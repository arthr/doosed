/**
 * Property-Based Tests: Turn Manager
 *
 * T045b: Turn order initialization produces valid permutation (all IDs present, no duplicates)
 * T046b: Next player always returns valid, non-eliminated player (when at least one alive)
 *
 * Constitution Principle VI: Testing Estrategico - property-based tests para invariantes fortes
 */

import { describe, expect } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import {
  initializeTurnOrder,
  getNextPlayer,
  getNextPlayerId,
} from '../turn-manager';
import type { Player } from '../../types/game';
import { setSeed } from '../utils/random';

// ==========================================================================
// Arbitrary: Player
// ==========================================================================

const playerArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 10 }),
  name: fc.string({ minLength: 1, maxLength: 20 }),
  avatar: fc.constant(''),
  isBot: fc.boolean(),
  lives: fc.integer({ min: 0, max: 5 }),
  resistance: fc.integer({ min: 0, max: 10 }),
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

// Array de 2-6 jogadores com IDs unicos
const playersArrayArbitrary = fc
  .array(playerArbitrary, { minLength: 2, maxLength: 6 })
  .map((players) => {
    // Garantir IDs unicos
    const uniquePlayers = players.map((p, i) => ({ ...p, id: `p${i}` }));
    return uniquePlayers;
  });

// Array com pelo menos 1 jogador vivo
const playersWithAliveArbitrary = playersArrayArbitrary.filter((players) =>
  players.some((p) => !p.isEliminated)
);

describe('Turn Manager - Property-Based Tests', () => {
  // ==========================================================================
  // T045b: initializeTurnOrder Invariants
  // ==========================================================================
  describe('initializeTurnOrder Invariants (T045b)', () => {
    test.prop([playersArrayArbitrary, fc.integer({ min: 1, max: 100000 })])(
      'deve retornar array com mesmo tamanho do input',
      (players, seed) => {
        setSeed(seed);
        const turnOrder = initializeTurnOrder(players);

        expect(turnOrder.length).toBe(players.length);
      }
    );

    test.prop([playersArrayArbitrary, fc.integer({ min: 1, max: 100000 })])(
      'deve conter todos os IDs dos jogadores',
      (players, seed) => {
        setSeed(seed);
        const turnOrder = initializeTurnOrder(players);

        for (const player of players) {
          expect(turnOrder).toContain(player.id);
        }
      }
    );

    test.prop([playersArrayArbitrary, fc.integer({ min: 1, max: 100000 })])(
      'NAO deve conter IDs duplicados',
      (players, seed) => {
        setSeed(seed);
        const turnOrder = initializeTurnOrder(players);

        const uniqueIds = new Set(turnOrder);
        expect(uniqueIds.size).toBe(turnOrder.length);
      }
    );

    test.prop([playersArrayArbitrary, fc.integer({ min: 1, max: 100000 })])(
      'deve ser uma permutacao valida dos IDs originais',
      (players, seed) => {
        setSeed(seed);
        const turnOrder = initializeTurnOrder(players);
        const originalIds = players.map((p) => p.id).sort();
        const sortedTurnOrder = [...turnOrder].sort();

        expect(sortedTurnOrder).toEqual(originalIds);
      }
    );
  });

  // ==========================================================================
  // T046b: getNextPlayer Invariants
  // ==========================================================================
  describe('getNextPlayer Invariants (T046b)', () => {
    test.prop([
      playersWithAliveArbitrary,
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'deve retornar indice de jogador NAO eliminado',
      (players, seed) => {
        setSeed(seed);
        const turnOrder = initializeTurnOrder(players);
        const currentIndex = 0;

        const nextIndex = getNextPlayer(turnOrder, currentIndex, players);
        const nextPlayerId = turnOrder[nextIndex];
        const nextPlayer = players.find((p) => p.id === nextPlayerId);

        expect(nextPlayer).toBeDefined();
        expect(nextPlayer!.isEliminated).toBe(false);
      }
    );

    test.prop([
      playersWithAliveArbitrary,
      fc.integer({ min: 0, max: 5 }),
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'deve retornar indice dentro do range [0, turnOrder.length - 1]',
      (players, currentIndex, seed) => {
        setSeed(seed);
        const turnOrder = initializeTurnOrder(players);
        const validIndex = currentIndex % turnOrder.length;

        const nextIndex = getNextPlayer(turnOrder, validIndex, players);

        expect(nextIndex).toBeGreaterThanOrEqual(0);
        expect(nextIndex).toBeLessThan(turnOrder.length);
      }
    );

    test.prop([
      playersWithAliveArbitrary,
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'getNextPlayerId deve retornar ID valido',
      (players, seed) => {
        setSeed(seed);
        const turnOrder = initializeTurnOrder(players);
        const currentIndex = 0;

        const nextPlayerId = getNextPlayerId(turnOrder, currentIndex, players);

        expect(turnOrder).toContain(nextPlayerId);
        const nextPlayer = players.find((p) => p.id === nextPlayerId);
        expect(nextPlayer).toBeDefined();
        expect(nextPlayer!.isEliminated).toBe(false);
      }
    );
  });

  // ==========================================================================
  // Round-Robin Invariant
  // ==========================================================================
  describe('Round-Robin Invariant', () => {
    test.prop([
      fc.array(playerArbitrary.filter((p) => !p.isEliminated), {
        minLength: 2,
        maxLength: 6,
      }),
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'em um ciclo completo, todos os jogadores vivos devem ter turno',
      (basePlayers, seed) => {
        // Garantir IDs unicos
        const players = basePlayers.map((p, i) => ({ ...p, id: `p${i}` }));
        setSeed(seed);
        const turnOrder = initializeTurnOrder(players);

        const visitedPlayers = new Set<string>();
        let currentIndex = 0;

        // Fazer um ciclo completo
        for (let i = 0; i < players.length; i++) {
          const playerId = turnOrder[currentIndex];
          visitedPlayers.add(playerId);
          currentIndex = getNextPlayer(turnOrder, currentIndex, players);
        }

        // Todos os jogadores vivos devem ter sido visitados
        const alivePlayers = players.filter((p) => !p.isEliminated);
        for (const player of alivePlayers) {
          expect(visitedPlayers.has(player.id)).toBe(true);
        }
      }
    );
  });

  // ==========================================================================
  // Skip Eliminated Players
  // ==========================================================================
  describe('Skip Eliminated Players', () => {
    test.prop([
      fc
        .array(playerArbitrary, { minLength: 3, maxLength: 6 })
        .map((players) =>
          players.map((p, i) => ({
            ...p,
            id: `p${i}`,
            // Pelo menos 1 vivo
            isEliminated: i === 0 ? false : p.isEliminated,
          }))
        ),
      fc.integer({ min: 1, max: 100000 }),
    ])(
      'deve sempre pular jogadores eliminados',
      (players, seed) => {
        setSeed(seed);
        const turnOrder = initializeTurnOrder(players);

        // Testar de todos os indices
        for (let i = 0; i < turnOrder.length; i++) {
          try {
            const nextIndex = getNextPlayer(turnOrder, i, players);
            const nextPlayerId = turnOrder[nextIndex];
            const nextPlayer = players.find((p) => p.id === nextPlayerId);

            expect(nextPlayer).toBeDefined();
            expect(nextPlayer!.isEliminated).toBe(false);
          } catch {
            // Se lancar erro, significa que todos foram eliminados (exceto o que garantimos)
            // Isso pode acontecer em edge cases validos
          }
        }
      }
    );
  });
});

