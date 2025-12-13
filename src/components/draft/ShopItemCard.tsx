import React from 'react';
import type { Item } from '../../types/draft';

interface ShopItemCardProps {
  item: Item;
  canAfford: boolean;
  onBuy: () => void;
  disabled: boolean;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({ item, canAfford, onBuy, disabled }) => {
  const Icon = item.icon;

  return (
    <div className="group relative w-40 sm:w-48 bg-slate-800 border-4 border-slate-950 flex flex-col items-center p-3 transition-transform hover:-translate-y-1">
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>

      {/* Item Image Container */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-900 border-2 border-slate-700 flex items-center justify-center mb-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] rounded-sm group-hover:border-cyan-500/50 transition-colors">
         <Icon size={48} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" strokeWidth={1.5} />
      </div>

      {/* Details */}
      <div className="text-center mb-3 w-full">
        <h3 className="font-pixel text-xs sm:text-sm text-white mb-1 leading-tight min-h-[2.5em]">{item.name}</h3>
        <p className="text-slate-400 text-xs font-mono leading-none mb-2">{item.description}</p>
        <p className="font-pixel text-green-400 text-xs">{item.price} SCHMECKLES</p>
      </div>

      {/* Buy Button */}
      <button
        onClick={onBuy}
        disabled={!canAfford || disabled}
        className={`
          w-full py-2 font-pixel text-xs sm:text-sm border-b-4 border-r-4 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 transition-all
          ${!canAfford || disabled 
            ? 'bg-slate-700 border-slate-900 text-slate-500 cursor-not-allowed opacity-50' 
            : 'bg-cyan-600 border-cyan-800 text-white hover:bg-cyan-500 hover:shadow-[0_0_10px_rgba(6,182,212,0.6)]'}
        `}
      >
        BUY
      </button>
    </div>
  );
};

export default ShopItemCard;
