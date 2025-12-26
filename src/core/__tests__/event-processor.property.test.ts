/**
 * Property-Based Tests: Event Processor
 *
 * T052b: Determinism - same initial state + same events = identical final state
 *
 * Constitution Principle III: Event-Driven & Deterministico
 * Constitution Principle VI: Testing Estrategico
 */

import { describe, expect } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import {
  processEvent,
  processEventSequence,
  testDeterminism,
} from '../event-processor';
import {
  EventType,
  type GameEvent,
  type TurnStartedEvent,
  type PillConsumedEvent,
  type MatchEndedEvent,
} from '../../types/events';
import type { Match, Player } from '../../types/game';
import { MatchPhase } from '../../types/game';
import { PillType, PillModifier } from '../../types/pill';

// ==========================================================================
// Arbitrary: Base Event
// ==========================================================================

function createBaseEvent(): Omit<GameEvent, 'type'> {
  return {
    timestamp: performance.now(),
    matchId: 'match-1',
    roundNumber: 1,
    turnIndex: 0,
  };
}

const pillTypeArbitrary = fc.constantFrom(
  PillType.SAFE,
  PillType.DMG_LOW,
  PillType.DMG_HIGH,
  PillType.HEAL,
  PillType.FATAL,
  PillType.LIFE
);

const modifiersArbitrary = fc.array(
  fc.constantFrom(PillModifier.INVERTED, PillModifier.DOUBLED),
  { minLength: 0, maxLength: 2 }
);

const turnStartedEventArbitrary = fc.record({
  type: fc.constant(EventType.TURN_STARTED),
  timestamp: fc.nat(),
  matchId: fc.constant('match-1'),
  roundNumber: fc.integer({ min: 1, max: 20 }),
  turnIndex: fc.nat({ max: 10 }),
  playerId: fc.constantFrom('p1', 'p2'),
  timerDuration: fc.constant(30),
}) as fc.Arbitrary<TurnStartedEvent>;

const pillConsumedEventArbitrary = fc.record({
  type: fc.constant(EventType.PILL_CONSUMED),
  timestamp: fc.nat(),
  matchId: fc.constant('match-1'),
  roundNumber: fc.integer({ min: 1, max: 20 }),
  turnIndex: fc.nat({ max: 10 }),
  playerId: fc.constantFrom('p1', 'p2'),
  pillId: fc.string({ minLength: 5, maxLength: 10 }),
  pillType: pillTypeArbitrary,
  pillShape: fc.constantFrom('capsule', 'round', 'heart'),
  modifiers: modifiersArbitrary,
}) as fc.Arbitrary<PillConsumedEvent>;

const matchEndedEventArbitrary = fc.record({
  type: fc.constant(EventType.MATCH_ENDED),
  timestamp: fc.nat(),
  matchId: fc.constant('match-1'),
  roundNumber: fc.integer({ min: 1, max: 20 }),
  turnIndex: fc.nat({ max: 10 }),
  winnerId: fc.constantFrom('p1', 'p2'),
  totalRounds: fc.integer({ min: 1, max: 20 }),
  duration: fc.integer({ min: 10000, max: 600000 }),
}) as fc.Arbitrary<MatchEndedEvent>;

// ==========================================================================
// Fixtures
// ==========================================================================

