import { IPlayer } from '../../types/game';
import { PixelCard } from '../ui/PixelCard';
import { Heart, Shield } from 'lucide-react';
export const OpponentCard = ({ player, isActive }: { player: IPlayer; isActive: boolean }) => {
  return (
    <PixelCard
      variant={isActive ? 'active' : 'default'}
      className="flex flex-col items-center min-w-[140px] gap-2"
    >
      <div className="flex w-full justify-between items-center px-1">
        <span className="text-[10px] truncate max-w-[100px]">{player.name}</span>
      </div>
      <div className="flex gap-2 w-full">
        <div className="w-12 h-12 bg-gray-700 border-2 border-white overflow-hidden rounded-sm">
          <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-1 justify-center">
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
