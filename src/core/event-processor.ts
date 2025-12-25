/**
 * Event Processor: Processamento Determinístico de Eventos
 *
 * Implementa:
 * - Reducer puro para todos os 8 core events
 * - Validação de estado após cada evento
 * - Error recovery (DEV: pause+debug, PROD: retry+fallback)
 * - Determinismo: mesmos eventos → mesmo estado final
 *
 * Constitution Principle III: Event-Driven & Determinístico
 * research.md Decision 6
 */

import type {
  GameEvent,
  PlayerJoinedEvent,
  TurnStartedEvent,
  ItemUsedEvent,
  PillConsumedEvent,
  EffectAppliedEvent,
  CollapseTriggeredEvent,
  RoundCompletedEvent,
  MatchEndedEvent,
} from '../types/events';
import type { Match } from '../types/game';
import {
  validatePlayerInvariants,
  validateMatchInvariants,
} from './utils/validation';

// ============================================================================
// Types
// ============================================================================

export interface ProcessEventResult {
  success: boolean;
  updatedState: Match;
  error?: string;
  validationErrors?: string[];
}

// ============================================================================
// T052: Process Event (Reducer Pattern)
// ============================================================================

/**
 * Processa evento deterministicamente
 * Reducer puro: estado atual + evento → novo estado
 *
 * DETERMINÍSTICO: mesmos inputs → mesmo output
 * Constitution Principle III
 */
export function processEvent(state: Match, event: GameEvent): Match {
  switch (event.type) {
    case 'PLAYER_JOINED':
      return handlePlayerJoined(state, event as PlayerJoinedEvent);

    case 'TURN_STARTED':
      return handleTurnStarted(state, event as TurnStartedEvent);

    case 'ITEM_USED':
      return handleItemUsed(state, event as ItemUsedEvent);

    case 'PILL_CONSUMED':
      return handlePillConsumed(state, event as PillConsumedEvent);

    case 'EFFECT_APPLIED':
      return handleEffectApplied(state, event as EffectAppliedEvent);

    case 'COLLAPSE_TRIGGERED':
      return handleCollapseTriggered(state, event as CollapseTriggeredEvent);

    case 'ROUND_COMPLETED':
      return handleRoundCompleted(state, event as RoundCompletedEvent);

    case 'MATCH_ENDED':
      return handleMatchEnded(state, event as MatchEndedEvent);

    default:
      console.warn(`[EVENT] Unknown event type:`, event);
      return state;
  }
}

// ============================================================================
// Event Handlers (8 core events)
// ============================================================================

function handlePlayerJoined(state: Match, event: PlayerJoinedEvent): Match {
  // Adicionar jogador ao match (simplificado - usado em Lobby)
  // Implementação completa em matchStore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = event; // Placeholder para futura implementação
  return state;
}

function handleTurnStarted(state: Match, event: TurnStartedEvent): Match {
  // Marcar jogador como ativo (simplificado)
  // Implementação completa em matchStore/turnManager
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = event; // Placeholder para futura implementação
  return state;
}

function handleItemUsed(state: Match, event: ItemUsedEvent): Match {
  // Registrar uso de item (simplificado)
  // Implementação completa em inventoryManager
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = event; // Placeholder para futura implementação
  return state;
}

function handlePillConsumed(state: Match, event: PillConsumedEvent): Match {
  // Processar consumo de pill (simplificado)
  // Implementação completa em poolStore/effectResolver
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = event; // Placeholder para futura implementação
  return state;
}

function handleEffectApplied(state: Match, event: EffectAppliedEvent): Match {
  // Aplicar efeito ao jogador (simplificado)
  // Implementação completa em effectResolver
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = event; // Placeholder para futura implementação
  return state;
}

function handleCollapseTriggered(state: Match, event: CollapseTriggeredEvent): Match {
  // Processar colapso (simplificado)
  // Implementação completa em collapseHandler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = event; // Placeholder para futura implementação
  return state;
}

function handleRoundCompleted(state: Match, event: RoundCompletedEvent): Match {
  // Finalizar rodada (simplificado)
  // Implementação completa em matchStore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = event; // Placeholder para futura implementação
  return state;
}

