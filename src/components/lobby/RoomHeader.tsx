import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { LobbyPanel } from '@/components/lobby/LobbyPanel';

interface RoomHeaderProps {
  roomCode: string;
  status: string;
}

export function RoomHeader({ roomCode, status }: RoomHeaderProps) {
  return (
    <header className="flex flex-col items-stretch gap-3 md:flex-row md:gap-4">
      <LobbyPanel className="flex flex-1 items-center justify-center md:justify-start">
        <h1 className="text-neon-green flex items-center gap-3 font-mono text-base font-black tracking-widest uppercase md:text-xl">
          ROOM CODE:
          <span
            className={cn(
              'rounded border border-border-muted bg-void-black px-3 py-1 text-text-primary',
              'shadow-pixel',
            )}
          >
            [{roomCode}]
          </span>
        </h1>
      </LobbyPanel>

      <LobbyPanel className="flex flex-2 items-center justify-center md:justify-start">
        <div className="text-neon-yellow flex items-center gap-3 text-sm uppercase md:text-base">
          <AlertTriangle className="h-5 w-5 animate-pulse md:h-6 md:w-6" />
          <span className="tracking-wide">STATUS: {status}</span>
        </div>
      </LobbyPanel>
    </header>
  );
}
