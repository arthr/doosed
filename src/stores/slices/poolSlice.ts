/**
 * Pool Slice - Gerencia operacoes no pool de pilulas
 *
 * Responsabilidades:
 * - Revelar pilulas (Scanner)
 * - Consumir pilulas
 * - Aplicar modificadores (Inverter, Doubler)
 * - Embaralhar pool
 *
 * NOTA: Pool state esta em currentRound (matchSlice)
 * Este slice apenas provoca actions no pool via get()
 *
 * Seguindo Zustand Slices Pattern
 */

import type { SliceCreator, PoolSlice } from './types';
import type { Pool } from '../../types/game';
import type { Pill, PillModifier } from '../../types/pill';
import { PillState } from '../../types/pill';
import { shuffle } from '../../core/utils/random';

export const createPoolSlice: SliceCreator<PoolSlice> = (set, get) => ({
  // ==================== ACTIONS ====================

  /**
   * Revela uma pilula
   * - Marca isRevealed = true
   * - Adiciona a pool.revealed
   */
  revealPill: (pillId: string) =>
    set(state => {
      if (!state.currentRound) return;

      const pill = state.currentRound.pool.pills.find((p: Pill) => p.id === pillId);
      if (!pill || pill.isRevealed) return;

      pill.isRevealed = true;
      state.currentRound.pool.revealed.push(pill);
    }),

  /**
   * Consome uma pilula
   * - Marca state = CONSUMED
   * - Remove do array pills
   */
  consumePill: (pillId: string) =>
    set(state => {
      if (!state.currentRound) return;

      const pillIndex = state.currentRound.pool.pills.findIndex((p: Pill) => p.id === pillId);
      if (pillIndex === -1) {
        console.warn('[poolSlice.consumePill] Pill nao encontrada no pool', {
          pillId,
        });
        return;
      }

      const pill = state.currentRound.pool.pills[pillIndex];
      if (pill.state === PillState.CONSUMED) {
        console.warn('[poolSlice.consumePill] Pill ja consumida', { pillId });
        return;
      }
      pill.state = PillState.CONSUMED;

      // Remove do pool
      state.currentRound.pool.pills.splice(pillIndex, 1);

      // Mantem pool.size como tamanho inicial do baralho (usado para stats).
      // Atualiza counters para refletir as pills REMANESCENTES por tipo (FR-072).
      const currentCount = state.currentRound.pool.counters[pill.type] || 0;
      state.currentRound.pool.counters[pill.type] = Math.max(0, currentCount - 1);
    }),

  /**
   * Aplica modificador a uma pilula
   */
  applyModifierToPill: (pillId: string, modifier: PillModifier) =>
    set(state => {
      if (!state.currentRound) return;

      const pill = state.currentRound.pool.pills.find((p: Pill) => p.id === pillId);
      if (!pill) return;

      if (!pill.modifiers.includes(modifier)) {
        pill.modifiers.push(modifier);
      }
    }),

  /**
   * Embaralha pool
   * - Reordena pills array
   * - Reseta revelacoes
   */
  shufflePool: () =>
    set(state => {
      if (!state.currentRound) return;

      state.currentRound.pool.pills = shuffle(state.currentRound.pool.pills);

      // Atualiza positions
      state.currentRound.pool.pills.forEach((pill: Pill, index: number) => {
        pill.position = index;
      });

      // Reseta revelacoes
      state.currentRound.pool.revealed = [];
      for (const pill of state.currentRound.pool.pills) {
        pill.isRevealed = false;
      }
      // Counters representam as pills REMANESCENTES por tipo (FR-072).
      // Shuffle nao muda tipos/quantidades, mas recomputamos para garantir consistencia.
      const counters: Record<string, number> = {};
      for (const pill of state.currentRound.pool.pills) {
        counters[pill.type] = (counters[pill.type] || 0) + 1;
      }
      state.currentRound.pool.counters = counters;
    }),

  // ==================== QUERIES ====================

  /**
   * Retorna pool atual
   */
  getPool: (): Pool | null => get().currentRound?.pool || null,

  /**
   * Retorna pilula por ID
   */
  getPill: (pillId: string): Pill | undefined =>
    get().currentRound?.pool.pills.find((p: Pill) => p.id === pillId),
});
