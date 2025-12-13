import { PixelCard } from '@/components/ui/PixelCard';
import { useGameStore } from '@/store/useGameStore';
import { Heart, Shield } from 'lucide-react';
export const PlayerDashboard = () => {
  const me = useGameStore(state => state.players.find(p => p.id === 'player-1'));
  if (!me) return null;
  return (
    <PixelCard variant="player" className="flex h-full w-full flex-col gap-2 bg-black/80">
      <div className="text-rick-green mb-1 text-sm">{me.name} (YOU)</div>
      <div className="flex items-start gap-4">
        <div className="border-rick-green h-32 w-24 shrink-0 border-2 bg-gray-800">
          <img src={me.avatarUrl} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400">Health Bar</span>
            <div className="flex gap-1">
              {Array.from({ length: me.hp }).map((_, i) => (
                <Heart key={i} className="text-health fill-health" />
              ))}
            </div>
            <span className="mt-1 text-[10px] text-gray-400">Resistance Bar</span>
            <div className="flex gap-1">
              {Array.from({ length: me.shields }).map((_, i) => (
                <Shield key={i} className="text-shield fill-shield" />
              ))}
              {Array.from({ length: me.goldShields }).map((_, i) => (
                <Shield key={`g-${i}`} className="text-shield-gold fill-shield-gold" />
              ))}
            </div>
          </div>
          <div className="mt-2 text-[10px] text-gray-400">Inventory Grid</div>
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 10 }).map((_, i) => {
              const item = me.inventory[i];
              return (
                <div
                  key={i}
                  className="hover:border-rick-green group relative flex h-10 w-10 cursor-pointer items-center justify-center border border-gray-600 bg-gray-800"
                >
                  {item ? (
                    <>
                      <span className="text-xl">{item.icon}</span>
                      <div className="absolute bottom-full z-50 mb-1 hidden border border-white bg-black p-1 text-[8px] whitespace-nowrap group-hover:block">
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
