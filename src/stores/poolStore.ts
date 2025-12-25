/**
 * Pool Store - Gerencia pool de pílulas da rodada atual
 * 
 * Responsabilidades:
 * - Gerenciar pool atual (pills, counters, revealed)
 * - Revelar pílulas (Scanner)
 * - Consumir pílulas
 * - Aplicar modificadores (Inverter, Doubler)
 * 
 * T061: Zustand Store para Pool com pills, counters, revealed
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Pool, Pill, PillModifier } from '../types/game';
import { generatePool } from '../core/pool-generator';
import { DEFAULT_GAME_CONFIG } from '../config/game-config';
import { shuffle } from '../core/utils/random';
import { PillState } from '../types/pill';

interface PoolState {
  // Pool atual
  pool: Pool | null;

  // Actions
  generateNewPool: (roundNumber: number) => void;
  setPool: (pool: Pool) => void;
  revealPill: (pillId: string) => void;
  consumePill: (pillId: string) => void;
  applyModifierToPill: (pillId: string, modifier: PillModifier) => void;
  shufflePool: () => void;
  updatePill: (pillId: string, updater: (pill: Pill) => void) => void;
}

export const usePoolStore = create<PoolState>()(
  immer((set) => ({
    pool: null,

    /**
     * Gera novo pool para rodada
     * - Usa core/pool-generator
     * - Inicializa counters e listas
     */
    generateNewPool: (roundNumber: number) =>
      set((state) => {
        state.pool = generatePool(roundNumber, DEFAULT_GAME_CONFIG);
      }),

    /**
     * Define pool diretamente
     */
    setPool: (pool: Pool) =>
      set((state) => {
        state.pool = pool;
      }),

    /**
     * Revela uma pílula
     * - Marca isRevealed = true
     * - Adiciona a pool.revealed
     */
    revealPill: (pillId: string) =>
      set((state) => {
        if (!state.pool) return;

        const pill = state.pool.pills.find((p: Pill) => p.id === pillId);
        if (!pill || pill.isRevealed) return;

        pill.isRevealed = true;
        state.pool.revealed.push(pill);

        // Atualiza contador
        state.pool.counters[pill.type] = (state.pool.counters[pill.type] || 0) + 1;
      }),

    /**
     * Consome uma pílula
     * - Marca state = CONSUMED
     * - Remove do array pills
     */
    consumePill: (pillId: string) =>
      set((state) => {
        if (!state.pool) return;

        const pillIndex = state.pool.pills.findIndex((p: Pill) => p.id === pillId);
        if (pillIndex === -1) return;

        const pill = state.pool.pills[pillIndex];
        pill.state = PillState.CONSUMED;

        // Remove do pool
        state.pool.pills.splice(pillIndex, 1);
        state.pool.size = state.pool.pills.length;
      }),

    /**
     * Aplica modificador a uma pílula
     * - Adiciona a pill.modifiers se não existir
     */
    applyModifierToPill: (pillId: string, modifier: PillModifier) =>
      set((state) => {
        if (!state.pool) return;

        const pill = state.pool.pills.find((p: Pill) => p.id === pillId);
        if (!pill) return;

        if (!pill.modifiers.includes(modifier)) {
          pill.modifiers.push(modifier);
        }
      }),

    /**
     * Embaralha pool
     * - Reordena pills array
     * - Atualiza position de cada pill
     */
    shufflePool: () =>
      set((state) => {
        if (!state.pool) return;

        // Usa shuffle com RNG global (sem seed para jogo real)
        state.pool.pills = shuffle(state.pool.pills);

        // Atualiza positions
        state.pool.pills.forEach((pill: Pill, index: number) => {
          pill.position = index;
        });
      }),

    /**
     * Atualiza pill com função customizada
     */
    updatePill: (pillId: string, updater) =>
      set((state) => {
        if (!state.pool) return;

        const pill = state.pool.pills.find((p: Pill) => p.id === pillId);
        if (pill) {
          updater(pill);
        }
      }),
  }))
);
