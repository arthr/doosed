/**
 * useTurnManagement - Hook especializado para gestao de turnos
 *
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Gerenciar ciclo de turnos (next, skip, timeout)
 */

import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useEventLogger } from './useEventLogger';
import { randomInt } from '../core/utils/random';
import type { Player } from '../types/game';

export function useTurnManagement() {
  // Usar useGameStore com seletores para performance
  const nextTurn = useGameStore(state => state.nextTurn);
  const nextRound = useGameStore(state => state.nextRound);
  const setActiveTurn = useGameStore(state => state.setActiveTurn);
  const clearActiveTurns = useGameStore(state => state.clearActiveTurns);
  const bumpTurnToken = useGameStore(state => state.bumpTurnToken);
  const getPlayer = useGameStore(state => state.getPlayer);
  const getAllPlayers = useGameStore(state => state.getAllPlayers);
  const getAlivePlayers = useGameStore(state => state.getAlivePlayers);

  const { logTurn } = useEventLogger();

  /**
   * Retorna o player do turno atual baseado em match.activeTurnIndex
   */
  const getCurrentTurnPlayer = useCallback((): Player | null => {
    const match = useGameStore.getState().match;
    if (!match) return null;

    const currentPlayerId = match.turnOrder[match.activeTurnIndex];
    return getPlayer(currentPlayerId) || null;
  }, [getPlayer]);

  /**
   * Verifica se pool esgotou e precisa de nova rodada
   */
  const shouldStartNewRound = useCallback((): boolean => {
    const pool = useGameStore.getState().currentRound?.pool;
    return pool ? pool.pills.length === 0 : false;
  }, []);

  /**
   * Avanca para proximo turno (ou rodada se pool esgotou)
   * Logica FR-045: Pool vazio -> nova rodada
   */
  const advanceToNextTurn = useCallback(() => {
    const match = useGameStore.getState().match;
    if (!match) return;

    const alivePlayers = getAlivePlayers();

    // Jogo terminou? Nao avanca
    if (alivePlayers.length <= 1) return;

    // Pool esgotou? Nova rodada
    if (shouldStartNewRound()) {
      const nextRoundNumber = (useGameStore.getState().currentRound?.number || 0) + 1;
      logTurn('Pool esgotado - iniciando nova rodada', {
        roundNumber: nextRoundNumber,
      });
      nextRound(); // Gera novo pool + reseta activeTurnIndex = 0
    } else {
      nextTurn(); // Incrementa activeTurnIndex
    }

    // Limpa turno ativo DEPOIS de avancar o indice
    // Isso permite que useEffect detecte !activePlayer e chame startNextTurn()
    clearActiveTurns();
    bumpTurnToken();
  }, [
    getAlivePlayers,
    shouldStartNewRound,
    nextTurn,
    nextRound,
    clearActiveTurns,
    bumpTurnToken,
    logTurn,
  ]);

  /**
   * Inicia turno de um player especifico
   */
  const startTurnForPlayer = useCallback(
    (player: Player) => {
      setActiveTurn(player.id);
      bumpTurnToken();

      const roundNumber = useGameStore.getState().currentRound?.number || 0;
      logTurn(`Turno de ${player.name}`, {
        playerId: player.id,
        roundNumber,
      });
    },
    [setActiveTurn, bumpTurnToken, logTurn],
  );

  /**
   * Pula turno de player eliminado e tenta proximo
   */
  const skipEliminatedPlayerTurn = useCallback(() => {
    nextTurn();
  }, [nextTurn]);

  /**
   * Handler para timeout de turno - consome pill aleatoria
   * Retorna pillId da pill aleatoria ou null se nao ha pills
   */
  const handleTurnTimeout = useCallback((): string | null => {
    const pool = useGameStore.getState().currentRound?.pool;
    const players = getAllPlayers();
    const activePlayer = players.find(p => p.isActiveTurn);

    if (!pool || !activePlayer || pool.pills.length === 0) {
      return null;
    }

    // Seleciona pill aleatoria usando o RNG global semeado
    const randomIndex = randomInt(0, pool.pills.length - 1);
    const randomPill = pool.pills[randomIndex];

    logTurn(`Timer expirou! ${activePlayer.name} consumira pill aleatoria`, {
      playerId: activePlayer.id,
      pillId: randomPill.id,
    });

    return randomPill.id;
  }, [getAllPlayers, logTurn]);

  return {
    getCurrentTurnPlayer,
    shouldStartNewRound,
    advanceToNextTurn,
    startTurnForPlayer,
    skipEliminatedPlayerTurn,
    handleTurnTimeout,
  };
}
