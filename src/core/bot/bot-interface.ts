/**
 * Bot Interface: Contrato comum para todos os níveis de bot
 *
 * Todos os bots devem implementar esta interface
 * Garante consistência e testabilidade
 */

import type { Match, Player, Pool } from '../../types/game';
import type { Item } from '../../types/item';
import type { Pill } from '../../types/pill';
import type { GameConfig } from '../../types/config';
import { DEFAULT_GAME_CONFIG } from '../../config/game-config';

// ============================================================================
// Bot Action Types
// ============================================================================

export type BotAction =
  | {
      type: 'USE_ITEM';
      itemId: string;
      targetPillId?: string;
      targetShape?: string;
      targetPlayerId?: string;
    }
  | {
      type: 'CONSUME_PILL';
      pillId: string;
    }
  | {
      type: 'SIGNAL_SHOP';
      wants: boolean;
    }
  | {
      type: 'END_TURN';
    };

// ============================================================================
// Bot Interface
// ============================================================================

export interface BotAI {
  /**
   * Decide ação do bot no Draft
   * Escolhe itens para comprar (dentro do orçamento)
   */
  decideDraftAction(
    player: Player,
    availableItems: Item[],
    config: { budget: number },
    gameConfig?: GameConfig
  ): { itemId: string } | null;

  /**
   * Decide ação do bot no turno
   * Pode usar itens múltiplos, DEVE consumir pill para finalizar
   */
  decideTurnAction(
    player: Player,
    opponents: Player[],
    pool: Pool,
    match: Match,
    seed: number,
    gameConfig?: GameConfig
  ): BotAction;

  /**
   * Decide ação do bot no Shopping
   * Escolhe boosts para comprar
   */
  decideShoppingAction(
    player: Player,
    availableBoosts: Item[],
    config: { budget: number },
    gameConfig?: GameConfig
  ): { itemId: string } | null;
}

// ============================================================================
// Helpers: Common Bot Utilities
// ============================================================================

/**
 * Filtra pills disponíveis no pool
 */
export function getAvailablePills(pool: Pool): Pill[] {
  return pool.pills.filter((p) => p.state === 'AVAILABLE');
}

/**
 * Filtra pills reveladas SAFE
 */
export function getRevealedSafePills(pool: Pool): Pill[] {
  return pool.pills.filter(
    (p) => p.state === 'AVAILABLE' && p.isRevealed && p.type === 'SAFE'
  );
}

/**
 * Filtra pills reveladas HEAL
 */
export function getRevealedHealPills(pool: Pool): Pill[] {
  return pool.pills.filter(
    (p) => p.state === 'AVAILABLE' && p.isRevealed && p.type === 'HEAL'
  );
}

/**
 * Filtra pills não reveladas
 */
export function getUnrevealedPills(pool: Pool): Pill[] {
  return pool.pills.filter((p) => p.state === 'AVAILABLE' && !p.isRevealed);
}

/**
 * Verifica se jogador esta em situacao critica
 * Usa config para thresholds de perigo
 */
export function isPlayerInDanger(
  player: Player,
  config: GameConfig = DEFAULT_GAME_CONFIG
): boolean {
  const dangerResistanceThreshold = Math.floor(config.health.resistanceCap / 3);
  return player.isLastChance || player.resistance <= dangerResistanceThreshold || player.lives === 1;
}

/**
 * Calcula "threat score" do jogador (quão perto de perder)
 * Usa config para thresholds baseados em valores de saude
 */
export function calculateThreatScore(
  player: Player,
  config: GameConfig = DEFAULT_GAME_CONFIG
): number {
  let score = 0;

  if (player.isEliminated) return 1000; // Maximo threat

  const maxLives = config.health.initialLives;
  const maxResistance = config.health.resistanceCap;

  if (player.isLastChance) score += 50;
  if (player.lives === 1) score += 30;
  if (player.lives === maxLives - 1) score += 10;

  if (player.resistance <= 0) score += 50;
  if (player.resistance <= maxResistance / 3) score += 20;
  if (player.resistance <= maxResistance * 2 / 3) score += 10;

  return score;
}

