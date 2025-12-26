/**
 * Property-Based Tests: Collapse Handler
 *
 * T038b: Collapse sempre resulta em lives >= 0, resistance = 6 (reset)
 *
 * Constitution Principle VI: Testing Estrategico - property-based tests para invariantes fortes
 */

import { describe, expect } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import {
  handleCollapse,
  handleElimination,
  processCollapseOrElimination,
  applyCollapseToPlayer,
  validateCollapseState,
} from '../collapse-handler';
import type { Player } from '../../types/game';
import { DEFAULT_GAME_CONFIG } from '../../config/game-config';

// ==========================================================================
// Arbitrary: Player
// ==========================================================================

const playerArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 10 }),
  name: fc.string({ minLength: 1, maxLength: 20 }),
  avatar: fc.constant(''),
  isBot: fc.boolean(),
  lives: fc.integer({ min: 0, max: 5 }),
  maxLives: fc.constant(3),
  resistance: fc.integer({ min: -10, max: 10 }),
  resistanceCap: fc.constant(6),
  extraResistance: fc.integer({ min: 0, max: 6 }),
  inventory: fc.constant([]),
  pillCoins: fc.integer({ min: 0, max: 1000 }),
  activeStatuses: fc.constant([]),
  isEliminated: fc.boolean(),
  isLastChance: fc.boolean(),
  isActiveTurn: fc.boolean(),
  totalCollapses: fc.integer({ min: 0, max: 20 }),
  shapeQuest: fc.constant(null),
  wantsShop: fc.constant(false),
}) as fc.Arbitrary<Player>;

// Player que precisa colapsar (resistance <= 0, nao eliminado)
const collapsingPlayerArbitrary = playerArbitrary.filter(
  (p) => p.resistance <= 0 && !p.isEliminated && p.lives > 0
);

// Player em ultima chance
const lastChancePlayerArbitrary = playerArbitrary.filter(
  (p) => p.resistance <= 0 && p.isLastChance && !p.isEliminated
);

describe('Collapse Handler - Property-Based Tests', () => {
  // ==========================================================================
  // T038b: Collapse Invariants
  // ==========================================================================
  describe('Collapse Invariants (T038b)', () => {
    test.prop([collapsingPlayerArbitrary])(
      'apos colapso, lives deve ser >= 0',
      (player) => {
        const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

        expect(result.newLives).toBeGreaterThanOrEqual(0);
      }
    );

    test.prop([collapsingPlayerArbitrary])(
      'apos colapso, resistance deve ser resetada para 6',
      (player) => {
        const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

        expect(result.newResistance).toBe(6);
      }
    );

    test.prop([collapsingPlayerArbitrary])(
      'apos colapso, collapsed deve ser true',
      (player) => {
        const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

        expect(result.collapsed).toBe(true);
      }
    );

    test.prop([collapsingPlayerArbitrary])(
      'apos colapso, totalCollapses deve incrementar em 1',
      (player) => {
        const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

        expect(result.totalCollapses).toBe(player.totalCollapses + 1);
      }
    );

    test.prop([collapsingPlayerArbitrary])(
      'apos colapso, lives deve decrementar em 1',
      (player) => {
        const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

        expect(result.newLives).toBe(Math.max(0, player.lives - 1));
      }
    );

    test.prop([collapsingPlayerArbitrary])(
      'apos colapso, isLastChance deve ser true se newLives == 0',
      (player) => {
        const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

        if (result.newLives === 0) {
          expect(result.isLastChance).toBe(true);
        }
      }
    );

    test.prop([collapsingPlayerArbitrary])(
      'colapso normal NAO deve eliminar jogador',
      (player) => {
        const result = handleCollapse(player, DEFAULT_GAME_CONFIG);

        expect(result.isEliminated).toBe(false);
      }
    );
  });

  // ==========================================================================
  // Elimination Invariants
  // ==========================================================================
  describe('Elimination Invariants', () => {
    test.prop([lastChancePlayerArbitrary])(
      'eliminacao deve marcar isEliminated como true',
      (player) => {
        const result = handleElimination(player);

        expect(result.isEliminated).toBe(true);
      }
    );

    test.prop([lastChancePlayerArbitrary])(
      'eliminacao deve manter isLastChance como true',
      (player) => {
        const result = handleElimination(player);

        expect(result.isLastChance).toBe(true);
      }
    );

    test.prop([lastChancePlayerArbitrary])(
      'eliminacao deve setar resistance para 0',
      (player) => {
        const result = handleElimination(player);

        expect(result.newResistance).toBe(0);
      }
    );
  });

  // ==========================================================================
  // Apply Collapse Invariants
  // ==========================================================================
  describe('Apply Collapse Invariants', () => {
    test.prop([collapsingPlayerArbitrary])(
      'applyCollapseToPlayer deve produzir estado valido',
      (player) => {
        const result = handleCollapse(player, DEFAULT_GAME_CONFIG);
        const updatedPlayer = applyCollapseToPlayer(player, result);

        expect(validateCollapseState(updatedPlayer)).toBe(true);
      }
    );

    test.prop([collapsingPlayerArbitrary])(
      'applyCollapseToPlayer deve resetar extraResistance para 0',
      (player) => {
        const result = handleCollapse(player, DEFAULT_GAME_CONFIG);
        const updatedPlayer = applyCollapseToPlayer(player, result);

        expect(updatedPlayer.extraResistance).toBe(0);
      }
    );
  });

  // ==========================================================================
  // processCollapseOrElimination
  // ==========================================================================
  describe('processCollapseOrElimination', () => {
    test.prop([playerArbitrary.filter((p) => p.resistance > 0)])(
      'NAO deve processar colapso se resistance > 0',
      (player) => {
        const result = processCollapseOrElimination(player, DEFAULT_GAME_CONFIG);

        expect(result).toBeNull();
      }
    );

    test.prop([collapsingPlayerArbitrary])(
      'deve processar colapso se resistance <= 0 e lives > 0',
      (player) => {
        const result = processCollapseOrElimination(player, DEFAULT_GAME_CONFIG);

        expect(result).not.toBeNull();
        expect(result!.collapsed).toBe(true);
      }
    );
  });

  // ==========================================================================
  // Full Sequence Invariant
  // ==========================================================================
  describe('Full Sequence Invariant', () => {
    test.prop([fc.integer({ min: 1, max: 5 })])(
      'sequencia de colapsos deve eventualmente eliminar jogador',
      (initialLives) => {
        let player: Player = {
          id: 'test',
          name: 'Test',
          avatar: '',
          isBot: false,
          lives: initialLives,
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
        };

        let collapseCount = 0;
        const maxIterations = initialLives + 2; // Seguranca contra loop infinito

        while (!player.isEliminated && collapseCount < maxIterations) {
          // Simular dano
          player = { ...player, resistance: 0 };

          const result = processCollapseOrElimination(player, DEFAULT_GAME_CONFIG);
          if (result) {
            player = applyCollapseToPlayer(player, result);
            collapseCount++;
          } else {
            break;
          }
        }

        // Apos initialLives + 1 colapsos, jogador deve estar eliminado
        expect(player.isEliminated).toBe(true);
        expect(collapseCount).toBe(initialLives + 1);
      }
    );
  });
});

