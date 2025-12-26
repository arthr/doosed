/**
 * Unit Tests: Inventory Manager
 *
 * T041a: addItemToInventory - stackable increment, non-stackable add, reject when full
 * T042a: removeItemFromInventory - decrement stack, remove slot when quantity=0
 *
 * Constitution Principle VI: Testing Estrategico
 */

import { describe, it, expect } from 'vitest';
import {
  addItemToInventory,
  removeItemFromInventory,
  useItem,
  validateInventory,
} from '../inventory-manager';
import type { Item, InventorySlot } from '../../types/item';
import { ItemCategory, Targeting, Availability } from '../../types/item';
import type { Player, Pool } from '../../types/game';
import { DEFAULT_GAME_CONFIG } from '../../config/game-config';

// ==========================================================================
// Test Fixtures
// ==========================================================================

function createMockItem(overrides: Partial<Item> = {}): Item {
  return {
    id: 'scanner',
    name: 'Scanner',
    description: 'Revela tipo de uma pill',
    category: ItemCategory.INTEL,
    cost: 15,
    targeting: Targeting.PILL,
    isStackable: true,
    stackLimit: 3,
    availability: Availability.BOTH,
    ...overrides,
  };
}

function createMockPlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: 'player-1',
    name: 'Test Player',
    avatar: '',
    isBot: false,
    lives: 3,
    resistance: 6,
    resistanceCap: 6,
    extraResistance: 0,
    inventory: [],
    pillCoins: 100,
    activeStatuses: [],
    isEliminated: false,
    isLastChance: false,
    isActiveTurn: false,
    totalCollapses: 0,
    shapeQuest: null,
    wantsShop: false,
    ...overrides,
  };
}

function createMockPool(): Pool {
  return {
    roundNumber: 1,
    pills: [
      {
        id: 'pill-1',
        type: 'SAFE' as any,
        shape: 'capsule',
        modifiers: [],
        isRevealed: false,
        position: 0,
        state: 'AVAILABLE' as any,
      },
    ],
    size: 1,
    counters: { SAFE: 1 },
    revealed: [],
    unlockedShapes: ['capsule'],
  };
}

