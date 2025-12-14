import React from 'react';
import type { Player } from '@/types/lobby';
import { PlayerCard } from './PlayerCard';

interface PlayerGridProps {
  players: (Player | null)[];
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({ players }) => {
  return (
    <div className="grid h-full grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
      {players.map((player, index) => (
        <PlayerCard key={index} player={player} />
      ))}
    </div>
  );
};
