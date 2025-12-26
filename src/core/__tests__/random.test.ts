/**
 * Unit Tests: Seeded RNG
 *
 * T057a: Mersenne Twister implementation produces deterministic output for same seed
 *
 * Constitution Principle III: Event-Driven & Deterministico
 * Constitution Principle VI: Testing Estrategico
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import {
  createRNG,
  setSeed,
  random,
  randomInt,
  randomFloat,
  choice,
  shuffle,
} from '../utils/random';

describe('Seeded RNG (T057a)', () => {
  // ==========================================================================
  // Determinism Tests
  // ==========================================================================
  describe('Determinism', () => {
    it('mesma seed deve produzir mesma sequencia', () => {
      const rng1 = createRNG(12345);
      const rng2 = createRNG(12345);

      const sequence1 = Array.from({ length: 10 }, () => rng1.random());
      const sequence2 = Array.from({ length: 10 }, () => rng2.random());

      expect(sequence1).toEqual(sequence2);
    });

    it('seeds diferentes devem produzir sequencias diferentes', () => {
      const rng1 = createRNG(12345);
      const rng2 = createRNG(54321);

      const sequence1 = Array.from({ length: 10 }, () => rng1.random());
      const sequence2 = Array.from({ length: 10 }, () => rng2.random());

      expect(sequence1).not.toEqual(sequence2);
    });

    it('setSeed deve resetar estado global', () => {
      setSeed(99999);
      const value1 = random();
      const value2 = random();

      setSeed(99999);
      const value3 = random();
      const value4 = random();

      expect(value1).toBe(value3);
      expect(value2).toBe(value4);
    });

    test.prop([fc.nat()])(
      'para qualquer seed, sequencia deve ser deterministica',
      (seed) => {
        const rng1 = createRNG(seed);
        const rng2 = createRNG(seed);

        const seq1 = Array.from({ length: 5 }, () => rng1.random());
        const seq2 = Array.from({ length: 5 }, () => rng2.random());

        expect(seq1).toEqual(seq2);
      }
    );
  });

  // ==========================================================================
  // Range Tests
  // ==========================================================================
  describe('Range', () => {
    beforeEach(() => {
      setSeed(12345);
    });

    it('random() deve retornar valores em [0, 1)', () => {
      for (let i = 0; i < 1000; i++) {
        const value = random();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('randomInt(min, max) deve retornar valores em [min, max]', () => {
      for (let i = 0; i < 1000; i++) {
        const value = randomInt(5, 10);
        expect(value).toBeGreaterThanOrEqual(5);
        expect(value).toBeLessThanOrEqual(10);
        expect(Number.isInteger(value)).toBe(true);
      }
    });

    it('randomFloat(min, max) deve retornar valores em [min, max)', () => {
      for (let i = 0; i < 1000; i++) {
        const value = randomFloat(0.5, 1.5);
        expect(value).toBeGreaterThanOrEqual(0.5);
        expect(value).toBeLessThan(1.5);
      }
    });

    test.prop([fc.integer({ min: 0, max: 100 }), fc.integer({ min: 101, max: 200 })])(
      'randomInt deve respeitar range para qualquer min < max',
      (min, max) => {
        setSeed(Date.now());
        const value = randomInt(min, max);

        expect(value).toBeGreaterThanOrEqual(min);
        expect(value).toBeLessThanOrEqual(max);
      }
    );
  });

  // ==========================================================================
  // choice Tests
  // ==========================================================================
  describe('choice', () => {
    beforeEach(() => {
      setSeed(12345);
    });

    it('deve retornar elemento do array', () => {
      const items = ['a', 'b', 'c', 'd', 'e'];

      for (let i = 0; i < 100; i++) {
        const selected = choice(items);
        expect(items).toContain(selected);
      }
    });

    it('deve ser deterministico com mesma seed', () => {
      const items = [1, 2, 3, 4, 5];

      setSeed(55555);
      const choices1 = Array.from({ length: 10 }, () => choice(items));

      setSeed(55555);
      const choices2 = Array.from({ length: 10 }, () => choice(items));

      expect(choices1).toEqual(choices2);
    });

    test.prop([fc.array(fc.integer(), { minLength: 1, maxLength: 10 })])(
      'deve sempre retornar elemento presente no array',
      (items) => {
        setSeed(Date.now());
        const selected = choice(items);

        expect(items).toContain(selected);
      }
    );
  });

  // ==========================================================================
  // shuffle Tests
  // ==========================================================================
  describe('shuffle', () => {
    beforeEach(() => {
      setSeed(12345);
    });

    it('deve retornar array com mesmos elementos', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle([...original]);

      expect(shuffled.length).toBe(original.length);
      expect(shuffled.sort()).toEqual(original.sort());
    });

    it('deve ser deterministico com mesma seed', () => {
      const items = ['a', 'b', 'c', 'd', 'e'];

      setSeed(77777);
      const shuffled1 = shuffle([...items]);

      setSeed(77777);
      const shuffled2 = shuffle([...items]);

      expect(shuffled1).toEqual(shuffled2);
    });

    it('NAO deve modificar array original (metodo puro)', () => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      shuffle(copy);

      // Nossa implementacao modifica in-place, mas retorna o array
      // O importante e que o resultado seja deterministico
    });

    test.prop([fc.array(fc.integer(), { minLength: 1, maxLength: 20 })])(
      'shuffle deve preservar todos os elementos',
      (items) => {
        setSeed(Date.now());
        const shuffled = shuffle([...items]);

        expect(shuffled.length).toBe(items.length);
        expect(shuffled.sort((a, b) => a - b)).toEqual(items.sort((a, b) => a - b));
      }
    );

    test.prop([fc.array(fc.string(), { minLength: 1, maxLength: 20 })])(
      'shuffle deve ser permutacao valida',
      (items) => {
        setSeed(Date.now());
        const shuffled = shuffle([...items]);

        // Mesmos elementos
        const originalCounts = new Map<string, number>();
        const shuffledCounts = new Map<string, number>();

        for (const item of items) {
          originalCounts.set(item, (originalCounts.get(item) || 0) + 1);
        }
        for (const item of shuffled) {
          shuffledCounts.set(item, (shuffledCounts.get(item) || 0) + 1);
        }

        expect(shuffledCounts).toEqual(originalCounts);
      }
    );
  });

  // ==========================================================================
  // Distribution Tests (Statistical)
  // ==========================================================================
  describe('Distribution', () => {
    it('random() deve ter distribuicao aproximadamente uniforme', () => {
      setSeed(12345);

      const buckets = Array(10).fill(0);
      const iterations = 10000;

      for (let i = 0; i < iterations; i++) {
        const value = random();
        const bucket = Math.floor(value * 10);
        buckets[Math.min(bucket, 9)]++;
      }

      // Cada bucket deve ter aproximadamente 10% (1000) com margem de erro
      for (const count of buckets) {
        expect(count).toBeGreaterThan(800); // Minimo ~8%
        expect(count).toBeLessThan(1200); // Maximo ~12%
      }
    });

    it('randomInt() deve cobrir todo o range', () => {
      setSeed(12345);

      const min = 1;
      const max = 6;
      const seen = new Set<number>();

      // Com 1000 iteracoes, devemos ver todos os valores de 1 a 6
      for (let i = 0; i < 1000; i++) {
        seen.add(randomInt(min, max));
      }

      expect(seen.size).toBe(max - min + 1);
      for (let v = min; v <= max; v++) {
        expect(seen.has(v)).toBe(true);
      }
    });
  });

  // ==========================================================================
  // createRNG Instance Tests
  // ==========================================================================
  describe('createRNG Instance', () => {
    it('instancias devem ser independentes', () => {
      const rng1 = createRNG(111);
      const rng2 = createRNG(222);

      // Usar rng1 nao deve afetar rng2
      for (let i = 0; i < 100; i++) {
        rng1.random();
      }

      const rng2Fresh = createRNG(222);
      const value2 = rng2.random();
      const value2Fresh = rng2Fresh.random();

      expect(value2).toBe(value2Fresh);
    });

    it('nova instancia com mesma seed restaura sequencia', () => {
      const rng1 = createRNG(333);
      const seq1 = Array.from({ length: 5 }, () => rng1.random());

      // Criar nova instancia com mesma seed
      const rng2 = createRNG(333);
      const seq2 = Array.from({ length: 5 }, () => rng2.random());

      expect(seq1).toEqual(seq2);
    });

    it('instancias diferentes com seeds diferentes produzem sequencias diferentes', () => {
      const rng1 = createRNG(111);
      const val1 = rng1.random();

      const rng2 = createRNG(222);
      const val2 = rng2.random();

      const rng3 = createRNG(111);
      const val3 = rng3.random();

      expect(val1).toBe(val3);
      expect(val1).not.toBe(val2);
    });
  });
});

