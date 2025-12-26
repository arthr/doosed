/**
 * useBotExecution - Hook especializado para execução de bot AI
 * 
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Executar decisões de bot AI
 */

import { useCallback, useMemo } from 'react';
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import { useEventLogger } from './useEventLogger';
import { BotEasy } from '../core/bot/bot-easy';
import type { Player } from '../types/game';

export function useBotExecution() {
  const { match } = useMatchStore();
  const { players } = usePlayerStore();
  const { logBotDecision } = useEventLogger();

  // Instância singleton do bot Easy
  const botEasy = useMemo(() => new BotEasy(), []);

  /**
   * Executa turno do bot (decide ação e retorna decisão)
   * Note: Não aplica a ação, apenas retorna a decisão
   */
  const executeBotDecision = useCallback(
    (bot: Player) => {
      const pool = match?.currentRound?.pool;
      
      if (!pool || !match) {
        return null;
      }

      logBotDecision(`Bot ${bot.name} pensando...`, { botId: bot.id });

      const opponents = players.filter((p) => p.id !== bot.id);
      const seed = Date.now() + Math.random() * 1000;

      const decision = botEasy.decideTurnAction(bot, opponents, pool, match, seed);

      if (decision.type === 'CONSUME_PILL') {
        logBotDecision(`Bot decidiu consumir pill ${decision.pillId}`, {
          botId: bot.id,
          pillId: decision.pillId,
        });
      } else if (decision.type === 'USE_ITEM') {
        logBotDecision(`Bot decidiu usar item ${decision.itemId}`, {
          botId: bot.id,
          itemId: decision.itemId,
        });
      }

      return decision;
    },
    [match, players, botEasy, logBotDecision]
  );

  /**
   * Verifica se player é bot e pode agir
   */
  const canBotAct = useCallback((player: Player): boolean => {
    return player.isBot && !player.isEliminated;
  }, []);

  return {
    executeBotDecision,
    canBotAct,
  };
}

