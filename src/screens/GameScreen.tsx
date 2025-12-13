import { ActionCenter } from '@/components/game/ActionCenter';
import { GameTable } from '@/components/game/GameTable';
import { OpponentCard } from '@/components/game/OpponentCard';
import { PlayerDashboard } from '@/components/game/PlayerDashboard';
import { useGameStore } from '@/store/useGameStore';
export const GameScreen = () => {
  const players = useGameStore(state => state.players);
  const opponents = players.filter(p => p.id !== 'player-1');
  return (
    <div className="bg-space-black relative container mx-auto flex h-screen w-screen flex-col overflow-hidden p-4">
      <div className="bg-space-black absolute inset-0 z-0" />
      <div className="bg-scanlines pointer-events-none absolute inset-0 z-50 opacity-10" />
      <div className="relative z-10 flex h-1/4 items-center justify-center gap-4 px-8">
        {opponents.map(p => (
          <OpponentCard key={p.id} player={p} isActive={p.id === 'p3'} />
        ))}
      </div>
      <div className="relative z-10 flex h-2/4 items-center justify-center">
        <GameTable />
      </div>
      <div className="relative z-10 grid h-1/4 grid-cols-3 gap-4">
        <div className="col-span-2">
          <PlayerDashboard />
        </div>
        <div className="col-span-1">
          <ActionCenter />
        </div>
      </div>
    </div>
  );
};
