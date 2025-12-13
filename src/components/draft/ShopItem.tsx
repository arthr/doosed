import React from 'react';
import { cn } from '@/lib/cn';

type Item = {
  id: number;
  name: string;
  desc: string;
  price: number;
  icon: React.ReactNode;
};

type ShopItemProps = {
  item: Item;
  onBuy: (item: Item) => void;
  canAfford: boolean;
};

export const ShopItem = ({ item, onBuy, canAfford }: ShopItemProps) => (
  <div
    className={cn(
      'group relative flex w-full flex-col items-center rounded-lg',
      'border-4 border-neutral-700 bg-neutral-950',
      'p-3 md:p-4',
      'shadow-[1px_1px_5px_2px_rgba(0,0,0,0.5)]',
      'transition-colors hover:border-neutral-300',
    )}
  >
    {/* Image Placeholder Area */}
    <div
      className={cn(
        'relative mb-2 flex aspect-square w-full items-center justify-center overflow-hidden',
        'border-2 border-neutral-800 bg-neutral-900',
        'transition-colors group-hover:bg-neutral-800',
        'md:mb-3',
      )}
    >
      <div className="absolute inset-0 bg-neutral-800 opacity-20"></div>
      <div className="scale-[0.85] sm:scale-100">{item.icon}</div>
    </div>

    <h3 className="mb-1 text-xs font-normal tracking-wide text-white sm:text-sm">{item.name}</h3>
    <p className="mb-1 min-h-0 text-center text-[10px] text-neutral-500 sm:min-h-[40px] sm:text-xs">
      {item.desc}
    </p>
    <p className="mb-2 font-mono text-[10px] text-neutral-300 sm:text-xs md:mb-3">
      {item.price} SCHMECKLES
    </p>

    <button
      onClick={() => onBuy(item)}
      disabled={!canAfford}
      className={cn(
        'w-full border-b-4',
        'py-1.5 sm:py-2',
        'text-[10px] sm:text-xs',
        'font-normal tracking-wider uppercase',
        'transition-all active:translate-y-1 active:border-b-0',
        canAfford
          ? 'border-neutral-600 bg-neutral-300 text-black hover:border-neutral-400 hover:bg-white'
          : 'cursor-not-allowed border-neutral-900 bg-neutral-800 text-neutral-600 opacity-50',
      )}
    >
      {canAfford ? 'Buy' : 'Too Poor'}
    </button>

    {/* Decorative corner screws */}
    <div className="absolute top-1 left-1 h-1 w-1 rounded-full bg-neutral-500"></div>
    <div className="absolute top-1 right-1 h-1 w-1 rounded-full bg-neutral-500"></div>
    <div className="absolute bottom-1 left-1 h-1 w-1 rounded-full bg-neutral-500"></div>
    <div className="absolute right-1 bottom-1 h-1 w-1 rounded-full bg-neutral-500"></div>
  </div>
);
