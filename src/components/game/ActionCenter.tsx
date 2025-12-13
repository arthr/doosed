import { useGameStore } from '../../store/useGameStore';
import { ActionDock } from '../ui/ActionDock';
import { GameLogPanel } from '../ui/GameLogPanel';
export const ActionCenter = () => {
  const logs = useGameStore(state => state.gameLog);
  return (
    <div className="flex flex-col h-full gap-2">
      <ActionDock onShop={() => {}} onChat={() => {}} />
      <GameLogPanel logs={logs} className="flex-1" />
    </div>
  );
};
