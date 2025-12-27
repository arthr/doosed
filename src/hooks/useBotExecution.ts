/**
 * useBotExecution - Hook especializado para execucao de bot AI
 *
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Executar decisoes de bot AI
 */

import { useCallback, useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useEventLogger } from './useEventLogger';
import { BotEasy } from '../core/bot/bot-easy';
import { BotLevel } from '../types/game';
import type { Player, Match } from '../types/game';

export function useBotExecution() {
  // Usar useGameStore com seletores para performance
  const match = useGameStore(state => state.match);
  const currentRound = useGameStore(state => state.currentRound);
  const getAllPlayers = useGameStore(state => state.getAllPlayers);
  const getPool = useGameStore(state => state.getPool);

  const { logBotDecision } = useEventLogger();

  // Instancias memoizadas por nivel (por enquanto NORMAL/HARD/INSANE delegam para Easy)
  const bots = useMemo(() => {
    const easy = new BotEasy();
    return {
      [BotLevel.EASY]: easy,
      [BotLevel.NORMAL]: easy,
      [BotLevel.HARD]: easy,
      [BotLevel.INSANE]: easy,
    };
  }, []);

  const getBotAI = useCallback(
    (player: Player) => {
      const level = player.botLevel || BotLevel.EASY;
      return bots[level] || bots[BotLevel.EASY];
    },
    [bots],
  );

  /**
   * Executa turno do bot (decide acao e retorna decisao)
   * Note: Nao aplica a acao, apenas retorna a decisao
   */
  const executeBotDecision = useCallback(
    (bot: Player) => {
      const pool = getPool();
      const players = getAllPlayers();

      if (!pool || !match || !currentRound) {
        return null;
      }

      logBotDecision(`Bot ${bot.name} pensando...`, { botId: bot.id });

      const opponents = players.filter(p => p.id !== bot.id);
      const baseSeed = match.seed || Date.now();
      const derivedSeed = baseSeed * 137 + match.activeTurnIndex;

      // Criar objeto Match compativel para o bot
      const matchForBot: Match = {
        id: match.id,
        seed: match.seed,
        phase: match.phase,
        players,
        rounds: [],
        currentRound,
        turnOrder: match.turnOrder,
        activeTurnIndex: match.activeTurnIndex,
        seasonalShapes: match.seasonalShapes,
        shopSignals: match.shopSignals,
        winnerId: match.winnerId,
        startedAt: match.startedAt,
        endedAt: match.endedAt,
      };

      const ai = getBotAI(bot);
      const decision = ai.decideTurnAction(bot, opponents, pool, matchForBot, derivedSeed);

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
    [match, currentRound, getAllPlayers, getPool, getBotAI, logBotDecision],
  );

  /**
   * Verifica se player e bot e pode agir
   */
  const canBotAct = useCallback((player: Player): boolean => {
    // Nao depende de isActiveTurn para evitar objetos stale em callbacks agendados.
    // A validade do turno eh garantida pelo turnToken/activePlayerId no useGameLoop.
    return player.isBot && !player.isEliminated;
  }, []);

  return {
    executeBotDecision,
    canBotAct,
  };
}
