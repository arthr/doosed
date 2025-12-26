/**
 * Game Store - Store Combinado usando Zustand Slices Pattern
 *
 * Combina todos os slices em um unico bounded store:
 * - matchSlice: Ciclo de vida da partida
 * - playersSlice: Gerenciamento de jogadores
 * - poolSlice: Operacoes no pool de pilulas
 *
 * Beneficios:
 * - Zero sincronizacao entre stores
 * - SOLID-S mantido via arquivos separados
 * - Slices acessam uns aos outros via get()
 *
 * @see https://zustand.docs.pmnd.rs/guides/slices-pattern
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createMatchSlice } from './slices/matchSlice';
import { createPlayersSlice } from './slices/playersSlice';
import { createPoolSlice } from './slices/poolSlice';
import type { GameStore } from './slices/types';

export const useGameStore = create<GameStore>()(
  immer((...a) => ({
    ...createMatchSlice(...a),
    ...createPlayersSlice(...a),
    ...createPoolSlice(...a),
  }))
);

