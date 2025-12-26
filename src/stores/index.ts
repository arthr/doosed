/**
 * Stores Index - Re-exports do sistema de stores
 *
 * Usar useGameStore para todas as operacoes do jogo.
 * Os slices individuais sao exportados para testes ou extensao.
 */

// Store principal (usar este)
export { useGameStore } from './gameStore';

// Types
export type {
  GameStore,
  MatchSlice,
  PlayersSlice,
  PoolSlice,
  SliceCreator,
  RoundSummary,
} from './slices/types';

// Slices individuais (para testes ou extensao)
export { createMatchSlice } from './slices/matchSlice';
export { createPlayersSlice } from './slices/playersSlice';
export { createPoolSlice } from './slices/poolSlice';

