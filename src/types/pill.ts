/**
 * Types: Pill & Shape
 *
 * Baseado em data-model.md (Pill, Shape)
 */

// ============================================================================
// Enums
// ============================================================================

export enum PillType {
  SAFE = 'SAFE', // Sem efeito
  DMG_LOW = 'DMG_LOW', // -2 Resistência
  DMG_HIGH = 'DMG_HIGH', // -4 Resistência
  HEAL = 'HEAL', // +2 Resistência
  FATAL = 'FATAL', // Zera Resistência
  LIFE = 'LIFE', // +1 Vida
}

export enum PillModifier {
  INVERTED = 'INVERTED', // Inverte efeito (dano ↔ cura)
  DOUBLED = 'DOUBLED', // Multiplica efeito por 2
}

export enum PillState {
  AVAILABLE = 'AVAILABLE', // Disponível no pool
  CONSUMED = 'CONSUMED', // Já consumida
}

// ============================================================================
// Interfaces
// ============================================================================

export interface Shape {
  id: string; // ID único (ex: 'capsule', 'triangle')
  name: string; // Nome de exibição
  assetPath: string; // Caminho do asset visual
  unlockRound: number; // Rodada de unlock (≥ 1)
  isSeasonal: boolean; // Se é shape sazonal
  seasonalTheme?: string; // Tema (ex: 'christmas') se isSeasonal
}

export interface Pill {
  id: string; // UUID
  type: PillType; // Tipo do efeito
  shape: string; // ID da Shape (FK)
  modifiers: PillModifier[]; // Modificadores ativos
  isRevealed: boolean; // Se tipo foi revelado
  position: number; // Posição no grid (≥ 0)
  state: PillState; // Estado atual
}

// ============================================================================
// Constants
// ============================================================================

export const PILL_BASE_VALUES: Record<PillType, number> = {
  [PillType.SAFE]: 0,
  [PillType.DMG_LOW]: -2,
  [PillType.DMG_HIGH]: -4,
  [PillType.HEAL]: 2,
  [PillType.FATAL]: -999, // Valor especial (zera resistência)
  [PillType.LIFE]: 1,
};

// ============================================================================
// Type Guards
// ============================================================================

export function isPillType(value: string): value is PillType {
  return Object.values(PillType).includes(value as PillType);
}

export function isPillModifier(value: string): value is PillModifier {
  return Object.values(PillModifier).includes(value as PillModifier);
}
