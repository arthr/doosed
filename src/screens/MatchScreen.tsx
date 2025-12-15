import { OpponentsBar } from '@/components/game/hud/OpponentsBar';
import { PlayerDashboard } from '@/components/game/hud/PlayerDashboard';
import { ActionPanel } from '@/components/game/hud/ActionPanel';
import { GameTable } from '@/components/game/table/GameTable';

export const MatchScreen = () => {
  return (
    <div className="flex flex-col min-h-screen p-2 md:p-6 bg-space-black text-foreground font-sans overflow-hidden">
      {/* Area Superior: Oponentes */}
      <OpponentsBar />

      {/* Area Central: Mesa de Jogo */}
      <div className="flex-1 flex items-center justify-center w-full">
        <GameTable />
      </div>

      {/* Area Inferior: Dashboard e Acoes */}
      <div className="w-full flex flex-col md:flex-row gap-4 h-auto md:h-48 mt-auto">
        <PlayerDashboard />
        <ActionPanel />
      </div>
    </div>
  );
};
