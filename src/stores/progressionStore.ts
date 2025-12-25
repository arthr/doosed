/**
 * Progression Store - Gerencia progressão persistente do jogador
 * 
 * Responsabilidades:
 * - Gerenciar XP, level, schmeckles
 * - Persistir em localStorage
 * - Calcular level-ups
 * - Estatísticas globais (gamesPlayed, wins)
 * 
 * T063: Zustand Store para Progression com persist middleware (localStorage)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Profile } from '../types/game';

interface ProgressionState extends Profile {
  // Actions
  addXP: (amount: number) => void;
  addSchmeckles: (amount: number) => void;
  spendSchmeckles: (amount: number) => void;
  incrementGamesPlayed: () => void;
  incrementWins: () => void;
  addRoundsSurvived: (rounds: number) => void;
  trackItemUsage: (itemId: string) => void;
  updateAvatar: (avatar: string) => void;
  updateName: (name: string) => void;
  clearProfile: () => void;
}

const DEFAULT_PROFILE: Profile = {
  id: crypto.randomUUID(),
  name: 'Jogador',
  avatar: 'default.png',
  level: 1,
  xp: 0,
  schmeckles: 0,
  gamesPlayed: 0,
  wins: 0,
  totalRoundsSurvived: 0,
  mostUsedItems: {},
  lastUpdated: Date.now(),
};

/**
 * Calcula level baseado em XP
 * Formula: level = floor(sqrt(xp / 100)) + 1
 */
function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Calcula XP necessário para próximo nível
 */
function getXPForNextLevel(currentLevel: number): number {
  const nextLevel = currentLevel + 1;
  return (nextLevel - 1) ** 2 * 100;
}

export const useProgressionStore = create<ProgressionState>()(
  persist(
    immer((set) => ({
      ...DEFAULT_PROFILE,

      /**
       * Adiciona XP e detecta level-up
       */
      addXP: (amount: number) =>
        set((state) => {
          const oldLevel = state.level;
          state.xp += amount;
          const newLevel = calculateLevel(state.xp);

          if (newLevel > oldLevel) {
            state.level = newLevel;
            
            // Log level-up
            console.log(`🎉 LEVEL UP! Agora nível ${newLevel}`);
          }

          state.lastUpdated = Date.now();
        }),

      /**
       * Adiciona Schmeckles
       */
      addSchmeckles: (amount: number) =>
        set((state) => {
          state.schmeckles += amount;
          state.lastUpdated = Date.now();
        }),

      /**
       * Gasta Schmeckles
       */
      spendSchmeckles: (amount: number) =>
        set((state) => {
          if (state.schmeckles >= amount) {
            state.schmeckles -= amount;
            state.lastUpdated = Date.now();
          }
        }),

      /**
       * Incrementa contador de partidas jogadas
       */
      incrementGamesPlayed: () =>
        set((state) => {
          state.gamesPlayed += 1;
          state.lastUpdated = Date.now();
        }),

      /**
       * Incrementa contador de vitórias
       */
      incrementWins: () =>
        set((state) => {
          state.wins += 1;
          state.lastUpdated = Date.now();
        }),

      /**
       * Adiciona rounds sobrevividos
       */
      addRoundsSurvived: (rounds: number) =>
        set((state) => {
          state.totalRoundsSurvived += rounds;
          state.lastUpdated = Date.now();
        }),

      /**
       * Rastreia uso de item
       */
      trackItemUsage: (itemId: string) =>
        set((state) => {
          state.mostUsedItems[itemId] = (state.mostUsedItems[itemId] || 0) + 1;
          state.lastUpdated = Date.now();
        }),

      /**
       * Atualiza avatar
       */
      updateAvatar: (avatar: string) =>
        set((state) => {
          state.avatar = avatar;
          state.lastUpdated = Date.now();
        }),

      /**
       * Atualiza nome
       */
      updateName: (name: string) =>
        set((state) => {
          state.name = name.slice(0, 20); // Limita a 20 chars
          state.lastUpdated = Date.now();
        }),

      /**
       * Reseta profile para padrão
       */
      clearProfile: () =>
        set(() => ({
          ...DEFAULT_PROFILE,
          id: crypto.randomUUID(),
          lastUpdated: Date.now(),
        })),
    })),
    {
      name: 'dosed:profile', // localStorage key
      version: 1, // Schema version para migrações futuras
    }
  )
);

/**
 * Hook auxiliar para obter info de progressão de level
 */
export function useProgressionInfo() {
  const { level, xp } = useProgressionStore();
  const xpForNextLevel = getXPForNextLevel(level);
  const xpForCurrentLevel = level > 1 ? getXPForNextLevel(level - 1) : 0;
  const xpProgress = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = (xpProgress / xpNeeded) * 100;

  return {
    level,
    xp,
    xpForNextLevel,
    xpProgress,
    xpNeeded,
    progressPercent,
  };
}

