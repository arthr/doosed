/**
 * useGameLoop - Hook orquestrador do game loop (REFATORADO)
 *
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Orquestrar hooks especializados (Composition over Monolith)
 *
 * Hooks compostos:
 * - usePillConsumption: consumo de pills
 * - useTurnManagement: gestao de turnos
 * - useBotExecution: execucao de bot AI
 * - useMatchEndDetection: deteccao de fim de jogo
 * - useItemActions: uso de itens
 *
 * T085-T088: Wire gameplay mechanics
 */

import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { usePillConsumption } from './usePillConsumption';
import { useTurnManagement } from './useTurnManagement';
import { useBotExecution } from './useBotExecution';
import { useMatchEndDetection } from './useMatchEndDetection';
import { useItemActions } from './useItemActions';
import { DEFAULT_GAME_CONFIG } from '../config/game-config';
import { MatchPhase } from '../types/game';

export function useGameLoop() {
  // Usar useGameStore com seletores para performance
  const match = useGameStore(state => state.match);
  const getPool = useGameStore(state => state.getPool);
  const getAllPlayers = useGameStore(state => state.getAllPlayers);
  const setProcessingTurn = useGameStore(state => state.setProcessingTurn);

  // Hooks especializados (SOLID-S)
  const { consumePill } = usePillConsumption();
  const {
    getCurrentTurnPlayer,
    advanceToNextTurn,
    startTurnForPlayer,
    skipEliminatedPlayerTurn,
    handleTurnTimeout: getTurnTimeoutPillId,
  } = useTurnManagement();
  const { executeBotDecision, canBotAct } = useBotExecution();
  const { checkAndHandleMatchEnd } = useMatchEndDetection();
  const { handleItemUse: handleItemUseWithTargets } = useItemActions();

  const botTimeoutMs = DEFAULT_GAME_CONFIG.timers.botTimeout * 1000;

  const isStillSameTurn = useCallback(
    (expectedTurnToken: number, expectedActivePlayerId?: string | null) => {
      const state = useGameStore.getState();
      if (!state.match || state.match.phase !== MatchPhase.MATCH) return false;
      if (state.turnToken !== expectedTurnToken) return false;

      if (typeof expectedActivePlayerId !== 'undefined') {
        const active = state.getAllPlayers().find(p => p.isActiveTurn) || null;
        if ((active?.id || null) !== expectedActivePlayerId) return false;
      }

      return true;
    },
    [],
  );

  /**
   * Handler de consumo de pill (orquestra hooks especializados)
   * T085: Wire MatchScreen pill clicks
   */
  const handlePillConsume = useCallback(
    (pillId: string, playerId: string) => {
      const pool = getPool();
      const players = getAllPlayers();

      if (!pool) return;

      const pill = pool.pills.find(p => p.id === pillId);
      const player = players.find(p => p.id === playerId);

      if (!pill || !player) return;

      // Consome pill (hook especializado)
      consumePill(pill, player);

      // Apos consumo, checa fim de jogo e avanca turno
      const { turnToken } = useGameStore.getState();
      const activePlayerIdAtConsume =
        useGameStore
          .getState()
          .getAllPlayers()
          .find(p => p.isActiveTurn)?.id || null;

      setTimeout(() => {
        if (!isStillSameTurn(turnToken, activePlayerIdAtConsume)) return;
        const matchEnded = checkAndHandleMatchEnd();

        if (!matchEnded) {
          advanceToNextTurn();
        }
      }, 500);
    },
    [
      getPool,
      getAllPlayers,
      consumePill,
      isStillSameTurn,
      checkAndHandleMatchEnd,
      advanceToNextTurn,
    ],
  );

  /**
   * Executa turno do bot (orquestra decisao + acao)
   */
  const executeBotTurnAction = useCallback(
    (bot: ReturnType<typeof getAllPlayers>[0]) => {
      if (!canBotAct(bot)) return;

      const decision = executeBotDecision(bot);

      if (!decision) return;

      if (decision.type === 'CONSUME_PILL') {
        const token = useGameStore.getState().turnToken;
        setTimeout(() => {
          if (!isStillSameTurn(token, bot.id)) return;
          handlePillConsume(decision.pillId, bot.id);
        }, 1000);
      } else if (decision.type === 'USE_ITEM') {
        const token = useGameStore.getState().turnToken;
        setTimeout(() => {
          if (!isStillSameTurn(token, bot.id)) return;
          handleItemUseWithTargets(bot.id, decision.itemId, {
            targetPillId: decision.targetPillId,
            targetShape: decision.targetShape,
            targetPlayerId: decision.targetPlayerId,
          });
        }, 1000);
      }
    },
    [canBotAct, executeBotDecision, isStillSameTurn, handlePillConsume, handleItemUseWithTargets],
  );

  /**
   * Auto-consume random pill quando timer expira
   * T087: Wire turn timer expiration
   */
  const handleTurnTimeout = useCallback(() => {
    const players = getAllPlayers();
    const activePlayer = players.find(p => p.isActiveTurn);
    if (!activePlayer) return;

    const randomPillId = getTurnTimeoutPillId();

    if (randomPillId) {
      handlePillConsume(randomPillId, activePlayer.id);
    }
  }, [getAllPlayers, getTurnTimeoutPillId, handlePillConsume]);

  /**
   * Inicia proximo turno (orquestra hooks especializados)
   */
  const startNextTurn = useCallback(() => {
    const state = useGameStore.getState();
    if (state.isProcessingTurn) return;

    setProcessingTurn(true);
    if (!match) {
      setProcessingTurn(false);
      return;
    }

    // Checa fim de jogo
    const matchEnded = checkAndHandleMatchEnd();
    if (matchEnded) {
      setProcessingTurn(false);
      return;
    }

    const currentPlayer = getCurrentTurnPlayer();

    // Player eliminado? Pula turno
    if (!currentPlayer || currentPlayer.isEliminated) {
      skipEliminatedPlayerTurn();
      // Nao usamos recursao aqui: o MatchScreen ja observa activePlayer === null e chama startNextTurn().
      // Isso evita problemas de "use-before-define" e reduz reentrancia por timeouts.
      setProcessingTurn(false);
      return;
    }

    // Inicia turno do player
    startTurnForPlayer(currentPlayer);
    setProcessingTurn(false);

    // Se e bot, executa IA
    if (canBotAct(currentPlayer)) {
      const tokenAtStart = useGameStore.getState().turnToken;
      setTimeout(() => {
        if (!isStillSameTurn(tokenAtStart, currentPlayer.id)) return;
        executeBotTurnAction(currentPlayer);
      }, 2000);

      // Fallback: se o bot nao agir em tempo razoavel, forca consumo automatico (timers.botTimeout).
      setTimeout(() => {
        if (!isStillSameTurn(tokenAtStart, currentPlayer.id)) return;
        // Reusa o mesmo mecanismo do timeout do turno.
        // Se o bot ja tiver agido, o turnToken ja tera mudado e este callback sera ignorado.
        handleTurnTimeout();
      }, botTimeoutMs);
    }
  }, [
    match,
    setProcessingTurn,
    botTimeoutMs,
    isStillSameTurn,
    checkAndHandleMatchEnd,
    getCurrentTurnPlayer,
    skipEliminatedPlayerTurn,
    startTurnForPlayer,
    canBotAct,
    handleTurnTimeout,
    executeBotTurnAction,
  ]);

  return {
    // Handlers publicos (compatibilidade com MatchScreen)
    handlePillConsume,
    handleItemUse: handleItemUseWithTargets,
    handleTurnTimeout,
    startNextTurn,
  };
}
