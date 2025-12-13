import React from 'react';
import { cn } from '@/lib/cn';

type Item = {
  id: number;
  name: string;
  icon: React.ReactNode;
};

type InventorySlotProps = {
  item?: Item;
  className?: string;
};

export const InventorySlot = ({ item, className = '' }: InventorySlotProps) => (
  <div
    className={cn(
      'group relative flex aspect-square items-center justify-center rounded',
      'border-2 border-neutral-700 bg-neutral-900',
      'transition-colors hover:border-neutral-500',
      className,
    )}
  >
    {item ? (
      <div className="flex flex-col items-center">
        <div className="scale-[0.45] text-neutral-300 transition-colors group-hover:text-white sm:scale-[0.55] md:scale-[0.65]">
          {item.icon}
        </div>
        <span className="mt-1 hidden text-[10px] text-neutral-500 uppercase lg:block">
          {item.name}
        </span>
      </div>
    ) : (
      <div className="h-1.5 w-1.5 rounded-full bg-neutral-800"></div>
    )}
  </div>
);
