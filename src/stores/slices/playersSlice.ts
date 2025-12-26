/**
 * Players Slice - Gerencia estado dos jogadores
 *
 * Responsabilidades:
 * - Lives, resistance, inventory
 * - Dano, cura, status
 * - Inventario (add/remove items)
 * - Economia (Pill Coins)
 *
 * Seguindo Zustand Slices Pattern
 */

import type { SliceCreator, PlayersSlice } from './types';
import type { Player } from '../../types/game';
import type { Status } from '../../types/status';
import type { Item } from '../../types/item';
import { processCollapseOrElimination } from '../../core/collapse-handler';
import {
  addItemToInventory,
  removeItemFromInventory,
} from '../../core/inventory-manager';

export const createPlayersSlice: SliceCreator<PlayersSlice> = (set, get) => ({
  // ==================== STATE ====================
  players: new Map(),

  // ==================== ACTIONS ====================

  /**
   * Inicializa array de players
   * Converte para Map para O(1) lookup
   */
  setPlayers: (players: Player[]) =>
    set((state) => {
      state.players = new Map(players.map((p) => [p.id, p]));
    }),

  /**
   * Atualiza player especifico com funcao customizada
   */
  updatePlayer: (playerId: string, updater) =>
    set((state) => {
      const player = state.players.get(playerId);
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
      const player = state.players.get(playerId);
      if (!player) return;

      player.resistance -= damage;

      // Checa collapse ou eliminacao (resistance <= 0)
      const collapseResult = processCollapseOrElimination(player);

      if (collapseResult && collapseResult.collapsed) {
        player.lives = collapseResult.newLives;
        player.resistance = collapseResult.newResistance;
        player.extraResistance = 0;
        player.isLastChance = collapseResult.isLastChance;
        player.isEliminated = collapseResult.isEliminated;
        player.totalCollapses = collapseResult.totalCollapses;

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
      const player = state.players.get(playerId);
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
   */
  applyStatus: (playerId: string, status: Status) =>
    set((state) => {
      const player = state.players.get(playerId);
      if (player) {
        player.activeStatuses.push(status);
      }
    }),

  /**
   * Remove status do jogador
   */
  removeStatus: (playerId: string, statusId: string) =>
    set((state) => {
      const player = state.players.get(playerId);
      if (player) {
        player.activeStatuses = player.activeStatuses.filter(
          (s) => s.id !== statusId
        );
      }
    }),

  /**
   * Adiciona item ao inventario
   * Usa logica core de addItemToInventory
   */
  addToInventory: (playerId: string, item: Item) =>
    set((state) => {
      const player = state.players.get(playerId);
      if (!player) return;

      const result = addItemToInventory(player.inventory, item);
      if (result.success) {
        player.inventory = result.updatedInventory;
      }
    }),

  /**
   * Remove item do inventario
   */
  removeFromInventory: (playerId: string, itemId: string) =>
    set((state) => {
      const player = state.players.get(playerId);
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
      const player = state.players.get(playerId);
      if (player) {
        player.pillCoins += amount;
      }
    }),

  /**
   * Gasta Pill Coins do jogador
   */
  spendPillCoins: (playerId: string, amount: number) =>
    set((state) => {
      const player = state.players.get(playerId);
      if (player && player.pillCoins >= amount) {
        player.pillCoins -= amount;
      }
    }),

  /**
   * Define jogador como tendo turno ativo
   */
  setActiveTurn: (playerId: string) =>
    set((state) => {
      for (const player of state.players.values()) {
        player.isActiveTurn = player.id === playerId;
      }
    }),

  /**
   * Limpa todos os turnos ativos
   */
  clearActiveTurns: () =>
    set((state) => {
      for (const player of state.players.values()) {
        player.isActiveTurn = false;
      }
    }),

  // ==================== QUERIES ====================

  /**
   * Retorna player por ID (O(1) lookup)
   */
  getPlayer: (id: string) => get().players.get(id),

  /**
   * Retorna todos os players como array
   */
  getAllPlayers: () => Array.from(get().players.values()),

  /**
   * Retorna apenas players vivos (nao eliminados)
   */
  getAlivePlayers: () =>
    Array.from(get().players.values()).filter((p) => !p.isEliminated),
});

