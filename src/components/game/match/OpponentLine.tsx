/**
 * OpponentLine Component - Linha horizontal de oponentes
 * 
 * T072: Renderiza linha de opponent PlayerCards em view compacto
 */

import React from 'react';
import type { Player } from '../../../types/game';
import { PlayerCard } from '../../ui/player-card';

interface OpponentLineProps {
  opponents: Player[];
  activePlayerId?: string;
}

export function OpponentLine({ opponents, activePlayerId }: OpponentLineProps) {
  if (opponents.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xs p-4 border border-gray-700">
        <div className="text-gray-500 text-sm text-center">Nenhum oponente</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xs p-4 border border-gray-700">
      <div className="text-gray-400 text-sm font-bold mb-3">Oponentes</div>

      <div className="flex gap-3 overflow-x-auto">
        {opponents.map((opponent) => (
          <PlayerCard
            key={opponent.id}
            player={opponent}
            isActive={opponent.id === activePlayerId}
            compact={true}
          />
        ))}
      </div>
    </div>
  );
}