describe('Inventory Manager', () => {
  // ==========================================================================
  // T041a: addItemToInventory
  // ==========================================================================
  describe('addItemToInventory (T041a)', () => {
    describe('Stackable Items', () => {
      it('deve adicionar novo slot para item stackable quando nao existe', () => {
        const inventory: InventorySlot[] = [];
        const item = createMockItem({ isStackable: true });

        const result = addItemToInventory(inventory, item, DEFAULT_GAME_CONFIG);

        expect(result.success).toBe(true);
        expect(result.updatedInventory.length).toBe(1);
        expect(result.updatedInventory[0].item?.id).toBe('scanner');
        expect(result.updatedInventory[0].quantity).toBe(1);
      });

      it('deve incrementar quantity para item stackable existente', () => {
        const item = createMockItem({ isStackable: true });
        const inventory: InventorySlot[] = [
          { slotIndex: 0, item, quantity: 1 },
        ];

        const result = addItemToInventory(inventory, item, DEFAULT_GAME_CONFIG);

        expect(result.success).toBe(true);
        expect(result.updatedInventory.length).toBe(1);
        expect(result.updatedInventory[0].quantity).toBe(2);
      });

      it('deve respeitar stackLimit', () => {
        const item = createMockItem({ isStackable: true, stackLimit: 3 });
        const inventory: InventorySlot[] = [
          { slotIndex: 0, item, quantity: 3 }, // Ja no limite
        ];

        const result = addItemToInventory(inventory, item, DEFAULT_GAME_CONFIG);

        expect(result.success).toBe(false);
        expect(result.reason).toContain('Stack limit');
      });

      it('deve stackar em inventario cheio se item ja existe', () => {
        const stackableItem = createMockItem({ id: 'scanner', isStackable: true, stackLimit: 3 });
        const otherItems = Array.from({ length: 4 }, (_, i) =>
          createMockItem({ id: `item-${i}`, isStackable: false })
        );

        const inventory: InventorySlot[] = [
          { slotIndex: 0, item: stackableItem, quantity: 1 },
          ...otherItems.map((item, i) => ({ slotIndex: i + 1, item, quantity: 1 })),
        ];

        const result = addItemToInventory(inventory, stackableItem, DEFAULT_GAME_CONFIG);

        expect(result.success).toBe(true);
        expect(result.updatedInventory.length).toBe(5);
        expect(result.updatedInventory[0].quantity).toBe(2);
      });
    });

    describe('Non-Stackable Items', () => {
      it('deve adicionar novo slot para item non-stackable', () => {
        const inventory: InventorySlot[] = [];
        const item = createMockItem({ id: 'shield', isStackable: false });

        const result = addItemToInventory(inventory, item, DEFAULT_GAME_CONFIG);

        expect(result.success).toBe(true);
        expect(result.updatedInventory.length).toBe(1);
        expect(result.updatedInventory[0].quantity).toBe(1);
      });

      it('deve adicionar novo slot mesmo se item identico existe', () => {
        const item = createMockItem({ id: 'shield', isStackable: false });
        const inventory: InventorySlot[] = [
          { slotIndex: 0, item, quantity: 1 },
        ];

        const result = addItemToInventory(inventory, item, DEFAULT_GAME_CONFIG);

        expect(result.success).toBe(true);
        expect(result.updatedInventory.length).toBe(2);
      });
    });

    describe('Inventory Full (5 slots)', () => {
      it('deve rejeitar quando inventario esta cheio (5 slots)', () => {
        const items = Array.from({ length: 5 }, (_, i) =>
          createMockItem({ id: `item-${i}`, isStackable: false })
        );
        const inventory: InventorySlot[] = items.map((item, i) => ({
          slotIndex: i,
          item,
          quantity: 1,
        }));

        const newItem = createMockItem({ id: 'new-item', isStackable: false });
        const result = addItemToInventory(inventory, newItem, DEFAULT_GAME_CONFIG);

        expect(result.success).toBe(false);
        expect(result.reason).toContain('Inventory full');
      });
    });
  });

  // ==========================================================================
  // T042a: removeItemFromInventory
  // ==========================================================================
  describe('removeItemFromInventory (T042a)', () => {
    it('deve decrementar quantity para item stackable com quantity > 1', () => {
      const item = createMockItem({ isStackable: true });
      const inventory: InventorySlot[] = [
        { slotIndex: 0, item, quantity: 3 },
      ];

      const result = removeItemFromInventory(inventory, 'scanner');

      expect(result.success).toBe(true);
      expect(result.updatedInventory.length).toBe(1);
      expect(result.updatedInventory[0].quantity).toBe(2);
      expect(result.removedItem?.id).toBe('scanner');
    });

    it('deve remover slot quando quantity = 1', () => {
      const item = createMockItem({ isStackable: true });
      const inventory: InventorySlot[] = [
        { slotIndex: 0, item, quantity: 1 },
      ];

      const result = removeItemFromInventory(inventory, 'scanner');

      expect(result.success).toBe(true);
      expect(result.updatedInventory.length).toBe(0);
    });

    it('deve remover slot para item non-stackable', () => {
      const item = createMockItem({ isStackable: false });
      const inventory: InventorySlot[] = [
        { slotIndex: 0, item, quantity: 1 },
      ];

      const result = removeItemFromInventory(inventory, 'scanner');

      expect(result.success).toBe(true);
      expect(result.updatedInventory.length).toBe(0);
    });

    it('deve reindexar slots apos remocao', () => {
      const items = Array.from({ length: 3 }, (_, i) =>
        createMockItem({ id: `item-${i}`, isStackable: false })
      );
      const inventory: InventorySlot[] = items.map((item, i) => ({
        slotIndex: i,
        item,
        quantity: 1,
      }));

      const result = removeItemFromInventory(inventory, 'item-1'); // Remove do meio

      expect(result.success).toBe(true);
      expect(result.updatedInventory.length).toBe(2);
      expect(result.updatedInventory[0].slotIndex).toBe(0);
      expect(result.updatedInventory[1].slotIndex).toBe(1);
    });

    it('deve falhar se item nao existe', () => {
      const inventory: InventorySlot[] = [];
      const result = removeItemFromInventory(inventory, 'nonexistent');

      expect(result.success).toBe(false);
      expect(result.reason).toContain('not found');
      expect(result.removedItem).toBeNull();
    });
  });

  // ==========================================================================
  // T043: useItem
  // ==========================================================================
  describe('useItem (T043)', () => {
    const player = createMockPlayer();
    const pool = createMockPool();

    it('deve retornar REVEAL_PILL para Scanner com targetPillId', () => {
      const item = createMockItem({ id: 'scanner' });
      const result = useItem(item, player, pool, 'pill-1');

      expect(result.success).toBe(true);
      expect(result.effects.length).toBe(1);
      expect(result.effects[0].type).toBe('REVEAL_PILL');
      expect(result.effects[0].targetPillId).toBe('pill-1');
    });

    it('deve falhar Scanner sem targetPillId', () => {
      const item = createMockItem({ id: 'scanner' });
      const result = useItem(item, player, pool);

      expect(result.success).toBe(false);
      expect(result.reason).toContain('targetPillId');
    });

    it('deve retornar ADD_MODIFIER INVERTED para Inverter', () => {
      const item = createMockItem({ id: 'inverter' });
      const result = useItem(item, player, pool, 'pill-1');

      expect(result.success).toBe(true);
      expect(result.effects[0].type).toBe('ADD_MODIFIER');
      expect(result.effects[0].modifier).toBe('INVERTED');
    });

    it('deve retornar ADD_MODIFIER DOUBLED para Double', () => {
      const item = createMockItem({ id: 'double' });
      const result = useItem(item, player, pool, 'pill-1');

      expect(result.success).toBe(true);
      expect(result.effects[0].type).toBe('ADD_MODIFIER');
      expect(result.effects[0].modifier).toBe('DOUBLED');
    });

    it('deve retornar APPLY_STATUS SHIELDED para Shield', () => {
      const item = createMockItem({ id: 'shield', targeting: Targeting.SELF });
      const result = useItem(item, player, pool);

      expect(result.success).toBe(true);
      expect(result.effects[0].type).toBe('APPLY_STATUS');
      expect(result.effects[0].statusType).toBe('SHIELDED');
    });

    it('deve retornar POCKET_PILL para Pocket Pill', () => {
      const item = createMockItem({ id: 'pocket-pill', targeting: Targeting.SELF });
      const result = useItem(item, player, pool);

      expect(result.success).toBe(true);
      expect(result.effects[0].type).toBe('POCKET_PILL');
    });

    it('deve retornar SHUFFLE_POOL para Shuffle', () => {
      const item = createMockItem({ id: 'shuffle', targeting: Targeting.NONE });
      const result = useItem(item, player, pool);

      expect(result.success).toBe(true);
      expect(result.effects[0].type).toBe('SHUFFLE_POOL');
    });

    it('deve retornar DISCARD_PILL para Discard', () => {
      const item = createMockItem({ id: 'discard' });
      const result = useItem(item, player, pool, 'pill-1');

      expect(result.success).toBe(true);
      expect(result.effects[0].type).toBe('DISCARD_PILL');
    });

    it('deve falhar para item desconhecido', () => {
      const item = createMockItem({ id: 'unknown-item' });
      const result = useItem(item, player, pool);

      expect(result.success).toBe(false);
      expect(result.reason).toContain('Unknown item');
    });
  });

  // ==========================================================================
  // T044: validateInventory
  // ==========================================================================
  describe('validateInventory (T044)', () => {
    it('deve validar inventario vazio', () => {
      expect(validateInventory([], DEFAULT_GAME_CONFIG)).toBe(true);
    });

    it('deve validar inventario com 5 slots', () => {
      const items = Array.from({ length: 5 }, (_, i) =>
        createMockItem({ id: `item-${i}`, isStackable: false })
      );
      const inventory: InventorySlot[] = items.map((item, i) => ({
        slotIndex: i,
        item,
        quantity: 1,
      }));

      expect(validateInventory(inventory, DEFAULT_GAME_CONFIG)).toBe(true);
    });

    it('deve invalidar inventario com mais de 5 slots', () => {
      const items = Array.from({ length: 6 }, (_, i) =>
        createMockItem({ id: `item-${i}`, isStackable: false })
      );
      const inventory: InventorySlot[] = items.map((item, i) => ({
        slotIndex: i,
        item,
        quantity: 1,
      }));

      expect(validateInventory(inventory, DEFAULT_GAME_CONFIG)).toBe(false);
    });

    it('deve validar item stackable dentro do limite', () => {
      const item = createMockItem({ isStackable: true, stackLimit: 3 });
      const inventory: InventorySlot[] = [
        { slotIndex: 0, item, quantity: 3 },
      ];

      expect(validateInventory(inventory, DEFAULT_GAME_CONFIG)).toBe(true);
    });

    it('deve invalidar item stackable acima do limite', () => {
      const item = createMockItem({ isStackable: true, stackLimit: 3 });
      const inventory: InventorySlot[] = [
        { slotIndex: 0, item, quantity: 5 },
      ];

      expect(validateInventory(inventory, DEFAULT_GAME_CONFIG)).toBe(false);
    });

    it('deve invalidar item non-stackable com quantity != 1', () => {
      const item = createMockItem({ isStackable: false });
      const inventory: InventorySlot[] = [
        { slotIndex: 0, item, quantity: 2 },
      ];

      expect(validateInventory(inventory, DEFAULT_GAME_CONFIG)).toBe(false);
    });
  });
});

