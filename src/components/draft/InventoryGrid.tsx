import React from 'react';
import type { Item } from '../../types/draft';

interface InventoryGridProps {
  inventory: Item[];
  maxSlots: number;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({ inventory, maxSlots }) => {
  // Create an array of size maxSlots, filling with inventory items or null
  const slots = Array.from({ length: maxSlots }).map((_, index) => inventory[index] || null);

  return (
    <div className="w-full">
      <h2 className="text-white font-pixel text-sm sm:text-base mb-2 uppercase tracking-wide">
        Your Backpack <span className="text-cyan-400">({maxSlots} Slots)</span>
      </h2>
      
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-4 bg-slate-900 p-2 sm:p-4 rounded border-2 border-slate-800 shadow-inner">
        {slots.map((item, index) => (
          <div 
            key={index} 
            className={`
              aspect-square border-2 flex items-center justify-center relative overflow-hidden
              ${item 
                ? 'bg-slate-800 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                : 'bg-slate-950 border-slate-800'}
            `}
          >
            {item ? (
              <>
                <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>
                <item.icon 
                  size={24} 
                  className="text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,1)]" 
                />
                {/* Tooltip on hover (simple title) */}
                <div className="opacity-0 hover:opacity-100 absolute bottom-0 left-0 right-0 bg-black/80 text-[8px] text-center text-white font-mono p-1 pointer-events-none transition-opacity">
                   {item.name}
                </div>
              </>
            ) : (
              <div className="w-full h-full opacity-10 flex items-center justify-center">
                 {/* Empty slot diagonal lines pattern */}
                 <div className="w-1/2 h-px bg-slate-500 rotate-45 transform"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryGrid;
