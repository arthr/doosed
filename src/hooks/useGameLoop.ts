/**
 * useGameLoop - Hook principal do game loop
 * 
 * Gerencia o ciclo de turnos, consumo de pills, bot AI, e transições
 * T085-T088: Wire gameplay mechanics
 */

import { useCallback, useMemo } from 'react';
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import { useProgressionStore } from '../stores/progressionStore';
import { useEventLogger } from './useEventLogger';
import { resolvePillEffect } from '../core/effect-resolver';
import { BotEasy } from '../core/bot/bot-easy';
import type { Player } from '../types/game';

export function useGameLoop() {
  const { match, nextTurn, endMatch, updateMatch } = useMatchStore();
  const { players, updatePlayer, applyDamage, applyHeal, setActiveTurn, clearActiveTurns } = usePlayerStore();
  const { addXP, incrementGamesPlayed, incrementWins, addRoundsSurvived } = useProgressionStore();
  const { logPill, logTurn, logItem, logMatch, logBotDecision } = useEventLogger();

  // Pool vem do currentRound (fonte única da verdade)
  const pool = match?.currentRound?.pool || null;

  // Instância do bot Easy
  const botEasy = useMemo(() => new BotEasy(), []);

  /**
   * Checa se match terminou
   * T088: Wire match end detection
   */
  const checkMatchEnd = useCallback(() => {
    const alivePlayers = players.filter((p) => !p.isEliminated);

    if (alivePlayers.length === 1) {
      const winner = alivePlayers[0];
      
      logMatch(`Partida terminada! Vencedor: ${winner.name}`, {
        winnerId: winner.id,
      });

      // Calcula recompensas (mock - será refinado)
      const xpReward = 150;
      const isWinner = !winner.isBot;

      if (isWinner) {
        addXP(xpReward);
        incrementWins();
      }

      incrementGamesPlayed();
      addRoundsSurvived(match?.rounds.length || 0);

      // Finaliza match
      endMatch(winner.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, match?.rounds.length]);

  /**
   * Consume pill e aplica efeitos
   * T085: Wire MatchScreen pill clicks
   */
  const handlePillConsume = useCallback(
    (pillId: string, playerId: string) => {
      if (!pool) return;

      const pill = pool.pills.find((p) => p.id === pillId);
      const player = players.find((p) => p.id === playerId);

      if (!pill || !player) return;

      // Consume pill - atualiza no matchStore
      updateMatch((m) => {
        if (!m.currentRound) return;
        const pillIndex = m.currentRound.pool.pills.findIndex((p) => p.id === pillId);
        if (pillIndex !== -1) {
          m.currentRound.pool.pills.splice(pillIndex, 1);
          m.currentRound.pool.size = m.currentRound.pool.pills.length;
        }
      });

      // Resolve efeito
      const effect = resolvePillEffect(pill, player);

      // Aplica efeito baseado no type
      if (effect.type === 'HEAL' && effect.value > 0) {
        applyHeal(playerId, effect.value);
      } else if (effect.type === 'DAMAGE' && effect.value > 0) {
        applyDamage(playerId, effect.value);
      } else if (effect.type === 'LIFE' && effect.value > 0) {
        updatePlayer(playerId, (p) => {
          p.lives = Math.min(3, p.lives + effect.value);
        });
      }

      // Log
      logPill(`${player.name} consumiu pill ${pill.shape} (${pill.type})`, {
        playerId,
        pillId,
        pillType: pill.type,
        effect,
      });

      // Checa fim do turno
      clearActiveTurns();
      
      // Checa eliminação e fim de jogo
      const checkAndContinue = () => {
        checkMatchEnd();
        
        // Próximo turno - incrementa índice
        setTimeout(() => {
          nextTurn();
        }, 500);
      };
      
      setTimeout(checkAndContinue, 500);
    },
    [pool, players, updateMatch, applyDamage, applyHeal, updatePlayer, logPill, clearActiveTurns, nextTurn, checkMatchEnd]
  );

  /**
   * Executa turno do bot
   */
  const executeBotTurn = useCallback(
    (bot: Player) => {
      if (!pool || !match) return;

      logBotDecision(`Bot ${bot.name} pensando...`, { botId: bot.id });

      const opponents = players.filter((p) => p.id !== bot.id);
      const seed = Date.now() + Math.random() * 1000;

      const decision = botEasy.decideTurnAction(bot, opponents, pool, match, seed);

      if (decision.type === 'CONSUME_PILL') {
        setTimeout(() => {
          handlePillConsume(decision.pillId, bot.id);
        }, 1000);
      } else if (decision.type === 'USE_ITEM') {
        logBotDecision(`Bot tentou usar item ${decision.itemId}`, { botId: bot.id });
      }
    },
    [pool, match, players, botEasy, logBotDecision, handlePillConsume]
  );

  /**
   * Inicia próximo turno (inclui bot AI)
   */
  const startNextTurn = useCallback(() => {
    if (!match) return;

    const alivePlayers = players.filter((p) => !p.isEliminated);
    if (alivePlayers.length <= 1) {
      checkMatchEnd();
      return;
    }

    const currentPlayerId = match.turnOrder[match.activeTurnIndex];
    const currentPlayer = players.find((p) => p.id === currentPlayerId);

    if (!currentPlayer || currentPlayer.isEliminated) {
      nextTurn();
      setTimeout(() => {
        startNextTurn(); // Recursivo - tentar próximo jogador
      }, 100);
      return;
    }

    setActiveTurn(currentPlayerId);

    logTurn(`Turno de ${currentPlayer.name}`, {
      playerId: currentPlayerId,
      roundNumber: match.currentRound?.number || 0,
    });

    // Se é bot, executa IA
    if (currentPlayer.isBot && pool) {
      setTimeout(() => {
        executeBotTurn(currentPlayer);
      }, 2000);
    }
  }, [match, players, pool, setActiveTurn, logTurn, nextTurn, checkMatchEnd, executeBotTurn]);

  /**
   * Usa item do inventário
   * T086: Wire item usage
   */
  const handleItemUse = useCallback(
    (playerId: string, itemId: string) => {
      const player = players.find((p) => p.id === playerId);
      if (!player) return;

      const slot = player.inventory.find((s) => s.item?.id === itemId);
      if (!slot || !slot.item) return;
      
      logItem(`${player.name} usou ${slot.item.name}`, {
        playerId,
        itemId,
      });
    },
    [players, logItem]
  );

  /**
   * Auto-consume random pill quando timer expira
   * T087: Wire turn timer expiration
   */
  const handleTurnTimeout = useCallback(() => {
    if (!pool || !match) return;

    const activePlayer = players.find((p) => p.isActiveTurn);
    if (!activePlayer || pool.pills.length === 0) return;

    // Seleciona pill aleatória
    const randomIndex = Math.floor(Math.random() * pool.pills.length);
    const randomPill = pool.pills[randomIndex];

    logTurn(`Timer expirou! ${activePlayer.name} consumiu pill aleatória`, {
      playerId: activePlayer.id,
      pillId: randomPill.id,
    });

    handlePillConsume(randomPill.id, activePlayer.id);
  }, [pool, match, players, logTurn, handlePillConsume]);

  return {
    handlePillConsume,
    handleItemUse,
    handleTurnTimeout,
    startNextTurn,
    checkMatchEnd,
  };
}
