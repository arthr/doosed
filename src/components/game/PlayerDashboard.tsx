import { useGameStore } from '../../store/useGameStore';
import { PixelCard } from '../ui/PixelCard';
import { Heart, Shield } from 'lucide-react';
export const PlayerDashboard = () => {
  const me = useGameStore(state => state.players.find(p => p.id === 'player-1'));
  if (!me) return null;
  return (
    <PixelCard variant="player" className="w-full h-full flex flex-col gap-2 bg-black/80">
      <div className="text-rick-green text-sm mb-1">{me.name} (YOU)</div>
      <div className="flex gap-4 items-start">
        <div className="w-24 h-32 bg-gray-800 border-2 border-rick-green shrink-0">
          <img src={me.avatarUrl} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400">Health Bar</span>
            <div className="flex gap-1">
              {Array.from({ length: me.hp }).map((_, i) => (
                <Heart key={i} className="text-health fill-health" />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 mt-1">Resistance Bar</span>
            <div className="flex gap-1">
              {Array.from({ length: me.shields }).map((_, i) => (
                <Shield key={i} className="text-shield fill-shield" />
              ))}
              {Array.from({ length: me.goldShields }).map((_, i) => (
                <Shield key={`g-${i}`} className="text-shield-gold fill-shield-gold" />
              ))}
            </div>
          </div>
          <div className="text-[10px] text-gray-400 mt-2">Inventory Grid</div>
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 10 }).map((_, i) => {
              const item = me.inventory[i];
              return (
                <div
                  key={i}
                  className="w-10 h-10 bg-gray-800 border border-gray-600 flex items-center justify-center hover:border-rick-green cursor-pointer group relative"
                >
                  {item ? (
                    <>
                      <span className="text-xl">{item.icon}</span>
                      <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black border border-white p-1 text-[8px] whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PixelCard>
  );
};