function createMockPlayer(id: string, overrides: Partial<Player> = {}): Player {
  return {
    id,
    name: `Player ${id}`,
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

function createMockMatch(): Match {
  return {
    id: 'match-1',
    seed: 12345,
    phase: MatchPhase.MATCH,
    players: [createMockPlayer('p1'), createMockPlayer('p2')],
    rounds: [],
    currentRound: null,
    turnOrder: ['p1', 'p2'],
    activeTurnIndex: 0,
    seasonalShapes: [],
    shopSignals: [],
    winnerId: null,
    startedAt: Date.now(),
    endedAt: null,
  };
}

describe('Event Processor - Property-Based Tests', () => {
  // ==========================================================================
  // T052b: Determinism Invariant
  // ==========================================================================
  describe('Determinism Invariant (T052b)', () => {
    test.prop([turnStartedEventArbitrary])(
      'mesmo estado + mesmo evento = estado final identico (TURN_STARTED)',
      (event) => {
        const match = createMockMatch();

        // Processar o mesmo evento multiplas vezes
        const result1 = processEvent(match, event);
        const result2 = processEvent(match, event);
        const result3 = processEvent(match, event);

        // Todos os resultados devem ser identicos
        expect(result1).toEqual(result2);
        expect(result2).toEqual(result3);
      }
    );

    test.prop([pillConsumedEventArbitrary])(
      'mesmo estado + mesmo evento = estado final identico (PILL_CONSUMED)',
      (event) => {
        const match = createMockMatch();

        const result1 = processEvent(match, event);
        const result2 = processEvent(match, event);

        expect(result1).toEqual(result2);
      }
    );

    test.prop([matchEndedEventArbitrary])(
      'MATCH_ENDED deve sempre setar winnerId e endedAt corretamente',
      (event) => {
        const match = createMockMatch();

        const result = processEvent(match, event);

        expect(result.winnerId).toBe(event.winnerId);
        expect(result.endedAt).toBe(event.timestamp);
      }
    );
  });

  // ==========================================================================
  // Event Sequence Determinism
  // ==========================================================================
  describe('Event Sequence Determinism', () => {
    test.prop([
      fc.array(
        fc.oneof(turnStartedEventArbitrary, pillConsumedEventArbitrary),
        { minLength: 1, maxLength: 10 }
      ),
    ])(
      'mesma sequencia de eventos = mesmo estado final',
      (events) => {
        const match = createMockMatch();

        // Processar sequencia multiplas vezes
        const result1 = processEventSequence(match, events);
        const result2 = processEventSequence(match, events);

        expect(result1.success).toBe(result2.success);
        if (result1.success && result2.success) {
          expect(result1.updatedState).toEqual(result2.updatedState);
        }
      }
    );

    test.prop([
      fc.array(
        fc.oneof(turnStartedEventArbitrary, pillConsumedEventArbitrary),
        { minLength: 1, maxLength: 5 }
      ),
    ])(
      'testDeterminism deve retornar true para qualquer sequencia',
      (events) => {
        const match = createMockMatch();

        const isDeterministic = testDeterminism(match, events, 3);

        expect(isDeterministic).toBe(true);
      }
    );
  });

  // ==========================================================================
  // State Consistency After Events
  // ==========================================================================
  describe('State Consistency After Events', () => {
    test.prop([
      fc.array(turnStartedEventArbitrary, { minLength: 1, maxLength: 5 }),
    ])(
      'id do match deve permanecer inalterado',
      (events) => {
        const match = createMockMatch();
        const result = processEventSequence(match, events);

        if (result.success) {
          expect(result.updatedState.id).toBe(match.id);
        }
      }
    );

    test.prop([
      fc.array(turnStartedEventArbitrary, { minLength: 1, maxLength: 5 }),
    ])(
      'turnOrder deve permanecer inalterado (exceto para eventos especificos)',
      (events) => {
        const match = createMockMatch();
        const result = processEventSequence(match, events);

        if (result.success) {
          expect(result.updatedState.turnOrder).toEqual(match.turnOrder);
        }
      }
    );
  });

  // ==========================================================================
  // Commutativity (lack of)
  // ==========================================================================
  describe('Event Order Matters', () => {
    test.prop([
      turnStartedEventArbitrary,
      matchEndedEventArbitrary,
    ])(
      'ordem dos eventos importa para resultado final',
      (turnEvent, endEvent) => {
        const match = createMockMatch();

        // Ordem 1: turn -> end
        const state1a = processEvent(match, turnEvent);
        const state1b = processEvent(state1a, endEvent);

        // Ordem 2: end -> turn
        const state2a = processEvent(match, endEvent);
        const state2b = processEvent(state2a, turnEvent);

        // Estados podem ser diferentes dependendo da ordem
        // Especialmente para MATCH_ENDED que finaliza o match
        expect(state1b.winnerId).toBe(endEvent.winnerId);
        expect(state2a.winnerId).toBe(endEvent.winnerId);
      }
    );
  });

  // ==========================================================================
  // Unknown Events
  // ==========================================================================
  describe('Unknown Events', () => {
    test.prop([
      fc.record({
        type: fc.string().filter((s) => !Object.values(EventType).includes(s as EventType)),
        timestamp: fc.nat(),
        matchId: fc.constant('match-1'),
        roundNumber: fc.integer({ min: 1, max: 20 }),
        turnIndex: fc.nat({ max: 10 }),
      }),
    ])(
      'eventos desconhecidos devem retornar estado inalterado',
      (unknownEvent) => {
        const match = createMockMatch();

        const result = processEvent(match, unknownEvent as unknown as GameEvent);

        // Estado deve permanecer identico
        expect(result.id).toBe(match.id);
        expect(result.phase).toBe(match.phase);
        expect(result.winnerId).toBe(match.winnerId);
      }
    );
  });
});

