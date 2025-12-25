/**
 * Player Store - Gerencia estado dos jogadores
 * 
 * Responsabilidades:
 * - Atualizar lives, resistance, inventory
 * - Aplicar dano, cura, status
 * - Gerenciar inventário (add/remove items)
 * 
 * T060: Zustand Store para Players com lives, resistance, inventory, etc.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Player, Status, Item } from '../types/game';
import { addItemToInventory, removeItemFromInventory } from '../core/inventory-manager';
import { processCollapseOrElimination } from '../core/collapse-handler';

interface PlayerState {
  // Estado dos jogadores (sincronizado com matchStore.match.players)
  players: Player[];

  // Actions
  setPlayers: (players: Player[]) => void;
  updatePlayer: (playerId: string, updater: (player: Player) => void) => void;
  applyDamage: (playerId: string, damage: number) => void;
  applyHeal: (playerId: string, heal: number) => void;
  applyStatus: (playerId: string, status: Status) => void;
  removeStatus: (playerId: string, statusId: string) => void;
  addToInventory: (playerId: string, item: Item) => void;
  removeFromInventory: (playerId: string, itemId: string) => void;
  grantPillCoins: (playerId: string, amount: number) => void;
  spendPillCoins: (playerId: string, amount: number) => void;
  setActiveTurn: (playerId: string) => void;
  clearActiveTurns: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  immer((set) => ({
    players: [],

    /**
     * Inicializa array de players
     */
    setPlayers: (players: Player[]) =>
      set((state) => {
        state.players = players;
      }),

    /**
     * Atualiza player específico com função customizada
     */
    updatePlayer: (playerId: string, updater) =>
      set((state) => {
        const player = state.players.find((p: Player) => p.id === playerId);
        if (player) {
          updater(player);
        }
      }),

    /**
     * Aplica dano ao jogador
     * - Reduz resistance
     * - Checa collapse (resistance <= 0)
     * - Atualiza isLastChance e isEliminated
     */
    applyDamage: (playerId: string, damage: number) =>
      set((state) => {
        const player = state.players.find((p: Player) => p.id === playerId);
        if (!player) return;

        player.resistance -= damage;

        // Checa collapse ou eliminação (resistance <= 0)
        const collapseResult = processCollapseOrElimination(player);
        
        if (collapseResult && collapseResult.collapsed) {
          // Aplica resultado do colapso aos campos do player
          player.lives = collapseResult.newLives;
          player.resistance = collapseResult.newResistance;
          player.extraResistance = 0; // Reset extra resistance
          player.isLastChance = collapseResult.isLastChance;
          player.isEliminated = collapseResult.isEliminated;
          player.totalCollapses = collapseResult.totalCollapses;
          
          // Eliminados não podem ter turno ativo
          if (collapseResult.isEliminated) {
            player.isActiveTurn = false;
          }
        }
      }),

    /**
     * Aplica cura ao jogador
     * - Aumenta resistance respeitando cap
     * - Overflow vai para extraResistance
     */
    applyHeal: (playerId: string, heal: number) =>
      set((state) => {
        const player = state.players.find((p: Player) => p.id === playerId);
        if (!player) return;

        player.resistance += heal;

        // Respeita cap
        if (player.resistance > player.resistanceCap) {
          const overflow = player.resistance - player.resistanceCap;
          player.resistance = player.resistanceCap;
          player.extraResistance = Math.min(overflow, player.resistanceCap);
        }
      }),

    /**
     * Aplica status ao jogador
     * - Adiciona a activeStatuses
     */
    applyStatus: (playerId: string, status: Status) =>
      set((state) => {
        const player = state.players.find((p: Player) => p.id === playerId);
        if (!player) return;

        player.activeStatuses.push(status);
      }),

    /**
     * Remove status do jogador
     */
    removeStatus: (playerId: string, statusId: string) =>
      set((state) => {
        const player = state.players.find((p: Player) => p.id === playerId);
        if (!player) return;

        player.activeStatuses = player.activeStatuses.filter((s: Status) => s.id !== statusId);
      }),

    /**
     * Adiciona item ao inventário
     * - Usa lógica core de addItemToInventory
     * - Respeita limite de 5 slots
     */
    addToInventory: (playerId: string, item: Item) =>
      set((state) => {
        const player = state.players.find((p: Player) => p.id === playerId);
        if (!player) return;

        const result = addItemToInventory(player.inventory, item);
        if (result.success) {
          player.inventory = result.updatedInventory;
        }
      }),

    /**
     * Remove item do inventário
     * - Decrementa stack ou remove slot
     */
    removeFromInventory: (playerId: string, itemId: string) =>
      set((state) => {
        const player = state.players.find((p: Player) => p.id === playerId);
        if (!player) return;

        const result = removeItemFromInventory(player.inventory, itemId);
        if (result.success) {
          player.inventory = result.updatedInventory;
        }
      }),

    /**
     * Concede Pill Coins ao jogador
     */
    grantPillCoins: (playerId: string, amount: number) =>
      set((state) => {
        const player = state.players.find((p: Player) => p.id === playerId);
        if (!player) return;

        player.pillCoins += amount;
      }),

    /**
     * Gasta Pill Coins do jogador
     */
    spendPillCoins: (playerId: string, amount: number) =>
      set((state) => {
        const player = state.players.find((p: Player) => p.id === playerId);
        if (!player) return;

        if (player.pillCoins >= amount) {
          player.pillCoins -= amount;
        }
      }),

    /**
     * Define jogador como tendo turno ativo
     */
    setActiveTurn: (playerId: string) =>
      set((state) => {
        state.players.forEach((p: Player) => {
          p.isActiveTurn = p.id === playerId;
        });
      }),

    /**
     * Limpa todos os turnos ativos
     */
    clearActiveTurns: () =>
      set((state) => {
        state.players.forEach((p: Player) => {
          p.isActiveTurn = false;
        });
      }),
  }))
);
