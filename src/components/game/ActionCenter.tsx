import { ActionDock } from '@/components/ui/ActionDock';
import { GameLogPanel } from '@/components/ui/GameLogPanel';
import { useGameStore } from '@/store/useGameStore';
export const ActionCenter = () => {
  const logs = useGameStore(state => state.gameLog);
  return (
    <div className="flex h-full flex-col gap-2">
      <ActionDock
        shop={{ onClick: () => {}, disabled: false }}
        chat={{ onClick: () => {}, disabled: false }}
      />
      <GameLogPanel logs={logs} className="flex-1" />
    </div>
  );
};
