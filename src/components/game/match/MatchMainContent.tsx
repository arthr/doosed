/**
 * MatchMainContent - Grid principal da partida
 * 
 * Componente especifico do MatchScreen
 * Organiza layout de oponentes, pool, HUD e log
 */

import React from 'react';
import { PillPool } from './PillPool';
import { PlayerHUD } from './PlayerHUD';
import { OpponentLine } from './OpponentLine';
import { LogViewer } from '../../ui/log-viewer';
import { Button } from '../../ui/button';
import type { Player, Pool } from '../../../types/game';

interface MatchMainContentProps {
  opponents: Player[];
  activePlayerId?: string;
  pool: Pool;
  humanPlayer: Player;
  isHumanTurn: boolean;
  onPillClick: (pillId: string) => void;
  onItemClick: (slotIndex: number) => void;
}

export function MatchMainContent({
  opponents,
  activePlayerId,
  pool,
  humanPlayer,
  isHumanTurn,
  onPillClick,
  onItemClick,
}: MatchMainContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left Column - Opponents + Log */}
      <div className="lg:col-span-1 space-y-4">
        <OpponentLine opponents={opponents} activePlayerId={activePlayerId} />
        <LogViewer maxHeight="400px" />
      </div>

      {/* Right Column - Pool + HUD */}
      <div className="lg:col-span-2 space-y-4">
        <PillPool
          pool={pool}
          onPillClick={onPillClick}
          isTargeting={false}
          disabled={!isHumanTurn}
        />

        <PlayerHUD
          player={humanPlayer}
          onItemClick={onItemClick}
          isItemsDisabled={!isHumanTurn}
        />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" disabled={true}>
            Sinalizar Loja (US2)
          </Button>
        </div>
      </div>
    </div>
  );
}

