/**
 * Collapse Handler: Mecânica de Colapso (Vidas → Resistência)
 *
 * Implementa sistema de saúde dupla:
 * - Colapso ocorre quando Resistência ≤ 0
 * - Colapso reduz Vidas em 1 e reseta Resistência para 6
 * - Última Chance: 0 Vidas mas ainda vivo
 * - Eliminado: Colapso em Última Chance
 *
 * Baseado em data-model.md "Player State Transitions"
 * FR-095 a FR-099
 */

import type { Player } from '../types/game';
import type { GameConfig } from '../types/config';
import { validatePlayerInvariants } from './utils/validation';
import { DEFAULT_GAME_CONFIG } from '../config/game-config';

// ============================================================================
// Types
// ============================================================================

export interface CollapseResult {
  collapsed: boolean; // Se colapso ocorreu
  previousLives: number;
  newLives: number;
  newResistance: number;
  isLastChance: boolean; // Se entrou em última chance (lives === 0)
  isEliminated: boolean; // Se foi eliminado (colapso em última chance)
  totalCollapses: number; // Novo total de colapsos
}

// ============================================================================
// T038: Handle Collapse (Core Logic)
// ============================================================================

/**
 * Processa colapso quando Resistência ≤ 0
 *
 * Fluxo:
 * 1. Reduz Vidas em 1
 * 2. Reseta Resistência para config.health.initialResistance
 * 3. Se Vidas === 0 → Última Chance (isLastChance = true)
 * 4. Incrementa totalCollapses
 *
 * FR-095: Colapso ocorre quando resistance <= 0
 * FR-096: Vidas reduz em 1, Resistência reseta para valor configurado
 * FR-097: Feedback visual claro (implementado em UI)
 */
export function handleCollapse(
  player: Player,
  config: GameConfig = DEFAULT_GAME_CONFIG
): CollapseResult {
  const resistanceResetValue = config.health.initialResistance;
  const previousLives = player.lives;
  const newLives = Math.max(player.lives - 1, 0); // Lives nunca negativo
  const newResistance = resistanceResetValue;
  const isLastChance = newLives === 0;
  const totalCollapses = player.totalCollapses + 1;

  return {
    collapsed: true,
    previousLives,
    newLives,
    newResistance,
    isLastChance,
    isEliminated: false, // Colapso normal não elimina (apenas sinaliza última chance)
    totalCollapses,
  };
}

// ============================================================================
// T039: Check Elimination (Colapso em Última Chance)
// ============================================================================

/**
 * Verifica se jogador deve ser eliminado
 *
 * Eliminação ocorre quando:
 * - Jogador já está em Última Chance (lives === 0)
 * - E sofre outro Colapso (resistance <= 0)
 *
 * FR-099: Colapso em Última Chance elimina jogador
 */
export function checkElimination(player: Player): boolean {
  return player.isLastChance && player.resistance <= 0;
}

/**
 * Processa eliminação de jogador
 */
export function handleElimination(player: Player): CollapseResult {
  return {
    collapsed: true,
    previousLives: player.lives,
    newLives: 0,
    newResistance: 0, // Resistência irrelevante quando eliminado
    isLastChance: true,
    isEliminated: true,
    totalCollapses: player.totalCollapses + 1,
  };
}

// ============================================================================
// T040: Collapse Validation
// ============================================================================

/**
 * Valida estado pós-colapso
 *
 * Invariantes:
 * - Lives >= 0 (sempre)
 * - Resistance = resistanceCap após reset
 * - Se lives === 0, isLastChance === true
 * - Se isEliminated === true, isActiveTurn === false
 */
export function validateCollapseState(player: Player): boolean {
  return validatePlayerInvariants(player);
}

// ============================================================================
// Main Function: Process Collapse or Elimination
// ============================================================================

/**
 * Processa Colapso ou Eliminação baseado no estado atual
 *
 * Uso:
 * 1. Verificar se resistance <= 0
 * 2. Chamar esta função
 * 3. Aplicar CollapseResult ao Player
 *
 * @param player - Jogador atual
 * @param config - Configuração do jogo (opcional, usa DEFAULT_GAME_CONFIG)
 * @returns CollapseResult com informações do colapso/eliminação
 */
export function processCollapseOrElimination(
  player: Player,
  config: GameConfig = DEFAULT_GAME_CONFIG
): CollapseResult | null {
  // Não processa se resistência > 0
  if (player.resistance > 0) {
    return null;
  }

  // Verificar eliminação (colapso em última chance)
  if (checkElimination(player)) {
    return handleElimination(player);
  }

  // Colapso normal
  return handleCollapse(player, config);
}

// ============================================================================
// Helper: Apply Collapse Result to Player
// ============================================================================

/**
 * Aplica CollapseResult ao Player, retornando novo Player
 */
export function applyCollapseToPlayer(player: Player, result: CollapseResult): Player {
  if (!result.collapsed) {
    return player;
  }

  return {
    ...player,
    lives: result.newLives,
    resistance: result.newResistance,
    extraResistance: 0, // Reset extra resistance
    isLastChance: result.isLastChance,
    isEliminated: result.isEliminated,
    isActiveTurn: result.isEliminated ? false : player.isActiveTurn, // Eliminados não têm turno
    totalCollapses: result.totalCollapses,
  };
}