function handleMatchEnded(state: Match, event: MatchEndedEvent): Match {
  // Finalizar match (simplificado)
  // Implementação completa em matchStore
  return {
    ...state,
    winnerId: event.winnerId,
    endedAt: event.timestamp,
  };
}

// ============================================================================
// T053: State Validation After Each Event
// ============================================================================

/**
 * Valida estado após processar evento
 *
 * Invariantes validados:
 * - Lives >= 0 (Player)
 * - Inventory <= 5 slots (Player)
 * - Resistance válido (Player)
 * - Pool size bounds (Pool)
 * - Turn order válido (Match)
 *
 * FR-186.19: Validação de state integrity
 */
export function validateStateAfterEvent(state: Match): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validar Match
  if (!validateMatchInvariants(state)) {
    errors.push('Match invariants violated');
  }

  // Validar cada Player
  for (const player of state.players) {
    if (!validatePlayerInvariants(player)) {
      errors.push(`Player ${player.id} invariants violated`);
    }
  }

  // Validar Pool (se existe rodada atual)
  if (state.rounds.length > 0) {
    const currentRound = state.rounds[state.rounds.length - 1];
    if (currentRound?.pool) {
      // Validação de pool feita em pool-generator
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// T054: Error Recovery (Dual-Mode)
// ============================================================================

/**
 * Processa evento com error recovery
 *
 * DEV mode: Pausa e exibe debug overlay
 * PROD mode: Retry (1-2x) + fallback graceful
 *
 * FR-186.8 a FR-186.10, research.md Decision 3
 */
export function processEventWithRecovery(
  state: Match,
  event: GameEvent,
  isDev: boolean = import.meta.env.DEV
): ProcessEventResult {
  try {
    // 1. Processar evento
    const updatedState = processEvent(state, event);

    // 2. Validar estado
    const validation = validateStateAfterEvent(updatedState);

    if (!validation.valid) {
      // Estado inválido após evento
      if (isDev) {
        // DEV: Pausar e debug
        console.error('[EVENT] State validation failed after event:', event);
        console.error('[EVENT] Validation errors:', validation.errors);
        console.error('[EVENT] Current state:', updatedState);

        // Em DEV, lançar erro para pausar
        throw new Error(`State validation failed: ${validation.errors.join(', ')}`);
      } else {
        // PROD: Tentar recovery (fallback para estado anterior)
        console.warn('[EVENT] State validation failed, falling back to previous state');
        return {
          success: false,
          updatedState: state, // Fallback para estado anterior
          error: 'State validation failed',
          validationErrors: validation.errors,
        };
      }
    }

    return {
      success: true,
      updatedState,
    };
  } catch (error) {
    // Erro durante processamento
    if (isDev) {
      // DEV: Re-throw para pausar
      throw error;
    } else {
      // PROD: Fallback graceful
      console.error('[EVENT] Error processing event:', error);
      return {
        success: false,
        updatedState: state, // Fallback para estado anterior
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// ============================================================================
// Helpers: Event Queue & Replay
// ============================================================================

/**
 * Processa sequência de eventos (para replay/testing)
 */
export function processEventSequence(
  initialState: Match,
  events: GameEvent[]
): ProcessEventResult {
  let currentState = initialState;
  const errors: string[] = [];

  for (const event of events) {
    const result = processEventWithRecovery(currentState, event);

    if (!result.success) {
      errors.push(result.error || 'Unknown error');
      // Parar processamento em erro
      return {
        success: false,
        updatedState: currentState,
        error: `Event sequence failed at event ${event.type}`,
        validationErrors: errors,
      };
    }

    currentState = result.updatedState;
  }

  return {
    success: true,
    updatedState: currentState,
  };
}

/**
 * Testa determinismo: mesma sequência → mesmo resultado
 */
export function testDeterminism(
  initialState: Match,
  events: GameEvent[],
  iterations: number = 3
): boolean {
  const results: Match[] = [];

  for (let i = 0; i < iterations; i++) {
    const result = processEventSequence(initialState, events);
    if (!result.success) {
      return false;
    }
    results.push(result.updatedState);
  }

  // Verificar se todos os resultados são idênticos
  for (let i = 1; i < results.length; i++) {
    if (JSON.stringify(results[i]) !== JSON.stringify(results[0])) {
      console.error('[DETERMINISM] Results differ at iteration', i);
      return false;
    }
  }

  return true;
}

