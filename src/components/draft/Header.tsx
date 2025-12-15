import React from 'react';
import { Coins, Clock } from 'lucide-react';
import { cn } from '@/lib/cn';

type HeaderProps = {
  balance: number;
  time: number;
};

const headerContainerClassName = cn(
  'flex flex-row',
  'items-center justify-between',
  'gap-2 md:gap-4',
  'border-b-4 border-neutral-700',
  'border-x-4 border-x-neutral-800 md:border-x-8',
  'pb-2 sm:pb-3 md:pb-4',
  'bg-neutral-900/80',
  'p-2 sm:p-3 md:p-4',
  'z-40 md:sticky md:top-0',
);

const infoBoxClassName = cn(
  'border-2 border-neutral-600 bg-black',
  'px-3 sm:px-4 md:px-6',
  'py-1.5 md:py-2',
  'rounded shadow-lg',
  'flex items-center gap-2 md:gap-3',
  'w-full justify-center md:w-auto',
);

const titleClassName = cn(
  'hidden md:flex',
  'text-base font-normal text-neutral-500',
  'tracking-[0.2em] uppercase',
  'border-x-4 border-neutral-800',
  'px-6 lg:px-8',
);

type InfoBoxProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

const InfoBox = ({ icon, label, value }: InfoBoxProps) => (
  <div className={infoBoxClassName}>
    {icon}
    <span className="hidden text-sm tracking-widest md:block">{label}:</span>
    <span className="font-normal text-white">{value}</span>
  </div>
);

export const Header = ({ balance, time }: HeaderProps) => {
  const formattedDraftTime = `00:${time < 10 ? `0${time}` : time}`;

  return (
    <div className={headerContainerClassName}>
      <InfoBox
        icon={<Coins className="text-neon-yellow" size={18} />}
        label="PILL COINS"
        value={balance}
      />

      <div className={cn(titleClassName, 'flex-1 items-center justify-center gap-4 space-x-4')}>
        <span className="text-white">Draft</span>
        <img
          src="/images/avatar/rick_winner.png"
          alt="Rick Winner"
          className="-my-4 size-16 drop-shadow-xs select-none"
          draggable={false}
        />
        <span className="text-white">Shop</span>
      </div>

      <InfoBox
        icon={<Clock className="text-neon-yellow" size={18} />}
        label="DRAFT ENDS"
        value={formattedDraftTime}
      />
    </div>
  );
};
