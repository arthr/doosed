/**
 * Validation Utilities
 *
 * Validações de invariantes do jogo
 * Constitution Principle VI: Testing Estratégico - validar invariantes críticos
 */

import type { Player, Pool, Match } from '../../types/game';
import type { Pill } from '../../types/pill';
import type { GameConfig } from '../../types/config';
import { DEFAULT_GAME_CONFIG } from '../../config/game-config';

// ============================================================================
// Player Invariants
// ============================================================================

export function validatePlayerInvariants(
  player: Player,
  config: GameConfig = DEFAULT_GAME_CONFIG
): boolean {
  const maxSlots = config.inventory.maxSlots;

  // lives >= 0 (sempre)
  if (player.lives < 0) {
    console.error(`[INVARIANT] Player ${player.id} has negative lives: ${player.lives}`);
    return false;
  }

  // extraResistance >= 0 && <= resistanceCap
  if (player.extraResistance < 0 || player.extraResistance > player.resistanceCap) {
    console.error(
      `[INVARIANT] Player ${player.id} extraResistance out of bounds: ${player.extraResistance}`
    );
    return false;
  }

  // inventory <= maxSlots
  if (player.inventory.length > maxSlots) {
    console.error(
      `[INVARIANT] Player ${player.id} has too many inventory slots: ${player.inventory.length}`
    );
    return false;
  }

  // Se eliminado, não pode ter turno ativo
  if (player.isEliminated && player.isActiveTurn) {
    console.error(`[INVARIANT] Player ${player.id} is eliminated but has active turn`);
    return false;
  }

  // Se lives === 0, deve estar em última chance
  if (player.lives === 0 && !player.isLastChance && !player.isEliminated) {
    console.error(`[INVARIANT] Player ${player.id} has 0 lives but not in last chance`);
    return false;
  }

  return true;
}

// ============================================================================
// Pool Invariants
// ============================================================================

export function validatePoolInvariants(
  pool: Pool,
  config: GameConfig = DEFAULT_GAME_CONFIG
): boolean {
  const { baseSize, maxSize, minShapeDiversity } = config.pool;

  // size >= baseSize && <= maxSize
  if (pool.size < baseSize || pool.size > maxSize) {
    console.error(`[INVARIANT] Pool size out of bounds: ${pool.size} (expected ${baseSize}-${maxSize})`);
    return false;
  }

  // pills.length === size
  if (pool.pills.length !== pool.size) {
    console.error(
      `[INVARIANT] Pool pills length mismatch: ${pool.pills.length} !== ${pool.size}`
    );
    return false;
  }

  // revealed.length <= size
  if (pool.revealed.length > pool.size) {
    console.error(`[INVARIANT] Pool revealed count too high: ${pool.revealed.length} > ${pool.size}`);
    return false;
  }

  // Diversidade minima de shapes
  const uniqueShapes = new Set(pool.pills.map((p) => p.shape));
  if (uniqueShapes.size < minShapeDiversity) {
    console.error(`[INVARIANT] Pool has insufficient shape diversity: ${uniqueShapes.size} (min ${minShapeDiversity})`);
    return false;
  }

  return true;
}

// ============================================================================
// Match Invariants
// ============================================================================

// Constantes de match (nao sao configuráveis por enquanto)
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 6;

export function validateMatchInvariants(match: Match): boolean {
  // players.length >= MIN_PLAYERS && <= MAX_PLAYERS
  if (match.players.length < MIN_PLAYERS || match.players.length > MAX_PLAYERS) {
    console.error(`[INVARIANT] Match has invalid player count: ${match.players.length} (expected ${MIN_PLAYERS}-${MAX_PLAYERS})`);
    return false;
  }

  // turnOrder.length === players.length
  if (match.turnOrder.length !== match.players.length) {
    console.error(
      `[INVARIANT] TurnOrder length mismatch: ${match.turnOrder.length} !== ${match.players.length}`
    );
    return false;
  }

  // activeTurnIndex < turnOrder.length
  if (match.activeTurnIndex >= match.turnOrder.length) {
    console.error(
      `[INVARIANT] Active turn index out of bounds: ${match.activeTurnIndex} >= ${match.turnOrder.length}`
    );
    return false;
  }

  // Se phase === RESULTS, winnerId deve estar definido
  if (match.phase === 'RESULTS' && !match.winnerId) {
    console.error(`[INVARIANT] Match in RESULTS phase but no winner defined`);
    return false;
  }

  // currentRound deve estar nos rounds se não está em LOBBY/DRAFT
  if (
    match.phase !== 'LOBBY' &&
    match.phase !== 'DRAFT' &&
    match.currentRound &&
    !match.rounds.find((r) => r.number === match.currentRound?.number)
  ) {
    console.error(
      `[INVARIANT] Current round not found in rounds array: ${match.currentRound.number}`
    );
    return false;
  }

  return true;
}

// ============================================================================
// Type-specific validations
// ============================================================================

export function validatePillDistribution(
  pills: Pill[],
  expectedDistribution: Record<string, number>,
  tolerance: number = 0.05
): boolean {
  const total = pills.length;
  const counters: Record<string, number> = {};

  // Contar tipos
  for (const pill of pills) {
    counters[pill.type] = (counters[pill.type] || 0) + 1;
  }

  // Verificar cada tipo contra distribuição esperada
  for (const [type, expectedCount] of Object.entries(expectedDistribution)) {
    const actualCount = counters[type] || 0;
    const actualPercentage = actualCount / total;
    const expectedPercentage = expectedCount / total;
    const diff = Math.abs(actualPercentage - expectedPercentage);

    if (diff > tolerance) {
      console.error(
        `[INVARIANT] Pill type ${type} distribution out of tolerance: ${actualPercentage.toFixed(2)} vs ${expectedPercentage.toFixed(2)}`
      );
      return false;
    }
  }

  return true;
}

