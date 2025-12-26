/**
 * Effect Resolver: Resolução de Efeitos de Pills
 *
 * Resolve efeitos de pills consumidas:
 * - Todos os 6 tipos de pill (SAFE, DMG_LOW, DMG_HIGH, HEAL, FATAL, LIFE)
 * - Modificadores (INVERTED, DOUBLED)
 * - Shield blocking (SHIELDED status)
 * - Resistance cap enforcement
 *
 * Baseado em data-model.md "Effect Resolution"
 */

import { PillType, PillModifier, PILL_BASE_VALUES, type Pill } from '../types/pill';
import { StatusType, type Status } from '../types/status';
import type { Player } from '../types/game';
import type { GameConfig } from '../types/config';
import { DEFAULT_GAME_CONFIG } from '../config/game-config';

// ============================================================================
// Types
// ============================================================================

export interface EffectResult {
  type: 'DAMAGE' | 'HEAL' | 'LIFE' | 'NONE' | 'BLOCKED';
  value: number; // Valor aplicado (positivo para heal/life, negativo para dano)
  originalValue?: number; // Valor original antes de modificadores (se aplicável)
  wasBlocked?: boolean; // Se efeito foi bloqueado por Shield
}

// ============================================================================
// T034: Resolve Pill Effect (Base)
// ============================================================================

/**
 * Resolve efeito base da pill (sem modificadores)
 */
function resolveBasePillEffect(pill: Pill): EffectResult {
  const baseValue = PILL_BASE_VALUES[pill.type];

  switch (pill.type) {
    case PillType.SAFE:
      return { type: 'NONE', value: 0 };

    case PillType.DMG_LOW:
    case PillType.DMG_HIGH:
      return { type: 'DAMAGE', value: baseValue };

    case PillType.HEAL:
      return { type: 'HEAL', value: baseValue };

    case PillType.FATAL:
      return { type: 'DAMAGE', value: baseValue }; // -999 (special)

    case PillType.LIFE:
      return { type: 'LIFE', value: baseValue }; // +1 vida

    default:
      return { type: 'NONE', value: 0 };
  }
}

// ============================================================================
// T035: Apply Modifiers (INVERTED, DOUBLED)
// ============================================================================

/**
 * Aplica modificadores de pill ao efeito base
 *
 * INVERTED: Inverte dano ↔ cura (FATAL/LIFE não afetados)
 * DOUBLED: Multiplica valor por 2 (FATAL/LIFE não afetados)
 */
function applyModifiers(effect: EffectResult, pill: Pill): EffectResult {
  let modifiedEffect = { ...effect, originalValue: effect.value };

  // INVERTED: Inverte dano ↔ cura
  if (pill.modifiers.includes(PillModifier.INVERTED)) {
    if (pill.type === PillType.DMG_LOW || pill.type === PillType.DMG_HIGH) {
      // Dano vira cura
      modifiedEffect = {
        ...modifiedEffect,
        type: 'HEAL',
        value: -modifiedEffect.value, // Inverter sinal
      };
    } else if (pill.type === PillType.HEAL) {
      // Cura vira dano
      modifiedEffect = {
        ...modifiedEffect,
        type: 'DAMAGE',
        value: -modifiedEffect.value, // Inverter sinal
      };
    }
    // SAFE, FATAL, LIFE não são afetados por INVERTED
  }

  // DOUBLED: Multiplica por 2
  if (pill.modifiers.includes(PillModifier.DOUBLED)) {
    if (pill.type !== PillType.FATAL && pill.type !== PillType.LIFE) {
      modifiedEffect.value *= 2;
    }
    // FATAL e LIFE não são afetados por DOUBLED
  }

  return modifiedEffect;
}

// ============================================================================
// T036: Check Shield (SHIELDED Status)
// ============================================================================

/**
 * Verifica se jogador tem Shield ativo e bloqueia dano
 * Shield bloqueia TODO dano (DMG_LOW, DMG_HIGH, FATAL)
 * Shield NÃO bloqueia cura (HEAL, Pocket Pill)
 */
