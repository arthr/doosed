import { useGameStore } from '../store/useGameStore';
import { OpponentCard } from '../components/game/OpponentCard';
import { GameTable } from '../components/game/GameTable';
import { PlayerDashboard } from '../components/game/PlayerDashboard';
import { ActionCenter } from '../components/game/ActionCenter';
export const GameScreen = () => {
  const players = useGameStore(state => state.players);
  const opponents = players.filter(p => p.id !== 'player-1');
  return (
    <div className="h-screen w-screen container mx-auto bg-space-black relative flex flex-col p-4 overflow-hidden">
      <div className="absolute inset-0 bg-space-black z-0" />
      <div className="absolute inset-0 bg-scanlines pointer-events-none z-50 opacity-10" />
      <div className="relative z-10 h-1/4 flex items-center justify-center gap-4 px-8">
        {opponents.map(p => (
          <OpponentCard key={p.id} player={p} isActive={p.id === 'p3'} />
        ))}
      </div>
      <div className="relative z-10 h-2/4 flex items-center justify-center">
        <GameTable />
      </div>
      <div className="relative z-10 h-1/4 grid grid-cols-3 gap-4">
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
