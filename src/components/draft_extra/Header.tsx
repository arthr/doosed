import React from 'react';
import { Coins, Clock } from 'lucide-react';

type HeaderProps = {
  balance: number;
  time: number;
};

export const Header = ({ balance, time }: HeaderProps) => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b-4 border-neutral-700 pb-4 mb-6 bg-neutral-900/80 p-4 sticky top-0 z-40">
    <div className="border-2 border-neutral-600 bg-black px-6 py-2 rounded shadow-lg flex items-center gap-3 w-full md:w-auto justify-center">
      <Coins className="text-neutral-400" size={24} />
      <span className="text-2xl tracking-widest text-neutral-200">
        SCHMECKLES: <span className="text-white font-bold">{balance}</span>
      </span>
    </div>

    <h1 className="hidden md:block text-3xl text-neutral-500 font-bold tracking-[0.2em] uppercase border-x-4 border-neutral-800 px-8">
      Draft / Shop Screen
    </h1>

    <div className="border-2 border-neutral-600 bg-black px-6 py-2 rounded shadow-lg flex items-center gap-3 w-full md:w-auto justify-center">
      <Clock className="text-neutral-400" size={24} />
      <span className="text-2xl tracking-widest text-neutral-200">
        DRAFT ENDS: <span className="text-white font-bold">00:{time < 10 ? `0${time}` : time}</span>
      </span>
    </div>
  </div>
);
