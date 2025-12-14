import type { Player } from '@/types/lobby';
import { PlayerCard } from './PlayerCard';

interface PlayerGridProps {
  players: (Player | null)[];
}

export function PlayerGrid({ players }: PlayerGridProps) {
  return (
    <div className="grid h-full grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
      {players.map((player, index) => (
        <PlayerCard key={index} player={player} />
      ))}
    </div>
  );
}
