import React from 'react';
import type { Player } from '@/types/lobby';
import { Crown, MessageSquare, Plus } from 'lucide-react';
import { clsx } from 'clsx';

interface PlayerCardProps {
  player: Player | null;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  // EMPTY SLOT STATE
  if (!player) {
    return (
      <div className="group relative flex h-24 flex-row items-center justify-center gap-4 rounded-xl border-4 border-dashed border-zinc-800 bg-zinc-900 p-4 transition-colors hover:bg-zinc-800/50 md:h-auto md:flex-col md:justify-center">
        <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="z-10 flex w-full flex-col items-center gap-2">
          <span className="animate-pulse font-mono text-xl font-bold tracking-widest text-zinc-500 uppercase md:text-2xl">
            SEARCHING...
          </span>
          <button className="flex items-center gap-2 rounded-md border-b-4 border-green-800 bg-green-600 px-6 py-1 font-black text-black uppercase hover:bg-green-500 active:translate-y-1 active:border-b-0">
            <Plus className="h-4 w-4" /> Invite
          </button>
        </div>
      </div>
    );
  }

  // OCCUPIED SLOT STATE
  return (
    <div
      className={clsx(
        'relative flex h-24 flex-row items-center gap-4 overflow-hidden rounded-xl border-4 bg-zinc-800 p-3 transition-all md:h-auto md:flex-col',
        player.isReady
          ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
          : 'border-zinc-700',
      )}
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-purple-900/20 to-transparent"></div>

      {/* Host Icon */}
      {player.isHost && (
        <div className="absolute top-2 left-2 z-10 text-yellow-500 drop-shadow-md">
          <Crown className="h-5 w-5 fill-current md:h-8 md:w-8" />
        </div>
      )}

      {/* Chat Icon (Static for demo) */}
      <div className="absolute top-2 right-2 z-10 text-zinc-400">
        <MessageSquare className="h-5 w-5" />
      </div>

      {/* Avatar */}
      <div className="relative">
        <img
          src={player.avatar}
          className={clsx(
            'h-16 w-16 rounded border-2 bg-zinc-900 object-cover md:aspect-video md:h-48 md:w-full',
            player.isReady ? 'border-green-400' : 'border-zinc-600',
          )}
          alt={player.name}
        />
      </div>

      {/* Info */}
      <div className="z-10 flex grow flex-col md:w-full md:items-center">
        <h2 className="max-w-[150px] truncate text-xl font-black tracking-wide uppercase md:max-w-full md:text-2xl">
          {player.name}
        </h2>
        <div
          className={clsx(
            'flex items-center gap-2 text-sm font-bold uppercase md:text-lg',
            player.isReady ? 'text-green-400' : 'text-zinc-500',
          )}
        >
          <span
            className={clsx(
              'h-3 w-3 rounded-full',
              player.isReady ? 'animate-pulse bg-green-400' : 'bg-zinc-500',
            )}
          ></span>
          {player.isReady ? 'READY' : 'NOT READY'}
        </div>
      </div>
    </div>
  );
};
