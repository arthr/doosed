/**
 * PlayerHUD Component - HUD do jogador ativo
 * 
 * T071 + T073: Mostra lives, resistance, inventory, pill coins, status + turn indicator
 */

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
  // Preenche slots vazios até 5
  const inventorySlots = [...player.inventory];
  while (inventorySlots.length < 5) {
    inventorySlots.push({ slotIndex: inventorySlots.length, item: null, quantity: 0 });
  }

  return (
    <div className="relative bg-gray-900 rounded-xs p-4 border-2 border-gray-700">
      {/* Turn Indicator */}
      {player.isActiveTurn && (
        <div className="absolute top-2 right-2 px-3 py-2 bg-green-600 text-white font-bold text-center rounded-xs animate-pulse">
          SEU TURNO
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {/* Player Card */}
        <div>
          <PlayerCard player={player} isActive={player.isActiveTurn} compact={false} />
        </div>

        {/* Inventory e Info */}
        <div className="flex flex-col gap-3 w-full">
          {/* Pill Coins */}
          <div className="bg-gray-800 rounded-xs p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm font-bold">Pill Coins</span>
              <span className="text-yellow-500 font-bold text-xl">{player.pillCoins}</span>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-gray-800 rounded-xs p-3 border border-gray-700">
            <div className="text-gray-400 text-sm font-bold mb-2">Inventário</div>
            <div className="flex gap-2">
              {inventorySlots.map((slot, index) => (
                <InventorySlot
                  key={index}
                  slot={slot}
                  slotIndex={index}
                  onClick={() => onItemClick?.(index)}
                  isDisabled={isItemsDisabled || !slot.item}
                />
              ))}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="bg-gray-800 rounded-xs p-3 border border-gray-700">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400">Colapsos:</span>
                <span className="text-white font-bold ml-2">{player.totalCollapses}</span>
              </div>
              {player.shapeQuest && (
                <div>
                  <span className="text-gray-400">Quest:</span>
                  <span className="text-green-500 font-bold ml-2">
                    {player.shapeQuest.progress}/{player.shapeQuest.sequence.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

