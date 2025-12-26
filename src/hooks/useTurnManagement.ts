/**
 * useTurnManagement - Hook especializado para gestão de turnos
 * 
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Gerenciar ciclo de turnos (next, skip, timeout)
 */

import { useCallback } from 'react';
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import { useEventLogger } from './useEventLogger';
import type { Player } from '../types/game';

export function useTurnManagement() {
  const { match, nextTurn, nextRound } = useMatchStore();
  const { players, setActiveTurn, clearActiveTurns } = usePlayerStore();
  const { logTurn } = useEventLogger();

  /**
   * Retorna o player do turno atual baseado em match.activeTurnIndex
   */
  const getCurrentTurnPlayer = useCallback((): Player | null => {
    if (!match) return null;

    const currentPlayerId = match.turnOrder[match.activeTurnIndex];
    return players.find((p) => p.id === currentPlayerId) || null;
  }, [match, players]);

  /**
   * Verifica se pool esgotou e precisa de nova rodada
   */
  const shouldStartNewRound = useCallback((): boolean => {
    const pool = match?.currentRound?.pool;
    return pool ? pool.pills.length === 0 : false;
  }, [match]);

  /**
   * Avança para próximo turno (ou rodada se pool esgotou)
   * Lógica FR-045: Pool vazio → nova rodada
   */
  const advanceToNextTurn = useCallback(() => {
    if (!match) return;

    const alivePlayers = players.filter((p) => !p.isEliminated);
    
    // Jogo terminou? Não avança
    if (alivePlayers.length <= 1) return;

    // Pool esgotou? Nova rodada
    if (shouldStartNewRound()) {
      logTurn('Pool esgotado - iniciando nova rodada', {
        roundNumber: (match.currentRound?.number || 0) + 1,
      });
      nextRound(); // Gera novo pool + reseta activeTurnIndex = 0
    } else {
      nextTurn(); // Incrementa activeTurnIndex
    }

    // Limpa turno ativo para triggar detecção de próximo turno
    clearActiveTurns();
  }, [match, players, shouldStartNewRound, nextTurn, nextRound, clearActiveTurns, logTurn]);

  /**
   * Inicia turno de um player específico
   */
  const startTurnForPlayer = useCallback(
    (player: Player) => {
      setActiveTurn(player.id);

      logTurn(`Turno de ${player.name}`, {
        playerId: player.id,
        roundNumber: match?.currentRound?.number || 0,
      });
    },
    [match?.currentRound?.number, setActiveTurn, logTurn]
  );

  /**
   * Pula turno de player eliminado e tenta próximo
   */
  const skipEliminatedPlayerTurn = useCallback(() => {
    nextTurn();
  }, [nextTurn]);

  /**
   * Handler para timeout de turno - consome pill aleatória
   * Retorna pillId da pill aleatória ou null se não há pills
   */
  const handleTurnTimeout = useCallback((): string | null => {
    const pool = match?.currentRound?.pool;
    const activePlayer = players.find((p) => p.isActiveTurn);

    if (!pool || !activePlayer || pool.pills.length === 0) {
      return null;
    }

    // Seleciona pill aleatória
    const randomIndex = Math.floor(Math.random() * pool.pills.length);
    const randomPill = pool.pills[randomIndex];

    logTurn(`Timer expirou! ${activePlayer.name} consumirá pill aleatória`, {
      playerId: activePlayer.id,
      pillId: randomPill.id,
    });

    return randomPill.id;
  }, [match, players, logTurn]);

  return {
    getCurrentTurnPlayer,
    shouldStartNewRound,
    advanceToNextTurn,
    startTurnForPlayer,
    skipEliminatedPlayerTurn,
    handleTurnTimeout,
  };
}

