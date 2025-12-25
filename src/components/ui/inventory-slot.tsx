/**
 * InventorySlot Component - Slot de inventário
 * 
 * T067: Mostra item icon, nome, quantidade (se stackable), clicável para usar
 */

import React from 'react';
import type { InventorySlot as InventorySlotType } from '../../types/item';

interface InventorySlotProps {
  slot: InventorySlotType | null;
  slotIndex: number;
  onClick?: () => void;
  isDisabled?: boolean;
}

export function InventorySlot({ slot, slotIndex, onClick, isDisabled = false }: InventorySlotProps) {
  const isEmpty = !slot || !slot.item;

  return (
    <div
      onClick={!isEmpty && !isDisabled ? onClick : undefined}
      className={`
        relative w-16 h-16 bg-gray-800 border-2 border-gray-700 rounded-lg
        flex items-center justify-center
        ${!isEmpty && !isDisabled ? 'cursor-pointer hover:border-green-500' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        transition-all duration-200
      `}
    >
      {isEmpty ? (
        // Slot vazio
        <div className="text-gray-600 text-xs">{slotIndex + 1}</div>
      ) : (
        // Item no slot
        <>
          {/* Ícone do item (placeholder: primeira letra) */}
          <div className="text-white font-bold text-xl">
            {slot.item!.name.charAt(0).toUpperCase()}
          </div>

          {/* Quantidade (se stackable) */}
          {slot.item!.isStackable && slot.quantity > 1 && (
            <div className="absolute bottom-0 right-0 bg-green-600 text-white text-xs font-bold px-1 rounded-tl">
              {slot.quantity}
            </div>
          )}

          {/* Nome do item (tooltip) */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {slot.item!.name}
          </div>
        </>
      )}
    </div>
  );
}

