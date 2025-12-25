/**
 * DraftScreen - Tela de draft de itens
 * 
 * T076: 60s timer, shop grid (DRAFT/BOTH), inventory (5 slots), pill coins, confirm
 * T084: Wire DraftScreen → Match (Integration)
 */

import React from 'react';
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import { useProgressionStore } from '../stores/progressionStore';
import { useTurnTimer } from '../hooks/useTurnTimer';
import { Button } from '../components/ui/button';
import { TimerDisplay } from '../components/ui/timer-display';
import { ShopGrid } from '../components/game/ShopGrid';
import { InventorySlot } from '../components/ui/inventory-slot';
import type { Item } from '../types/game';
import { MatchPhase } from '../types/game';
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
  const { transitionPhase, nextRound } = useMatchStore();
  const { players, addToInventory, spendPillCoins } = usePlayerStore();
  const profile = useProgressionStore();

  const humanPlayer = players.find((p) => p.id === profile.id);
  const playerCoins = humanPlayer?.pillCoins || 100;

  // T084: Timer com auto-transição para MATCH
  const handleDraftTimeout = React.useCallback(() => {
    // Bots fazem compras automáticas (simplificado)
    
    // Inicia match
    nextRound();
    transitionPhase(MatchPhase.MATCH);
  }, [nextRound, transitionPhase]);

  const { timeRemaining } = useTurnTimer({
    duration: DRAFT_TIME,
    onTimeout: handleDraftTimeout,
    autoStart: true,
  });

  const handleConfirm = () => {
    handleDraftTimeout();
  };

  const handleItemPurchase = (item: Item) => {
    if (!humanPlayer || playerCoins < item.cost) return;
    
    spendPillCoins(humanPlayer.id, item.cost);
    addToInventory(humanPlayer.id, item);
  };

  // Preenche slots vazios até 5
  const inventorySlots = humanPlayer ? [...humanPlayer.inventory] : [];
  while (inventorySlots.length < 5) {
    inventorySlots.push({ slotIndex: inventorySlots.length, item: null, quantity: 0 });
  }

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
              <div className="text-yellow-500 font-bold text-3xl">{playerCoins}</div>
            </div>
            <TimerDisplay seconds={timeRemaining} maxSeconds={DRAFT_TIME} size="lg" />
          </div>
        </div>

        {/* Inventário */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
          <div className="text-white font-bold mb-3">Seu Inventário (5 slots)</div>
          <div className="flex gap-2">
            {inventorySlots.map((slot, index) => (
              <InventorySlot key={index} slot={slot} slotIndex={index} isDisabled={true} />
            ))}
          </div>
        </div>

        {/* Shop Grid */}
        <div className="mb-6">
          <div className="text-white font-bold text-xl mb-4">Loja</div>
          <ShopGrid
            items={MOCK_ITEMS}
            playerCoins={playerCoins}
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

