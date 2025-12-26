/**
 * useMatchEndDetection - Hook especializado para deteccao de fim de jogo
 *
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Detectar fim de jogo e calcular recompensas
 */

import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useProgressionStore } from '../stores/progressionStore';
import { useEventLogger } from './useEventLogger';
import { DEFAULT_GAME_CONFIG } from '../config/game-config';

export function useMatchEndDetection() {
  // Usar useGameStore com seletores para performance
  const rounds = useGameStore((state) => state.rounds);
  const endMatch = useGameStore((state) => state.endMatch);
  const getAlivePlayers = useGameStore((state) => state.getAlivePlayers);

  const { addXP, incrementGamesPlayed, incrementWins, addRoundsSurvived } =
    useProgressionStore();
  const { logMatch } = useEventLogger();

  /**
   * Checa se ha apenas 1 jogador vivo (condicao de vitoria)
   * Retorna o vencedor ou null se jogo continua
   */
  const checkForWinner = useCallback(() => {
    const alivePlayers = getAlivePlayers();

    if (alivePlayers.length === 1) {
      return alivePlayers[0];
    }

    return null;
  }, [getAlivePlayers]);

  /**
   * Calcula recompensas de XP baseado em performance
   * Usa config para valores de XP (FR-161)
   */
  const calculateXPReward = useCallback((isWinner: boolean, roundsSurvived: number = 0): number => {
    const { xp: xpConfig } = DEFAULT_GAME_CONFIG;
    const baseXP = roundsSurvived * xpConfig.xpPerRound;
    const winBonus = isWinner ? xpConfig.victoryBonus : 0;

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
      const xpReward = calculateXPReward(isPlayerWinner, rounds.length);

      // Aplica recompensas
      if (isPlayerWinner) {
        addXP(xpReward);
        incrementWins();
      }

      incrementGamesPlayed();
      addRoundsSurvived(rounds.length || 0);

      // Finaliza match no store
      endMatch(winner.id);
    },
    [
      rounds.length,
      logMatch,
      calculateXPReward,
      addXP,
      incrementWins,
      incrementGamesPlayed,
      addRoundsSurvived,
      endMatch,
    ]
  );

  /**
   * Checa fim de jogo e finaliza se necessario
   * Retorna true se jogo terminou, false caso contrario
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
