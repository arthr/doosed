/**
 * Unit Tests: Collapse Handler
 *
 * T038a: handleCollapse - lives -1, resistance reset to 6, isLastChance, isEliminated
 *
 * Constitution Principle VI: Testing Estrategico
 */

import { describe, it, expect } from 'vitest';
import {
  handleCollapse,
  checkElimination,
  handleElimination,
  processCollapseOrElimination,
  applyCollapseToPlayer,
  validateCollapseState,
} from '../collapse-handler';
import type { Player } from '../../types/game';
import { DEFAULT_GAME_CONFIG } from '../../config/game-config';

// ==========================================================================
// Test Fixtures
// ==========================================================================

function createMockPlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: 'player-1',
    name: 'Test Player',
    avatar: '',
    isBot: false,
    lives: 3,
    maxLives: 3,
    resistance: 6,
    resistanceCap: 6,
    extraResistance: 0,
    inventory: [],
    pillCoins: 100,
    activeStatuses: [],
    isEliminated: false,
    isLastChance: false,
    isActiveTurn: false,
    totalCollapses: 0,
    shapeQuest: null,
    wantsShop: false,
    ...overrides,
  };
}

describe('Collapse Handler', () => {
  // ==========================================================================
  // T038a: handleCollapse
  // ==========================================================================
  describe('handleCollapse (T038a)', () => {
    it('deve reduzir lives em 1', () => {
      const player = createMockPlayer({ lives: 3, resistance: 0 });
      const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

      expect(result.newLives).toBe(2);
      expect(result.previousLives).toBe(3);
    });

    it('deve resetar resistance para 6', () => {
      const player = createMockPlayer({ resistance: -5 });
      const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

      expect(result.newResistance).toBe(6);
    });

    it('deve marcar collapsed como true', () => {
      const player = createMockPlayer({ resistance: 0 });
      const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

      expect(result.collapsed).toBe(true);
    });

    it('deve marcar isLastChance quando lives chegar a 0', () => {
      const player = createMockPlayer({ lives: 1, resistance: 0 });
      const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

      expect(result.newLives).toBe(0);
      expect(result.isLastChance).toBe(true);
    });

    it('NAO deve marcar isLastChance quando lives > 0', () => {
      const player = createMockPlayer({ lives: 2, resistance: 0 });
      const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

      expect(result.newLives).toBe(1);
      expect(result.isLastChance).toBe(false);
    });

    it('deve incrementar totalCollapses', () => {
      const player = createMockPlayer({ totalCollapses: 2 });
      const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

      expect(result.totalCollapses).toBe(3);
    });

    it('NAO deve marcar isEliminated em colapso normal', () => {
      const player = createMockPlayer({ lives: 1, resistance: 0 });
      const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

      expect(result.isEliminated).toBe(false);
    });

    it('lives nunca deve ser negativo', () => {
      const player = createMockPlayer({ lives: 0, resistance: 0 });
      const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

      expect(result.newLives).toBeGreaterThanOrEqual(0);
    });
  });

  // ==========================================================================
  // T039: checkElimination
  // ==========================================================================
  describe('checkElimination (T039)', () => {
    it('deve retornar true quando isLastChance E resistance <= 0', () => {
      const player = createMockPlayer({
        lives: 0,
        resistance: 0,
        isLastChance: true,
      });

      expect(checkElimination(player)).toBe(true);
    });

    it('deve retornar true quando isLastChance E resistance negativa', () => {
      const player = createMockPlayer({
        lives: 0,
        resistance: -5,
        isLastChance: true,
      });

      expect(checkElimination(player)).toBe(true);
    });

    it('deve retornar false quando isLastChance mas resistance > 0', () => {
      const player = createMockPlayer({
        lives: 0,
        resistance: 3,
        isLastChance: true,
      });

      expect(checkElimination(player)).toBe(false);
    });

    it('deve retornar false quando NAO isLastChance mesmo com resistance <= 0', () => {
      const player = createMockPlayer({
        lives: 2,
        resistance: 0,
        isLastChance: false,
      });

      expect(checkElimination(player)).toBe(false);
    });
  });

  // ==========================================================================
  // handleElimination
  // ==========================================================================
  describe('handleElimination', () => {
    it('deve marcar isEliminated como true', () => {
      const player = createMockPlayer({
        lives: 0,
        resistance: 0,
        isLastChance: true,
      });
      const result = handleElimination(player);

      expect(result.isEliminated).toBe(true);
    });

    it('deve manter isLastChance como true', () => {
      const player = createMockPlayer({
        lives: 0,
        resistance: 0,
        isLastChance: true,
      });
      const result = handleElimination(player);

      expect(result.isLastChance).toBe(true);
    });

    it('deve setar resistance para 0', () => {
      const player = createMockPlayer({
        lives: 0,
        resistance: -10,
        isLastChance: true,
      });
      const result = handleElimination(player);

      expect(result.newResistance).toBe(0);
    });

    it('deve incrementar totalCollapses', () => {
      const player = createMockPlayer({
        lives: 0,
        resistance: 0,
        isLastChance: true,
        totalCollapses: 3,
      });
      const result = handleElimination(player);

      expect(result.totalCollapses).toBe(4);
    });
  });

  // ==========================================================================
  // processCollapseOrElimination
  // ==========================================================================
  describe('processCollapseOrElimination', () => {
    it('deve retornar null se resistance > 0', () => {
      const player = createMockPlayer({ resistance: 3 });
      const result = processCollapseOrElimination(player, DEFAULT_GAME_CONFIG);

      expect(result).toBeNull();
    });

    it('deve processar colapso normal quando lives > 0', () => {
      const player = createMockPlayer({ lives: 2, resistance: 0 });
      const result = processCollapseOrElimination(player, DEFAULT_GAME_CONFIG);

      expect(result).not.toBeNull();
      expect(result!.collapsed).toBe(true);
      expect(result!.isEliminated).toBe(false);
    });

    it('deve processar eliminacao quando isLastChance e resistance <= 0', () => {
      const player = createMockPlayer({
        lives: 0,
        resistance: 0,
        isLastChance: true,
      });
      const result = processCollapseOrElimination(player, DEFAULT_GAME_CONFIG);

      expect(result).not.toBeNull();
      expect(result!.isEliminated).toBe(true);
    });

    it('deve tratar resistance negativa como trigger de colapso', () => {
      const player = createMockPlayer({ lives: 3, resistance: -5 });
      const result = processCollapseOrElimination(player, DEFAULT_GAME_CONFIG);

      expect(result).not.toBeNull();
      expect(result!.collapsed).toBe(true);
    });
  });

  // ==========================================================================
  // applyCollapseToPlayer
  // ==========================================================================
  describe('applyCollapseToPlayer', () => {
    it('deve aplicar CollapseResult ao player', () => {
      const player = createMockPlayer({ lives: 3, resistance: 0 });
      const result = handleCollapse(player, DEFAULT_GAME_CONFIG);
      const updatedPlayer = applyCollapseToPlayer(player, result);

      expect(updatedPlayer.lives).toBe(2);
      expect(updatedPlayer.resistance).toBe(6);
      expect(updatedPlayer.isLastChance).toBe(false);
      expect(updatedPlayer.isEliminated).toBe(false);
    });

    it('deve resetar extraResistance no colapso', () => {
      const player = createMockPlayer({
        lives: 3,
        resistance: 0,
        extraResistance: 5,
      });
      const result = handleCollapse(player, DEFAULT_GAME_CONFIG);
      const updatedPlayer = applyCollapseToPlayer(player, result);

      expect(updatedPlayer.extraResistance).toBe(0);
    });

    it('deve desativar turno ao ser eliminado', () => {
      const player = createMockPlayer({
        lives: 0,
        resistance: 0,
        isLastChance: true,
        isActiveTurn: true,
      });
      const result = handleElimination(player);
      const updatedPlayer = applyCollapseToPlayer(player, result);

      expect(updatedPlayer.isActiveTurn).toBe(false);
      expect(updatedPlayer.isEliminated).toBe(true);
    });

    it('deve retornar player inalterado se collapsed = false', () => {
      const player = createMockPlayer({ lives: 3, resistance: 6 });
      const result = { collapsed: false } as any;
      const updatedPlayer = applyCollapseToPlayer(player, result);

      expect(updatedPlayer).toEqual(player);
    });
  });

  // ==========================================================================
  // T040: validateCollapseState
  // ==========================================================================
  describe('validateCollapseState (T040)', () => {
    it('deve validar estado pos-colapso correto', () => {
      const player = createMockPlayer({
        lives: 2,
        resistance: 6,
        isLastChance: false,
        isEliminated: false,
      });

      expect(validateCollapseState(player)).toBe(true);
    });

    it('deve validar estado de ultima chance correto', () => {
      const player = createMockPlayer({
        lives: 0,
        resistance: 6,
        isLastChance: true,
        isEliminated: false,
      });

      expect(validateCollapseState(player)).toBe(true);
    });

    it('deve validar estado de eliminado correto', () => {
      const player = createMockPlayer({
        lives: 0,
        resistance: 0,
        isLastChance: true,
        isEliminated: true,
        isActiveTurn: false,
      });

      expect(validateCollapseState(player)).toBe(true);
    });
  });

  // ==========================================================================
  // Integration: Full Collapse Sequence
  // ==========================================================================
  describe('Full Collapse Sequence', () => {
    it('deve processar sequencia completa: 3 lives -> 2 -> 1 -> 0 (ultima chance) -> eliminado', () => {
      let player = createMockPlayer({ lives: 3, resistance: 6 });

      // Primeiro colapso: 3 -> 2 lives
      player = { ...player, resistance: 0 };
      let result = processCollapseOrElimination(player, DEFAULT_GAME_CONFIG);
      player = applyCollapseToPlayer(player, result!);
      expect(player.lives).toBe(2);
      expect(player.isLastChance).toBe(false);

      // Segundo colapso: 2 -> 1 lives
      player = { ...player, resistance: 0 };
      result = processCollapseOrElimination(player, DEFAULT_GAME_CONFIG);
      player = applyCollapseToPlayer(player, result!);
      expect(player.lives).toBe(1);
      expect(player.isLastChance).toBe(false);

      // Terceiro colapso: 1 -> 0 lives (ultima chance)
      player = { ...player, resistance: 0 };
      result = processCollapseOrElimination(player, DEFAULT_GAME_CONFIG);
      player = applyCollapseToPlayer(player, result!);
      expect(player.lives).toBe(0);
      expect(player.isLastChance).toBe(true);
      expect(player.isEliminated).toBe(false);

      // Quarto colapso: eliminacao
      player = { ...player, resistance: 0 };
      result = processCollapseOrElimination(player, DEFAULT_GAME_CONFIG);
      player = applyCollapseToPlayer(player, result!);
      expect(player.lives).toBe(0);
      expect(player.isLastChance).toBe(true);
      expect(player.isEliminated).toBe(true);
    });
  });
});

