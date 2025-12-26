/**
 * Inventory Manager: Gerenciamento de Inventário (5 slots)
 *
 * Implementa:
 * - Adicionar itens (stackable vs non-stackable)
 * - Remover itens (decrementar stack ou remover slot)
 * - Usar itens (aplicar efeitos)
 * - Validação de 5 slots máximo
 *
 * Baseado em data-model.md "InventorySlot Invariantes"
 * FR-012 a FR-018, FR-050 a FR-058
 */

import type { Item, InventorySlot } from '../types/item';
import type { Player, Pool } from '../types/game';
import type { GameConfig } from '../types/config';
import { PillModifier } from '../types/pill';
import { StatusType } from '../types/status';
import { DEFAULT_GAME_CONFIG } from '../config/game-config';

// ============================================================================
// Types
// ============================================================================

export interface AddItemResult {
  success: boolean;
  reason?: string; // Motivo de falha (se success === false)
  updatedInventory: InventorySlot[];
}

export interface RemoveItemResult {
  success: boolean;
  reason?: string;
  updatedInventory: InventorySlot[];
  removedItem: Item | null;
}

export interface UseItemResult {
  success: boolean;
  reason?: string;
  effects: ItemEffect[];
}

export interface ItemEffect {
  type: 'REVEAL_PILL' | 'REVEAL_SHAPE' | 'ADD_MODIFIER' | 'APPLY_STATUS' | 'SHUFFLE_POOL' | 'DISCARD_PILL' | 'POCKET_PILL';
  targetPillId?: string;
  targetShape?: string;
  targetPlayerId?: string;
  modifier?: PillModifier;
  statusType?: StatusType;
  pillsRevealed?: string[]; // IDs de pills reveladas
}

// ============================================================================
// T041: Add Item to Inventory
// ============================================================================

/**
 * Adiciona item ao inventário
 *
 * Regras:
 * - Stackable: incrementa quantity se item já existe (respeitando stackLimit)
 * - Non-stackable: adiciona novo slot
 * - Maximo de slots via config
 *
 * FR-012 a FR-017
 */
export function addItemToInventory(
  inventory: InventorySlot[],
  item: Item,
  config: GameConfig = DEFAULT_GAME_CONFIG
): AddItemResult {
  const maxSlots = config.inventory.maxSlots;

  // Verificar se inventário já atingiu limite de slots
  if (inventory.length >= maxSlots) {
    // Se item é stackable, tentar stackar em slot existente
    if (item.isStackable) {
      const existingSlotIndex = inventory.findIndex(
        (slot) => slot.item?.id === item.id
      );

      if (existingSlotIndex !== -1) {
        const existingSlot = inventory[existingSlotIndex];
        const newQuantity = existingSlot.quantity + 1;

        // Verificar stack limit
        if (item.stackLimit && newQuantity > item.stackLimit) {
          return {
            success: false,
            reason: `Stack limit reached (${item.stackLimit})`,
            updatedInventory: inventory,
          };
        }

        // Incrementar quantidade
        const updatedInventory = [...inventory];
        updatedInventory[existingSlotIndex] = {
          ...existingSlot,
          quantity: newQuantity,
        };

        return {
          success: true,
          updatedInventory,
        };
      }
    }

    // Nao pode adicionar (inventario cheio)
    return {
      success: false,
      reason: `Inventory full (${maxSlots} slots)`,
      updatedInventory: inventory,
    };
  }

  // Se item é stackable E já existe no inventário, incrementar
  if (item.isStackable) {
    const existingSlotIndex = inventory.findIndex(
      (slot) => slot.item?.id === item.id
    );

    if (existingSlotIndex !== -1) {
      const existingSlot = inventory[existingSlotIndex];
      const newQuantity = existingSlot.quantity + 1;

      // Verificar stack limit
      if (item.stackLimit && newQuantity > item.stackLimit) {
        return {
          success: false,
          reason: `Stack limit reached (${item.stackLimit})`,
          updatedInventory: inventory,
        };
      }

      const updatedInventory = [...inventory];
      updatedInventory[existingSlotIndex] = {
        ...existingSlot,
        quantity: newQuantity,
      };

      return {
        success: true,
        updatedInventory,
      };
    }
  }

  // Adicionar novo slot
  const newSlot: InventorySlot = {
    slotIndex: inventory.length,
    item,
    quantity: 1,
  };

  return {
    success: true,
    updatedInventory: [...inventory, newSlot],
  };
}

// ============================================================================
// T042: Remove Item from Inventory
// ============================================================================

/**
 * Remove item do inventário
 *
 * Regras:
 * - Decrementa quantity se stackable
 * - Remove slot se quantity === 0 OU item non-stackable
 * - Reindexar slots após remoção
 *
 * FR-018
 */
export function removeItemFromInventory(
  inventory: InventorySlot[],
  itemId: string
): RemoveItemResult {
  const slotIndex = inventory.findIndex((slot) => slot.item?.id === itemId);

  if (slotIndex === -1) {
    return {
      success: false,
      reason: 'Item not found in inventory',
      updatedInventory: inventory,
      removedItem: null,
    };
  }

  const slot = inventory[slotIndex];
  const item = slot.item;

  if (!item) {
    return {
      success: false,
      reason: 'Slot is empty',
      updatedInventory: inventory,
      removedItem: null,
    };
  }

  // Se stackable e quantity > 1, decrementar
  if (item.isStackable && slot.quantity > 1) {
    const updatedInventory = [...inventory];
    updatedInventory[slotIndex] = {
      ...slot,
      quantity: slot.quantity - 1,
    };

    return {
      success: true,
      updatedInventory,
      removedItem: item,
    };
  }

  // Remover slot e reindexar
  const updatedInventory = inventory
    .filter((_, idx) => idx !== slotIndex)
    .map((slot, idx) => ({ ...slot, slotIndex: idx }));

  return {
    success: true,
    updatedInventory,
    removedItem: item,
  };
}

