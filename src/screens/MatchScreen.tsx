/**
 * MatchScreen - Tela principal da partida
 * 
 * T077: PillPool, PlayerHUD, OpponentLine, LogViewer, round number, turn timer, actions
 */

import React from 'react';
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import { usePoolStore } from '../stores/poolStore';
import { useProgressionStore } from '../stores/progressionStore';
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
  const { pool } = usePoolStore();
  const profile = useProgressionStore();

  const humanPlayer = players.find((p) => p.id === profile.id);
  const opponents = players.filter((p) => p.id !== profile.id);
  const currentRound = match?.currentRound;
  const activePlayer = players.find((p) => p.isActiveTurn);

  const [turnTimer, setTurnTimer] = React.useState(30);
  const [isTargeting, setIsTargeting] = React.useState(false);

  // Turn timer
  React.useEffect(() => {
    if (!activePlayer || !humanPlayer?.isActiveTurn) return;

    const interval = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-consume random pill
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activePlayer, humanPlayer?.isActiveTurn]);

  const handlePillClick = (pillId: string) => {
    console.log('Pill clicked:', pillId);
    // Será conectado ao event processor na fase de Integration
  };

  const handleItemClick = (slotIndex: number) => {
    console.log('Item clicked:', slotIndex);
    setIsTargeting(true);
  };

  const handleShopSignal = () => {
    console.log('Shop signal toggled');
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
            <TimerDisplay seconds={turnTimer} maxSeconds={30} label="Turno" size="md" />
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