function checkShield(player: Player, effect: EffectResult): EffectResult {
  const hasShield = player.activeStatuses.some((s: Status) => s.type === StatusType.SHIELDED);

  if (hasShield && effect.type === 'DAMAGE') {
    return {
      type: 'BLOCKED',
      value: 0,
      originalValue: effect.value,
      wasBlocked: true,
    };
  }

  return effect;
}

// ============================================================================
// T037: Apply Resistance Cap
// ============================================================================

/**
 * Aplica caps de resistência:
 * - Resistência base: -∞ a resistanceCap
 * - Resistência extra (overflow): 0 a extraResistanceCap
 */
export function applyResistanceCap(
  currentResistance: number,
  resistanceCap: number,
  extraResistance: number,
  extraResistanceCap: number,
  delta: number
): { resistance: number; extraResistance: number } {
  let newResistance = currentResistance + delta;
  let newExtraResistance = extraResistance;

  // Se resistência vai acima do cap, overflow vai para extraResistance
  if (newResistance > resistanceCap) {
    const overflow = newResistance - resistanceCap;
    newResistance = resistanceCap;
    newExtraResistance = Math.min(newExtraResistance + overflow, extraResistanceCap);
  }

  // Resistência pode ser negativa (sem limite inferior)
  // Não há cap negativo conforme FR-069a

  return {
    resistance: newResistance,
    extraResistance: newExtraResistance,
  };
}

// ============================================================================
// Main Function: Resolve Pill Effect
// ============================================================================

/**
 * Resolve efeito completo da pill no jogador
 *
 * Fluxo:
 * 1. Resolve efeito base
 * 2. Aplica modificadores (INVERTED, DOUBLED)
 * 3. Verifica Shield (bloqueia dano)
 * 4. Aplica resistance cap (se aplicável)
 *
 * Retorna EffectResult para ser aplicado ao jogador
 */
export function resolvePillEffect(pill: Pill, player: Player): EffectResult {
  // 1. Efeito base
  let effect = resolveBasePillEffect(pill);

  // 2. Modificadores
  effect = applyModifiers(effect, pill);

  // 3. Shield check
  effect = checkShield(player, effect);

  // 4. Resistance cap é aplicado externamente (no collapse-handler ou turn-manager)
  // pois depende do estado atual do jogador

  return effect;
}

// ============================================================================
// Helper: Apply Effect to Player
// ============================================================================

/**
 * Aplica EffectResult ao Player, retornando novo Player
 * Esta função é helper e DEVE ser chamada após resolvePillEffect
 */
export function applyEffectToPlayer(
  player: Player,
  effect: EffectResult,
  config: GameConfig = DEFAULT_GAME_CONFIG
): Player {
  let updatedPlayer = { ...player };

  switch (effect.type) {
    case 'NONE':
    case 'BLOCKED':
      // Sem mudanças
      break;

    case 'DAMAGE': {
      // Aplicar dano à resistência
      const { resistance, extraResistance } = applyResistanceCap(
        updatedPlayer.resistance,
        updatedPlayer.resistanceCap,
        updatedPlayer.extraResistance,
        updatedPlayer.resistanceCap, // extraResistanceCap = resistanceCap
        effect.value // Negativo para dano
      );
      updatedPlayer.resistance = resistance;
      updatedPlayer.extraResistance = extraResistance;
      break;
    }

    case 'HEAL': {
      // Aplicar cura à resistência
      const { resistance, extraResistance } = applyResistanceCap(
        updatedPlayer.resistance,
        updatedPlayer.resistanceCap,
        updatedPlayer.extraResistance,
        updatedPlayer.resistanceCap,
        effect.value // Positivo para cura
      );
      updatedPlayer.resistance = resistance;
      updatedPlayer.extraResistance = extraResistance;
      break;
    }

    case 'LIFE': {
      // +1 Vida (cap via config)
      const maxLives = config.health.initialLives;
      updatedPlayer.lives = Math.min(updatedPlayer.lives + 1, maxLives);
      break;
    }
  }

  return updatedPlayer;
}

