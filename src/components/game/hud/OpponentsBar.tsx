import { Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

interface OpponentCardProps {
  name: string;
  avatar: string;
  active: boolean;
}

function OpponentCard({ name, avatar, active }: OpponentCardProps) {
  return (
    <div
      className={cn(
        'p-2 border-2 rounded-lg w-32 md:w-40 flex flex-col items-center bg-panel',
        active ? 'border-neon-yellow' : 'border-neon-purple',
      )}
    >
      <div className="w-10 h-10 mb-1 bg-neutral-700 rounded-full overflow-hidden">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-normal text-text-primary truncate w-full text-center">{name}</span>

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
      <OpponentCard name="Birdperson" avatar="/images/avatar/birdperson_md.png" active={false} />
      <OpponentCard name="Cromulon" avatar="/images/avatar/cromolum_md.png" active />
      <OpponentCard name="Squanchy" avatar="/images/avatar/squanchy_md.png" active={false} />
      <OpponentCard name="Beth Smith" avatar="/images/avatar/beth_smith_md.png" active={false} />
      <OpponentCard name="Morty" avatar="/images/avatar/morty_md.png" active={false} />
    </div>
  );
}
