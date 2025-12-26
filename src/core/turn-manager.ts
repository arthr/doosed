/**
 * Turn Manager: Gerenciamento de Turnos e Ordem de Jogadores
 *
 * Implementa:
 * - Ordem de turnos (randomizada uma vez no início)
 * - Round-robin (pular jogadores eliminados)
 * - Início e fim de turno
 * - Timer management (via config)
 * - Auto-consumo de pill aleatória em timeout
 *
 * Baseado em data-model.md "Match -> Turn Order"
 * FR-048, FR-049, FR-061 a FR-067
 */

import type { Player, Match, Turn } from '../types/game';
import type { GameConfig } from '../types/config';
import { shuffle as shuffleArray } from './utils/random';
import { DEFAULT_GAME_CONFIG } from '../config/game-config';

// ============================================================================
// T045: Initialize Turn Order (Randomize Once)
// ============================================================================

/**
 * Ordem de turnos (randomizada uma vez no início)
 *
 * BUG: Uso de shuffle (que usa Math.random() por padrão se não re-seeded) quebra o determinismo.
 * Sugestão: Usar uma semente (seed) vinda do match setup para inicializar a ordem.
 */
export function initializeTurnOrder(players: Player[]): string[] {
  if (players.length === 0) {
    throw new Error('Cannot initialize turn order with empty players array');
  }

  // Randomizar IDs de jogadores
  const playerIds = players.map((p) => p.id);
  return shuffleArray(playerIds);
}

// ============================================================================
// T046: Get Next Player (Round-Robin with Skip)
// ============================================================================

/**
 * Retorna índice do próximo jogador na ordem de turnos
 * Pula jogadores eliminados automaticamente
 *
 * FR-049, FR-065, FR-066: Round-robin, pular eliminados
 */
export function getNextPlayer(
  turnOrder: string[],
  currentIndex: number,
  players: Player[]
): number {
  if (turnOrder.length === 0) {
    throw new Error('Turn order is empty');
  }

  let nextIndex = (currentIndex + 1) % turnOrder.length;
  let attempts = 0;
  const maxAttempts = turnOrder.length;

  // Pular jogadores eliminados
  while (attempts < maxAttempts) {
    const playerId = turnOrder[nextIndex];
    const player = players.find((p) => p.id === playerId);

    if (player && !player.isEliminated) {
      return nextIndex;
    }

    nextIndex = (nextIndex + 1) % turnOrder.length;
    attempts++;
  }

  // Se todos eliminados (não deveria acontecer - match deveria ter terminado)
  throw new Error('All players are eliminated');
}

/**
 * Retorna ID do próximo jogador
 */
export function getNextPlayerId(
  turnOrder: string[],
  currentIndex: number,
  players: Player[]
): string {
  const nextIndex = getNextPlayer(turnOrder, currentIndex, players);
  return turnOrder[nextIndex];
}

// ============================================================================
// T047: Start Turn (Initialize Timer)
// ============================================================================

/**
 * Inicia turno de um jogador
 * Inicializa timer (via config) e marca jogador como ativo
 *
 * FR-062, FR-064: Timer configuravel, isActiveTurn flag
 */
export function startTurn(
  match: Match,
  playerId: string,
  config: GameConfig = DEFAULT_GAME_CONFIG
): Turn {
  const timerDuration = config.timers.turn;
  const player = match.players.find((p) => p.id === playerId);

  if (!player) {
    throw new Error(`Player ${playerId} not found in match`);
  }

  if (player.isEliminated) {
    throw new Error(`Cannot start turn for eliminated player ${playerId}`);
  }

  const turn: Turn = {
    playerId,
    timerRemaining: timerDuration,
    itemsUsed: [],
    pillConsumed: null,
    statusesApplied: [],
    startedAt: Date.now(),
    endedAt: null,
    targetingActive: false,
  };

  return turn;
}

// ============================================================================
// T048: End Turn (Finalize)
// ============================================================================

/**
 * Finaliza turno quando:
 * - Pill foi consumida
 * - Timer expirou (auto-consumo de pill aleatória)
 *
 * FR-061: Turno termina quando pill consumida
 * FR-063: Timeout → auto-consumo de pill aleatória
 */
export function endTurn(turn: Turn): Turn {
  return {
    ...turn,
    endedAt: Date.now(),
    targetingActive: false,
  };
}

/**
 * Verifica se turno deve terminar
 */
export function shouldEndTurn(turn: Turn): boolean {
  // Turno termina se pill foi consumida
  if (turn.pillConsumed !== null) {
    return true;
  }

  // Turno termina se timer expirou
  if (turn.timerRemaining <= 0) {
    return true;
  }

  return false;
}

/**
 * Calcula duração do turno em milissegundos
 */
export function getTurnDuration(turn: Turn): number {
  if (turn.endedAt === null) {
    return Date.now() - turn.startedAt;
  }
  return turn.endedAt - turn.startedAt;
}

// ============================================================================
// Helpers: Player Turn State
// ============================================================================

/**
 * Marca jogador como ativo no turno
 */
export function markPlayerActiveTurn(player: Player, isActive: boolean): Player {
  return {
    ...player,
    isActiveTurn: isActive,
  };
}

/**
 * Verifica se é turno de um jogador específico
 */
export function isPlayerTurn(match: Match, playerId: string): boolean {
  if (match.activeTurnIndex < 0 || match.activeTurnIndex >= match.turnOrder.length) {
    return false;
  }

  const activePlayerId = match.turnOrder[match.activeTurnIndex];
  return activePlayerId === playerId;
}

/**
 * Retorna jogador ativo no turno atual
 */
export function getActivePlayer(match: Match): Player | null {
  if (match.activeTurnIndex < 0 || match.activeTurnIndex >= match.turnOrder.length) {
    return null;
  }

  const activePlayerId = match.turnOrder[match.activeTurnIndex];
  return match.players.find((p) => p.id === activePlayerId) || null;
}
