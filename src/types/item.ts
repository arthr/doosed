/**
 * Types: Item & InventorySlot
 *
 * Baseado em data-model.md (Item, InventorySlot)
 */

// ============================================================================
// Enums
// ============================================================================

export enum ItemCategory {
  INTEL = 'INTEL', // Informação (Scanner, Shape Scanner, Inverter, Double)
  SUSTAIN = 'SUSTAIN', // Sobrevivência (Pocket Pill, Shield)
  CONTROL = 'CONTROL', // Controle (Handcuffs, Force Feed)
  CHAOS = 'CHAOS', // Caos (Shuffle, Discard)
}

export enum Targeting {
  SELF = 'SELF', // Alvo próprio
  OPPONENT = 'OPPONENT', // Alvo oponente específico
  PILL = 'PILL', // Alvo pill específica
  SHAPE = 'SHAPE', // Alvo shape (todas pills dessa forma)
  NONE = 'NONE', // Sem alvo
}

export enum Availability {
  DRAFT = 'DRAFT', // Apenas no Draft
  MATCH = 'MATCH', // Apenas na Pill Store (durante Match)
  BOTH = 'BOTH', // Ambos
}

// ============================================================================
// Interfaces
// ============================================================================

export interface Item {
  id: string; // ID único
  name: string; // Nome de exibição
  description: string; // Descrição do efeito
  category: ItemCategory; // Categoria
  cost: number; // Custo em Pill Coins (> 0)
  targeting: Targeting; // Tipo de alvo
  isStackable: boolean; // Se pode stackar
  stackLimit?: number; // Limite de stack (se isStackable)
  availability: Availability; // Onde disponível
}

export interface InventorySlot {
  slotIndex: number; // Índice do slot (0-4)
  item: Item | null; // Item no slot
  quantity: number; // Quantidade stackada (≥ 1 se item presente)
}

// ============================================================================
// Type Guards
// ============================================================================

export function isItemCategory(value: string): value is ItemCategory {
  return Object.values(ItemCategory).includes(value as ItemCategory);
}

export function isTargeting(value: string): value is Targeting {
  return Object.values(Targeting).includes(value as Targeting);
}

export function isAvailability(value: string): value is Availability {
  return Object.values(Availability).includes(value as Availability);
}
