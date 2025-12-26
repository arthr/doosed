/**
 * MatchScreen - Tela principal da partida
 * 
 * STATUS: DESINTEGRADO - Apenas estrutura visual
 * TODO REFACTOR: Reintegrar após refatoração de hooks e stores
 * 
 * Componentes visuais mantidos:
 * - PillPool, PlayerHUD, OpponentLine, LogViewer, TimerDisplay
 * 
 * Lógica removida (será reintegrada):
 * - useGameLoop (será dividido em hooks menores)
 * - Gestão de turnos automática
 * - Handlers de pill/item
 * - Sistema de targeting
 */

import React from 'react';
import { PillPool } from '../components/game/PillPool';
import { PlayerHUD } from '../components/game/PlayerHUD';
import { OpponentLine } from '../components/game/OpponentLine';
import { LogViewer } from '../components/ui/log-viewer';
import { TimerDisplay } from '../components/ui/timer-display';
import { Button } from '../components/ui/button';

export function MatchScreen() {
  // TODO REFACTOR: Reintegrar hooks refatorados aqui
  // - useMatchData() - dados da partida (pool, round, players)
  // - usePillConsumption() - consumo de pills
  // - useTurnManagement() - gestão de turnos
  // - useItemActions() - uso de itens

  // Mock data para manter estrutura visual
  const mockPool = null;
  const mockHumanPlayer = null;
  const mockOpponents: any[] = [];
  const mockCurrentRound = { number: 1 };
  const mockActivePlayer = null;
  const mockTimeRemaining = 30;

  const handlePillClick = (pillId: string) => {
    console.log('[DESINTEGRADO] Pill clicked:', pillId);
    // TODO REFACTOR: Reintegrar com usePillConsumption
  };

  const handleItemClick = (slotIndex: number) => {
    console.log('[DESINTEGRADO] Item clicked:', slotIndex);
    // TODO REFACTOR: Reintegrar com useItemActions
  };

  const handleLeave = () => {
    console.log('[DESINTEGRADO] Leave clicked');
    // TODO REFACTOR: Reintegrar navegação
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-green-500">Match em Andamento</h1>
            <p className="text-gray-400 text-sm">
              Rodada {mockCurrentRound.number} | Turno: {mockActivePlayer?.name || '...'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <TimerDisplay
              seconds={mockTimeRemaining}
              maxSeconds={30}
              label="Turno"
              size="md"
            />
            <Button onClick={handleLeave} variant="danger" size="sm">
              Sair
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Opponents */}
          <div className="lg:col-span-1 space-y-4">
            <OpponentLine opponents={mockOpponents} activePlayerId={mockActivePlayer?.id} />
            
            {/* Log Viewer */}
            <LogViewer maxHeight="400px" />
          </div>

          {/* Middle Column - Pool */}
          <div className="lg:col-span-2 space-y-4">
            <PillPool pool={mockPool} onPillClick={handlePillClick} isTargeting={false} />

            {/* Player HUD */}
            <PlayerHUD
              player={mockHumanPlayer}
              onItemClick={handleItemClick}
              isItemsDisabled={true}
            />

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

