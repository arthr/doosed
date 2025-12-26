/**
 * Types: Game Entities
 *
 * Baseado em data-model.md (Player, Pool, ShapeQuest, Turn, Round, Match, ShoppingPhase, Profile)
 */

import type { Pill, PillModifier } from './pill';
import type { Item, InventorySlot } from './item';
import type { Status } from './status';

// Re-export tipos usados em stores
export type { Pill, Item, InventorySlot, Status, PillModifier };

// ============================================================================
// Enums
// ============================================================================

export enum BotLevel {
  EASY = 'EASY', // Paciente (conservador)
  NORMAL = 'NORMAL', // Cobaia (balanceado)
  HARD = 'HARD', // Sobrevivente (calculista)
  INSANE = 'INSANE', // Hofmann (impiedoso)
}

export enum MatchPhase {
  LOBBY = 'LOBBY', // Configurando sala
  DRAFT = 'DRAFT', // Draft de itens (60s)
  MATCH = 'MATCH', // Partida em andamento
  SHOPPING = 'SHOPPING', // Shopping Phase (entre rodadas)
  RESULTS = 'RESULTS', // Resultados finais
}

export enum RoundState {
  ACTIVE = 'ACTIVE', // Rodada ativa (turnos em progresso)
  COMPLETED = 'COMPLETED', // Rodada completada (pool esgotado)
}

export enum QuestStatus {
  ACTIVE = 'ACTIVE', // Quest ativa (em progresso)
  COMPLETED = 'COMPLETED', // Quest completada (recompensa concedida)
  FAILED = 'FAILED', // Quest falhada (sequência errada)
  DISCARDED = 'DISCARDED', // Quest descartada (nova rodada iniciou)
}

export enum ShoppingState {
  ACTIVE = 'ACTIVE', // Shopping ativo (timer contando)
  COMPLETED = 'COMPLETED', // Shopping concluído (todos confirmaram OU timer expirou)
}

export enum BoostType {
  ONE_UP = 'ONE_UP', // +1 Vida no início da próxima rodada
  REBOOT = 'REBOOT', // Resistência restaurada para máximo
  SCANNER_2X = 'SCANNER_2X', // 2 pills reveladas automaticamente
}

// ============================================================================
// Interfaces
// ============================================================================

export interface Player {
  id: string; // UUID
  name: string; // Nome de exibição (1-20 chars)
  avatar: string; // Avatar visual (URL)
  isBot: boolean; // Se é bot ou humano
  botLevel?: BotLevel; // Nível de dificuldade (se isBot)

  // Health
  lives: number; // Vidas atuais (≥ 0, ≤ 3)
  resistance: number; // Resistência atual (pode ser negativa)
  resistanceCap: number; // Resistência máxima (> 0)
  extraResistance: number; // Resistência extra/overflow (≥ 0, ≤ cap)

  // Inventory & Economy
  inventory: InventorySlot[]; // Inventário (≤ 5 slots)
  pillCoins: number; // Moeda da partida (≥ 0)

  // State
  activeStatuses: Status[]; // Status ativos
  isEliminated: boolean; // Se foi eliminado
  isLastChance: boolean; // Se está em última chance (0 vidas)
  isActiveTurn: boolean; // Se é turno ativo

  // Stats
  totalCollapses: number; // Total de colapsos sofridos (≥ 0)

  // Quest
  shapeQuest: ShapeQuest | null; // Quest ativa da rodada

  // Shopping
  wantsShop: boolean; // Sinalizou interesse na loja
}

export interface Pool {
  roundNumber: number; // Número da rodada (≥ 1)
  pills: Pill[]; // Array de pílulas
  size: number; // Tamanho total (≥ 6, ≤ 12)
  counters: Record<string, number>; // Contadores por tipo (PillType string keys)
  revealed: Pill[]; // Pills reveladas
  unlockedShapes: string[]; // Shapes disponíveis (ShapeIds)
}

export interface ShapeQuest {
  id: string; // UUID
  roundNumber: number; // Rodada da quest (≥ 1)
  playerId: string; // Jogador dono (FK)
  sequence: string[]; // Sequência de shapes (ShapeIds, length 2-5)
  progress: number; // Progresso atual (≥ 0, ≤ length)
  reward: number; // Pill Coins ao completar (> 0)
  status: QuestStatus; // Estado da quest
}

export interface Boost {
  type: BoostType; // Tipo do boost
  cost: number; // Custo em Pill Coins (> 0)
  effect: string; // Descrição do efeito
  requirement?: string; // Requisito de disponibilidade
}

