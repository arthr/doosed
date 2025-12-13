import React from 'react';
import { Coins, Clock } from 'lucide-react';

type HeaderProps = {
  balance: number;
  time: number;
};

export const Header = ({ balance, time }: HeaderProps) => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 border-b-4 border-neutral-700 pb-2 sm:pb-3 md:pb-4 mb-3 md:mb-6 bg-neutral-900/80 p-2 sm:p-3 md:p-4 md:sticky md:top-0 z-40">
    <div className="border-2 border-neutral-600 bg-black px-3 sm:px-4 md:px-6 py-1.5 md:py-2 rounded shadow-lg flex items-center gap-2 md:gap-3 w-full md:w-auto justify-center">
      <Coins className="text-neutral-400" size={18} />
      <span className="text-sm sm:text-base tracking-widest text-neutral-200">
        SCHMECKLES: <span className="text-white font-normal">{balance}</span>
      </span>
    </div>

    <h1 className="hidden md:block text-base text-neutral-500 font-normal tracking-[0.2em] uppercase border-x-4 border-neutral-800 px-6 lg:px-8">
      Draft / Shop Screen
    </h1>

    <div className="border-2 border-neutral-600 bg-black px-3 sm:px-4 md:px-6 py-1.5 md:py-2 rounded shadow-lg flex items-center gap-2 md:gap-3 w-full md:w-auto justify-center">
      <Clock className="text-neutral-400" size={18} />
      <span className="text-sm sm:text-base tracking-widest text-neutral-200">
        DRAFT ENDS: <span className="text-white font-normal">00:{time < 10 ? `0${time}` : time}</span>
      </span>
    </div>
  </div>
);
