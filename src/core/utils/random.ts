/**
 * Seeded Random Number Generator (RNG)
 *
 * Implementação de Mersenne Twister (MT19937) simplificado
 * Garante determinismo: mesma seed → mesma sequência
 * Constitution Principle III: Determinístico
 */

// ============================================================================
// Mersenne Twister (MT19937) Implementation
// ============================================================================

class SeededRNG {
  private MT: number[] = [];
  private index: number = 624;
  private readonly N = 624;
  private readonly M = 397;
  private readonly MATRIX_A = 0x9908b0df;
  private readonly UPPER_MASK = 0x80000000;
  private readonly LOWER_MASK = 0x7fffffff;

  constructor(seed: number) {
    this.MT[0] = seed >>> 0;
    for (let i = 1; i < this.N; i++) {
      const s = this.MT[i - 1] ^ (this.MT[i - 1] >>> 30);
      this.MT[i] =
        ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
        (s & 0x0000ffff) * 1812433253 +
        i;
      this.MT[i] >>>= 0;
    }
  }

  /**
   * Gera próximo número aleatório (32-bit unsigned integer)
   */
  private next(): number {
    if (this.index >= this.N) {
      this.twist();
    }

    let y = this.MT[this.index++];

    // Tempering
    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;

    return y >>> 0;
  }

  private twist(): void {
    for (let i = 0; i < this.N; i++) {
      const x =
        (this.MT[i] & this.UPPER_MASK) + (this.MT[(i + 1) % this.N] & this.LOWER_MASK);
      let xA = x >>> 1;
      if (x % 2 !== 0) {
        xA ^= this.MATRIX_A;
      }
      this.MT[i] = this.MT[(i + this.M) % this.N] ^ xA;
    }
    this.index = 0;
  }

  /**
   * Gera número float entre 0 (inclusive) e 1 (exclusive)
   */
  public random(): number {
    return this.next() / 0x100000000;
  }

  /**
   * Gera inteiro entre min (inclusive) e max (inclusive)
   */
  public randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /**
   * Gera float entre min (inclusive) e max (exclusive)
   */
  public randomFloat(min: number, max: number): number {
    return this.random() * (max - min) + min;
  }

  /**
   * Escolhe elemento aleatório de um array
   */
  public choice<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot choose from empty array');
    }
    return array[this.randomInt(0, array.length - 1)];
  }

  /**
   * Embaralha array (Fisher-Yates shuffle)
   */
  public shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.randomInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// ============================================================================
// Global Instance (pode ser re-seeded)
// ============================================================================

let globalRNG: SeededRNG = new SeededRNG(Date.now());

/**
 * Define seed global para RNG
 * Usado em testes para garantir determinismo
 */
export function setSeed(seed: number): void {
  globalRNG = new SeededRNG(seed);
}

/**
 * Cria RNG independente com seed específica
 * Útil para isolar decisões (ex: bot AI)
 */
export function createRNG(seed: number): SeededRNG {
  return new SeededRNG(seed);
}

/**
 * Gera número float entre 0 e 1
 */
export function random(): number {
  return globalRNG.random();
}

/**
 * Gera inteiro entre min e max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return globalRNG.randomInt(min, max);
}

/**
 * Gera float entre min e max (exclusive)
 */
export function randomFloat(min: number, max: number): number {
  return globalRNG.randomFloat(min, max);
}

/**
 * Escolhe elemento aleatório de array
 */
export function choice<T>(array: T[]): T {
  return globalRNG.choice(array);
}

/**
 * Embaralha array (retorna cópia)
 */
export function shuffle<T>(array: T[]): T[] {
  return globalRNG.shuffle(array);
}

// ============================================================================
// Export SeededRNG class for direct use
// ============================================================================

export { SeededRNG };

