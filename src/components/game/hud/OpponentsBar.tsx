import { Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

interface OpponentCardProps {
  name: string;
  active: boolean;
}

function OpponentCard({ name, active }: OpponentCardProps) {
  return (
    <div
      className={cn(
        'p-2 border-2 rounded-lg w-32 md:w-40 flex flex-col items-center bg-ui-panel',
        active ? 'border-morty-yellow' : 'border-evil-purple',
      )}
    >
      <div className="w-10 h-10 mb-1 bg-muted rounded-full flex items-center justify-center text-xs text-foreground">
        [AVATAR]
      </div>
      <span className="text-xs font-bold text-foreground truncate w-full text-center">{name}</span>

      {/* Placeholder para HP e Escudo */}
      <div className="flex gap-2 mt-1 items-center">
        <span className="text-heart text-xs">HP</span>
        <div className="flex items-center gap-1 text-shield">
          <Shield className="h-3 w-3" />
          <Shield className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}

export function OpponentsBar() {
  return (
    <div className="flex justify-between w-full gap-2 mb-4 overflow-x-auto p-2">
      <OpponentCard name="Birdperson" active={false} />
      <OpponentCard name="Cromulon" active />
      <OpponentCard name="K. Michael" active={false} />
      <OpponentCard name="Tammy" active={false} />
      <OpponentCard name="Morty" active={false} />
    </div>
  );
}
