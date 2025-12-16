import React from 'react';
import { cn } from '@/lib/cn';
import { DraftShopCategory } from '@/types/draft';

type Item = {
  id: number;
  name: string;
  desc: string;
  category: DraftShopCategory;
  price: number;
  icon: React.ReactNode;
};

type ShopItemProps = {
  item: Item;
  onBuy: (item: Item) => void;
  canAfford: boolean;
  timeLeft: number;
};

export const ShopItem = (props: ShopItemProps) => {
  const { item, onBuy, canAfford, timeLeft } = props;

  return (
    <div
      className={cn(
        'group relative flex w-full flex-col items-center rounded-lg',
        'border-4 border-neutral-700 bg-neutral-950',
        'py-3 md:py-4',
        'shadow-[1px_1px_5px_2px_rgba(0,0,0,0.5)]',
        'transition-colors hover:border-neutral-300',
      )}
    >
      {/* Image Placeholder Area */}
      <div className="w-full h-full flex items-center justify-center scale-[0.85] sm:scale-100 md:mb-3">{item.icon}</div>

      {/* <h3 className="mb-1 text-xs tracking-wide text-white sm:text-sm">{item.name}</h3>
      <p className="mb-1 min-h-0 text-center text-[10px] text-neutral-500 sm:min-h-[40px] sm:text-xs">
        {item.desc}
      </p>
      <p className="mb-2 font-mono text-[10px] text-neutral-300 sm:text-xs md:mb-3">
        {item.price} SCHMECKLES
      </p> */}

      <button
        onClick={() => onBuy(item)}
        disabled={!canAfford}
        className={cn(
          'w-full border-b-4',
          'py-1.5 sm:py-2',
          'text-[10px] sm:text-xs',
          'font-normal tracking-wider uppercase',
          'transition-all active:translate-y-1 active:border-b-0 active:border-t-4 active:border-t-transparent',
          canAfford
            ? 'border-neutral-600 bg-neutral-300 text-black hover:border-neutral-400 hover:bg-white'
            : 'cursor-not-allowed border-neutral-900 bg-neutral-800 text-neutral-600 opacity-50',
        )}
      >
        {canAfford ? 'Buy' : timeLeft > 0 ? 'Too Poor' : 'Time\'s Up!'}
      </button>

      {/* Decorative corner screws */}
      <div className="absolute top-1 left-1 h-1 w-1 rounded-full bg-neutral-500"></div>
      <div className="absolute top-1 right-1 h-1 w-1 rounded-full bg-neutral-500"></div>
      <div className="absolute bottom-1 left-1 h-1 w-1 rounded-full bg-neutral-500"></div>
      <div className="absolute right-1 bottom-1 h-1 w-1 rounded-full bg-neutral-500"></div>
    </div>
  );
};
