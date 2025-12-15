import { OpponentsBar } from '@/components/match/hud/OpponentsBar';
import { PlayerDashboard } from '@/components/match/hud/PlayerDashboard';
import { ActionPanel } from '@/components/match/hud/ActionPanel';
import { GameTable } from '@/components/match/table/GameTable';

export const MatchScreen = () => {
  return (
    <div className="bg-void-black text-text-primary min-h-screen w-full overflow-hidden">
      {/* Screen: Content */}
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col p-2 md:p-6 font-sans">
        {/* Section: Opponents */}
        <OpponentsBar />

        {/* Section: Table */}
        <div className="flex-1 flex items-center justify-center w-full">
          <GameTable />
        </div>

        {/* Section: Footer */}
        <div className="w-full flex flex-col md:flex-row gap-4 h-auto md:h-48 mt-auto">
          <PlayerDashboard />
          <ActionPanel />
        </div>
      </div>
    </div>
  );
};
