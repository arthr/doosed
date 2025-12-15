import { Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

export function PlayerDashboardPanel({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-h-0 gap-4", className)}>
      {/* Avatar */}
      <div className="border-border-muted w-24 h-32 overflow-hidden border-2 bg-neutral-800">
        <img
          src="/images/avatar/rick_sanchez.png"
          alt="Rick Sanchez"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <h2 className="mb-2 text-xl font-normal text-text-primary">Rick Sanchez (YOU)</h2>

        <div className="flex flex-wrap gap-8">
          <div>
            <span className="block text-xs text-text-muted">HEALTH BAR</span>
            <span className="text-heart text-xl">HP HP HP HP</span>
          </div>
          <div>
            <span className="block text-xs text-text-muted">RESISTANCE BAR</span>
            <span className="text-shield inline-flex items-center gap-1">
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


