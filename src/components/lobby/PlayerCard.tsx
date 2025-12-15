import type { Player } from '@/types/lobby';
import { Crown, MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { LobbyPanel } from '@/components/lobby/LobbyPanel';
import { LobbyButton } from '@/components/lobby/LobbyButton';

interface PlayerCardProps {
  player: Player | null;
}

const emptySlotContainerClassName = cn(
  'group relative flex h-24 flex-row items-center justify-center gap-4',
  'border-border bg-ui-panel rounded-xl border-4 border-dashed',
  'p-4 transition-colors hover:bg-space-black/20',
  'md:h-auto md:flex-col md:justify-center',
);

const occupiedContainerClassName = (isReady: boolean) =>
  cn(
    'relative flex h-24 flex-row items-center gap-4 overflow-hidden',
    'bg-ui-panel rounded-xl border-4 p-3 transition-all',
    'md:h-auto md:flex-col',
    isReady ? 'border-rick-green shadow-neon-green' : 'border-border',
  );

export function PlayerCard({ player }: PlayerCardProps) {
  // EMPTY SLOT STATE
  if (!player) {
    return (
      <div className={emptySlotContainerClassName}>
        <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        <div className="z-10 flex w-full flex-col items-center gap-2">
          <span className="animate-pulse font-mono text-base font-bold tracking-widest text-muted-foreground uppercase md:text-lg">
            SEARCHING...
          </span>
          <LobbyButton variant="primary" className="px-5 py-2 text-xs">
            <Plus className="h-4 w-4" />
            Invite
          </LobbyButton>
        </div>
      </div>
    );
  }

  // OCCUPIED SLOT STATE
  return (
    <div className={occupiedContainerClassName(player.isReady)}>
      {/* Background decoration */}
      <div className="from-evil-purple/20 pointer-events-none absolute inset-0 bg-linear-to-br to-transparent" />

      {/* Host Icon */}
      {player.isHost && (
        <div className="text-morty-yellow absolute top-2 left-2 z-10 drop-shadow-md">
          <Crown className="h-5 w-5 fill-current md:h-7 md:w-7" />
        </div>
      )}

      {/* Chat Icon (Static for demo) */}
      <div className="absolute top-2 right-2 z-10 text-muted-foreground">
        <MessageSquare className="h-5 w-5" />
      </div>

      {/* Avatar */}
      <LobbyPanel className="relative p-2">
        <img
          src={player.avatar}
          className={cn(
            'h-16 w-16 rounded border-2 bg-space-black object-cover',
            'md:aspect-video md:h-40 md:w-56',
            player.isReady ? 'border-rick-green' : 'border-border',
          )}
          alt={player.name}
        />
      </LobbyPanel>

      {/* Info */}
      <div className="z-10 flex grow flex-col md:w-full md:items-center">
        <h2 className="max-w-[150px] truncate text-base font-black tracking-wide uppercase md:max-w-full md:text-lg">
          {player.name}
        </h2>
        <div
          className={cn(
            'flex items-center gap-2 text-xs font-bold uppercase md:text-sm',
            player.isReady ? 'text-rick-green' : 'text-muted-foreground',
          )}
        >
          <span
            className={cn(
              'h-3 w-3 rounded-full',
              player.isReady ? 'bg-rick-green animate-pulse' : 'bg-muted-foreground',
            )}
          />
          {player.isReady ? 'READY' : 'NOT READY'}
        </div>
      </div>
    </div>
  );
}
