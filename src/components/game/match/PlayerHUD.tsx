import React from 'react';
import { Coins, Swords, CheckCircle2 } from 'lucide-react'; // Ícones necessários
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

  // Define a cor da borda/glow baseada no turno ativo
  const activeBorderClass = player.isActiveTurn
    ? "md:border-green-500 md:shadow-[0_0_15px_rgba(34,197,94,0.15)]"
    : "md:border-gray-700";

  return (
    <div className="w-full">
      {/* CONTAINER PRINCIPAL 
        Mobile: Funciona como um único card (bg-gray-900, border, rounded).
        Desktop: Torna-se transparente e remove bordas para deixar os filhos cuidarem disso.
      */}
      <div className={`
        relative flex flex-col md:flex-row gap-0 md:gap-4 
        bg-gray-900 md:bg-transparent 
        border border-gray-700 md:border-none 
        rounded-xl md:rounded-none 
        overflow-hidden md:overflow-visible
        shadow-xl md:shadow-none
      `}>

        {/* INDICADOR DE TURNO (MOBILE) - Barra verde no topo */}
        {player.isActiveTurn && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] md:hidden z-10" />
        )}

        {/* BLOCO ESQUERDO: Player Card 
          Mobile: Apenas preenchimento simples.
          Desktop: Ganha seu próprio estilo de card.
        */}
        <div className="p-4 md:p-3 md:bg-gray-900 md:border md:border-gray-700 md:rounded-xl flex items-center justify-center md:justify-start">
          <PlayerCard player={player} isActive={player.isActiveTurn} compact={false} />
        </div>

        {/* BLOCO DIREITO: Stats + Inventário 
          Mobile: Continuação do card único.
          Desktop: Card separado que contém as infos e inventário.
        */}
        <div className={`
          flex-1 flex flex-col gap-3 p-4 pt-0 md:p-3 
          md:bg-gray-900 md:rounded-xl md:border-2 transition-all duration-300
          ${activeBorderClass}
        `}>

          {/* LINHA DE STATUS (Coins, Combat, Quest) */}
          <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2 px-4 md:px-6">

            {/* Pill Coins */}
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-white font-bold text-lg">{player.pillCoins}</span>
            </div>

            {/* Colapsos / Combate */}
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-gray-400" />
              <span className="text-white font-bold text-lg">{player.totalCollapses}</span>
            </div>

            {/* Quest Progress */}
            {player.shapeQuest && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-white font-bold text-lg">
                  {player.shapeQuest.progress}/{player.shapeQuest.sequence.length}
                </span>
              </div>
            )}
          </div>

          {/* INVENTÁRIO */}
          <div className="grid grid-cols-5 gap-2">
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
      </div>
    </div>
  );
}