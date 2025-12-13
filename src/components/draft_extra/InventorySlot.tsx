import React from 'react';

type Item = {
  id: number;
  name: string;
  icon: React.ReactNode;
};

type InventorySlotProps = {
  item?: Item;
};

export const InventorySlot = ({ item }: InventorySlotProps) => (
  <div className="aspect-square bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center relative rounded group hover:border-neutral-500 transition-colors">
    {item ? (
      <div className="flex flex-col items-center">
        <div className="scale-75 text-neutral-300 group-hover:text-white transition-colors">
          {item.icon}
        </div>
        <span className="text-xs text-neutral-500 mt-1 uppercase hidden md:block">{item.name}</span>
      </div>
    ) : (
      <div className="w-2 h-2 bg-neutral-800 rounded-full"></div>
    )}
  </div>
);
