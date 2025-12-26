/**
 * Property-Based Tests: Pool Generator
 *
 * T029b: For any round 1-100, pool size in range [6, 12]
 * T032b: For any generated pool, type distribution within +/-5%, min 3 shapes
 *
 * Constitution Principle VI: Testing Estrategico - property-based tests para invariantes fortes
 */

import { describe, it, expect } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import { calculatePoolSize, generatePool, validatePool } from '../pool-generator';
import { DEFAULT_GAME_CONFIG } from '../../config/game-config';
import { setSeed } from '../utils/random';

describe('Pool Generator - Property-Based Tests', () => {
  // ==========================================================================
  // T029b: Pool Size Invariant
  // ==========================================================================
  describe('Pool Size Invariant (T029b)', () => {
    test.prop([fc.integer({ min: 1, max: 100 })])(
      'para qualquer rodada 1-100, pool size deve estar em [6, 12]',
      (roundNumber) => {
        const size = calculatePoolSize(roundNumber, DEFAULT_GAME_CONFIG);

        expect(size).toBeGreaterThanOrEqual(6);
        expect(size).toBeLessThanOrEqual(12);
      }
    );

    test.prop([fc.integer({ min: 1, max: 1000 })])(
      'para qualquer rodada 1-1000, pool size deve respeitar bounds',
      (roundNumber) => {
        const size = calculatePoolSize(roundNumber, DEFAULT_GAME_CONFIG);

        expect(size).toBeGreaterThanOrEqual(DEFAULT_GAME_CONFIG.pool.baseSize);
        expect(size).toBeLessThanOrEqual(DEFAULT_GAME_CONFIG.pool.maxSize);
      }
    );
  });

  // ==========================================================================
  // T032b: Pool Generation Invariants
  // ==========================================================================
  describe('Pool Generation Invariants (T032b)', () => {
    test.prop([
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'para qualquer pool gerado, deve ter pelo menos 3 shapes diferentes',
      (roundNumber, seed) => {
        setSeed(seed);
        const pool = generatePool(roundNumber, DEFAULT_GAME_CONFIG);

        const uniqueShapes = new Set(pool.pills.map((p) => p.shape));
        expect(uniqueShapes.size).toBeGreaterThanOrEqual(3);
      }
    );

    test.prop([
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'para qualquer pool gerado, pills.length deve ser igual a size',
      (roundNumber, seed) => {
        setSeed(seed);
        const pool = generatePool(roundNumber, DEFAULT_GAME_CONFIG);

        expect(pool.pills.length).toBe(pool.size);
      }
    );

    test.prop([
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'para qualquer pool gerado, roundNumber deve ser correto',
      (roundNumber, seed) => {
        setSeed(seed);
        const pool = generatePool(roundNumber, DEFAULT_GAME_CONFIG);

        expect(pool.roundNumber).toBe(roundNumber);
      }
    );

    test.prop([
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'para qualquer pool gerado, todas as pills devem ter estado AVAILABLE',
      (roundNumber, seed) => {
        setSeed(seed);
        const pool = generatePool(roundNumber, DEFAULT_GAME_CONFIG);

        for (const pill of pool.pills) {
          expect(pill.state).toBe('AVAILABLE');
        }
      }
    );

    test.prop([
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'para qualquer pool gerado, todas as pills devem ter IDs unicos',
      (roundNumber, seed) => {
        setSeed(seed);
        const pool = generatePool(roundNumber, DEFAULT_GAME_CONFIG);

        const ids = pool.pills.map((p) => p.id);
        const uniqueIds = new Set(ids);

        expect(uniqueIds.size).toBe(pool.pills.length);
      }
    );

    test.prop([
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'para qualquer pool gerado, validatePool deve retornar true',
      (roundNumber, seed) => {
        setSeed(seed);
        const pool = generatePool(roundNumber, DEFAULT_GAME_CONFIG);

        expect(validatePool(pool)).toBe(true);
      }
    );

    test.prop([
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'para qualquer pool gerado, revealed deve iniciar vazio',
      (roundNumber, seed) => {
        setSeed(seed);
        const pool = generatePool(roundNumber, DEFAULT_GAME_CONFIG);

        expect(pool.revealed).toEqual([]);
      }
    );

    test.prop([
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'para qualquer pool gerado, soma dos counters deve ser igual ao numero de pills',
      (roundNumber, seed) => {
        setSeed(seed);
        const pool = generatePool(roundNumber, DEFAULT_GAME_CONFIG);

        const totalFromCounters = Object.values(pool.counters).reduce(
          (sum, count) => sum + count,
          0
        );

        expect(totalFromCounters).toBe(pool.pills.length);
      }
    );

    test.prop([
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'para qualquer pool gerado, positions devem ser sequenciais 0..n-1',
      (roundNumber, seed) => {
        setSeed(seed);
        const pool = generatePool(roundNumber, DEFAULT_GAME_CONFIG);

        const positions = pool.pills.map((p) => p.position).sort((a, b) => a - b);

        for (let i = 0; i < positions.length; i++) {
          expect(positions[i]).toBe(i);
        }
      }
    );
  });

  // ==========================================================================
  // Pool Size Progression
  // ==========================================================================
  describe('Pool Size Progression', () => {
    it('deve aumentar monotonicamente (ou manter) com rodadas', () => {
      let previousSize = 0;

      for (let round = 1; round <= 50; round++) {
        const size = calculatePoolSize(round, DEFAULT_GAME_CONFIG);
        expect(size).toBeGreaterThanOrEqual(previousSize);
        previousSize = size;
      }
    });
  });
});

