import { ThumbsUp, Backpack } from 'lucide-react';
import { LobbyButton } from '@/components/lobby/LobbyButton';
import { cn } from '@/lib/cn';

interface ActionControlsProps {
  isReady: boolean;
  onToggleReady: () => void;
}

export function ActionControls({ isReady, onToggleReady }: ActionControlsProps) {
  return (
    <div className="flex flex-1 items-stretch justify-end gap-2 md:gap-4">
      <LobbyButton
        onClick={onToggleReady}
        variant={isReady ? 'neutral' : 'primary'}
        className={cn('flex flex-1 flex-col p-2 md:p-4', isReady && 'text-muted-foreground')}
      >
        <ThumbsUp className="mb-2 h-8 w-8 fill-current md:h-10 md:w-10" />
        {isReady ? 'NOT READY' : 'READY UP'}
      </LobbyButton>

      <LobbyButton variant="secondary" className="flex flex-1 flex-col p-2 md:p-4">
        <Backpack className="mb-2 h-8 w-8 fill-current md:h-10 md:w-10" />
        <span className="text-center leading-tight">
          CUSTOMIZE
          <br className="hidden md:block" /> LOADOUT
        </span>
      </LobbyButton>
    </div>
  );
}
