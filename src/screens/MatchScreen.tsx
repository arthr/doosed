/**
 * MatchScreen - Tela principal da partida (REFATORADO)
 *
 * T085: Wire MatchScreen pill clicks
 * T086: Wire MatchScreen item usage
 * T087: Wire turn timer expiration
 *
 * Refactoring:
 * - Seletores diretos do Zustand (performance)
 * - Subcomponentes em components/match/
 * - Efeitos consolidados
 * - Reducao de complexidade
 *
 * @see .specify/memory/constitution.md - Principio VIII (SOLID, DRY, KISS)
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { useTurnTimer } from '../hooks/useTurnTimer';
import { MatchHeader } from '../components/game/match/MatchHeader';
import { MatchMainContent } from '../components/game/match/MatchMainContent';
import { MatchLoadingState } from '../components/game/match/MatchLoadingState';
import { DEFAULT_GAME_CONFIG } from '../config/game-config';
import { MatchPhase } from '../types/game';

const TURN_TIME = DEFAULT_GAME_CONFIG.timers.turn;

export function MatchScreen() {
  // Store state - seletores diretos (otimizado)
  const match = useGameStore((state) => state.match);
  const currentRound = useGameStore((state) => state.currentRound);
  const pool = useGameStore((state) => state.currentRound?.pool || null);
  const getAllPlayers = useGameStore((state) => state.getAllPlayers);
  const resetMatch = useGameStore((state) => state.resetMatch);

  // Players array (derivado do Map via getter)
  const players = getAllPlayers();

  // Game loop hooks
  const { handlePillConsume, handleItemUse, handleTurnTimeout, startNextTurn } =
    useGameLoop();

  // Dados derivados - memoizados localmente (especificos desta tela)
  const humanPlayer = useMemo(
    () => players.find((p) => !p.isBot) || null,
    [players]
  );

  const opponents = useMemo(
    () => players.filter((p) => p.isBot),
    [players]
  );

  const activePlayer = useMemo(
    () => players.find((p) => p.isActiveTurn) || null,
    [players]
  );

  const isHumanTurn = useMemo(
    () => humanPlayer?.isActiveTurn ?? false,
    [humanPlayer]
  );

  // Timer de turno (apenas para humano)
  const { timeRemaining, resetTimer, stopTimer } = useTurnTimer({
    duration: TURN_TIME,
    onTimeout: () => {
      if (isHumanTurn) {
        handleTurnTimeout();
      }
    },
    autoStart: isHumanTurn,
  });

  // Efeito consolidado: iniciar turno e gerenciar timer
  useEffect(() => {
    if (!match || match.phase !== MatchPhase.MATCH) return;

    // Se nenhum player tem turno ativo, inicia proximo turno
    if (!activePlayer) {
      startNextTurn();
      return;
    }

    // Gerencia timer baseado no turno
    if (isHumanTurn) {
      resetTimer();
    } else {
      stopTimer();
    }
  }, [match, activePlayer, isHumanTurn, startNextTurn, resetTimer, stopTimer]);

  // Handlers (T085, T086)
  const handlePillClick = useCallback(
    (pillId: string) => {
      if (!isHumanTurn || !humanPlayer) return;
      stopTimer();
      handlePillConsume(pillId, humanPlayer.id);
    },
    [isHumanTurn, humanPlayer, stopTimer, handlePillConsume]
  );

  const handleItemClick = useCallback(
    (slotIndex: number) => {
      if (!isHumanTurn || !humanPlayer) return;
      const slot = humanPlayer.inventory[slotIndex];
      if (!slot?.item) return;
      handleItemUse(humanPlayer.id, slot.item.id);
    },
    [isHumanTurn, humanPlayer, handleItemUse]
  );

  const handleLeave = useCallback(() => {
    if (window.confirm('Tem certeza que deseja sair? Seu progresso sera perdido.')) {
      resetMatch();
    }
  }, [resetMatch]);

  // Loading state (early return)
  if (!match || !currentRound || !pool || !humanPlayer) {
    return <MatchLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <MatchHeader
          roundNumber={currentRound.number}
          activePlayerName={activePlayer?.name}
          isHumanTurn={isHumanTurn}
          timeRemaining={timeRemaining}
          turnTime={TURN_TIME}
          isOpponentBot={activePlayer?.isBot ?? false}
          onLeave={handleLeave}
        />

        <MatchMainContent
          opponents={opponents}
          activePlayerId={activePlayer?.id}
          pool={pool}
          humanPlayer={humanPlayer}
          isHumanTurn={isHumanTurn}
          onPillClick={handlePillClick}
          onItemClick={handleItemClick}
        />
      </div>
    </div>
  );
}
