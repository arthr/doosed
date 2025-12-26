/**
 * MatchScreen - Tela principal da partida
 *
 * T085: Wire MatchScreen pill clicks
 * T086: Wire MatchScreen item usage
 * T087: Wire turn timer expiration
 *
 * Funcionalidades:
 * - Pool de pilulas com click para consumo
 * - HUD do jogador com inventario
 * - Linha de oponentes
 * - Timer de turno com auto-consumo
 * - Execucao automatica de bots
 * - Deteccao de fim de jogo
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import { PillPool } from '../components/game/PillPool';
import { PlayerHUD } from '../components/game/PlayerHUD';
import { OpponentLine } from '../components/game/OpponentLine';
import { LogViewer } from '../components/ui/log-viewer';
import { TimerDisplay } from '../components/ui/timer-display';
import { Button } from '../components/ui/button';
import { useGameStore } from '../stores/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { useTurnTimer } from '../hooks/useTurnTimer';
import { DEFAULT_GAME_CONFIG } from '../config/game-config';
import { MatchPhase } from '../types/game';

const TURN_TIME = DEFAULT_GAME_CONFIG.timers.turn;

export function MatchScreen() {
  // Store state
  const match = useGameStore((state) => state.match);
  const currentRound = useGameStore((state) => state.currentRound);
  const getAllPlayers = useGameStore((state) => state.getAllPlayers);
  const getPool = useGameStore((state) => state.getPool);
  const resetMatch = useGameStore((state) => state.resetMatch);

  // Game loop hooks
  const { handlePillConsume, handleItemUse, handleTurnTimeout, startNextTurn } =
    useGameLoop();

  // Dados derivados
  const players = useMemo(() => getAllPlayers(), [getAllPlayers]);
  const pool = useMemo(() => getPool(), [getPool]);

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

  // Efeito para iniciar primeiro turno e resetar timer quando turno muda
  useEffect(() => {
    if (!match || match.phase !== MatchPhase.MATCH) return;

    // Se nenhum player tem turno ativo, inicia proximo turno
    if (!activePlayer) {
      startNextTurn();
    }
  }, [match, activePlayer, startNextTurn]);

  // Reseta timer quando turno do humano comeca
  useEffect(() => {
    if (isHumanTurn) {
      resetTimer();
    } else {
      stopTimer();
    }
  }, [isHumanTurn, resetTimer, stopTimer]);

  // Handler de click em pill (T085)
  const handlePillClick = useCallback(
    (pillId: string) => {
      if (!isHumanTurn || !humanPlayer) return;

      stopTimer();
      handlePillConsume(pillId, humanPlayer.id);
    },
    [isHumanTurn, humanPlayer, stopTimer, handlePillConsume]
  );

  // Handler de click em item (T086)
  const handleItemClick = useCallback(
    (slotIndex: number) => {
      if (!isHumanTurn || !humanPlayer) return;

      const slot = humanPlayer.inventory[slotIndex];
      if (!slot?.item) return;

      handleItemUse(humanPlayer.id, slot.item.id);
    },
    [isHumanTurn, humanPlayer, handleItemUse]
  );

  // Handler de saida
  const handleLeave = useCallback(() => {
    if (window.confirm('Tem certeza que deseja sair? Seu progresso sera perdido.')) {
      resetMatch();
    }
  }, [resetMatch]);

  // Guarda de seguranca - se nao tem match ou round, mostra loading
  if (!match || !currentRound || !pool) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando partida...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-green-500">Match em Andamento</h1>
            <p className="text-gray-400 text-sm">
              Rodada {currentRound.number} | Turno: {activePlayer?.name || '...'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {isHumanTurn && (
              <TimerDisplay
                seconds={timeRemaining}
                maxSeconds={TURN_TIME}
                label="Seu Turno"
                size="md"
              />
            )}
            {!isHumanTurn && activePlayer?.isBot && (
              <div className="text-yellow-500 text-sm font-bold animate-pulse">
                Bot pensando...
              </div>
            )}
            <Button onClick={handleLeave} variant="danger" size="sm">
              Sair
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Opponents + Log */}
          <div className="lg:col-span-1 space-y-4">
            <OpponentLine
              opponents={opponents}
              activePlayerId={activePlayer?.id}
            />

            {/* Log Viewer */}
            <LogViewer maxHeight="400px" />
          </div>

          {/* Right Column - Pool + HUD */}
          <div className="lg:col-span-2 space-y-4">
            <PillPool
              pool={pool}
              onPillClick={handlePillClick}
              isTargeting={false}
              disabled={!isHumanTurn}
            />

            {/* Player HUD */}
            {humanPlayer && (
              <PlayerHUD
                player={humanPlayer}
                onItemClick={handleItemClick}
                isItemsDisabled={!isHumanTurn}
              />
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                disabled={true}
              >
                Sinalizar Loja (US2)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
