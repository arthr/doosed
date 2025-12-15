import { OpponentsBar } from '@/components/match/hud/OpponentsBar';
import { GameTable } from '@/components/match/table/GameTable';
import { PhasePanelHUD } from '@/components/game/hud/PhasePanelHUD';
import { ActionDock } from '@/components/ui/ActionDock';
import { Header } from '@/components/game/hud/Header';
import { Coins, Trophy } from 'lucide-react';

export const MatchScreen = () => {
  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col">
      {/* Section: Header */}
      <Header
        left={{
          icon: <Coins className="text-neon-yellow" size={18} />,
          label: 'PILL COINS',
          value: 1000,
        }}
        right={{
          icon: <Trophy className="text-neon-yellow" size={18} />,
          label: 'SCORE',
          placeholder: '--',
        }}
        center={{ title: 'Match' }}
      />
      {/* Section: Content (scroll) */}
      <div className="bg-void-black text-text-primary border-border-muted flex flex-1 min-h-0 flex-col overflow-y-auto p-2 font-mono text-xs md:p-0 md:text-sm">

        {/* Section: Opponents */}
        <OpponentsBar />

        {/* Section: Table */}
        <div className="flex-1 flex items-center justify-center w-full">
          <GameTable />
        </div>
      </div>

      {/* Section: Footer */}
      <PhasePanelHUD
        phase="match"
        inventory={{ items: [], maxSlots: 8 }}
        chatThreadId="match"
        actions={
          <ActionDock
            shop={{ disabled: false, onClick: () => { } }}
            leave={{ disabled: false, onClick: () => { } }}
            layout="stack"
          />
        }
      />
    </div>
  );
};
