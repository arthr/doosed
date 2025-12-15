import { Heart, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

export function PlayerDashboardPanel({ className, playerName }: { className?: string; playerName?: string }) {
  return (
    <div className={cn("flex min-h-0 gap-4", className)}>
      {/* Avatar */}
      <div className="border-border-muted size-20 overflow-hidden border-2 bg-neutral-800">
        <img
          src="/images/avatar/rick_sanchez.png"
          alt={playerName ?? 'Player'}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {playerName ? <h2 className="text-xs text-text-muted">{playerName}</h2> : null}
        <div className="flex flex-col md:flex-row md:justify-start gap-4">
          <div className="flex">
            <span className="text-heart inline-flex items-center gap-1">
              <Heart className="h-4 w-4 fill-current" />
              <Heart className="h-4 w-4 fill-current" />
              <Heart className="h-4 w-4" />
            </span>
          </div>
          <div className="flex">
            <span className="text-shield inline-flex items-center gap-1">
              <Shield className="h-4 w-4 fill-current" />
              <Shield className="h-4 w-4 fill-current" />
              <Shield className="h-4 w-4 fill-current" />
              <Shield className="h-4 w-4" />
              <Shield className="h-4 w-4" />
              <Shield className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


