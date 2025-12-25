/**
 * Vitest Setup File
 *
 * Configuração global para todos os testes
 * Baseado em research.md Decision 9 (Testing Strategy)
 */

import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

// ============================================================================
// Test Utilities
// ============================================================================

/**
 * Helper para criar seed determinístico para testes
 * Garante reprodutibilidade (Constitution Principle III)
 */
export function createTestSeed(testName: string): number {
  let hash = 0;
  for (let i = 0; i < testName.length; i++) {
    const char = testName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Helper para validar determinismo
 * Executa função N vezes com mesmo input, valida output idêntico
 */
export function assertDeterministic<T>(
  fn: () => T,
  iterations: number = 3,
): void {
  const results: T[] = [];

  for (let i = 0; i < iterations; i++) {
    results.push(fn());
  }

  // Todos os resultados devem ser idênticos
  for (let i = 1; i < results.length; i++) {
    expect(results[i]).toEqual(results[0]);
  }
}

// ============================================================================
// Mock Utilities
// ============================================================================

/**
 * Mock de performance.now() para testes determinísticos
 */
export function mockPerformanceNow(startTime: number = 0): () => void {
  let currentTime = startTime;
  const originalNow = performance.now;

  performance.now = () => currentTime;

  // Return cleanup function
  return () => {
    performance.now = originalNow;
  };
}

/**
 * Avançar tempo mockado
 */
export function advanceTime(ms: number): void {
  const current = performance.now();
  performance.now = () => current + ms;
}

// ============================================================================
// Custom Matchers (se necessário no futuro)
// ============================================================================

// Exemplo de custom matcher:
// expect.extend({
//   toBeValidGameState(received) {
//     // validação customizada
//     return {
//       pass: true,
//       message: () => 'Estado válido',
//     };
//   },
// });

// ============================================================================
// Global Test Configuration
// ============================================================================

// Timeout configurado via vitest.config.ts
// Constitution: testes devem ser rápidos (<3s)

