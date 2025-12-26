/**
 * useMatchEndDetection - Hook especializado para detecção de fim de jogo
 * 
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Detectar fim de jogo e calcular recompensas
 */

import { useCallback } from 'react';
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import { useProgressionStore } from '../stores/progressionStore';
import { useEventLogger } from './useEventLogger';

export function useMatchEndDetection() {
  const { match, endMatch } = useMatchStore();
  const { players } = usePlayerStore();
  const { addXP, incrementGamesPlayed, incrementWins, addRoundsSurvived } = useProgressionStore();
  const { logMatch } = useEventLogger();

  /**
   * Checa se há apenas 1 jogador vivo (condição de vitória)
   * Retorna o vencedor ou null se jogo continua
   */
  const checkForWinner = useCallback(() => {
    const alivePlayers = players.filter((p) => !p.isEliminated);

    if (alivePlayers.length === 1) {
      return alivePlayers[0];
    }

    return null;
  }, [players]);

  /**
   * Calcula recompensas de XP baseado em performance
   * TODO: Refinar cálculo com base em stats reais
   */
  const calculateXPReward = useCallback((isWinner: boolean): number => {
    const baseXP = 100;
    const winBonus = isWinner ? 50 : 0;
    
    return baseXP + winBonus;
  }, []);

  /**
   * Finaliza match com vencedor e aplica recompensas
   */
  const finalizeMatch = useCallback(
    (winner: { id: string; name: string; isBot: boolean }) => {
      logMatch(`Partida terminada! Vencedor: ${winner.name}`, {
        winnerId: winner.id,
      });

      const isPlayerWinner = !winner.isBot;
      const xpReward = calculateXPReward(isPlayerWinner);

      // Aplica recompensas
      if (isPlayerWinner) {
        addXP(xpReward);
        incrementWins();
      }

      incrementGamesPlayed();
      addRoundsSurvived(match?.rounds.length || 0);

      // Finaliza match no store
      endMatch(winner.id);
    },
    [match?.rounds.length, logMatch, calculateXPReward, addXP, incrementWins, incrementGamesPlayed, addRoundsSurvived, endMatch]
  );

  /**
   * Checa fim de jogo e finaliza se necessário
   * Retorna true se jogo terminou, false caso contrário
   */
  const checkAndHandleMatchEnd = useCallback((): boolean => {
    const winner = checkForWinner();

    if (winner) {
      finalizeMatch(winner);
      return true;
    }

    return false;
  }, [checkForWinner, finalizeMatch]);

  return {
    checkForWinner,
    checkAndHandleMatchEnd,
    finalizeMatch,
  };
}

