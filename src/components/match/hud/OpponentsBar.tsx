
import { Shield, Heart, Skull } from 'lucide-react';
import { cn } from '@/lib/cn';

interface OpponentCardProps {
  name: string;
  avatar: string;
  isDead?: boolean;
  hp: number;
  maxHp: number;
  shields: number;
  isActive: boolean;
}

function OpponentCard({ name, avatar, isDead, hp, maxHp, shields, isActive }: OpponentCardProps) {
  return (
    <div
      className={cn(
        'relative p-2 border-2 rounded-xl flex-shrink-0 w-28 md:w-32 flex flex-col items-center transition-transform duration-300',
        isActive ? 'border-neon-yellow translate-y-2 scale-105 z-10 bg-neutral-800' : 'border-neutral-700 bg-neutral-900/80 opacity-90',
        isDead && 'opacity-50 grayscale border-red-900'
      )}
    >
      {isActive && (
        <div className="absolute -top-3 px-2 py-0.5 bg-neon-yellow text-black text-[10px] font-bold rounded-full animate-pulse">
          TURN
        </div>
      )}

      {/* Avatar Circle */}
      <div className={cn(
        "w-12 h-12 mb-2 rounded-full overflow-hidden border-2 shadow-lg",
        isActive ? "border-neon-yellow shadow-[0_0_10px_var(--color-neon-yellow)]" : "border-neutral-600",
        isDead && "border-red-900"
      )}>
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Name */}
      <span className={cn(
        "text-xs font-bold truncate w-full text-center px-1 mb-2",
        isActive ? "text-white" : "text-neutral-400"
      )}>
        {name}
      </span>

      {/* Stats Row */}
      {!isDead ? (
        <div className="flex items-center justify-center gap-3 w-full bg-black/40 rounded py-1 px-1">
          {/* HP */}
          <div className="flex items-center gap-1">
            <Heart size={12} className="fill-red-500 text-red-500" />
            <span className="text-xs font-mono text-white leading-none">{hp}/{maxHp}</span>
          </div>

          {/* Shields (se tiver) */}
          {shields > 0 && (
            <div className="flex items-center gap-1">
              <Shield size={12} className="fill-blue-400 text-blue-400" />
              <span className="text-xs font-mono text-blue-200 leading-none">{shields}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1 text-red-800 font-mono text-xs font-bold uppercase">
          <Skull size={14} /> DEAD
        </div>
      )}
    </div>
  );
}

export function OpponentsBar() {
  const opponents = [
    { name: "Birdperson", avatar: "/images/avatar/birdperson_md.png", hp: 4, maxHp: 5, shields: 1, active: false },
    { name: "Cromulon", avatar: "/images/avatar/cromolum_md.png", hp: 5, maxHp: 5, shields: 2, active: true },
    { name: "Squanchy", avatar: "/images/avatar/squanchy_md.png", hp: 2, maxHp: 4, shields: 0, active: false },
    { name: "Beth Smith", avatar: "/images/avatar/beth_smith_md.png", hp: 3, maxHp: 3, shields: 1, active: false },
    { name: "Morty", avatar: "/images/avatar/morty_md.png", hp: 0, maxHp: 3, shields: 0, isDead: true, active: false },
  ];

  return (
    <div className="flex justify-start md:justify-center w-full gap-2 mb-4 overflow-x-auto p-4 snap-x no-scrollbar mask-gradient-x">
      {opponents.map((opp, idx) => (
        <OpponentCard
          key={idx}
          name={opp.name}
          avatar={opp.avatar}
          hp={opp.hp}
          maxHp={opp.maxHp}
          shields={opp.shields}
          isActive={opp.active}
          isDead={opp.isDead}
        />
      ))}
    </div>
  );
}
