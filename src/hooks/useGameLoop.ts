/**
 * useGameLoop - Hook orquestrador do game loop (REFATORADO)
 * 
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Orquestrar hooks especializados (Composition over Monolith)
 * 
 * Hooks compostos:
 * - usePillConsumption: consumo de pills
 * - useTurnManagement: gestão de turnos
 * - useBotExecution: execução de bot AI
 * - useMatchEndDetection: detecção de fim de jogo
 * - useItemActions: uso de itens
 * 
 * T085-T088: Wire gameplay mechanics
 */

import { useCallback } from 'react';
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import { usePillConsumption } from './usePillConsumption';
import { useTurnManagement } from './useTurnManagement';
import { useBotExecution } from './useBotExecution';
import { useMatchEndDetection } from './useMatchEndDetection';
import { useItemActions } from './useItemActions';

export function useGameLoop() {
  const { match } = useMatchStore();
  const { players } = usePlayerStore();

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
  const { handleItemClick } = useItemActions();

  // Pool vem do currentRound (fonte única da verdade)
  const pool = match?.currentRound?.pool || null;

  /**
   * Handler de consumo de pill (orquestra hooks especializados)
   * T085: Wire MatchScreen pill clicks
   */
  const handlePillConsume = useCallback(
    (pillId: string, playerId: string) => {
      if (!pool) return;

      const pill = pool.pills.find((p) => p.id === pillId);
      const player = players.find((p) => p.id === playerId);

      if (!pill || !player) return;

      // Consome pill (hook especializado)
      consumePill(pill, player);

      // Após consumo, checa fim de jogo e avança turno
      setTimeout(() => {
        const matchEnded = checkAndHandleMatchEnd();
        
        if (!matchEnded) {
          advanceToNextTurn();
        }
      }, 500);
    },
    [pool, players, consumePill, checkAndHandleMatchEnd, advanceToNextTurn]
  );

  /**
   * Executa turno do bot (orquestra decisão + ação)
   */
  const executeBotTurnAction = useCallback(
    (bot: typeof players[0]) => {
      if (!canBotAct(bot)) return;

      const decision = executeBotDecision(bot);

      if (!decision) return;

      if (decision.type === 'CONSUME_PILL') {
        setTimeout(() => {
          handlePillConsume(decision.pillId, bot.id);
        }, 1000);
      } else if (decision.type === 'USE_ITEM') {
        setTimeout(() => {
          handleItemClick(bot.id, decision.itemId);
        }, 1000);
      }
    },
    [canBotAct, executeBotDecision, handlePillConsume, handleItemClick]
  );

  /**
   * Inicia próximo turno (orquestra hooks especializados)
   */
  const startNextTurn = useCallback(() => {
    if (!match) return;

    // Checa fim de jogo
    const matchEnded = checkAndHandleMatchEnd();
    if (matchEnded) return;

    const currentPlayer = getCurrentTurnPlayer();

    // Player eliminado? Pula turno
    if (!currentPlayer || currentPlayer.isEliminated) {
      skipEliminatedPlayerTurn();
      setTimeout(() => {
        startNextTurn(); // Recursivo - tenta próximo jogador
      }, 100);
      return;
    }

    // Inicia turno do player
    startTurnForPlayer(currentPlayer);

    // Se é bot, executa IA
    if (canBotAct(currentPlayer)) {
      setTimeout(() => {
        executeBotTurnAction(currentPlayer);
      }, 2000);
    }
  }, [
    match,
    checkAndHandleMatchEnd,
    getCurrentTurnPlayer,
    skipEliminatedPlayerTurn,
    startTurnForPlayer,
    canBotAct,
    executeBotTurnAction,
  ]);

  /**
   * Usa item do inventário (delegado ao hook especializado)
   * T086: Wire item usage
   */
  const handleItemUse = handleItemClick;

  /**
   * Auto-consume random pill quando timer expira
   * T087: Wire turn timer expiration
   */
  const handleTurnTimeout = useCallback(() => {
    const activePlayer = players.find((p) => p.isActiveTurn);
    if (!activePlayer) return;

    const randomPillId = getTurnTimeoutPillId();
    
    if (randomPillId) {
      handlePillConsume(randomPillId, activePlayer.id);
    }
  }, [players, getTurnTimeoutPillId, handlePillConsume]);

  return {
    // Handlers públicos (compatibilidade com MatchScreen)
    handlePillConsume,
    handleItemUse,
    handleTurnTimeout,
    startNextTurn,
  };
}