export interface Turn {
  playerId: string; // Jogador do turno (FK)
  timerRemaining: number; // Timer em segundos (≥ 0, ≤ 30)
  itemsUsed: Item[]; // Itens usados no turno
  pillConsumed: Pill | null; // Pill consumida
  statusesApplied: Status[]; // Status aplicados em alvos
  startedAt: number; // Início do turno (timestamp)
  endedAt: number | null; // Fim do turno (timestamp)
  targetingActive: boolean; // Se está selecionando alvo
}

export interface Round {
  number: number; // Número da rodada (≥ 1)
  pool: Pool; // Pool de pills
  turns: Turn[]; // Turnos executados
  shapeQuests: ShapeQuest[]; // Quests geradas (1 por jogador vivo)
  boostsToApply: Boost[]; // Boosts a aplicar no início
  state: RoundState; // Estado da rodada
  startedAt: number; // Início da rodada (timestamp)
  endedAt: number | null; // Fim da rodada (timestamp)
}

/**
 * Match Interface - Estrutura canonica para event-processor/replays
 *
 * NOTA IMPORTANTE: Esta interface representa o modelo conceitual completo.
 * O gameStore usa estrutura otimizada diferente:
 * - players: Map<string, Player> em playersSlice (O(1) lookup)
 * - rounds: RoundSummary[] em matchSlice (historico resumido)
 * - currentRound: objeto inline em matchSlice (com pool)
 *
 * Use esta interface para:
 * - Event processor (replays, auditoria)
 * - Serializacao/deserializacao de estado
 * - Validacao de invariantes de match
 *
 * Para operacoes em runtime, use os hooks e stores diretamente.
 */
export interface Match {
  id: string; // UUID
  phase: MatchPhase; // Fase atual
  players: Player[]; // Jogadores (length 2-6) - em runtime: playersSlice.players
  rounds: Round[]; // Rodadas jogadas - em runtime: matchSlice.rounds (RoundSummary[])
  currentRound: Round | null; // Rodada atual - em runtime: matchSlice.currentRound
  turnOrder: string[]; // Ordem de turnos (PlayerIds, fixa)
  activeTurnIndex: number; // Indice do turno ativo (>= 0)
  seasonalShapes: string[]; // Shapes sazonais ativas (ShapeIds)
  shopSignals: string[]; // Jogadores que sinalizaram loja (PlayerIds)
  winnerId: string | null; // Vencedor (se partida terminou)
  startedAt: number; // Inicio da partida (timestamp)
  endedAt: number | null; // Fim da partida (timestamp)
}

export interface CartItem {
  item: Item; // Item no carrinho
  quantity: number; // Quantidade (para stackables)
}

export interface ShoppingPhase {
  qualifiedPlayers: string[]; // Jogadores que podem comprar (PlayerIds)
  timerRemaining: number; // Timer em segundos (≥ 0, ≤ 30)
  carts: Record<string, CartItem[]>; // Carrinhos de compra (por PlayerId)
  confirmations: string[]; // Jogadores que confirmaram (PlayerIds)
  state: ShoppingState; // Estado da fase
}

export interface Profile {
  id: string; // UUID
  name: string; // Nome do jogador (1-20 chars)
  avatar: string; // Avatar escolhido (URL)
  level: number; // Nível atual (≥ 1)
  xp: number; // XP acumulado (≥ 0)
  schmeckles: number; // Meta-moeda acumulada (≥ 0)
  gamesPlayed: number; // Total de partidas jogadas (≥ 0)
  wins: number; // Total de vitórias (≥ 0)
  totalRoundsSurvived: number; // Total de rodadas sobrevividas (≥ 0)
  mostUsedItems: Record<string, number>; // Contadores de uso de itens (ItemId → count)
  lastUpdated: number; // Timestamp da última atualização (unix timestamp)
}

// ============================================================================
// Helper Types
// ============================================================================

export interface PersistedProfile {
  version: string; // Schema version (ex: "1.0.0")
  data: Profile; // Profile data
}

export interface Rewards {
  xp: number; // XP ganho
  schmeckles: number; // Schmeckles ganhos
}

// ============================================================================
// Type Guards
// ============================================================================

export function isBotLevel(value: string): value is BotLevel {
  return Object.values(BotLevel).includes(value as BotLevel);
}

export function isMatchPhase(value: string): value is MatchPhase {
  return Object.values(MatchPhase).includes(value as MatchPhase);
}

export function isRoundState(value: string): value is RoundState {
  return Object.values(RoundState).includes(value as RoundState);
}

export function isQuestStatus(value: string): value is QuestStatus {
  return Object.values(QuestStatus).includes(value as QuestStatus);
}

export function isShoppingState(value: string): value is ShoppingState {
  return Object.values(ShoppingState).includes(value as ShoppingState);
}

export function isBoostType(value: string): value is BoostType {
  return Object.values(BoostType).includes(value as BoostType);
}
