/**
 * State Machine: Transições de Fase do Jogo
 *
 * Implementa:
 * - MatchPhase state machine (LOBBY → DRAFT → MATCH → SHOPPING → RESULTS)
 * - Validação de transições permitidas
 * - Inicialização de estado específico por fase
 * - Detecção de fim de partida (1 sobrevivente)
 *
 * Baseado em data-model.md "Match -> Phase Transitions"
 * FR-001 a FR-020, FR-043 a FR-067, FR-111 a FR-113
 */

import { MatchPhase, type Match, type Player } from '../types/game';

// ============================================================================
// Types
// ============================================================================

export interface PhaseTransition {
  from: MatchPhase;
  to: MatchPhase;
  allowed: boolean;
  reason?: string;
}

// ============================================================================
// T049: Define MatchPhase State Machine
// ============================================================================

/**
 * Define transições válidas entre fases
 *
 * LOBBY → DRAFT (clicar "Start")
 * DRAFT → MATCH (timer expira OU clicar "Confirm")
 * MATCH → SHOPPING (se alguém sinalizou loja E tem coins)
 * MATCH → MATCH (próxima rodada, se ninguém sinalizou loja)
 * MATCH → RESULTS (quando 1 sobrevivente resta)
 * SHOPPING → MATCH (próxima rodada)
 * RESULTS → LOBBY ("Jogar Novamente") ou HOME ("Menu Principal")
 */
const VALID_TRANSITIONS: Record<MatchPhase, MatchPhase[]> = {
  [MatchPhase.LOBBY]: [MatchPhase.DRAFT],
  [MatchPhase.DRAFT]: [MatchPhase.MATCH],
  [MatchPhase.MATCH]: [MatchPhase.SHOPPING, MatchPhase.MATCH, MatchPhase.RESULTS],
  [MatchPhase.SHOPPING]: [MatchPhase.MATCH],
  [MatchPhase.RESULTS]: [MatchPhase.LOBBY],
};

/**
 * Valida se transição é permitida
 */
export function isTransitionAllowed(from: MatchPhase, to: MatchPhase): PhaseTransition {
  const allowedPhases = VALID_TRANSITIONS[from];

  if (!allowedPhases) {
    return {
      from,
      to,
      allowed: false,
      reason: `Invalid source phase: ${from}`,
    };
  }

  if (!allowedPhases.includes(to)) {
    return {
      from,
      to,
      allowed: false,
      reason: `Transition from ${from} to ${to} is not allowed`,
    };
  }

  return {
    from,
    to,
    allowed: true,
  };
}

// ============================================================================
// T050: Transition to Phase (with Validation)
// ============================================================================

/**
 * Transiciona para nova fase, inicializando estado específico
 *
 * Inicialização por fase:
 * - DRAFT: Inicia timer de 60s
 * - MATCH: Gera pool primeira rodada, inicializa turnos
 * - SHOPPING: Cria ShoppingPhase com qualificados
 * - RESULTS: Calcula XP/Schmeckles
 */
export function transitionToPhase(match: Match, newPhase: MatchPhase): Match {
  // Validar transição
  const transition = isTransitionAllowed(match.phase, newPhase);
  if (!transition.allowed) {
    throw new Error(transition.reason || 'Invalid transition');
  }

  let updatedMatch: Match = {
    ...match,
    phase: newPhase,
  };

  // Inicializar estado específico da fase
  switch (newPhase) {
    case MatchPhase.LOBBY:
      // Reset para novo jogo
      updatedMatch = {
        ...updatedMatch,
        rounds: [],
        currentRound: null,
        activeTurnIndex: 0,
        winnerId: null,
      };
      break;

    case MatchPhase.DRAFT:
      // Timer de 60s gerenciado externamente (hooks)
      updatedMatch = {
        ...updatedMatch,
        startedAt: Date.now(),
      };
      break;

    case MatchPhase.MATCH:
      // Pool primeira rodada e turnos gerenciados externamente (stores)
      // currentRound será definido quando round for criado
      break;

    case MatchPhase.SHOPPING:
      // ShoppingPhase criado externamente (economyStore)
      break;

    case MatchPhase.RESULTS:
      // Calcular XP/Schmeckles externamente (progressionStore)
      updatedMatch = {
        ...updatedMatch,
        endedAt: Date.now(),
      };
      break;
  }

  return updatedMatch;
}

// ============================================================================
// T051: Check Match End (1 Survivor)
// ============================================================================

/**
 * Verifica se partida terminou (apenas 1 jogador vivo)
 *
 * FR-111 a FR-113: Match termina quando 1 sobrevivente
 */
export function checkMatchEnd(match: Match): {
  ended: boolean;
  winnerId: string | null;
  reason?: string;
} {
  const alivePlayers = match.players.filter((p: Player) => !p.isEliminated);

  if (alivePlayers.length === 1) {
    return {
      ended: true,
      winnerId: alivePlayers[0].id,
      reason: 'Only 1 player remaining',
    };
  }

  if (alivePlayers.length === 0) {
    // Edge case: todos eliminados simultaneamente (ex: todos consumiram FATAL)
    return {
      ended: true,
      winnerId: null,
      reason: 'All players eliminated (draw)',
    };
  }

  return {
    ended: false,
    winnerId: null,
  };
}

/**
 * Retorna jogadores vivos
 */
export function getAlivePlayers(match: Match): Player[] {
  return match.players.filter((p: Player) => !p.isEliminated);
}

/**
 * Retorna jogadores eliminados
 */
export function getEliminatedPlayers(match: Match): Player[] {
  return match.players.filter((p: Player) => p.isEliminated);
}

/**
 * Conta jogadores vivos
 */
export function countAlivePlayers(match: Match): number {
  return getAlivePlayers(match).length;
}

// ============================================================================
// Helpers: Phase-specific Checks
// ============================================================================

/**
 * Verifica se pode iniciar Draft (requisitos mínimos)
 */
export function canStartDraft(match: Match): { can: boolean; reason?: string } {
  if (match.phase !== MatchPhase.LOBBY) {
    return { can: false, reason: 'Not in LOBBY phase' };
  }

  if (match.players.length < 2) {
    return { can: false, reason: 'Need at least 2 players' };
  }

  if (match.players.length > 6) {
    return { can: false, reason: 'Maximum 6 players' };
  }

  return { can: true };
}

/**
 * Verifica se pode iniciar Match (Draft completo)
 */
export function canStartMatch(match: Match): { can: boolean; reason?: string } {
  if (match.phase !== MatchPhase.DRAFT) {
    return { can: false, reason: 'Not in DRAFT phase' };
  }

  // Draft sempre pode avançar (timer expira ou confirm)
  return { can: true };
}

/**
 * Verifica se pode abrir Shopping (alguém sinalizou E tem coins)
 */
export function canOpenShopping(match: Match): { can: boolean; reason?: string } {
  if (match.phase !== MatchPhase.MATCH) {
    return { can: false, reason: 'Not in MATCH phase' };
  }

  const qualifiedPlayers = match.players.filter(
    (p: Player) => !p.isEliminated && p.wantsShop && p.pillCoins > 0
  );

  if (qualifiedPlayers.length === 0) {
    return { can: false, reason: 'No qualified players for shopping' };
  }

  return { can: true };
}

/**
 * Verifica se deve transicionar para Results
 */
export function shouldTransitionToResults(match: Match): boolean {
  const { ended } = checkMatchEnd(match);
  return ended;
}

