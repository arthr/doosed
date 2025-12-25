/**
 * Types: Game Events (8 Core Events)
 *
 * Baseado em data-model.md (Event System)
 * Constitution Principle III: Máximo 8 tipos de eventos
 */

import type { BotLevel } from './game';
import type { PillType, PillModifier } from './pill';
import type { StatusType } from './status';

// ============================================================================
// Base Event
// ============================================================================

export interface BaseEvent {
  type: EventType; // Tipo do evento
  timestamp: number; // performance.now() para ordenação determinística
  matchId: string; // ID da partida
  roundNumber: number; // Número da rodada
  turnIndex: number; // Índice do turno
}

// ============================================================================
// Event Types (8 core events)
// ============================================================================

export enum EventType {
  PLAYER_JOINED = 'PLAYER_JOINED',
  TURN_STARTED = 'TURN_STARTED',
  ITEM_USED = 'ITEM_USED',
  PILL_CONSUMED = 'PILL_CONSUMED',
  EFFECT_APPLIED = 'EFFECT_APPLIED',
  COLLAPSE_TRIGGERED = 'COLLAPSE_TRIGGERED',
  ROUND_COMPLETED = 'ROUND_COMPLETED',
  MATCH_ENDED = 'MATCH_ENDED',
}

// ============================================================================
// Event Payloads
// ============================================================================

export interface PlayerJoinedEvent extends BaseEvent {
  type: EventType.PLAYER_JOINED;
  playerId: string;
  playerName: string;
  isBot: boolean;
  botLevel?: BotLevel;
}

export interface TurnStartedEvent extends BaseEvent {
  type: EventType.TURN_STARTED;
  playerId: string;
  timerDuration: number; // 30s default
}

export interface ItemUsedEvent extends BaseEvent {
  type: EventType.ITEM_USED;
  playerId: string;
  itemId: string;
  targetPlayerId?: string; // Se targeting OPPONENT/SELF
  targetPillId?: string; // Se targeting PILL
  targetShape?: string; // Se targeting SHAPE
}

export interface PillConsumedEvent extends BaseEvent {
  type: EventType.PILL_CONSUMED;
  playerId: string;
  pillId: string;
  pillType: PillType; // Revelado ao consumir
  pillShape: string;
  modifiers: PillModifier[];
}

export interface EffectAppliedEvent extends BaseEvent {
  type: EventType.EFFECT_APPLIED;
  targetPlayerId: string;
  effect: {
    type: 'DAMAGE' | 'HEAL' | 'LIFE' | 'STATUS' | 'BLOCKED';
    value?: number;
    statusType?: StatusType;
  };
  source: 'PILL' | 'ITEM';
  sourceId: string;
}

export interface CollapseTriggeredEvent extends BaseEvent {
  type: EventType.COLLAPSE_TRIGGERED;
  playerId: string;
  previousLives: number;
  newLives: number;
  newResistance: number; // Resetado para 6
  isLastChance: boolean; // Se lives === 0
  isEliminated: boolean; // Se colapsou em última chance
}

export interface RoundCompletedEvent extends BaseEvent {
  type: EventType.ROUND_COMPLETED;
  roundNumber: number;
  alivePlayers: number;
  questsCompleted: Array<{ playerId: string; reward: number }>;
  shopActivated: boolean;
}

export interface MatchEndedEvent extends BaseEvent {
  type: EventType.MATCH_ENDED;
  winnerId: string;
  totalRounds: number;
  duration: number; // ms
}

// ============================================================================
// Union Type
// ============================================================================

export type GameEvent =
  | PlayerJoinedEvent
  | TurnStartedEvent
  | ItemUsedEvent
  | PillConsumedEvent
  | EffectAppliedEvent
  | CollapseTriggeredEvent
  | RoundCompletedEvent
  | MatchEndedEvent;

// ============================================================================
// Type Guards
// ============================================================================

export function isEventType(value: string): value is EventType {
  return Object.values(EventType).includes(value as EventType);
}

export function isGameEvent(value: unknown): value is GameEvent {
  if (typeof value !== 'object' || value === null) return false;
  const event = value as Record<string, unknown>;
  return typeof event.type === 'string' && isEventType(event.type);
}

// ============================================================================
// Event Validation
// ============================================================================

/**
 * Valida que temos exatamente 8 tipos de eventos (Constitution compliance)
 */
export const EVENT_TYPE_COUNT = Object.keys(EventType).length;
export const MAX_EVENT_TYPES = 8;

if (EVENT_TYPE_COUNT > MAX_EVENT_TYPES) {
  throw new Error(
    `Constitution violation: Event types exceed maximum (${EVENT_TYPE_COUNT} > ${MAX_EVENT_TYPES})`,
  );
}
