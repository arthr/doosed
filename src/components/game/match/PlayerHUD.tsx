import React from 'react';
import type { Player } from '../../../types/game';
import { PlayerCard } from '../../ui/player-card';
import { InventorySlot } from '../../ui/inventory-slot';

interface PlayerHUDProps {
  player: Player;
  onItemClick?: (slotIndex: number) => void;
  isItemsDisabled?: boolean;
}

export function PlayerHUD({ player, onItemClick, isItemsDisabled = false }: PlayerHUDProps) {
  const inventorySlots = [...player.inventory];
  while (inventorySlots.length < 5) {
    inventorySlots.push({ slotIndex: inventorySlots.length, item: null, quantity: 0 });
  }

  return (
    <div className="relative bg-gray-900 rounded-lg p-3 sm:p-4 border-2 border-gray-700 shadow-xl overflow-hidden">

      {/* Turn Indicator - Melhorado para não sobrepor em telas pequenas */}
      {player.isActiveTurn && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-green-500 animate-pulse md:hidden" />
      )}

      <div className="flex flex-col lg:flex-row gap-4">

        {/* Lado Esquerdo: Player Card e Turno (Desktop) */}
        <div className="flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-4">
          <div className="shrink-0">
            <PlayerCard player={player} isActive={player.isActiveTurn} compact={false} />
          </div>

          {player.isActiveTurn && (
            <div className="hidden lg:block px-3 py-2 bg-green-600 text-white font-bold text-center rounded-xs animate-pulse w-full text-sm">
              SEU TURNO
            </div>
          )}
        </div>

        {/* Lado Direito: Info e Inventário */}
        <div className="flex-1 flex flex-col gap-3">

          {/* Top Row: Pill Coins e Status Mobile */}
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[120px] bg-gray-800 rounded-xs p-2 md:p-3 border border-gray-700 flex items-center justify-between">
              <span className="text-gray-400 text-xs md:sm font-bold uppercase tracking-wider">Pill Coins</span>
              <span className="text-yellow-500 font-bold text-lg md:text-xl">{player.pillCoins}</span>
            </div>

            {/* Turn Indicator Mobile */}
            {player.isActiveTurn && (
              <div className="lg:hidden flex items-center px-3 bg-green-600 text-white font-bold text-xs rounded-xs animate-pulse">
                SEU TURNO
              </div>
            )}
          </div>

          {/* Inventory - Grid Responsivo */}
          <div className="bg-gray-800 rounded-xs p-3 border border-gray-700">
            <div className="text-gray-400 text-[10px] md:text-xs font-bold mb-2 uppercase">Inventário</div>
            <div className="grid grid-cols-5 gap-1.5 md:gap-2">
              {inventorySlots.map((slot, index) => (
                <div key={index} className="aspect-square">
                  <InventorySlot
                    slot={slot}
                    slotIndex={index}
                    onClick={() => onItemClick?.(index)}
                    isDisabled={isItemsDisabled || !slot.item}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Estatísticas e Quest */}
          <div className="bg-gray-800/50 rounded-xs p-2 px-3 border border-gray-700/50">
            <div className="flex flex-row justify-between items-center text-[10px] md:text-xs">
              <div className="flex gap-4">
                <p>
                  <span className="text-gray-400 uppercase">Colapsos:</span>
                  <span className="text-white font-bold ml-1">{player.totalCollapses}</span>
                </p>
                {player.shapeQuest && (
                  <p>
                    <span className="text-gray-400 uppercase">Quest:</span>
                    <span className="text-green-500 font-bold ml-1">
                      {player.shapeQuest.progress}/{player.shapeQuest.sequence.length}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}