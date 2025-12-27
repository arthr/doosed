/**
 * DraftScreen - Tela de draft de itens
 *
 * T084: Wire DraftScreen timer expiration and Confirm button
 *
 * Funcionalidades:
 * - Timer de 60s com auto-transicao para MATCH
 * - Compra de itens para inventario
 * - Visualizacao de inventario (5 slots)
 * - Confirmacao manual antecipada
 */

import React, { useCallback, useMemo } from 'react';
import { Button } from '../components/ui/button';
import { TimerDisplay } from '../components/ui/timer-display';
import { ShopGrid } from '../components/game/ShopGrid';
import { InventorySlot } from '../components/ui/inventory-slot';
import { useGameStore } from '../stores/gameStore';
import { useTurnTimer } from '../hooks/useTurnTimer';
import { DEFAULT_GAME_CONFIG } from '../config/game-config';
import { Availability, ItemCategory, Targeting } from '../types/item';
import type { Item, InventorySlot as IInventorySlot } from '../types/item';
import { MatchPhase } from '../types/game';

// Item descriptions
const ITEM_DESCRIPTIONS: Record<string, { name: string; description: string; category: ItemCategory }> = {
  scanner: { name: 'Scanner', description: 'Revela o tipo de uma pilula', category: ItemCategory.INTEL },
  shapeScanner: { name: 'Shape Scanner', description: 'Revela todas as pilulas de uma forma', category: ItemCategory.INTEL },
  inverter: { name: 'Inverter', description: 'Inverte o efeito de uma pilula', category: ItemCategory.INTEL },
  double: { name: 'Double', description: 'Dobra o efeito de uma pilula', category: ItemCategory.INTEL },
  pocketPill: { name: 'Pocket Pill', description: 'Pilula SAFE garantida', category: ItemCategory.SUSTAIN },
  shield: { name: 'Shield', description: 'Bloqueia proximo dano', category: ItemCategory.SUSTAIN },
  handcuffs: { name: 'Handcuffs', description: 'Pula turno do oponente', category: ItemCategory.CONTROL },
  forceFeed: { name: 'Force Feed', description: 'Forca oponente a consumir pilula', category: ItemCategory.CONTROL },
  shuffle: { name: 'Shuffle', description: 'Embaralha o pool', category: ItemCategory.CHAOS },
  discard: { name: 'Discard', description: 'Descarta uma pilula', category: ItemCategory.CHAOS },
};

// Converte config para array de Items filtrando por disponibilidade
const createItemCatalog = (): Item[] => {
  const items: Item[] = [];

  for (const [id, config] of Object.entries(DEFAULT_GAME_CONFIG.items)) {
    const meta = ITEM_DESCRIPTIONS[id];
    if (!meta) continue;

    if (config.availability === Availability.DRAFT || config.availability === Availability.BOTH) {
      items.push({
        id,
        name: meta.name,
        description: meta.description,
        category: meta.category,
        cost: config.cost,
        targeting: config.targeting,
        isStackable: config.stackable,
        stackLimit: config.stackLimit ?? 1,
        availability: config.availability,
      });
    }
  }

  return items;
};

const DRAFT_ITEMS: Item[] = createItemCatalog();

const DRAFT_TIME = DEFAULT_GAME_CONFIG.timers.draft;

export function DraftScreen() {
  // Store state e actions
  const transitionPhase = useGameStore((state) => state.transitionPhase);
  const nextRound = useGameStore((state) => state.nextRound);
  const getAllPlayers = useGameStore((state) => state.getAllPlayers);
  const addToInventory = useGameStore((state) => state.addToInventory);
  const spendPillCoins = useGameStore((state) => state.spendPillCoins);

  // Encontra player humano
  const humanPlayer = useMemo(() => {
    const players = getAllPlayers();
    return players.find((p) => !p.isBot) || null;
  }, [getAllPlayers]);

  // Handler de confirmacao - transiciona para MATCH
  const handleConfirmDraft = useCallback(() => {
    // Gera primeira rodada (pool)
    nextRound();
    // Transiciona para MATCH
    transitionPhase(MatchPhase.MATCH);
  }, [nextRound, transitionPhase]);

  // Timer de draft com auto-transicao
  const { timeRemaining, stopTimer } = useTurnTimer({
    duration: DRAFT_TIME,
    onTimeout: handleConfirmDraft,
    autoStart: true,
  });

  // Handler de compra de item
  const handleItemPurchase = useCallback(
    (item: Item) => {
      if (!humanPlayer) return;

      // Verifica se tem coins suficientes
      if (humanPlayer.pillCoins < item.cost) return;

      // Verifica se tem espaco no inventario
      if (humanPlayer.inventory.length >= 5) {
        // Verifica se e stackable e ja tem o item
        const existingSlot = humanPlayer.inventory.find(
          (slot) => slot.item?.id === item.id && item.isStackable
        );
        if (!existingSlot) return;
      }

      // Gasta coins e adiciona ao inventario
      spendPillCoins(humanPlayer.id, item.cost);
      addToInventory(humanPlayer.id, item);
    },
    [humanPlayer, spendPillCoins, addToInventory]
  );

  // Confirmacao manual (antecipada)
  const handleConfirm = useCallback(() => {
    stopTimer();
    handleConfirmDraft();
  }, [stopTimer, handleConfirmDraft]);

  // Slots de inventario (sempre 5)
  const inventorySlots: IInventorySlot[] = useMemo(() => {
    const slots: IInventorySlot[] = [];
    for (let i = 0; i < 5; i++) {
      const existingSlot = humanPlayer?.inventory[i];
      slots.push(
        existingSlot || {
          slotIndex: i,
          item: null,
          quantity: 0,
        }
      );
    }
    return slots;
  }, [humanPlayer?.inventory]);

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
              <div className="text-yellow-500 font-bold text-3xl">
                {humanPlayer?.pillCoins ?? 0}
              </div>
            </div>
            <TimerDisplay seconds={timeRemaining} maxSeconds={DRAFT_TIME} size="lg" />
          </div>
        </div>

        {/* Inventario */}
        <div className="bg-gray-800 rounded-xs p-4 border border-gray-700 mb-6">
          <div className="text-white font-bold mb-3">Seu Inventario (5 slots)</div>
          <div className="flex gap-2">
            {inventorySlots.map((slot, index) => (
              <InventorySlot key={index} slot={slot} slotIndex={index} isDisabled={true} />
            ))}
          </div>
        </div>

        {/* Shop Grid */}
        <div className="mb-6">
          <div className="text-white font-bold text-xl mb-4">Loja</div>
          <div className="max-h-[400px] overflow-y-auto">
            <ShopGrid
              items={DRAFT_ITEMS}
              playerCoins={humanPlayer?.pillCoins ?? 0}
              onItemPurchase={handleItemPurchase}
              availability="DRAFT"
            />
          </div>
        </div>

        {/* Confirm Button */}
        <Button onClick={handleConfirm} variant="primary" size="lg" className="w-full">
          Confirmar e Iniciar Match
        </Button>
      </div>
    </div>
  );
}

