/**
 * Types: Game Configuration
 *
 * Baseado em data-model.md (Configuration Schema)
 */

import type { PillType } from './pill';
import type { Targeting, Availability } from './item';
import type { BoostType } from './game';

// ============================================================================
// Configuration Interface
// ============================================================================

export interface GameConfig {
  timers: TimersConfig;
  health: HealthConfig;
  economy: EconomyConfig;
  pool: PoolConfig;
  shapes: ShapesConfig;
  items: ItemsConfig;
  boosts: BoostsConfig;
  inventory: InventoryConfig;
  xp: XPConfig;
}

// ============================================================================
// Sub-Configurations
// ============================================================================

export interface TimersConfig {
  turn: number; // Turno (30s)
  draft: number; // Draft (60s)
  shopping: number; // Shopping (30s)
  botTimeout: number; // Bot timeout (5s)
}

export interface HealthConfig {
  initialLives: number; // Vidas iniciais (3)
  initialResistance: number; // Resistência inicial (6)
  resistanceCap: number; // Resistência máxima (6)
  extraResistanceCap: number; // Resistência extra cap (6)
}

export interface EconomyConfig {
  initialPillCoins: number; // Pill Coins iniciais (100)
  shapeQuestBaseReward: number; // Recompensa base de quest (10)
  questMultipliers: {
    early: number; // 1.0x (rodadas 1-3)
    mid: number; // 1.5x (rodadas 4-7)
    late: number; // 2.0x (rodadas 8+)
  };
}

export interface PoolConfig {
  baseSize: number; // Tamanho base (6)
  incrementEveryNRounds: number; // Incremento a cada N rodadas (3)
  maxSize: number; // Tamanho máximo (12)
  minShapeDiversity: number; // Diversidade mínima de shapes (3)
  distribution: Record<PillType, PillDistribution>;
}

export interface PillDistribution {
  unlockRound: number; // Rodada de unlock
  initialPercentage: number; // Percentual inicial (rodadas 1-3)
  finalPercentage: number; // Percentual final (rodadas 10+)
}

export interface ShapesConfig {
  base: Array<{ id: string; unlockRound: number }>;
  seasonal: Array<{ id: string; theme: string; enabled: boolean }>;
}

export interface ItemsConfig {
  [itemId: string]: ItemConfig;
}

export interface ItemConfig {
  cost: number;
  targeting: Targeting;
  stackable: boolean;
  stackLimit?: number;
  availability: Availability;
}

export type BoostsConfig = {
  [key in BoostType]: BoostConfig;
};

export interface BoostConfig {
  cost: number;
  requirement?: string;
}

export interface InventoryConfig {
  maxSlots: number; // 5
}

export interface XPConfig {
  xpPerRound: number; // XP por rodada sobrevivida (10)
  xpPerQuest: number; // XP por quest completada (25)
  victoryBonus: number; // Bonus de vitória (100)
  schmecklesBase: number; // Schmeckles base para vitória (50)
  schmecklesPerRound: number; // Schmeckles por rodada (5)
  levelCurve: number; // Curva de progressão (100)
}

// ============================================================================
// Type Guards & Validation
// ============================================================================

export function isGameConfig(value: unknown): value is GameConfig {
  if (typeof value !== 'object' || value === null) return false;

  const config = value as Record<string, unknown>;

  return (
    typeof config.timers === 'object' &&
    typeof config.health === 'object' &&
    typeof config.economy === 'object' &&
    typeof config.pool === 'object' &&
    typeof config.shapes === 'object' &&
    typeof config.items === 'object' &&
    typeof config.boosts === 'object' &&
    typeof config.inventory === 'object' &&
    typeof config.xp === 'object'
  );
}

export function validateConfig(config: GameConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Timers validation
  if (config.timers.turn <= 0) errors.push('timers.turn must be > 0');
  if (config.timers.draft <= 0) errors.push('timers.draft must be > 0');
  if (config.timers.shopping <= 0) errors.push('timers.shopping must be > 0');
  if (config.timers.botTimeout <= 0) errors.push('timers.botTimeout must be > 0');

  // Health validation
  if (config.health.initialLives < 1) errors.push('health.initialLives must be >= 1');
  if (config.health.initialResistance < 1) errors.push('health.initialResistance must be >= 1');
  if (config.health.resistanceCap < 1) errors.push('health.resistanceCap must be >= 1');
  if (config.health.extraResistanceCap < 0) errors.push('health.extraResistanceCap must be >= 0');

  // Pool validation
  if (config.pool.baseSize < 1) errors.push('pool.baseSize must be >= 1');
  if (config.pool.maxSize < config.pool.baseSize) {
    errors.push('pool.maxSize must be >= pool.baseSize');
  }
  if (config.pool.minShapeDiversity < 1) errors.push('pool.minShapeDiversity must be >= 1');

  // Inventory validation
  if (config.inventory.maxSlots < 1) errors.push('inventory.maxSlots must be >= 1');

  return {
    valid: errors.length === 0,
    errors,
  };
}
