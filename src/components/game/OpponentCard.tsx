import { PixelCard } from '@/components/ui/PixelCard';
import { IPlayer } from '@/types/game';
import { Heart, Shield } from 'lucide-react';
export const OpponentCard = ({ player, isActive }: { player: IPlayer; isActive: boolean }) => {
  return (
    <PixelCard
      variant={isActive ? 'active' : 'default'}
      className="flex min-w-[140px] flex-col items-center gap-2"
    >
      <div className="flex w-full items-center justify-between px-1">
        <span className="max-w-[100px] truncate text-[10px]">{player.name}</span>
      </div>
      <div className="flex w-full gap-2">
        <div className="h-12 w-12 overflow-hidden rounded-sm border-2 border-white bg-gray-700">
          <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <div className="flex">
            {Array.from({ length: player.hp }).map((_, i) => (
              <Heart key={i} size={12} className="text-health fill-health" />
            ))}
          </div>
          <div className="flex">
            {Array.from({ length: player.shields }).map((_, i) => (
              <Shield key={i} size={12} className="text-shield fill-shield" />
            ))}
            {Array.from({ length: player.goldShields }).map((_, i) => (
              <Shield key={`g-${i}`} size={12} className="text-shield-gold fill-shield-gold" />
            ))}
          </div>
        </div>
      </div>
    </PixelCard>
  );
};
