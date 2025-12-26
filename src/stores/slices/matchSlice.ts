/**
 * Match Slice - Gerencia ciclo de vida da partida
 *
 * Responsabilidades:
 * - Fases da partida (LOBBY, DRAFT, MATCH, SHOPPING, RESULTS)
 * - Rodadas e turnos
 * - Inicio e fim de partida
 *
 * Seguindo Zustand Slices Pattern
 */

import type { SliceCreator, MatchSlice, RoundSummary } from './types';
import type { Player } from '../../types/game';
import { MatchPhase, RoundState } from '../../types/game';
import { generatePool } from '../../core/pool-generator';
import { initializeTurnOrder } from '../../core/turn-manager';
import { DEFAULT_GAME_CONFIG } from '../../config/game-config';
import { setSeed } from '../../core/utils/random';

export const createMatchSlice: SliceCreator<MatchSlice> = (set, get) => ({
  // ==================== STATE ====================
    match: null,
  currentRound: null,
  rounds: [],

  // ==================== ACTIONS ====================

  /**
   * Navega do HOME para LOBBY
   * Cria um match vazio na fase LOBBY
   */
  navigateToLobby: () =>
    set((state) => {
      setSeed(0);
      // BUG: Uso de Date.now() para ID torna a criação de partida não-determinística.
      // Sugestão: IDs devem ser passados como payload de evento ou gerados deterministicamente.
      const now = Date.now();

      state.match = {
        id: `match_${now}`,
        seed: 0,
        phase: MatchPhase.LOBBY,
        turnOrder: [],
        activeTurnIndex: 0,
        seasonalShapes: [],
        shopSignals: [],
        winnerId: null,
        startedAt: now,
        endedAt: null,
      };
    }),

  /**
   * Inicia uma nova partida com players
   * - Armazena players no playersSlice
   * - Randomiza ordem de turnos
   */
  startMatch: (players: Player[], seed: number = Date.now()) =>
    set((state) => {
      setSeed(seed);
      // Armazena players diretamente no state (nao usar get() dentro de set())
      state.players = new Map(players.map((p) => [p.id, p]));

      const turnOrder = initializeTurnOrder(players);
      const matchId = `match-${seed}`;

      state.match = {
        id: matchId,
        seed,
        phase: MatchPhase.LOBBY,
        turnOrder,
        activeTurnIndex: 0,
        seasonalShapes: [],
        shopSignals: [],
        winnerId: null,
        startedAt: Date.now(),
        endedAt: null,
      };
    }),

  /**
   * Transiciona para nova fase
   * Se transiciona para MATCH, gera primeira rodada
   */
  transitionPhase: (newPhase: MatchPhase) =>
    set((state) => {
      if (!state.match) return;

      state.match.phase = newPhase;

      // Se transiciona para MATCH e nao tem round, gera primeiro
      if (newPhase === MatchPhase.MATCH && !state.currentRound) {
        const pool = generatePool(1, DEFAULT_GAME_CONFIG);

        state.currentRound = {
          number: 1,
          pool,
          turns: [],
          shapeQuests: [],
          boostsToApply: [],
          state: RoundState.ACTIVE,
          startedAt: Date.now(),
          endedAt: null,
        };
      }
    }),

  /**
   * Avanca para proxima rodada
   * - Salva resumo da rodada anterior
   * - Gera novo pool
   */
  nextRound: () =>
    set((state) => {
      if (!state.match || !state.currentRound) return;

      // Salvar resumo da rodada anterior
      const roundSummary: RoundSummary = {
        number: state.currentRound.number,
        pillsConsumed:
          state.currentRound.pool.size - state.currentRound.pool.pills.length,
        questsCompleted: state.currentRound.shapeQuests.filter(
          (q) => q.status === 'COMPLETED'
        ).length,
        collapses: 0, // TODO: calcular via playersSlice
        duration: Date.now() - state.currentRound.startedAt,
      };
      state.rounds.push(roundSummary);

      // Nova rodada
      const roundNumber = state.currentRound.number + 1;
      const pool = generatePool(roundNumber, DEFAULT_GAME_CONFIG);

      state.currentRound = {
        number: roundNumber,
        pool,
        turns: [],
        shapeQuests: [],
        boostsToApply: [],
        state: RoundState.ACTIVE,
        startedAt: Date.now(),
        endedAt: null,
      };

      state.match.activeTurnIndex = 0;
    }),

  /**
   * Avanca para proximo turno
   * - Incrementa activeTurnIndex
   * - Pula jogadores eliminados
   */
  nextTurn: () =>
    set((state) => {
      if (!state.match) return;

      // Usa playersSlice query via get()
      const alivePlayers = get().getAlivePlayers();
      if (alivePlayers.length === 0) return;

      // Incrementa e faz wrap
      state.match.activeTurnIndex =
        (state.match.activeTurnIndex + 1) % state.match.turnOrder.length;

      // Pular eliminados (max 10 tentativas para evitar loop infinito)
      let attempts = 0;
      while (attempts < 10) {
        const currentPlayerId =
          state.match.turnOrder[state.match.activeTurnIndex];
        const currentPlayer = get().getPlayer(currentPlayerId);

        if (currentPlayer && !currentPlayer.isEliminated) break;

        state.match.activeTurnIndex =
          (state.match.activeTurnIndex + 1) % state.match.turnOrder.length;
        attempts++;
      }
    }),

  /**
   * Finaliza partida
   * - Define winnerId
   * - Transiciona para RESULTS
   */
  endMatch: (winnerId: string) =>
    set((state) => {
      if (!state.match) return;

      state.match.winnerId = winnerId;
      state.match.phase = MatchPhase.RESULTS;
      state.match.endedAt = Date.now();
    }),

  /**
   * Reseta estado para novo jogo
   */
  resetMatch: () =>
    set((state) => {
      setSeed(0);
      state.match = null;
      state.currentRound = null;
      state.rounds = [];
      state.players = new Map();
    }),

  /**
   * Atualiza currentRound com funcao customizada
   * Util para updates complexos via Immer
   */
  updateCurrentRound: (updater) =>
    set((state) => {
      if (!state.currentRound) return;
      updater(state.currentRound);
    }),
});

