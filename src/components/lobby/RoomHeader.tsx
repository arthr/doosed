import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RoomHeaderProps {
  roomCode: string;
  status: string;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({ roomCode, status }) => {
  return (
    <header className="flex flex-col items-stretch gap-4 md:flex-row">
      {/* Room Code Box */}
      <div className="flex flex-1 items-center justify-center rounded-lg border-4 border-zinc-700 bg-zinc-800 p-3 shadow-lg md:justify-start">
        <h1 className="flex items-center gap-3 font-mono text-2xl font-black tracking-widest text-green-500 uppercase md:text-4xl">
          ROOM CODE:{' '}
          <span className="rounded border border-zinc-600 bg-zinc-950 px-3 py-1 text-white">
            [{roomCode}]
          </span>
        </h1>
      </div>

      {/* Status Box */}
      <div className="flex flex-[2] items-center justify-center rounded-lg border-4 border-zinc-700 bg-zinc-800 p-3 shadow-lg md:justify-start">
        <div className="flex items-center gap-3 text-lg font-bold text-yellow-400 uppercase md:text-2xl">
          <AlertTriangle className="h-6 w-6 animate-pulse md:h-8 md:w-8" />
          <span className="tracking-wide">STATUS: {status}</span>
        </div>
      </div>
    </header>
  );
};
