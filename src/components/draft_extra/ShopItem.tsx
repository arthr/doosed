import React from 'react';

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
  <div className="group relative flex flex-col items-center bg-neutral-950 border-4 border-neutral-700 hover:border-neutral-300 transition-colors p-3 md:p-4 w-full rounded-lg shadow-[1px_1px_5px_2px_rgba(0,0,0,0.5)]">
    {/* Image Placeholder Area */}
    <div className="w-full aspect-square bg-neutral-900 border-2 border-neutral-800 mb-2 md:mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-neutral-800 transition-colors">
      <div className="absolute inset-0 bg-neutral-800 opacity-20"></div>
      <div className="scale-[0.85] sm:scale-100">{item.icon}</div>
    </div>

    <h3 className="text-xs sm:text-sm font-normal text-white mb-1 tracking-wide">{item.name}</h3>
    <p className="text-neutral-500 text-[10px] sm:text-xs mb-1 text-center min-h-0 sm:min-h-[40px]">
      {item.desc}
    </p>
    <p className="text-neutral-300 font-mono text-[10px] sm:text-xs mb-2 md:mb-3">{item.price} SCHMECKLES</p>

    <button
      onClick={() => onBuy(item)}
      disabled={!canAfford}
      className={`w-full py-1.5 sm:py-2 border-b-4 active:border-b-0 active:translate-y-1 font-normal text-[10px] sm:text-xs tracking-wider uppercase transition-all
        ${canAfford
          ? 'bg-neutral-300 text-black border-neutral-600 hover:bg-white hover:border-neutral-400'
          : 'bg-neutral-800 text-neutral-600 border-neutral-900 cursor-not-allowed opacity-50'}`}
    >
      {canAfford ? 'Buy' : 'Too Poor'}
    </button>

    {/* Decorative corner screws */}
    <div className="absolute top-1 left-1 w-1 h-1 bg-neutral-500 rounded-full"></div>
    <div className="absolute top-1 right-1 w-1 h-1 bg-neutral-500 rounded-full"></div>
    <div className="absolute bottom-1 left-1 w-1 h-1 bg-neutral-500 rounded-full"></div>
    <div className="absolute bottom-1 right-1 w-1 h-1 bg-neutral-500 rounded-full"></div>
  </div>
);
