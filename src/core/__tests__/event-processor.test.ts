/**
 * Unit Tests: Event Processor
 *
 * T052a: processEvent reducer - all 8 core event types with valid payloads
 *
 * Constitution Principle VI: Testing Estrategico
 */

import { describe, it, expect } from 'vitest';
import {
  processEvent,
  processEventWithRecovery,
  processEventSequence,
  testDeterminism,
  validateStateAfterEvent,
} from '../event-processor';
import {
  EventType,
  type GameEvent,
  type PlayerJoinedEvent,
  type TurnStartedEvent,
  type ItemUsedEvent,
  type PillConsumedEvent,
  type EffectAppliedEvent,
  type CollapseTriggeredEvent,
  type RoundCompletedEvent,
  type MatchEndedEvent,
} from '../../types/events';
import type { Match, Player } from '../../types/game';
import { MatchPhase } from '../../types/game';
import { PillType } from '../../types/pill';

// ==========================================================================
// Test Fixtures
// ==========================================================================

function createMockPlayer(id: string, overrides: Partial<Player> = {}): Player {
  return {
    id,
    name: `Player ${id}`,
    avatar: '',
    isBot: false,
    lives: 3,
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

function createMockMatch(overrides: Partial<Match> = {}): Match {
  const players = [createMockPlayer('p1'), createMockPlayer('p2')];
  return {
    id: 'match-1',
    phase: MatchPhase.MATCH,
    players,
    rounds: [],
    currentRound: null,
    turnOrder: ['p1', 'p2'],
    activeTurnIndex: 0,
    seasonalShapes: [],
    shopSignals: [],
    winnerId: null,
    startedAt: Date.now(),
    endedAt: null,
    ...overrides,
  };
}

function createBaseEvent(type: EventType): Omit<GameEvent, 'type'> {
  return {
    timestamp: performance.now(),
    matchId: 'match-1',
    roundNumber: 1,
    turnIndex: 0,
  };
}

describe('Event Processor', () => {
  // ==========================================================================
  // T052a: processEvent - all 8 core event types
  // ==========================================================================
  describe('processEvent (T052a)', () => {
    const match = createMockMatch();

    describe('PLAYER_JOINED', () => {
      it('deve processar evento sem erros', () => {
        const event: PlayerJoinedEvent = {
          type: EventType.PLAYER_JOINED,
          ...createBaseEvent(EventType.PLAYER_JOINED),
          playerId: 'p3',
          playerName: 'Player 3',
          isBot: false,
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
        // Evento simplificado - retorna estado inalterado
        expect(result.id).toBe(match.id);
      });
    });

    describe('TURN_STARTED', () => {
      it('deve processar evento sem erros', () => {
        const event: TurnStartedEvent = {
          type: EventType.TURN_STARTED,
          ...createBaseEvent(EventType.TURN_STARTED),
          playerId: 'p1',
          timerDuration: 30,
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });
    });

    describe('ITEM_USED', () => {
      it('deve processar evento com targetPillId', () => {
        const event: ItemUsedEvent = {
          type: EventType.ITEM_USED,
          ...createBaseEvent(EventType.ITEM_USED),
          playerId: 'p1',
          itemId: 'scanner',
          targetPillId: 'pill-1',
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });

      it('deve processar evento com targetPlayerId', () => {
        const event: ItemUsedEvent = {
          type: EventType.ITEM_USED,
          ...createBaseEvent(EventType.ITEM_USED),
          playerId: 'p1',
          itemId: 'handcuffs',
          targetPlayerId: 'p2',
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });

      it('deve processar evento com targetShape', () => {
        const event: ItemUsedEvent = {
          type: EventType.ITEM_USED,
          ...createBaseEvent(EventType.ITEM_USED),
          playerId: 'p1',
          itemId: 'shape-scanner',
          targetShape: 'capsule',
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });
    });

    describe('PILL_CONSUMED', () => {
      it('deve processar evento com todos os campos', () => {
        const event: PillConsumedEvent = {
          type: EventType.PILL_CONSUMED,
          ...createBaseEvent(EventType.PILL_CONSUMED),
          playerId: 'p1',
          pillId: 'pill-1',
          pillType: PillType.SAFE,
          pillShape: 'capsule',
          modifiers: [],
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });

      it('deve processar evento com modifiers', () => {
        const event: PillConsumedEvent = {
          type: EventType.PILL_CONSUMED,
          ...createBaseEvent(EventType.PILL_CONSUMED),
          playerId: 'p1',
          pillId: 'pill-1',
          pillType: PillType.DMG_LOW,
          pillShape: 'heart',
          modifiers: ['INVERTED' as any, 'DOUBLED' as any],
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });
    });

    describe('EFFECT_APPLIED', () => {
      it('deve processar evento de DAMAGE', () => {
        const event: EffectAppliedEvent = {
          type: EventType.EFFECT_APPLIED,
          ...createBaseEvent(EventType.EFFECT_APPLIED),
          targetPlayerId: 'p1',
          effect: { type: 'DAMAGE', value: -2 },
          source: 'PILL',
          sourceId: 'pill-1',
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });

      it('deve processar evento de HEAL', () => {
        const event: EffectAppliedEvent = {
          type: EventType.EFFECT_APPLIED,
          ...createBaseEvent(EventType.EFFECT_APPLIED),
          targetPlayerId: 'p1',
          effect: { type: 'HEAL', value: 2 },
          source: 'PILL',
          sourceId: 'pill-1',
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });

      it('deve processar evento de STATUS', () => {
        const event: EffectAppliedEvent = {
          type: EventType.EFFECT_APPLIED,
          ...createBaseEvent(EventType.EFFECT_APPLIED),
          targetPlayerId: 'p1',
          effect: { type: 'STATUS', statusType: 'SHIELDED' as any },
          source: 'ITEM',
          sourceId: 'shield',
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });

      it('deve processar evento de BLOCKED', () => {
        const event: EffectAppliedEvent = {
          type: EventType.EFFECT_APPLIED,
          ...createBaseEvent(EventType.EFFECT_APPLIED),
          targetPlayerId: 'p1',
          effect: { type: 'BLOCKED' },
          source: 'PILL',
          sourceId: 'pill-1',
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });
    });

    describe('COLLAPSE_TRIGGERED', () => {
      it('deve processar colapso normal', () => {
        const event: CollapseTriggeredEvent = {
          type: EventType.COLLAPSE_TRIGGERED,
          ...createBaseEvent(EventType.COLLAPSE_TRIGGERED),
          playerId: 'p1',
          previousLives: 3,
          newLives: 2,
          newResistance: 6,
          isLastChance: false,
          isEliminated: false,
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });

      it('deve processar colapso com ultima chance', () => {
        const event: CollapseTriggeredEvent = {
          type: EventType.COLLAPSE_TRIGGERED,
          ...createBaseEvent(EventType.COLLAPSE_TRIGGERED),
          playerId: 'p1',
          previousLives: 1,
          newLives: 0,
          newResistance: 6,
          isLastChance: true,
          isEliminated: false,
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });

      it('deve processar eliminacao', () => {
        const event: CollapseTriggeredEvent = {
          type: EventType.COLLAPSE_TRIGGERED,
          ...createBaseEvent(EventType.COLLAPSE_TRIGGERED),
          playerId: 'p1',
          previousLives: 0,
          newLives: 0,
          newResistance: 0,
          isLastChance: true,
          isEliminated: true,
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });
    });

    describe('ROUND_COMPLETED', () => {
      it('deve processar evento sem shop', () => {
        const event: RoundCompletedEvent = {
          type: EventType.ROUND_COMPLETED,
          ...createBaseEvent(EventType.ROUND_COMPLETED),
          roundNumber: 1,
          alivePlayers: 2,
          questsCompleted: [],
          shopActivated: false,
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });

      it('deve processar evento com quests completadas', () => {
        const event: RoundCompletedEvent = {
          type: EventType.ROUND_COMPLETED,
          ...createBaseEvent(EventType.ROUND_COMPLETED),
          roundNumber: 3,
          alivePlayers: 2,
          questsCompleted: [
            { playerId: 'p1', reward: 50 },
            { playerId: 'p2', reward: 30 },
          ],
          shopActivated: true,
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
      });
    });

    describe('MATCH_ENDED', () => {
      it('deve processar evento e setar winnerId', () => {
        const event: MatchEndedEvent = {
          type: EventType.MATCH_ENDED,
          ...createBaseEvent(EventType.MATCH_ENDED),
          winnerId: 'p1',
          totalRounds: 5,
          duration: 300000,
        };

        const result = processEvent(match, event);

        expect(result).toBeDefined();
        expect(result.winnerId).toBe('p1');
      });

      it('deve setar endedAt', () => {
        const event: MatchEndedEvent = {
          type: EventType.MATCH_ENDED,
          ...createBaseEvent(EventType.MATCH_ENDED),
          winnerId: 'p2',
          totalRounds: 3,
          duration: 180000,
        };

        const result = processEvent(match, event);

        expect(result.endedAt).toBe(event.timestamp);
      });
    });

    describe('Unknown Event Type', () => {
      it('deve retornar estado inalterado para tipo desconhecido', () => {
        const event = {
          type: 'UNKNOWN_EVENT',
          timestamp: performance.now(),
          matchId: 'match-1',
          roundNumber: 1,
          turnIndex: 0,
        } as unknown as GameEvent;

        const result = processEvent(match, event);

        expect(result).toEqual(match);
      });
    });
  });

  // ==========================================================================
  // T053: validateStateAfterEvent
  // ==========================================================================
  describe('validateStateAfterEvent (T053)', () => {
    it('deve validar estado correto', () => {
      const match = createMockMatch();
      const validation = validateStateAfterEvent(match);

      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('deve detectar jogador com lives negativos', () => {
      const match = createMockMatch({
        players: [
          createMockPlayer('p1', { lives: -1 }),
          createMockPlayer('p2'),
        ],
      });

      const validation = validateStateAfterEvent(match);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // T054: processEventWithRecovery
  // ==========================================================================
  describe('processEventWithRecovery (T054)', () => {
    it('deve retornar success para evento valido', () => {
      const match = createMockMatch();
      const event: TurnStartedEvent = {
        type: EventType.TURN_STARTED,
        ...createBaseEvent(EventType.TURN_STARTED),
        playerId: 'p1',
        timerDuration: 30,
      };

      const result = processEventWithRecovery(match, event, false);

      expect(result.success).toBe(true);
      expect(result.updatedState).toBeDefined();
    });
  });

  // ==========================================================================
  // processEventSequence
  // ==========================================================================
  describe('processEventSequence', () => {
    it('deve processar sequencia de eventos', () => {
      const match = createMockMatch();
      const events: GameEvent[] = [
        {
          type: EventType.TURN_STARTED,
          ...createBaseEvent(EventType.TURN_STARTED),
          playerId: 'p1',
          timerDuration: 30,
        } as TurnStartedEvent,
        {
          type: EventType.PILL_CONSUMED,
          ...createBaseEvent(EventType.PILL_CONSUMED),
          playerId: 'p1',
          pillId: 'pill-1',
          pillType: PillType.SAFE,
          pillShape: 'capsule',
          modifiers: [],
        } as PillConsumedEvent,
      ];

      const result = processEventSequence(match, events);

      expect(result.success).toBe(true);
    });
  });

  // ==========================================================================
  // testDeterminism
  // ==========================================================================
  describe('testDeterminism', () => {
    it('deve confirmar determinismo para mesma sequencia de eventos', () => {
      const match = createMockMatch();
      const events: GameEvent[] = [
        {
          type: EventType.TURN_STARTED,
          ...createBaseEvent(EventType.TURN_STARTED),
          playerId: 'p1',
          timerDuration: 30,
        } as TurnStartedEvent,
        {
          type: EventType.MATCH_ENDED,
          ...createBaseEvent(EventType.MATCH_ENDED),
          winnerId: 'p1',
          totalRounds: 1,
          duration: 10000,
        } as MatchEndedEvent,
      ];

      const isDeterministic = testDeterminism(match, events, 5);

      expect(isDeterministic).toBe(true);
    });
  });
});

