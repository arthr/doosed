/**
 * Unit Tests: Effect Resolver
 *
 * T034a: resolvePillEffect - all 6 pill types
 * T035a: modifier handling (INVERTED, DOUBLED)
 * T036a: Shield blocking
 *
 * Constitution Principle VI: Testing Estrategico
 */

import { describe, it, expect } from 'vitest';
import {
  resolvePillEffect,
  applyEffectToPlayer,
  applyResistanceCap,
} from '../effect-resolver';
import { PillType, PillModifier, PillState, type Pill } from '../../types/pill';
import { StatusType } from '../../types/status';
import type { Player } from '../../types/game';
import { DEFAULT_GAME_CONFIG } from '../../config/game-config';

// ==========================================================================
// Test Fixtures
// ==========================================================================

function createMockPill(type: PillType, modifiers: PillModifier[] = []): Pill {
  return {
    id: 'test-pill',
    type,
    shape: 'capsule',
    modifiers,
    isRevealed: false,
    position: 0,
    state: PillState.AVAILABLE,
  };
}

function createMockPlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: 'player-1',
    name: 'Test Player',
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

describe('Effect Resolver', () => {
  // ==========================================================================
  // T034a: resolvePillEffect - all 6 pill types
  // ==========================================================================
  describe('resolvePillEffect - Base Effects (T034a)', () => {
    const player = createMockPlayer();

    it('deve retornar NONE para SAFE pill', () => {
      const pill = createMockPill(PillType.SAFE);
      const result = resolvePillEffect(pill, player);

      expect(result.type).toBe('NONE');
      expect(result.value).toBe(0);
    });

    it('deve retornar DAMAGE -2 para DMG_LOW pill', () => {
      const pill = createMockPill(PillType.DMG_LOW);
      const result = resolvePillEffect(pill, player);

      expect(result.type).toBe('DAMAGE');
      expect(result.value).toBe(-2);
    });

    it('deve retornar DAMAGE -4 para DMG_HIGH pill', () => {
      const pill = createMockPill(PillType.DMG_HIGH);
      const result = resolvePillEffect(pill, player);

      expect(result.type).toBe('DAMAGE');
      expect(result.value).toBe(-4);
    });

    it('deve retornar HEAL +2 para HEAL pill', () => {
      const pill = createMockPill(PillType.HEAL);
      const result = resolvePillEffect(pill, player);

      expect(result.type).toBe('HEAL');
      expect(result.value).toBe(2);
    });

    it('deve retornar DAMAGE -999 para FATAL pill', () => {
      const pill = createMockPill(PillType.FATAL);
      const result = resolvePillEffect(pill, player);

      expect(result.type).toBe('DAMAGE');
      expect(result.value).toBe(-999);
    });

    it('deve retornar LIFE +1 para LIFE pill', () => {
      const pill = createMockPill(PillType.LIFE);
      const result = resolvePillEffect(pill, player);

      expect(result.type).toBe('LIFE');
      expect(result.value).toBe(1);
    });
  });

  // ==========================================================================
  // T035a: Modifier Handling (INVERTED, DOUBLED)
  // ==========================================================================
  describe('Modifier Handling (T035a)', () => {
    const player = createMockPlayer();

    describe('INVERTED modifier', () => {
      it('deve inverter DMG_LOW para HEAL +2', () => {
        const pill = createMockPill(PillType.DMG_LOW, [PillModifier.INVERTED]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('HEAL');
        expect(result.value).toBe(2); // Invertido de -2
      });

      it('deve inverter DMG_HIGH para HEAL +4', () => {
        const pill = createMockPill(PillType.DMG_HIGH, [PillModifier.INVERTED]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('HEAL');
        expect(result.value).toBe(4); // Invertido de -4
      });

      it('deve inverter HEAL para DAMAGE -2', () => {
        const pill = createMockPill(PillType.HEAL, [PillModifier.INVERTED]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('DAMAGE');
        expect(result.value).toBe(-2); // Invertido de +2
      });

      it('NAO deve afetar SAFE', () => {
        const pill = createMockPill(PillType.SAFE, [PillModifier.INVERTED]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('NONE');
        expect(result.value).toBe(0);
      });

      it('NAO deve afetar FATAL', () => {
        const pill = createMockPill(PillType.FATAL, [PillModifier.INVERTED]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('DAMAGE');
        expect(result.value).toBe(-999); // Inalterado
      });

      it('NAO deve afetar LIFE', () => {
        const pill = createMockPill(PillType.LIFE, [PillModifier.INVERTED]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('LIFE');
        expect(result.value).toBe(1); // Inalterado
      });
    });

    describe('DOUBLED modifier', () => {
      it('deve dobrar DMG_LOW para -4', () => {
        const pill = createMockPill(PillType.DMG_LOW, [PillModifier.DOUBLED]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('DAMAGE');
        expect(result.value).toBe(-4); // -2 * 2
      });

      it('deve dobrar DMG_HIGH para -8', () => {
        const pill = createMockPill(PillType.DMG_HIGH, [PillModifier.DOUBLED]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('DAMAGE');
        expect(result.value).toBe(-8); // -4 * 2
      });

      it('deve dobrar HEAL para +4', () => {
        const pill = createMockPill(PillType.HEAL, [PillModifier.DOUBLED]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('HEAL');
        expect(result.value).toBe(4); // 2 * 2
      });

      it('NAO deve afetar SAFE', () => {
        const pill = createMockPill(PillType.SAFE, [PillModifier.DOUBLED]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('NONE');
        expect(result.value).toBe(0);
      });

      it('NAO deve afetar FATAL', () => {
        const pill = createMockPill(PillType.FATAL, [PillModifier.DOUBLED]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('DAMAGE');
        expect(result.value).toBe(-999); // Inalterado
      });

      it('NAO deve afetar LIFE', () => {
        const pill = createMockPill(PillType.LIFE, [PillModifier.DOUBLED]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('LIFE');
        expect(result.value).toBe(1); // Inalterado
      });
    });

    describe('INVERTED + DOUBLED combined', () => {
      it('deve inverter e dobrar DMG_LOW para HEAL +4', () => {
        const pill = createMockPill(PillType.DMG_LOW, [
          PillModifier.INVERTED,
          PillModifier.DOUBLED,
        ]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('HEAL');
        expect(result.value).toBe(4); // -2 invertido para +2, dobrado para +4
      });

      it('deve inverter e dobrar HEAL para DAMAGE -4', () => {
        const pill = createMockPill(PillType.HEAL, [
          PillModifier.INVERTED,
          PillModifier.DOUBLED,
        ]);
        const result = resolvePillEffect(pill, player);

        expect(result.type).toBe('DAMAGE');
        expect(result.value).toBe(-4); // +2 invertido para -2, dobrado para -4
      });
    });
  });

  // ==========================================================================
  // T036a: Shield Blocking
  // ==========================================================================
  describe('Shield Blocking (T036a)', () => {
    it('deve bloquear dano quando SHIELDED', () => {
      const player = createMockPlayer({
        activeStatuses: [
          {
            id: 'shield-1',
            type: StatusType.SHIELDED,
            duration: 1,
            appliedAt: Date.now(),
            playerId: 'player-1',
          },
        ],
      });

      const pill = createMockPill(PillType.DMG_HIGH);
      const result = resolvePillEffect(pill, player);

      expect(result.type).toBe('BLOCKED');
      expect(result.value).toBe(0);
      expect(result.wasBlocked).toBe(true);
    });

    it('deve bloquear FATAL quando SHIELDED', () => {
      const player = createMockPlayer({
        activeStatuses: [
          {
            id: 'shield-1',
            type: StatusType.SHIELDED,
            duration: 1,
            appliedAt: Date.now(),
            playerId: 'player-1',
          },
        ],
      });

      const pill = createMockPill(PillType.FATAL);
      const result = resolvePillEffect(pill, player);

      expect(result.type).toBe('BLOCKED');
      expect(result.wasBlocked).toBe(true);
    });

    it('NAO deve bloquear HEAL quando SHIELDED', () => {
      const player = createMockPlayer({
        activeStatuses: [
          {
            id: 'shield-1',
            type: StatusType.SHIELDED,
            duration: 1,
            appliedAt: Date.now(),
            playerId: 'player-1',
          },
        ],
      });

      const pill = createMockPill(PillType.HEAL);
      const result = resolvePillEffect(pill, player);

      expect(result.type).toBe('HEAL');
      expect(result.value).toBe(2);
      expect(result.wasBlocked).toBeUndefined();
    });

    it('NAO deve bloquear LIFE quando SHIELDED', () => {
      const player = createMockPlayer({
        activeStatuses: [
          {
            id: 'shield-1',
            type: StatusType.SHIELDED,
            duration: 1,
            appliedAt: Date.now(),
            playerId: 'player-1',
          },
        ],
      });

      const pill = createMockPill(PillType.LIFE);
      const result = resolvePillEffect(pill, player);

      expect(result.type).toBe('LIFE');
      expect(result.value).toBe(1);
    });

    it('NAO deve bloquear quando player nao tem SHIELDED', () => {
      const player = createMockPlayer({ activeStatuses: [] });
      const pill = createMockPill(PillType.DMG_HIGH);
      const result = resolvePillEffect(pill, player);

      expect(result.type).toBe('DAMAGE');
      expect(result.value).toBe(-4);
    });
  });

  // ==========================================================================
  // applyResistanceCap
  // ==========================================================================
  describe('applyResistanceCap', () => {
    it('deve respeitar resistanceCap (overflow vai para extraResistance)', () => {
      const result = applyResistanceCap(6, 6, 0, 6, 3); // +3 heal em max

      expect(result.resistance).toBe(6); // Nao excede cap
      expect(result.extraResistance).toBe(3); // Overflow
    });

    it('deve respeitar extraResistanceCap', () => {
      const result = applyResistanceCap(6, 6, 5, 6, 5); // +5 com 5 extra ja

      expect(result.resistance).toBe(6);
      expect(result.extraResistance).toBe(6); // Cap em 6
    });

    it('deve permitir resistencia negativa (sem limite inferior)', () => {
      const result = applyResistanceCap(0, 6, 0, 6, -10);

      expect(result.resistance).toBe(-10); // Sem limite negativo
    });
  });

  // ==========================================================================
  // applyEffectToPlayer
  // ==========================================================================
  describe('applyEffectToPlayer', () => {
    it('deve aplicar dano corretamente', () => {
      const player = createMockPlayer({ resistance: 6 });
      const pill = createMockPill(PillType.DMG_LOW);
      const effect = resolvePillEffect(pill, player);
      const updatedPlayer = applyEffectToPlayer(player, effect, DEFAULT_GAME_CONFIG);

      expect(updatedPlayer.resistance).toBe(4); // 6 - 2
    });

    it('deve aplicar cura corretamente', () => {
      const player = createMockPlayer({ resistance: 4 });
      const pill = createMockPill(PillType.HEAL);
      const effect = resolvePillEffect(pill, player);
      const updatedPlayer = applyEffectToPlayer(player, effect, DEFAULT_GAME_CONFIG);

      expect(updatedPlayer.resistance).toBe(6); // 4 + 2
    });

    it('deve adicionar vida corretamente', () => {
      const player = createMockPlayer({ lives: 2 });
      const pill = createMockPill(PillType.LIFE);
      const effect = resolvePillEffect(pill, player);
      const updatedPlayer = applyEffectToPlayer(player, effect, DEFAULT_GAME_CONFIG);

      expect(updatedPlayer.lives).toBe(3); // 2 + 1
    });

    it('deve respeitar max lives ao adicionar vida', () => {
      const player = createMockPlayer({ lives: 3 }); // Ja no max
      const pill = createMockPill(PillType.LIFE);
      const effect = resolvePillEffect(pill, player);
      const updatedPlayer = applyEffectToPlayer(player, effect, DEFAULT_GAME_CONFIG);

      expect(updatedPlayer.lives).toBe(3); // Continua no max
    });

    it('nao deve modificar player para efeito BLOCKED', () => {
      const player = createMockPlayer({
        resistance: 6,
        activeStatuses: [
          {
            id: 'shield-1',
            type: StatusType.SHIELDED,
            duration: 1,
            appliedAt: Date.now(),
            playerId: 'player-1',
          },
        ],
      });
      const pill = createMockPill(PillType.DMG_HIGH);
      const effect = resolvePillEffect(pill, player);
      const updatedPlayer = applyEffectToPlayer(player, effect, DEFAULT_GAME_CONFIG);

      expect(updatedPlayer.resistance).toBe(6); // Inalterado
    });
  });
});

