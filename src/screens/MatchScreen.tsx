/**
 * MatchScreen - Tela principal da partida
 * 
 * T077: PillPool, PlayerHUD, OpponentLine, LogViewer, round number, turn timer, actions
 * T085-T087: Wire gameplay mechanics (Integration)
 */

import React from 'react';
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import { useProgressionStore } from '../stores/progressionStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { useTurnTimer } from '../hooks/useTurnTimer';
import { PillPool } from '../components/game/PillPool';
import { PlayerHUD } from '../components/game/PlayerHUD';
import { OpponentLine } from '../components/game/OpponentLine';
import { LogViewer } from '../components/ui/log-viewer';
import { TimerDisplay } from '../components/ui/timer-display';
import { Button } from '../components/ui/button';
import { MatchPhase } from '../types/game';

export function MatchScreen() {
  const { match, transitionPhase } = useMatchStore();
  const { players } = usePlayerStore();
  const profile = useProgressionStore();
  
  // Pool vem do currentRound (fonte única da verdade)
  const pool = match?.currentRound?.pool || null;

  const humanPlayer = players.find((p) => p.id === profile.id);
  const opponents = players.filter((p) => p.id !== profile.id);
  const currentRound = match?.currentRound;
  const activePlayer = players.find((p) => p.isActiveTurn);

  const [isTargeting, setIsTargeting] = React.useState(false);

  // Game loop hooks - T085-T087
  const { handlePillConsume, handleItemUse, handleTurnTimeout, startNextTurn } = useGameLoop();

  // Gerencia ciclo de turnos
  React.useEffect(() => {
    if (match?.phase !== MatchPhase.MATCH || !currentRound) return;

    // Se não há activePlayer, inicia o próximo turno
    if (!activePlayer) {
      const timer = setTimeout(() => {
        startNextTurn();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [match?.phase, currentRound, activePlayer, startNextTurn]);

  const handlePillClick = (pillId: string) => {
    if (!humanPlayer || !humanPlayer.isActiveTurn) return;
    if (isTargeting) return; // Item targeting mode
    
    handlePillConsume(pillId, humanPlayer.id);
  };

  const handleItemClick = (slotIndex: number) => {
    if (!humanPlayer || !humanPlayer.isActiveTurn) return;
    
    const slot = humanPlayer.inventory[slotIndex];
    if (!slot || !slot.item) return;

    // TODO: Implementar targeting system completo (US2)
    // Por agora, apenas usa item diretamente
    handleItemUse(humanPlayer.id, slot.item.id);
    setIsTargeting(false);
  };

  const handleShopSignal = () => {
    // Será implementado na US2
  };

  const handleLeave = () => {
    if (confirm('Tem certeza que deseja sair? Você perderá o progresso da partida.')) {
      transitionPhase(MatchPhase.LOBBY);
    }
  };

  if (!humanPlayer || !currentRound) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando partida...</div>
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
            {activePlayer && (
              <TurnTimerWrapper
                key={activePlayer.id}
                onTimeout={handleTurnTimeout}
                isActive={humanPlayer?.isActiveTurn || false}
              />
            )}
            <Button onClick={handleLeave} variant="danger" size="sm">
              Sair
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Opponents */}
          <div className="lg:col-span-1 space-y-4">
            <OpponentLine opponents={opponents} activePlayerId={activePlayer?.id} />
            
            {/* Log Viewer */}
            <LogViewer maxHeight="400px" />
          </div>

          {/* Middle Column - Pool */}
          <div className="lg:col-span-2 space-y-4">
            <PillPool pool={pool} onPillClick={handlePillClick} isTargeting={isTargeting} />

            {/* Player HUD */}
            <PlayerHUD
              player={humanPlayer}
              onItemClick={handleItemClick}
              isItemsDisabled={!humanPlayer.isActiveTurn}
            />

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleShopSignal}
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

/**
 * TurnTimerWrapper - Componente interno que usa key prop para reset automático
 * T087: Turn timer com auto-reset via key prop (React best practice)
 */
function TurnTimerWrapper({ onTimeout, isActive }: { onTimeout: () => void; isActive: boolean }) {
  const { timeRemaining } = useTurnTimer({
    duration: 30,
    onTimeout,
    autoStart: true,
  });

  return (
    <TimerDisplay
      seconds={timeRemaining}
      maxSeconds={30}
      label={isActive ? 'Seu Turno' : 'Turno'}
      size="md"
    />
  );
}

