import React from 'react';
import { ThumbsUp, Backpack } from 'lucide-react';
import { clsx } from 'clsx';

interface ActionControlsProps {
  isReady: boolean;
  onToggleReady: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({ isReady, onToggleReady }) => {
  return (
    <div className="flex flex-[1] items-stretch justify-end gap-2 md:gap-4">
      {/* Ready Button */}
      <button
        onClick={onToggleReady}
        className={clsx(
          'flex flex-1 flex-col items-center justify-center rounded-lg border-b-8 p-2 text-xl leading-none font-black uppercase transition-all active:translate-y-2 active:border-b-0 md:text-2xl',
          isReady
            ? 'border-zinc-800 bg-zinc-600 text-zinc-400'
            : 'border-green-700 bg-green-500 text-black hover:bg-green-400',
        )}
      >
        <ThumbsUp className="mb-2 h-8 w-8 fill-current md:h-10 md:w-10" />
        {isReady ? 'NOT READY' : 'READY UP'}
      </button>

      {/* Customize Button */}
      <button className="flex flex-1 flex-col items-center justify-center rounded-lg border-b-8 border-sky-700 bg-sky-500 p-2 text-lg leading-none font-black text-black uppercase transition-all hover:bg-sky-400 active:translate-y-2 active:border-b-0 md:text-2xl">
        <Backpack className="mb-2 h-8 w-8 fill-current md:h-10 md:w-10" />
        <span className="text-center leading-tight">
          CUSTOMIZE
          <br className="hidden md:block" /> LOADOUT
        </span>
      </button>
    </div>
  );
};
