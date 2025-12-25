/**
 * Match Store - Gerencia estado global da partida
 * 
 * Responsabilidades:
 * - Gerenciar fases da partida (LOBBY, DRAFT, MATCH, SHOPPING, RESULTS)
 * - Controlar players, rounds, turnOrder
 * - Detectar fim de partida e determinar vencedor
 * 
 * T059: Zustand Store para Match com phase, players, rounds, turnOrder, etc.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Match, MatchPhase, Player, Round } from '../types/game';
import { RoundState } from '../types/game';
import { DEFAULT_GAME_CONFIG } from '../config/game-config';
import { initializeTurnOrder } from '../core/turn-manager';
import { transitionToPhase } from '../core/state-machine';
import { generatePool } from '../core/pool-generator';

interface MatchState {
  // Estado atual da partida
  match: Match | null;
  
  // Actions
  navigateToLobby: () => void; // HOME → LOBBY (cria match inicial)
  startMatch: (players: Player[]) => void;
  transitionPhase: (newPhase: MatchPhase) => void;
  nextRound: () => void;
  nextTurn: () => void;
  endMatch: (winnerId: string) => void;
  updateMatch: (updater: (match: Match) => void) => void;
  resetMatch: () => void;
}

export const useMatchStore = create<MatchState>()(
  immer((set) => ({
    match: null,

    /**
     * Navega do HOME para LOBBY
     * - Cria um match vazio na fase LOBBY
     * - Usado apenas para navegação inicial HOME → LOBBY
     */
    navigateToLobby: () =>
      set((state) => {
        const now = Date.now();

        state.match = {
          id: `match_${now}`,
          phase: MatchPhase.LOBBY,
          players: [],
          rounds: [],
          currentRound: null,
          turnOrder: [],
          activeTurnIndex: 0,
          shopSignals: [],
          winnerId: null,
          startedAt: now,
          endedAt: null,
          seasonalShapes: [], // Temporadas não aplicáveis no LOBBY
        };
      }),

    /**
     * Inicia uma nova partida
     * - Cria estrutura Match inicial
     * - Randomiza ordem de turnos
     * - Inicia na fase LOBBY
     */
    startMatch: (players: Player[]) =>
      set((state) => {
        const now = Date.now();
        const turnOrder = initializeTurnOrder(players);

        state.match = {
          id: crypto.randomUUID(),
          phase: MatchPhase.LOBBY,
          players,
          rounds: [],
          currentRound: null,
          turnOrder,
          activeTurnIndex: 0,
          seasonalShapes: [],
          shopSignals: [],
          winnerId: null,
          startedAt: now,
          endedAt: null,
        };
      }),

    /**
     * Transiciona para nova fase
     * - Valida transição permitida
     * - Inicializa estado específico da fase
     * - Ex: DRAFT -> MATCH gera primeiro pool e inicia turno 1
     */
    transitionPhase: (newPhase: MatchPhase) =>
      set((state) => {
        if (!state.match) return;

        // Usa state machine do core para validar e executar transição
        const updatedMatch = transitionToPhase(state.match, newPhase);
        state.match = updatedMatch;

        // Se transicionou para MATCH e não tem round, gera primeiro
        if (newPhase === MatchPhase.MATCH && !state.match.currentRound) {
          const pool = generatePool(1, DEFAULT_GAME_CONFIG);
          const newRound: Round = {
            number: 1,
            pool,
            turns: [],
            shapeQuests: [],
            boostsToApply: [],
            state: RoundState.ACTIVE,
            startedAt: Date.now(),
            endedAt: null,
          };
          state.match.rounds.push(newRound);
          state.match.currentRound = newRound;
        }
      }),

    /**
     * Avança para próxima rodada
     * - Gera novo pool
     * - Reseta turnOrder para começar do primeiro jogador vivo
     * - Mantém Pill Coins acumulados
     */
    nextRound: () =>
      set((state) => {
        if (!state.match || !state.match.currentRound) return;

        const roundNumber = state.match.rounds.length + 1;
        const pool = generatePool(roundNumber, DEFAULT_GAME_CONFIG);

        const newRound: Round = {
          number: roundNumber,
          pool,
          turns: [],
          shapeQuests: [],
          boostsToApply: [],
          state: RoundState.ACTIVE,
          startedAt: Date.now(),
          endedAt: null,
        };

        // Finaliza round anterior
        if (state.match.currentRound) {
          state.match.currentRound.state = RoundState.COMPLETED;
          state.match.currentRound.endedAt = Date.now();
        }

        state.match.rounds.push(newRound);
        state.match.currentRound = newRound;
        state.match.activeTurnIndex = 0;
      }),

    /**
     * Avança para próximo turno
     * - Incrementa activeTurnIndex
     * - Pula jogadores eliminados
     * - Volta ao início quando chega no fim da ordem
     */
    nextTurn: () =>
      set((state) => {
        if (!state.match) return;

        const alivePlayers = state.match.players.filter((p: Player) => !p.isEliminated);
        if (alivePlayers.length === 0) return;

        // Incrementa e faz wrap
        state.match.activeTurnIndex = (state.match.activeTurnIndex + 1) % state.match.turnOrder.length;

        // Pula eliminados (max 10 tentativas para evitar loop infinito)
        let attempts = 0;
        while (attempts < 10) {
          const currentPlayerId = state.match.turnOrder[state.match.activeTurnIndex];
          const currentPlayer = state.match.players.find((p: Player) => p.id === currentPlayerId);
          if (currentPlayer && !currentPlayer.isEliminated) break;

          state.match.activeTurnIndex = (state.match.activeTurnIndex + 1) % state.match.turnOrder.length;
          attempts++;
        }
      }),

    /**
     * Finaliza partida
     * - Define winnerId
     * - Transiciona para RESULTS
     * - Registra timestamp de fim
     */
    endMatch: (winnerId: string) =>
      set((state) => {
        if (!state.match) return;

        state.match.winnerId = winnerId;
        state.match.phase = MatchPhase.RESULTS;
        state.match.endedAt = Date.now();
      }),

    /**
     * Atualiza match com função customizada
     * - Permite updates complexos via Immer
     */
    updateMatch: (updater) =>
      set((state) => {
        if (!state.match) return;
        updater(state.match);
      }),

    /**
     * Reseta estado para novo jogo
     */
    resetMatch: () =>
      set((state) => {
        state.match = null;
      }),
  }))
);

