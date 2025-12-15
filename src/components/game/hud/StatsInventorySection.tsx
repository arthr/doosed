import { Heart, Shield, User } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Inventory } from './Inventory';
import { SectionHeader } from './SectionHeader';
import { PhasePanelHUDInventory } from '@/types/hud';

export function StatsInventorySection({
  playerName,
  inventory,
  className,
}: {
  playerName?: string;
  inventory: PhasePanelHUDInventory;
  className?: string;
}) {
  const { items, maxSlots } = inventory;
  
  return (
    <div className={cn("flex flex-col min-h-0", className)}>
      <div className="flex flex-1 flex-col-2 items-center justify-center">
        {/* Avatar */}
        <div className="size-16 md:size-32">
          <img
            src="/images/avatar/rick_sanchez.png"
            alt={playerName ?? 'Player'}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col pl-4">
          <SectionHeader className="text-accent!" icon={<User size={20} />} title={playerName ?? 'Player'} />
          {/* {playerName ? <h2 className="text-xs text-text-muted">{playerName}</h2> : null} */}
          <div className="flex flex-row md:justify-start gap-4 mb-2">
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
          <Inventory inventory={inventory} />
        </div>
      </div>
    </div>
  );
}


