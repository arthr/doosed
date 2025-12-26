/**
 * Unit Tests: Pool Generator
 *
 * T029a: calculatePoolSize - size progression (base 6, +1 per 3 rounds, cap 12)
 * T030a: calculateDistribution - linear interpolation
 * T032a: generatePool - correct size, distribution, shape diversity
 *
 * Constitution Principle VI: Testing Estrategico
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculatePoolSize,
  calculateDistribution,
  getUnlockedShapes,
  generatePool,
  validatePool,
} from '../pool-generator';
import { DEFAULT_GAME_CONFIG } from '../../config/game-config';
import { PillType } from '../../types/pill';
import { setSeed } from '../utils/random';

describe('Pool Generator', () => {
  beforeEach(() => {
    // Reset RNG com seed fixa para reproducibilidade
    setSeed(12345);
  });

  // ==========================================================================
  // T029a: calculatePoolSize
  // ==========================================================================
  describe('calculatePoolSize (T029a)', () => {
    it('deve retornar tamanho base 6 para rodada 1', () => {
      const size = calculatePoolSize(1, DEFAULT_GAME_CONFIG);
      expect(size).toBe(6);
    });

    it('deve retornar tamanho base 6 para rodadas 1-3', () => {
      expect(calculatePoolSize(1, DEFAULT_GAME_CONFIG)).toBe(6);
      expect(calculatePoolSize(2, DEFAULT_GAME_CONFIG)).toBe(6);
      expect(calculatePoolSize(3, DEFAULT_GAME_CONFIG)).toBe(6);
    });

    it('deve incrementar +1 a cada 3 rodadas', () => {
      // Rodadas 4-6: size 7
      expect(calculatePoolSize(4, DEFAULT_GAME_CONFIG)).toBe(7);
      expect(calculatePoolSize(5, DEFAULT_GAME_CONFIG)).toBe(7);
      expect(calculatePoolSize(6, DEFAULT_GAME_CONFIG)).toBe(7);

      // Rodadas 7-9: size 8
      expect(calculatePoolSize(7, DEFAULT_GAME_CONFIG)).toBe(8);
      expect(calculatePoolSize(8, DEFAULT_GAME_CONFIG)).toBe(8);
      expect(calculatePoolSize(9, DEFAULT_GAME_CONFIG)).toBe(8);

      // Rodadas 10-12: size 9
      expect(calculatePoolSize(10, DEFAULT_GAME_CONFIG)).toBe(9);
      expect(calculatePoolSize(11, DEFAULT_GAME_CONFIG)).toBe(9);
      expect(calculatePoolSize(12, DEFAULT_GAME_CONFIG)).toBe(9);
    });

    it('deve respeitar cap de 12 pills para rodadas altas', () => {
      expect(calculatePoolSize(20, DEFAULT_GAME_CONFIG)).toBe(12);
      expect(calculatePoolSize(50, DEFAULT_GAME_CONFIG)).toBe(12);
      expect(calculatePoolSize(100, DEFAULT_GAME_CONFIG)).toBe(12);
    });

    it('deve retornar valores dentro do range [6, 12] para qualquer rodada', () => {
      for (let round = 1; round <= 100; round++) {
        const size = calculatePoolSize(round, DEFAULT_GAME_CONFIG);
        expect(size).toBeGreaterThanOrEqual(6);
        expect(size).toBeLessThanOrEqual(12);
      }
    });
  });

  // ==========================================================================
  // T030a: calculateDistribution
  // ==========================================================================
  describe('calculateDistribution (T030a)', () => {
    it('deve retornar distribuicao com todos os 6 tipos de pill', () => {
      const distribution = calculateDistribution(10, DEFAULT_GAME_CONFIG);
      
      expect(distribution).toHaveProperty(PillType.SAFE);
      expect(distribution).toHaveProperty(PillType.DMG_LOW);
      expect(distribution).toHaveProperty(PillType.DMG_HIGH);
      expect(distribution).toHaveProperty(PillType.HEAL);
      expect(distribution).toHaveProperty(PillType.FATAL);
      expect(distribution).toHaveProperty(PillType.LIFE);
    });

    it('deve retornar distribuicao normalizada (soma = 1.0)', () => {
      for (let round = 1; round <= 20; round++) {
        const distribution = calculateDistribution(round, DEFAULT_GAME_CONFIG);
        const total = Object.values(distribution).reduce((sum, p) => sum + p, 0);
        
        // Tolerancia para floating point
        expect(total).toBeCloseTo(1.0, 5);
      }
    });

    it('deve retornar 0% para tipos ainda nao desbloqueados', () => {
      // Rodada 1: DMG_HIGH (unlock R3), FATAL (R6), LIFE (R5) devem ser 0
      const dist1 = calculateDistribution(1, DEFAULT_GAME_CONFIG);
      expect(dist1[PillType.DMG_HIGH]).toBe(0);
      expect(dist1[PillType.FATAL]).toBe(0);
      expect(dist1[PillType.LIFE]).toBe(0);

      // Rodada 2: HEAL desbloqueado
      const dist2 = calculateDistribution(2, DEFAULT_GAME_CONFIG);
      expect(dist2[PillType.HEAL]).toBeGreaterThan(0);
    });

    it('deve interpolar linearmente entre initial e final percentages', () => {
      const distInitial = calculateDistribution(1, DEFAULT_GAME_CONFIG);
      const distFinal = calculateDistribution(10, DEFAULT_GAME_CONFIG);

      // SAFE deve diminuir (45% inicial -> 15% final)
      expect(distInitial[PillType.SAFE]).toBeGreaterThan(distFinal[PillType.SAFE]);

      // DMG_LOW deve diminuir (40% inicial -> 20% final)
      expect(distInitial[PillType.DMG_LOW]).toBeGreaterThan(distFinal[PillType.DMG_LOW]);
    });
  });

  // ==========================================================================
  // T031: getUnlockedShapes
  // ==========================================================================
  describe('getUnlockedShapes', () => {
    it('deve retornar shapes base desbloqueadas na rodada 1', () => {
      const shapes = getUnlockedShapes(1, DEFAULT_GAME_CONFIG);
      
      // Rodada 1 deve ter pelo menos as shapes com unlockRound = 1
      expect(shapes.length).toBeGreaterThanOrEqual(11); // 11 shapes com unlockRound = 1
      
      // Verificar algumas shapes especificas
      const shapeIds = shapes.map((s) => s.id);
      expect(shapeIds).toContain('capsule');
      expect(shapeIds).toContain('round');
      expect(shapeIds).toContain('heart');
    });

    it('deve desbloquear shapes progressivamente', () => {
      const shapes1 = getUnlockedShapes(1, DEFAULT_GAME_CONFIG);
      const shapes3 = getUnlockedShapes(3, DEFAULT_GAME_CONFIG);
      const shapes8 = getUnlockedShapes(8, DEFAULT_GAME_CONFIG);

      // Mais shapes conforme rodadas avancam
      expect(shapes3.length).toBeGreaterThanOrEqual(shapes1.length);
      expect(shapes8.length).toBeGreaterThanOrEqual(shapes3.length);

      // Rodada 3+ deve ter pumpkin e skull
      const shapeIds3 = shapes3.map((s) => s.id);
      expect(shapeIds3).toContain('pumpkin');
      expect(shapeIds3).toContain('skull');
    });

    it('nao deve incluir shapes sazonais desabilitadas', () => {
      const shapes = getUnlockedShapes(10, DEFAULT_GAME_CONFIG);
      const shapeIds = shapes.map((s) => s.id);

      // Shapes sazonais estao desabilitadas por padrao
      expect(shapeIds).not.toContain('christmas-tree');
      expect(shapeIds).not.toContain('snowflake');
    });
  });

  // ==========================================================================
  // T032a: generatePool
  // ==========================================================================
  describe('generatePool (T032a)', () => {
    it('deve gerar pool com tamanho correto', () => {
      const pool = generatePool(1, DEFAULT_GAME_CONFIG);
      
      expect(pool.size).toBe(6);
      expect(pool.pills.length).toBe(6);
    });

    it('deve gerar pool com roundNumber correto', () => {
      const pool = generatePool(5, DEFAULT_GAME_CONFIG);
      expect(pool.roundNumber).toBe(5);
    });

    it('deve gerar pool com pelo menos 3 shapes diferentes (min diversity)', () => {
      // Testar multiplas vezes para cobrir variancia
      for (let i = 0; i < 10; i++) {
        setSeed(12345 + i);
        const pool = generatePool(1, DEFAULT_GAME_CONFIG);
        
        const uniqueShapes = new Set(pool.pills.map((p) => p.shape));
        expect(uniqueShapes.size).toBeGreaterThanOrEqual(3);
      }
    });

    it('deve gerar pool com distribuicao dentro de +/-5% da configurada', () => {
      // Usar pool maior para ter distribuicao mais precisa
      setSeed(99999);
      const pool = generatePool(10, DEFAULT_GAME_CONFIG); // size 9

      // Contar tipos
      const counters: Record<string, number> = {};
      for (const pill of pool.pills) {
        counters[pill.type] = (counters[pill.type] || 0) + 1;
      }

      // Validar via funcao existente
      const isValid = validatePool(pool);
      expect(isValid).toBe(true);
    });

    it('deve gerar pills com IDs unicos', () => {
      const pool = generatePool(1, DEFAULT_GAME_CONFIG);
      
      const ids = pool.pills.map((p) => p.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(pool.pills.length);
    });

    it('deve gerar pills com positions sequenciais', () => {
      const pool = generatePool(1, DEFAULT_GAME_CONFIG);
      
      const positions = pool.pills.map((p) => p.position).sort((a, b) => a - b);
      
      for (let i = 0; i < positions.length; i++) {
        expect(positions[i]).toBe(i);
      }
    });

    it('deve gerar pills com state AVAILABLE', () => {
      const pool = generatePool(1, DEFAULT_GAME_CONFIG);
      
      for (const pill of pool.pills) {
        expect(pill.state).toBe('AVAILABLE');
      }
    });

    it('deve gerar pills sem modifiers iniciais', () => {
      const pool = generatePool(1, DEFAULT_GAME_CONFIG);
      
      for (const pill of pool.pills) {
        expect(pill.modifiers).toEqual([]);
      }
    });

    it('deve gerar pills nao reveladas', () => {
      const pool = generatePool(1, DEFAULT_GAME_CONFIG);
      
      for (const pill of pool.pills) {
        expect(pill.isRevealed).toBe(false);
      }
    });

    it('deve inicializar revealed array vazio', () => {
      const pool = generatePool(1, DEFAULT_GAME_CONFIG);
      expect(pool.revealed).toEqual([]);
    });

    it('deve inicializar counters com contagem por tipo', () => {
      const pool = generatePool(1, DEFAULT_GAME_CONFIG);
      
      // Somar counters deve dar o total de pills
      const totalFromCounters = Object.values(pool.counters).reduce(
        (sum, count) => sum + count,
        0
      );
      expect(totalFromCounters).toBe(pool.pills.length);
    });

    it('deve incluir unlockedShapes no pool', () => {
      const pool = generatePool(1, DEFAULT_GAME_CONFIG);
      
      expect(pool.unlockedShapes.length).toBeGreaterThan(0);
      expect(pool.unlockedShapes).toContain('capsule');
    });
  });

  // ==========================================================================
  // T033: validatePool
  // ==========================================================================
  describe('validatePool (T033)', () => {
    it('deve validar pool gerado corretamente', () => {
      const pool = generatePool(1, DEFAULT_GAME_CONFIG);
      expect(validatePool(pool)).toBe(true);
    });

    it('deve validar pools de diferentes rodadas', () => {
      for (let round = 1; round <= 15; round++) {
        setSeed(round * 1000);
        const pool = generatePool(round, DEFAULT_GAME_CONFIG);
        expect(validatePool(pool)).toBe(true);
      }
    });
  });
});

