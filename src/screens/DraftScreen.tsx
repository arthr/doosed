/**
 * DraftScreen - Tela de draft de itens
 * 
 * STATUS: DESINTEGRADO - Apenas estrutura visual
 * TODO REFACTOR: Reintegrar após refatoração de hooks e stores
 * 
 * Componentes visuais mantidos:
 * - ShopGrid, InventorySlot, TimerDisplay
 * 
 * Lógica removida (será reintegrada):
 * - useTurnTimer (draft timeout)
 * - Compra de itens
 * - Gestão de inventário
 * - Transição automática para MATCH
 */

import React from 'react';
import { Button } from '../components/ui/button';
import { TimerDisplay } from '../components/ui/timer-display';
import { ShopGrid } from '../components/game/ShopGrid';
import { InventorySlot } from '../components/ui/inventory-slot';
import { ItemCategory, Targeting, Availability } from '../types/item';

// Mock de itens (será substituído por config real)
const MOCK_ITEMS: Item[] = [
  {
    id: 'scanner',
    name: 'Scanner',
    description: 'Revela o tipo de uma pílula',
    category: ItemCategory.INTEL,
    cost: 15,
    targeting: Targeting.PILL,
    isStackable: true,
    stackLimit: 3,
    availability: Availability.BOTH,
  },
  {
    id: 'inverter',
    name: 'Inverter',
    description: 'Inverte o efeito de uma pílula',
    category: ItemCategory.INTEL,
    cost: 20,
    targeting: Targeting.PILL,
    isStackable: false,
    stackLimit: 1,
    availability: Availability.BOTH,
  },
  {
    id: 'pocket-pill',
    name: 'Pocket Pill',
    description: 'Pílula SAFE garantida',
    category: ItemCategory.SUSTAIN,
    cost: 25,
    targeting: Targeting.SELF,
    isStackable: false,
    stackLimit: 1,
    availability: Availability.DRAFT,
  },
];

const DRAFT_TIME = 60;

export function DraftScreen() {
  // TODO REFACTOR: Reintegrar hooks refatorados aqui
  // - useDraftData() - dados do draft (player, coins, inventory)
  // - useDraftTimer() - timer com auto-transição
  // - useItemPurchase() - compra de itens

  // Mock data para manter estrutura visual
  const mockTimeRemaining = 60;
  const mockPlayerCoins = 100;
  const mockInventorySlots = Array.from({ length: 5 }, (_, i) => ({
    slotIndex: i,
    item: null,
    quantity: 0,
  }));

  const handleConfirm = () => {
    console.log('[DESINTEGRADO] Confirm clicked');
    // TODO REFACTOR: Reintegrar transição para MATCH
  };

  const handleItemPurchase = (item: any) => {
    console.log('[DESINTEGRADO] Item purchase:', item);
    // TODO REFACTOR: Reintegrar com useItemPurchase
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header com Timer e Coins */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-500 mb-2">Draft Phase</h1>
            <p className="text-gray-400">Escolha seus itens iniciais</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-gray-400 text-sm">Pill Coins</div>
              <div className="text-yellow-500 font-bold text-3xl">{mockPlayerCoins}</div>
            </div>
            <TimerDisplay seconds={mockTimeRemaining} maxSeconds={DRAFT_TIME} size="lg" />
          </div>
        </div>

        {/* Inventário */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
          <div className="text-white font-bold mb-3">Seu Inventário (5 slots)</div>
          <div className="flex gap-2">
            {mockInventorySlots.map((slot, index) => (
              <InventorySlot key={index} slot={slot} slotIndex={index} isDisabled={true} />
            ))}
          </div>
        </div>

        {/* Shop Grid */}
        <div className="mb-6">
          <div className="text-white font-bold text-xl mb-4">Loja</div>
          <ShopGrid
            items={MOCK_ITEMS}
            playerCoins={mockPlayerCoins}
            onItemPurchase={handleItemPurchase}
            availability="DRAFT"
          />
        </div>

        {/* Confirm Button */}
        <Button onClick={handleConfirm} variant="primary" size="lg" className="w-full">
          Confirmar e Iniciar Match
        </Button>
      </div>
    </div>
  );
}

