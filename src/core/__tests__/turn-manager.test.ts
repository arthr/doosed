/**
 * Unit Tests: Turn Manager
 *
 * T045a: initializeTurnOrder - randomization produces valid permutation
 * T046a: getNextPlayer - skips eliminated, maintains round-robin, wraps correctly
 *
 * Constitution Principle VI: Testing Estrategico
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  initializeTurnOrder,
  getNextPlayer,
  getNextPlayerId,
  startTurn,
  endTurn,
  shouldEndTurn,
  getTurnDuration,
  markPlayerActiveTurn,
  isPlayerTurn,
  getActivePlayer,
} from '../turn-manager';
import type { Player, Match } from '../../types/game';
import { MatchPhase } from '../../types/game';
import { DEFAULT_GAME_CONFIG } from '../../config/game-config';
import { setSeed } from '../utils/random';

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

function createMockMatch(players: Player[], overrides: Partial<Match> = {}): Match {
  return {
    id: 'match-1',
    seed: 12345,
    phase: MatchPhase.MATCH,
    players,
    rounds: [],
    currentRound: null,
    turnOrder: players.map((p) => p.id),
    activeTurnIndex: 0,
    seasonalShapes: [],
    shopSignals: [],
    winnerId: null,
    startedAt: Date.now(),
    endedAt: null,
    ...overrides,
  };
}

describe('Turn Manager', () => {
  beforeEach(() => {
    setSeed(12345);
  });

  // ==========================================================================
  // T045a: initializeTurnOrder
  // ==========================================================================
  describe('initializeTurnOrder (T045a)', () => {
    it('deve retornar array com todos os player IDs', () => {
      const players = [
        createMockPlayer('p1'),
        createMockPlayer('p2'),
        createMockPlayer('p3'),
      ];

      const turnOrder = initializeTurnOrder(players);

      expect(turnOrder.length).toBe(3);
      expect(turnOrder).toContain('p1');
      expect(turnOrder).toContain('p2');
      expect(turnOrder).toContain('p3');
    });

    it('deve produzir permutacao valida (todos os IDs presentes)', () => {
      const players = Array.from({ length: 6 }, (_, i) =>
        createMockPlayer(`p${i}`)
      );

      const turnOrder = initializeTurnOrder(players);

      // Todos os IDs presentes
      for (const player of players) {
        expect(turnOrder).toContain(player.id);
      }

      // Sem duplicatas
      const uniqueIds = new Set(turnOrder);
      expect(uniqueIds.size).toBe(players.length);
    });

    it('deve randomizar ordem (nao sempre a mesma)', () => {
      const players = [
        createMockPlayer('p1'),
        createMockPlayer('p2'),
        createMockPlayer('p3'),
        createMockPlayer('p4'),
      ];

      // Testar com diferentes seeds
      const orders: string[][] = [];
      for (let seed = 1; seed <= 10; seed++) {
        setSeed(seed);
        orders.push(initializeTurnOrder(players));
      }

      // Pelo menos 2 ordens diferentes (alta probabilidade com 10 tentativas)
      const uniqueOrders = new Set(orders.map((o) => o.join(',')));
      expect(uniqueOrders.size).toBeGreaterThan(1);
    });

    it('deve lancar erro para array vazio', () => {
      expect(() => initializeTurnOrder([])).toThrow();
    });
  });

  // ==========================================================================
  // T046a: getNextPlayer
  // ==========================================================================
  describe('getNextPlayer (T046a)', () => {
    it('deve retornar proximo indice no round-robin', () => {
      const players = [
        createMockPlayer('p1'),
        createMockPlayer('p2'),
        createMockPlayer('p3'),
      ];
      const turnOrder = ['p1', 'p2', 'p3'];

      expect(getNextPlayer(turnOrder, 0, players)).toBe(1); // p1 -> p2
      expect(getNextPlayer(turnOrder, 1, players)).toBe(2); // p2 -> p3
    });

    it('deve fazer wrap corretamente', () => {
      const players = [
        createMockPlayer('p1'),
        createMockPlayer('p2'),
        createMockPlayer('p3'),
      ];
      const turnOrder = ['p1', 'p2', 'p3'];

      expect(getNextPlayer(turnOrder, 2, players)).toBe(0); // p3 -> p1 (wrap)
    });

    it('deve pular jogadores eliminados', () => {
      const players = [
        createMockPlayer('p1'),
        createMockPlayer('p2', { isEliminated: true }),
        createMockPlayer('p3'),
      ];
      const turnOrder = ['p1', 'p2', 'p3'];

      expect(getNextPlayer(turnOrder, 0, players)).toBe(2); // p1 -> p3 (pula p2)
    });

    it('deve pular multiplos eliminados consecutivos', () => {
      const players = [
        createMockPlayer('p1'),
        createMockPlayer('p2', { isEliminated: true }),
        createMockPlayer('p3', { isEliminated: true }),
        createMockPlayer('p4'),
      ];
      const turnOrder = ['p1', 'p2', 'p3', 'p4'];

      expect(getNextPlayer(turnOrder, 0, players)).toBe(3); // p1 -> p4 (pula p2, p3)
    });

    it('deve fazer wrap ao pular eliminados', () => {
      const players = [
        createMockPlayer('p1'),
        createMockPlayer('p2', { isEliminated: true }),
        createMockPlayer('p3', { isEliminated: true }),
      ];
      const turnOrder = ['p1', 'p2', 'p3'];

      // p1 -> p1 (unico vivo)
      expect(getNextPlayer(turnOrder, 0, players)).toBe(0);
    });

    it('deve lancar erro se turnOrder vazio', () => {
      const players = [createMockPlayer('p1')];
      expect(() => getNextPlayer([], 0, players)).toThrow();
    });

    it('deve lancar erro se todos eliminados', () => {
      const players = [
        createMockPlayer('p1', { isEliminated: true }),
        createMockPlayer('p2', { isEliminated: true }),
      ];
      const turnOrder = ['p1', 'p2'];

      expect(() => getNextPlayer(turnOrder, 0, players)).toThrow('All players are eliminated');
    });
  });

  // ==========================================================================
  // getNextPlayerId
  // ==========================================================================
  describe('getNextPlayerId', () => {
    it('deve retornar ID do proximo jogador', () => {
      const players = [
        createMockPlayer('p1'),
        createMockPlayer('p2'),
        createMockPlayer('p3'),
      ];
      const turnOrder = ['p1', 'p2', 'p3'];

      expect(getNextPlayerId(turnOrder, 0, players)).toBe('p2');
      expect(getNextPlayerId(turnOrder, 1, players)).toBe('p3');
      expect(getNextPlayerId(turnOrder, 2, players)).toBe('p1');
    });
  });

  // ==========================================================================
  // T047: startTurn
  // ==========================================================================
  describe('startTurn (T047)', () => {
    it('deve criar Turn com timer correto', () => {
      const players = [createMockPlayer('p1')];
      const match = createMockMatch(players);

      const turn = startTurn(match, 'p1', DEFAULT_GAME_CONFIG);

      expect(turn.timerRemaining).toBe(30); // DEFAULT timer
      expect(turn.playerId).toBe('p1');
    });

    it('deve inicializar Turn com campos vazios', () => {
      const players = [createMockPlayer('p1')];
      const match = createMockMatch(players);

      const turn = startTurn(match, 'p1', DEFAULT_GAME_CONFIG);

      expect(turn.itemsUsed).toEqual([]);
      expect(turn.pillConsumed).toBeNull();
      expect(turn.statusesApplied).toEqual([]);
      expect(turn.targetingActive).toBe(false);
      expect(turn.endedAt).toBeNull();
    });

    it('deve setar startedAt', () => {
      const players = [createMockPlayer('p1')];
      const match = createMockMatch(players);
      const before = Date.now();

      const turn = startTurn(match, 'p1', DEFAULT_GAME_CONFIG);

      expect(turn.startedAt).toBeGreaterThanOrEqual(before);
    });

    it('deve lancar erro para player nao encontrado', () => {
      const players = [createMockPlayer('p1')];
      const match = createMockMatch(players);

      expect(() => startTurn(match, 'nonexistent', DEFAULT_GAME_CONFIG)).toThrow();
    });

    it('deve lancar erro para player eliminado', () => {
      const players = [createMockPlayer('p1', { isEliminated: true })];
      const match = createMockMatch(players);

      expect(() => startTurn(match, 'p1', DEFAULT_GAME_CONFIG)).toThrow('eliminated');
    });
  });

  // ==========================================================================
  // T048: endTurn
  // ==========================================================================
  describe('endTurn (T048)', () => {
    it('deve setar endedAt', () => {
      const turn = {
        playerId: 'p1',
        timerRemaining: 15,
        itemsUsed: [],
        pillConsumed: null,
        statusesApplied: [],
        startedAt: Date.now() - 5000,
        endedAt: null,
        targetingActive: true,
      };

      const endedTurn = endTurn(turn);

      expect(endedTurn.endedAt).not.toBeNull();
      expect(endedTurn.targetingActive).toBe(false);
    });
  });

  // ==========================================================================
  // shouldEndTurn
  // ==========================================================================
  describe('shouldEndTurn', () => {
    it('deve retornar true quando pill consumida', () => {
      const turn = {
        playerId: 'p1',
        timerRemaining: 20,
        itemsUsed: [],
        pillConsumed: { id: 'pill-1' } as any,
        statusesApplied: [],
        startedAt: Date.now(),
        endedAt: null,
        targetingActive: false,
      };

      expect(shouldEndTurn(turn)).toBe(true);
    });

    it('deve retornar true quando timer expira', () => {
      const turn = {
        playerId: 'p1',
        timerRemaining: 0,
        itemsUsed: [],
        pillConsumed: null,
        statusesApplied: [],
        startedAt: Date.now(),
        endedAt: null,
        targetingActive: false,
      };

      expect(shouldEndTurn(turn)).toBe(true);
    });

    it('deve retornar false quando turno em andamento', () => {
      const turn = {
        playerId: 'p1',
        timerRemaining: 20,
        itemsUsed: [],
        pillConsumed: null,
        statusesApplied: [],
        startedAt: Date.now(),
        endedAt: null,
        targetingActive: false,
      };

      expect(shouldEndTurn(turn)).toBe(false);
    });
  });

  // ==========================================================================
  // getTurnDuration
  // ==========================================================================
  describe('getTurnDuration', () => {
    it('deve calcular duracao para turno em andamento', () => {
      const turn = {
        playerId: 'p1',
        timerRemaining: 20,
        itemsUsed: [],
        pillConsumed: null,
        statusesApplied: [],
        startedAt: Date.now() - 5000,
        endedAt: null,
        targetingActive: false,
      };

      const duration = getTurnDuration(turn);
      expect(duration).toBeGreaterThanOrEqual(5000);
    });

    it('deve calcular duracao para turno finalizado', () => {
      const turn = {
        playerId: 'p1',
        timerRemaining: 20,
        itemsUsed: [],
        pillConsumed: null,
        statusesApplied: [],
        startedAt: 1000,
        endedAt: 6000,
        targetingActive: false,
      };

      const duration = getTurnDuration(turn);
      expect(duration).toBe(5000);
    });
  });

  // ==========================================================================
  // markPlayerActiveTurn
  // ==========================================================================
  describe('markPlayerActiveTurn', () => {
    it('deve marcar jogador como ativo', () => {
      const player = createMockPlayer('p1', { isActiveTurn: false });
      const updated = markPlayerActiveTurn(player, true);

      expect(updated.isActiveTurn).toBe(true);
    });

    it('deve desmarcar jogador como ativo', () => {
      const player = createMockPlayer('p1', { isActiveTurn: true });
      const updated = markPlayerActiveTurn(player, false);

      expect(updated.isActiveTurn).toBe(false);
    });
  });

  // ==========================================================================
  // isPlayerTurn
  // ==========================================================================
  describe('isPlayerTurn', () => {
    it('deve retornar true quando e turno do jogador', () => {
      const players = [createMockPlayer('p1'), createMockPlayer('p2')];
      const match = createMockMatch(players, {
        turnOrder: ['p1', 'p2'],
        activeTurnIndex: 0,
      });

      expect(isPlayerTurn(match, 'p1')).toBe(true);
      expect(isPlayerTurn(match, 'p2')).toBe(false);
    });

    it('deve retornar false para indice invalido', () => {
      const players = [createMockPlayer('p1')];
      const match = createMockMatch(players, {
        turnOrder: ['p1'],
        activeTurnIndex: 5, // Invalido
      });

      expect(isPlayerTurn(match, 'p1')).toBe(false);
    });
  });

  // ==========================================================================
  // getActivePlayer
  // ==========================================================================
  describe('getActivePlayer', () => {
    it('deve retornar jogador ativo', () => {
      const players = [createMockPlayer('p1'), createMockPlayer('p2')];
      const match = createMockMatch(players, {
        turnOrder: ['p1', 'p2'],
        activeTurnIndex: 1,
      });

      const active = getActivePlayer(match);

      expect(active).not.toBeNull();
      expect(active?.id).toBe('p2');
    });

    it('deve retornar null para indice invalido', () => {
      const players = [createMockPlayer('p1')];
      const match = createMockMatch(players, {
        turnOrder: ['p1'],
        activeTurnIndex: 5,
      });

      expect(getActivePlayer(match)).toBeNull();
    });
  });
});