// ============================================================================
// T043: Use Item (Apply Effects)
// ============================================================================

/**
 * Usa item do inventário, aplicando efeitos
 *
 * Efeitos por item (FR-021 a FR-042):
 * - Scanner: revela pill
 * - Shape Scanner: revela todas pills de shape
 * - Inverter: adiciona modificador INVERTED
 * - Double: adiciona modificador DOUBLED
 * - Pocket Pill: +2 Resistência imediata
 * - Shield: aplica status SHIELDED (1 rodada)
 * - Handcuffs: aplica status HANDCUFFED ao oponente
 * - Force Feed: força oponente a consumir pill específica
 * - Shuffle: embaralha pool
 * - Discard: descarta pill do pool
 *
 * FR-050 a FR-058
 */
export function useItem(
  item: Item,
  player: Player,
  pool: Pool,
  targetPillId?: string,
  targetShape?: string,
  targetPlayerId?: string
): UseItemResult {
  const effects: ItemEffect[] = [];

  switch (item.id) {
    case 'scanner':
      if (!targetPillId) {
        return { success: false, reason: 'Scanner requires targetPillId', effects: [] };
      }
      effects.push({ type: 'REVEAL_PILL', targetPillId });
      break;

    case 'shape-scanner':
      if (!targetShape) {
        return { success: false, reason: 'Shape Scanner requires targetShape', effects: [] };
      }
      effects.push({ type: 'REVEAL_SHAPE', targetShape });
      break;

    case 'inverter':
      if (!targetPillId) {
        return { success: false, reason: 'Inverter requires targetPillId', effects: [] };
      }
      effects.push({ type: 'ADD_MODIFIER', targetPillId, modifier: PillModifier.INVERTED });
      break;

    case 'double':
      if (!targetPillId) {
        return { success: false, reason: 'Double requires targetPillId', effects: [] };
      }
      effects.push({ type: 'ADD_MODIFIER', targetPillId, modifier: PillModifier.DOUBLED });
      break;

    case 'pocket-pill':
      effects.push({ type: 'POCKET_PILL', targetPlayerId: player.id });
      break;

    case 'shield':
      effects.push({ type: 'APPLY_STATUS', targetPlayerId: player.id, statusType: StatusType.SHIELDED });
      break;

    case 'handcuffs':
      if (!targetPlayerId) {
        return { success: false, reason: 'Handcuffs requires targetPlayerId', effects: [] };
      }
      effects.push({ type: 'APPLY_STATUS', targetPlayerId, statusType: StatusType.HANDCUFFED });
      break;

    case 'force-feed':
      if (!targetPillId || !targetPlayerId) {
        return { success: false, reason: 'Force Feed requires targetPillId and targetPlayerId', effects: [] };
      }
      // Force Feed é complexo (implementação completa em turn-manager)
      effects.push({ type: 'REVEAL_PILL', targetPillId }); // Simplificado
      break;

    case 'shuffle':
      effects.push({ type: 'SHUFFLE_POOL' });
      break;

    case 'discard':
      if (!targetPillId) {
        return { success: false, reason: 'Discard requires targetPillId', effects: [] };
      }
      effects.push({ type: 'DISCARD_PILL', targetPillId });
      break;

    default:
      return { success: false, reason: `Unknown item: ${item.id}`, effects: [] };
  }

  return { success: true, effects };
}

// ============================================================================
// T044: Validate Inventory
// ============================================================================

/**
 * Valida invariantes do inventário
 *
 * Invariantes:
 * - inventory.length <= maxSlots (via config)
 * - Se item stackable, quantity <= stackLimit
 * - Se item non-stackable, quantity === 1
 * - Slots com item === null devem ter quantity === 0
 */
export function validateInventory(
  inventory: InventorySlot[],
  config: GameConfig = DEFAULT_GAME_CONFIG
): boolean {
  const maxSlots = config.inventory.maxSlots;

  // Max slots check
  if (inventory.length > maxSlots) {
    console.error(`[INVARIANT] Inventory has too many slots: ${inventory.length} (max ${maxSlots})`);
    return false;
  }

  for (const slot of inventory) {
    // Se item === null, quantity deve ser 0
    if (slot.item === null && slot.quantity !== 0) {
      console.error(`[INVARIANT] Empty slot with non-zero quantity: ${slot.quantity}`);
      return false;
    }

    if (slot.item) {
      // Se stackable, quantity <= stackLimit
      if (slot.item.isStackable && slot.item.stackLimit && slot.quantity > slot.item.stackLimit) {
        console.error(
          `[INVARIANT] Stack exceeds limit: ${slot.quantity} > ${slot.item.stackLimit}`
        );
        return false;
      }

      // Se non-stackable, quantity === 1
      if (!slot.item.isStackable && slot.quantity !== 1) {
        console.error(`[INVARIANT] Non-stackable item with quantity !== 1: ${slot.quantity}`);
        return false;
      }
    }
  }

  return true;
}

