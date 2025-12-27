/**
 * Game Configuration: Balance Values
 *
 * Todas as configurações de balance do jogo (FR-182 a FR-186)
 * Baseado em data-model.md e spec.md
 */

import { PillType } from '../types/pill';
import { Targeting, Availability } from '../types/item';
import { BoostType } from '../types/game';
import type { GameConfig } from '../types/config';

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_GAME_CONFIG: GameConfig = {
  // ==========================================================================
  // Timers
  // ==========================================================================
  timers: {
    turn: 30, // FR-062: 30 segundos por turno
    draft: 60, // FR-008: 60 segundos de Draft
    shopping: 30, // FR-142: 30 segundos de Shopping
    botTimeout: 5, // FR-124: 5 segundos de timeout para bot
  },

  // ==========================================================================
  // Health System
  // ==========================================================================
  health: {
    initialLives: 3, // FR-069: 3 Vidas iniciais
    initialResistance: 6, // FR-069: 6 Resistência inicial
    resistanceCap: 6, // FR-070: Resistência máxima 6
    extraResistanceCap: 6, // FR-070: Resistência extra cap 6
  },

  // ==========================================================================
  // Economy
  // ==========================================================================
  economy: {
    initialPillCoins: 100, // FR-009, FR-125: 100 Pill Coins iniciais
    shapeQuestBaseReward: 10, // FR-136: Recompensa base 10 coins
    questMultipliers: {
      early: 1.0, // Rodadas 1-3: multiplicador 1.0x
      mid: 1.5, // Rodadas 4-7: multiplicador 1.5x
      late: 2.0, // Rodadas 8+: multiplicador 2.0x
    },
  },

  // ==========================================================================
  // Pool Generation
  // ==========================================================================
  pool: {
    baseSize: 6, // FR-172: Base 6 pills
    incrementEveryNRounds: 3, // FR-172: +1 a cada 3 rodadas
    maxSize: 12, // FR-172: Cap em 12 pills
    minShapeDiversity: 3, // FR-177: Mínimo 3 shapes diferentes

    // FR-171: Distribuição progressiva por tipo
    distribution: {
      [PillType.SAFE]: {
        unlockRound: 1,
        initialPercentage: 0.45, // 45% inicial
        finalPercentage: 0.15, // 15% final (rodadas 10+)
      },
      [PillType.DMG_LOW]: {
        unlockRound: 1,
        initialPercentage: 0.4, // 40% inicial
        finalPercentage: 0.2, // 20% final
      },
      [PillType.DMG_HIGH]: {
        unlockRound: 3,
        initialPercentage: 0.0, // 0% inicial (locked)
        finalPercentage: 0.25, // 25% final
      },
      [PillType.HEAL]: {
        unlockRound: 2,
        initialPercentage: 0.1, // 10% inicial
        finalPercentage: 0.15, // 15% final
      },
      [PillType.FATAL]: {
        unlockRound: 6,
        initialPercentage: 0.0, // 0% inicial (locked)
        finalPercentage: 0.18, // 18% final
      },
      [PillType.LIFE]: {
        unlockRound: 5,
        initialPercentage: 0.05, // 5% inicial
        finalPercentage: 0.13, // 13% final
      },
    },
  },

  // ==========================================================================
  // Shapes
  // ==========================================================================
  shapes: {
    // FR-173 a FR-176: 16 shapes base
    base: [
      { id: 'capsule', unlockRound: 1 },
      { id: 'round', unlockRound: 1 },
      { id: 'triangle', unlockRound: 1 },
      { id: 'oval', unlockRound: 1 },
      { id: 'cross', unlockRound: 1 },
      { id: 'heart', unlockRound: 1 },
      { id: 'flower', unlockRound: 1 },
      { id: 'star', unlockRound: 1 },
      { id: 'coin', unlockRound: 1 },
      { id: 'gem', unlockRound: 1 },
      { id: 'fruit', unlockRound: 1 },
      { id: 'pumpkin', unlockRound: 3 },
      { id: 'skull', unlockRound: 3 },
      { id: 'bear', unlockRound: 5 },
      { id: 'domino', unlockRound: 7 },
      { id: 'pineapple', unlockRound: 8 },
    ],

    // FR-178, FR-179: Shapes sazonais (desabilitadas por padrão)
    seasonal: [
      { id: 'christmas-tree', theme: 'christmas', enabled: false },
      { id: 'snowflake', theme: 'christmas', enabled: false },
      { id: 'pumpkin-lantern', theme: 'halloween', enabled: false },
    ],
  },

  // ==========================================================================
  // Items Catalog
  // ==========================================================================
  items: {
    // INTEL (Informação)
    scanner: {
      cost: 15, // FR-021
      targeting: Targeting.PILL,
      stackable: true,
      stackLimit: 3,
      availability: Availability.BOTH,
    },
    'shape-scanner': {
      cost: 20, // FR-023
      targeting: Targeting.SHAPE,
      stackable: true,
      stackLimit: 2,
      availability: Availability.BOTH,
    },
    inverter: {
      cost: 25, // FR-025
      targeting: Targeting.PILL,
      stackable: false,
      availability: Availability.BOTH,
    },
    double: {
      cost: 25, // FR-027
      targeting: Targeting.PILL,
      stackable: false,
      availability: Availability.BOTH,
    },

    // SUSTAIN (Sobrevivência)
    'pocket-pill': {
      cost: 20, // FR-029
      targeting: Targeting.SELF,
      stackable: true,
      stackLimit: 3,
      availability: Availability.BOTH,
    },
    shield: {
      cost: 30, // FR-031
      targeting: Targeting.SELF,
      stackable: false,
      availability: Availability.BOTH,
    },

    // CONTROL (Controle)
    handcuffs: {
      cost: 30, // FR-033
      targeting: Targeting.OPPONENT,
      stackable: true,
      stackLimit: 2,
      availability: Availability.BOTH,
    },
    'force-feed': {
      cost: 35, // FR-035
      targeting: Targeting.PILL, // + OPPONENT (dual targeting)
      stackable: false,
      availability: Availability.BOTH,
    },

    // CHAOS (Caos)
    shuffle: {
      cost: 30, // FR-037
      targeting: Targeting.NONE,
      stackable: true,
      stackLimit: 2,
      availability: Availability.BOTH,
    },
    discard: {
      cost: 25, // FR-039
      targeting: Targeting.PILL,
      stackable: true,
      stackLimit: 2,
      availability: Availability.BOTH,
    },
  },

  // ==========================================================================
  // Boosts (Pill Store)
  // ==========================================================================
  boosts: {
    [BoostType.ONE_UP]: {
      cost: 20, // FR-146: 1-Up custa 20 coins
      requirement: 'lives < 3', // FR-149: Apenas se lives < 3
    },
    [BoostType.REBOOT]: {
      cost: 10, // FR-147: Reboot custa 10 coins
      requirement: 'resistance < 6', // Apenas se resistência < máximo
    },
    [BoostType.SCANNER_2X]: {
      cost: 10, // FR-148: Scanner-2X custa 10 coins
    },
  },

  // ==========================================================================
  // Inventory
  // ==========================================================================
  inventory: {
    maxSlots: 5, // FR-012: 5 slots máximo
  },

  // ==========================================================================
  // XP & Schmeckles
  // ==========================================================================
  xp: {
    xpPerRound: 10, // FR-161: 10 XP por rodada sobrevivida
    xpPerQuest: 25, // FR-161: 25 XP por quest completada
    victoryBonus: 100, // FR-161: 100 XP bonus de vitória
    schmecklesBase: 50, // FR-162: 50 Schmeckles base
    schmecklesPerRound: 5, // FR-162: +5 Schmeckles por rodada
    levelCurve: 100, // Curva: level = floor(sqrt(xp / 100)) + 1
  },
};

// ============================================================================
// Validation
// ============================================================================

import { validateConfig } from '../types/config';

const validation = validateConfig(DEFAULT_GAME_CONFIG);

if (!validation.valid) {
  console.error('[ERROR] DEFAULT_GAME_CONFIG validation failed:');
  validation.errors.forEach(error => console.error(`  - ${error}`));
  throw new Error('Invalid DEFAULT_GAME_CONFIG');
}

// ============================================================================
// Exports
// ============================================================================

export { type GameConfig } from '../types/config';
