/**
 * Slice Types - Tipos compartilhados entre slices do gameStore
 *
 * Seguindo Zustand Slices Pattern:
 * https://zustand.docs.pmnd.rs/guides/slices-pattern
 */

import type { StateCreator } from 'zustand';
import type {
  Player,
  Pool,
  Turn,
  MatchPhase,
  RoundState,
  ShapeQuest,
  Boost,
} from '../../types/game';
import type { Status } from '../../types/status';
import type { Item } from '../../types/item';
import type { Pill, PillModifier } from '../../types/pill';

// ============================================================================
// Round Summary (para historico)
// ============================================================================

export interface RoundSummary {
  number: number;
  pillsConsumed: number;
  questsCompleted: number;
  collapses: number;
  duration: number;
}

// ============================================================================
// Match Slice
// ============================================================================

export interface MatchSlice {
  // State
  match: {
    id: string;
    seed: number;
    phase: MatchPhase;
    turnOrder: string[];
    activeTurnIndex: number;
    seasonalShapes: string[];
    shopSignals: string[];
    winnerId: string | null;
    startedAt: number;
    endedAt: number | null;
  } | null;

  currentRound: {
    number: number;
    pool: Pool;
    turns: Turn[];
    shapeQuests: ShapeQuest[];
    boostsToApply: Boost[];
    state: RoundState;
    startedAt: number;
    endedAt: number | null;
  } | null;

  rounds: RoundSummary[];
  isProcessingTurn: boolean;
  turnToken: number;

  // Actions
  navigateToLobby: () => void;
  startMatch: (players: Player[], seed?: number) => void;
  transitionPhase: (phase: MatchPhase) => void;
  nextRound: () => void;
  nextTurn: () => void;
  endMatch: (winnerId: string) => void;
  resetMatch: () => void;
  setProcessingTurn: (isProcessing: boolean) => void;
  bumpTurnToken: () => void;
  updateCurrentRound: (updater: (round: NonNullable<MatchSlice['currentRound']>) => void) => void;
}

// ============================================================================
// Players Slice
// ============================================================================

export interface PlayersSlice {
  // State (Map para O(1) lookup)
  players: Map<string, Player>;

  // Actions
  setPlayers: (players: Player[]) => void;
  updatePlayer: (id: string, updater: (p: Player) => void) => void;
  applyDamage: (id: string, damage: number) => void;
  applyHeal: (id: string, heal: number) => void;
  applyStatus: (id: string, status: Status) => void;
  removeStatus: (id: string, statusId: string) => void;
  addToInventory: (id: string, item: Item) => void;
  removeFromInventory: (id: string, itemId: string) => void;
  grantPillCoins: (id: string, amount: number) => void;
  spendPillCoins: (id: string, amount: number) => void;
  setActiveTurn: (id: string) => void;
  clearActiveTurns: () => void;

  // Queries
  getPlayer: (id: string) => Player | undefined;
  getAllPlayers: () => Player[];
  getAlivePlayers: () => Player[];
}

// ============================================================================
// Pool Slice
// ============================================================================

export interface PoolSlice {
  // Actions (operam sobre currentRound.pool via get())
  revealPill: (pillId: string) => void;
  consumePill: (pillId: string) => void;
  discardPill: (pillId: string) => void;
  applyModifierToPill: (pillId: string, modifier: PillModifier) => void;
  shufflePool: () => void;

  // Queries
  getPool: () => Pool | null;
  getPill: (pillId: string) => Pill | undefined;
}

// ============================================================================
// Combined Store Type
// ============================================================================

export type GameStore = MatchSlice & PlayersSlice & PoolSlice;

// ============================================================================
// Slice Creator Type
// ============================================================================

/**
 * Tipo para criar slices com Immer middleware
 * Permite que cada slice acesse o state completo via get()
 */
export type SliceCreator<T> = StateCreator<GameStore, [['zustand/immer', never]], [], T>;
