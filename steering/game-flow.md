---
inclusion: always
---

# Game Flow Architecture - Dosed

## Critical Architecture Rules

### Phase Management Rules

- **Current**: 6 complex phases (setup → itemSelection → playing → roundEnding → shopping → ended)
- **Target**: 4 simplified phases (LOBBY → DRAFT → MATCH → RESULTS)
- **Event Limit**: Maximum 8 event types for multiplayer synchronization
- **Pure Functions**: All event processing must use pure functions with immutable state

### Critical Development Rules

2. **Component Separation**: Components must be pure UI - no business logic
3. **Hook Bridge**: Use hooks to bridge UI and state/logic layers
4. **Immutable Updates**: All state changes must return new objects
5. **Type Safety**: Strict TypeScript - no `any` types allowed
6. **Testing**: Both unit tests and property-based tests required for utils
7. **Event-Driven**: Target architecture uses max 8 event types for clean multiplayer sync

### File Naming Conventions

- **Components**: PascalCase (e.g., `GameBoard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGameActions.ts`)
- **Stores**: camelCase (e.g., `gameStore.ts`)
- **Utils**: camelCase (e.g., `gameLogic.ts`)
- **Types**: camelCase (e.g., `player.ts`)

## Architecture Overview

### Key Architectural Principles

- **Separation of Concerns**: Components (UI) → Hooks (Bridge) → Stores (State) → Utils (Logic)
- **Modular Design**: Feature-based organization with clear boundaries
- **Event-Driven**: Target system uses maximum 8 event types for simplified multiplayer
- **Immutable State**: All updates return new objects for reliable change detection
- **Pure Functions**: Business logic in utils must have no side effects

### Clean Architecture (PREFERRED FOR NEW FEATURES)

**CRITICAL**: When working on this codebase, prioritize the clean architecture:

1. **Use modular stores** in `src/stores/game/` for new features
2. **Follow 4-phase pattern**: LOBBY → DRAFT → MATCH → RESULTS
3. **Implement event-driven system** with max 8 event types
4. **Ensure pure functions** for all game logic

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CLEAN GAME FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  main.tsx → App.tsx → GameLayout → GameEngine                           │
│                                        ↓                                │
│             ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│             ↓             ↓             ↓             ↓             │   │
│         [LOBBY]       [DRAFT]       [MATCH]      [RESULTS]          │   │
│             ↓             ↓             ↓             ↓             │   │
│    ┌────────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐    │   │
│    │ Player Setup   │ │ Item     │ │ Unified  │ │ Stats &      │    │   │
│    │ + AI Bots      │ │ Selection│ │ Gameplay │ │ Rematch      │    │   │
│    │ + Difficulty   │ │ (30s)    │ │ + Store  │ │              │    │   │
│    │ + Room Config  │ │          │ │ Overlay  │ │              │    │   │
│    └────────────────┘ └──────────┘ └──────────┘ └──────────────┘    │   │
│                                                                     │   │
│   ┌───────────────────────────────────────────────────────────────┐ │   │
│   │                    EVENT-DRIVEN CORE                          │ │   │
│   │  GameEngine → EventProcessor → ModularStores                  │ │   │
│   │  • Max 8 Event Types  • Pure Functions  • Immutable State     │ │   │
│   └───────────────────────────────────────────────────────────────┘ │   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Store Architecture Rules

**MIGRATION PRIORITY**: The codebase is transitioning from legacy to clean architecture.

### Current Store Structure (Legacy - DO NOT EXTEND)

```
src/stores/
├── gameStore.ts              # Store legado (2386 linhas - SERÁ REMOVIDO)
├── overlayStore.ts           # Gerencia modais/overlays
├── toastStore.ts             # Sistema de notificações
├── multiplayerStore.ts       # Conexão Supabase Realtime
├── devToolStore.ts           # Ferramentas de desenvolvimento
│
└── game/                     # Stores modulares (transição)
    ├── index.ts              # Barrel exports
    ├── gameFlowStore.ts      # Fases, turnos, rodadas, vencedor
    ├── playerStore.ts        # Jogadores, vidas, resistência, inventário
    ├── pillPoolStore.ts      # Pool de pílulas, consumo, revelação
    ├── effectsStore.ts       # Efeitos ativos (shield, handcuffs)
    ├── itemUsageStore.ts     # Seleção de alvo, uso de itens
    └── shopStore.ts          # Pill Store, carrinho, boosts
```

#### Nova Arquitetura Clean (Destino)

```
src/stores/
├── overlayStore.ts           # Gerencia modais/overlays (mantido)
├── toastStore.ts             # Sistema de notificações (mantido)
├── multiplayerStore.ts       # Conexão Supabase Realtime (mantido)
├── devToolStore.ts           # Development tools (maintained)
│
└── clean-architecture/       # New modular architecture
    ├── index.ts              # Barrel exports
    ├── sessionStore.ts       # LOBBY: players, bots, config
    ├── draftStore.ts         # DRAFT: item selection, timer
    ├── matchStore.ts         # MATCH: gameplay core, unified
    ├── resultsStore.ts       # RESULTS: stats, winner, rematch
    │
    ├── gameEngine.ts         # Core game engine
    ├── eventProcessor.ts     # Event-driven architecture
    └── types.ts              # Clean architecture types
```

## Component Architecture Rules

**CRITICAL PATTERNS**: Follow strict separation of concerns:

- **Components**: Pure UI rendering only, no business logic
- **Hooks**: Bridge between UI and state, contain side effects
- **Stores**: State management with immutable updates
- **Utils**: Pure functions for game logic (no side effects)

### Component Structure

```
src/components/
├── ui/                       # Componentes base
│   ├── 8bit/                # Componentes estilizados retro
│   └── paceui/              # Componentes adicionais
│
├── layout/
│   └── GameLayout.tsx       # Layout principal
│
├── game/                    # Componentes do jogo
│   ├── GameBoard.tsx        # Orquestrador principal
│   ├── ItemSelectionScreen.tsx  # Seleção pré-jogo
│   ├── PillPool.tsx         # Mesa de pílulas
│   ├── AnimatedPlayerArea.tsx   # Área do jogador
│   ├── TurnIndicator.tsx    # Indicador de turno
│   ├── ShapeQuestDisplay.tsx    # Display de quests
│   ├── PillStore.tsx        # Interface da loja
│   └── [25+ outros componentes]
│
├── multiplayer/             # Componentes multiplayer
│   ├── LobbyScreen.tsx      # Tela de lobby
│   ├── CreateRoomForm.tsx   # Criação de sala
│   ├── JoinRoomForm.tsx     # Entrada em sala
│   ├── WaitingRoom.tsx      # Aguardando jogadores
│   └── DisconnectedOverlay.tsx  # Overlay de desconexão
│
├── overlays/                # Modais/overlays
│   ├── OverlayManager.tsx   # Gerenciador central
│   ├── PillReveal.tsx       # Animação de consumo
│   ├── GameOverDialog.tsx   # Fim de jogo
│   ├── NewRoundOverlay.tsx  # Nova rodada
│   └── ItemEffectOverlay.tsx    # Efeitos de itens
│
├── toasts/                  # Sistema de notificações
│   ├── ToastManager.tsx     # Gerenciador central
│   ├── Toast.tsx           # Componente individual
│   └── PlayerToasts.tsx    # Toasts específicos do jogador
│
└── dev/                     # Ferramentas de desenvolvimento
    ├── DevPage.tsx          # Página de debug
    ├── FloatingDevTool/     # DevTool flutuante
    ├── RealtimeDebugger.tsx # Debug multiplayer
    └── DistributionSimulator.tsx # Simulador de distribuição
```

## Business Logic Rules

### Utils Structure (Pure Functions Only)

```
src/utils/
├── constants.ts             # Configurações do jogo
├── gameLogic.ts            # Mecânicas core (dano, cura, colapso)
├── pillGenerator.ts        # Geração de pools de pílulas
├── pillProgression.ts      # Progressão de tipos por rodada
├── shapeProgression.ts     # Progressão de formas por rodada
├── questGenerator.ts       # Geração de Shape Quests
├── itemCatalog.ts          # Catálogo de itens (9+ itens)
├── itemLogic.ts            # Lógica de efeitos de itens
├── storeConfig.ts          # Configuração da Pill Store
├── aiLogic.ts              # IA (4 níveis de dificuldade)
├── aiConfig.ts             # Configuração da IA
├── playerManager.ts        # Gerenciamento de jogadores (UUID)
├── turnManager.ts          # Rotação de turnos (N-players)
└── __tests__/              # Testes unitários (6 arquivos)
```

## Hook Architecture Rules

**HOOK PATTERNS**: Hooks are the bridge layer between UI and business logic:

- **Actions**: `useGameActions.ts` - wrap store actions
- **Selectors**: `useGameState.ts` - optimized state subscriptions
- **Effects**: `usePillConsumption.ts` - complex UI flows
- **AI**: `useAIPlayer.ts` - automated behaviors

### Hook Structure (30+ hooks)

```
src/hooks/
├── index.ts                    # Barrel exports
│
├── useGameActions.ts           # Actions do jogo (startGame, selectPill, etc)
├── useGameState.ts             # Selectors otimizados (useGamePhase, useCurrentTurn, etc)
├── useGameBoardState.ts        # Estado encapsulado do GameBoard
│
├── usePillConsumption.ts       # Fluxo de consumo de pílulas
├── useItemUsage.ts             # Uso de itens durante partida
├── useItemSelection.ts         # Seleção de itens pré-jogo
├── useItemSelectionState.ts    # Estado da seleção de itens
├── useItemCatalog.ts           # Acesso ao catálogo de itens
│
├── useAIPlayer.ts              # Automação da IA
├── useAIItemSelection.ts       # Seleção automática de itens pela IA
├── useAIStore.ts               # Estado da IA
│
├── useMultiplayer.ts           # Conexão multiplayer
├── useRoomConnection.ts        # Gerenciamento de salas
│
├── useOverlay.ts               # Sistema de overlays
├── useOverlayState.ts          # Estado dos overlays
├── useToast.ts                 # Sistema de notificações
│
├── useStoreTimer.ts            # Timer da Pill Store
├── usePillStoreState.ts        # Estado da Pill Store
├── useStoreCatalog.ts          # Catálogo da loja
│
├── useTargetablePlayers.ts     # Jogadores alvejáveis (N-player)
├── useSeatLabel.ts             # Labels de assento (P1, P2, etc)
│
├── useDevTool.ts               # Ferramentas de desenvolvimento
├── useDevToolActions.ts        # Actions do DevTool
├── useDevToolGameSnapshot.ts   # Snapshot do jogo
└── useDevToolStoresSnapshot.ts # Snapshot dos stores
```

## Type System Rules

### Type Structure

```
src/types/
├── index.ts                # Barrel exports
├── game.ts                 # GameState, GamePhase, GameConfig
├── player.ts               # Player, PlayerId (UUID), PlayerEffect
├── pill.ts                 # Pill, PillType, PillShape, PillConfig
├── item.ts                 # ItemType, ItemCategory, InventoryItem
├── quest.ts                # ShapeQuest, QuestConfig
├── store.ts                # StoreState, StoreItem, BoostType
├── ai.ts                   # AIDecisionContext, PoolRiskAnalysis
├── multiplayer.ts          # Room, ConnectionStatus, GameMode
├── events.ts               # GameEvent, MultiplayerEvent
└── sync.ts                 # SyncData, estado de sincronização
```

## Service Architecture Rules

### Service Structure

```
src/services/
├── index.ts                # Barrel exports
├── realtimeService.ts      # Serviço principal Supabase Realtime
│
├── realtime/               # Módulos Realtime
│   └── index.ts           # Configuração de canais
│
├── game/                   # Serviços de jogo
│   └── index.ts           # Lógica de sincronização
│
└── sync/                   # Sincronização de estado
    └── index.ts           # Utilitários de sync
```

│ │ ├── ItemCard.tsx # Card visual do item
│ │ ├── InventoryBar.tsx # Barra de inventario (5 slots)
│ │ ├── InventorySlot.tsx # Slot individual de item
│ │ ├── ItemTargetSelector.tsx # Overlay de selecao de alvo
│ │ │
│ │ │ # Sistema de Shapes
│ │ ├── ShapeIcon.tsx # Icone de shape isolado
│ │ ├── ShapeQuestDisplay.tsx # UI do objetivo atual
│ │ ├── ShapeSelector.tsx # Selecao de shape para itens
│ │ │
│ │ │ # Pill Store
│ │ ├── PillStore.tsx # UI principal da loja
│ │ ├── StoreItemCard.tsx # Card de item na loja
│ │ └── WaitingForOpponent.tsx # Tela de espera
│ │
│ ├── overlays/ # Overlays bloqueantes
│ │ ├── OverlayManager.tsx # Gerencia qual overlay esta ativo
│ │ ├── PillReveal.tsx # Revela pilula consumida
│ │ ├── GameOverDialog.tsx # Tela de fim de jogo
│ │ ├── NewRoundOverlay.tsx # Banner de nova rodada
│ │ └── ItemEffectOverlay.tsx # Feedback visual de item usado
│ │
│ └── toasts/ # Notificacoes
│ ├── ToastManager.tsx # Renderiza toasts ativos
│ ├── Toast.tsx # Toast individual (8bit style)
│ └── PlayerToasts.tsx # Toasts contextuais por jogador

```

---

## Game Flow Rules

**CRITICAL**: Game flow is the core orchestration system. Follow these patterns:

### Game Phase Management

#### Current Flow (Legacy - 6 Complex Phases - AVOID EXTENDING)
```

┌──────────┐ startGame() ┌───────────────┐ confirmacao ┌──────────┐ eliminacao ┌──────────┐
│ setup │ ─────────────→ │ itemSelection │ ────────────→ │ playing │ ───────────→ │ ended │
└──────────┘ └───────────────┘ └──────────┘ └──────────┘
↑ │ │ │
│ │ (multiplayer) │ pool vazio │
│ ↓ ↓ │
│ ┌───────────────┐ [Alguém sinalizou loja?] │
│ │ roundEnding │ │ │ │
│ │ (delay 2s) │ NÃO SIM │
│ └───────────────┘ │ ↓ │
│ │ │ ┌───────────┐ │
│ ↓ │ │ shopping │ (30s) │
│ [Sync multiplayer] │ └───────────┘ │
│ │ │ │
│ ↓ ↓ │
│ ┌─────────────────┐ │
│ │ resetRound() │ │
│ │ (aplica boosts) │ │
│ └─────────────────┘ │
│ │ │
│ ↓ │
│ [playing - nova rodada] │
│ │
└──────────────────────────── resetGame() ───────────────────────────────────────────┘

```

#### Target Clean Flow (4 Simplified Phases - PREFERRED)
```

┌─────────┐ createGame() ┌─────────┐ startDraft() ┌─────────┐ startMatch() ┌─────────┐
│ LOBBY │ ─────────────→ │ DRAFT │ ─────────────→ │ MATCH │ ─────────────→ │ RESULTS │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
↑ │ │ │
│ │ │ │
│ • Player Setup │ • Item Selection │ • Unified Gameplay │ • Stats
│ • AI Bot Config │ • 30s Timer │ • Store as Overlay │ • Winner
│ • Room Settings │ • Auto-complete │ • No Sub-phases │ • Rematch
│ • Ready States │ │ • Event-driven │
│ │ │ │
└──────────────────────────────────── rematch() ──────────────────────────────────┘

```

### Turn Flow Rules

```

┌─────────┐ useItem() ┌─────────┐ consumePill() ┌────────────┐ nextTurn() ┌─────────┐
│ items │ ───────────→ │ items │ ──────────────→ │ resolution │ ───────────→ │ items │
└─────────┘ └─────────┘ └────────────┘ └─────────┘
↑ │ │ │
│ │ (sem itens) │ (efeitos aplicados) │
│ ↓ ↓ │
│ ┌─────────┐ ┌────────────┐ │
│ │ consume │ │ colapso? │ │
│ └─────────┘ └────────────┘ │
│ │ │ │
│ │ SIM │
│ │ ↓ │
│ │ ┌────────────────┐ │
│ │ │ -1 vida │ │
│ │ │ reset resist. │ │
│ │ └────────────────┘ │
│ │ │ │
│ └────────────────────────────┼───────────────────────────┘
│ │
└─────────────────────────────────────────────────────┘

```

## Modular Store Architecture

### Current Architecture (Legacy)
```

┌─────────────────────────────────────────────────────────────────────────────┐
│ GAME STORE (Legacy - 2386 linhas) │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ STORES MODULARES (Transição) │ │
│ │ │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │ │
│ │ │ gameFlowStore│ │ playerStore │ │ pillPoolStore│ │effectsStore │ │ │
│ │ │ │ │ │ │ │ │ │ │ │
│ │ │ • phases │ │ • players │ │ • pillPool │ │ • shield │ │ │
│ │ │ • turns │ │ • lives │ │ • typeCounts │ │ • handcuffs │ │ │
│ │ │ • rounds │ │ • resistance │ │ • revealed │ │ • duration │ │ │
│ │ │ • winner │ │ • inventory │ │ • consume │ │ │ │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘ │ │
│ │ │ │
│ │ ┌──────────────┐ ┌──────────────┐ │ │
│ │ │itemUsageStore│ │ shopStore │ │ │
│ │ │ │ │ │ │ │
│ │ │ • targeting │ │ • storeState │ │ │
│ │ │ • selection │ │ • cart │ │ │
│ │ │ • validation │ │ • timer │ │ │
│ │ └──────────────┘ └──────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

```

#### Nova Arquitetura Clean (Destino)
```

┌─────────────────────────────────────────────────────────────────────────────┐
│ CLEAN ARCHITECTURE │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ GAME ENGINE CORE │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │ │
│ │ │ GameEngine │ │EventProcessor│ │ AIDecision │ │ │
│ │ │ │ │ │ │ Engine │ │ │
│ │ │ • state mgmt │ │ • pure funcs │ │ • bot config │ │ │
│ │ │ • phase flow │ │ • validation │ │ • difficulty │ │ │
│ │ │ • subscript. │ │ • immutable │ │ • targeting │ │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ MODULAR STORES (4 Fases) │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │ │
│ │ │ sessionStore │ │ draftStore │ │ matchStore │ │resultsStore │ │ │
│ │ │ (LOBBY) │ │ (DRAFT) │ │ (MATCH) │ │ (RESULTS) │ │ │
│ │ │ • players │ │ • items │ │ • gameplay │ │ • stats │ │ │
│ │ │ • bots │ │ • timer │ │ • store │ │ • winner │ │ │
│ │ │ • config │ │ • selection │ │ • unified │ │ • rematch │ │ │
│ │ │ • ready │ │ • validation │ │ • no phases │ │ │ │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ overlayStore │ │ toastStore │ │multiplayerStore │ │ devToolStore │
│ (mantido) │ │ (mantido) │ │ (mantido) │ │ (mantido) │
│ • currentType │ │ • toasts[] │ │ • room │ │ • isOpen │
│ • data │ │ • add/remove │ │ • connection │ │ • snapshots │
│ • open/close │ │ • auto-dismiss │ │ • events (≤8) │ │ • actions │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘

```

## Event System Rules (Critical for Clean Architecture)

**MULTIPLAYER CONSTRAINT**: Maximum 8 event types for simplified synchronization:
- **LOBBY_EVENTS**: LOBBY_CREATED, PLAYER_JOINED, BOT_ADDED
- **DRAFT_EVENTS**: DRAFT_STARTED, ITEM_SELECTED, DRAFT_COMPLETED
- **MATCH_EVENTS**: MATCH_ACTION, MATCH_ENDED
- **RESULTS_EVENTS**: RESULTS_DISPLAYED, REMATCH_REQUESTED

**EVENT RULES**:
- All event processing uses pure functions
- Events must be deterministic (same input → same output)
- Immutable state updates only
- Host authority for conflict resolution

```

┌─────────────────────────────────────────────────────────────────────────────┐
│ EVENT-DRIVEN SYSTEM │
├─────────────────────────────────────────────────────────────────────────────┤
│ Máximo 8 Tipos de Eventos (vs 15+ atuais) │
│ │
│ LOBBY_EVENTS: DRAFT_EVENTS: │
│ • LOBBY_CREATED • DRAFT_STARTED │
│ • PLAYER_JOINED • ITEM_SELECTED │
│ • BOT_ADDED • DRAFT_COMPLETED │
│ │
│ MATCH_EVENTS: RESULTS_EVENTS: │
│ • MATCH_ACTION • RESULTS_DISPLAYED │
│ • MATCH_ENDED • REMATCH_REQUESTED │
│ │
│ Características: │
│ • Pure Functions • Immutable State │
│ • Event Validation • Sequence Numbers │
│ • Host Authority • Deterministic Processing │
└─────────────────────────────────────────────────────────────────────────────┘

```

## AI Bot System Rules

```

┌─────────────────────────────────────────────────────────────────────────────┐
│ AI BOT MANAGEMENT │
├─────────────────────────────────────────────────────────────────────────────┤
│ LOBBY Phase: │
│ • Player Slots: 2-4 total │
│ • Empty Slot → Add AI Bot option │
│ • Difficulty Selection: Easy, Normal, Hard, Insane │
│ • Human Replacement: Human can replace any AI bot │
│ │
│ AI Decision Engine: │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Easy │ │ Normal │ │ Hard │ │ Insane │ │
│ │ Paciente │ │ Cobaia │ │ Sobrevivente │ │ Hofmann │ │
│ │ │ │ │ │ │ │ │ │
│ │ • Predictable│ │ • Balanced │ │ • Aggressive │ │ • Calculating│ │
│ │ • Risk Averse│ │ • Tactical │ │ • Strategic │ │ • No Mercy │ │
│ │ • Learning │ │ • Adaptive │ │ • Items Focus│ │ • Perfect │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │
│ │
│ Deterministic Behavior: │
│ • Same input → Same output │
│ • Testable decision functions │
│ • Configurable personality traits │
└─────────────────────────────────────────────────────────────────────────────┘

```

> **Nota:** Toggle `wantsStore` e feito durante a rodada clicando no icone de Pill Coins (se `pillCoins > 0`).
> A fase `shopping` so ocorre se pelo menos 1 jogador sinalizou. Pill Store nao aparece em Game Over.

## Item Selection Flow Rules

```

┌─────────────────────────────────────────────────────────────────────┐
│ FASE: ITEM SELECTION │
├─────────────────────────────────────────────────────────────────────┤
│ │
│ 1. Usuario ve catalogo de 9 itens (4 categorias) │
│ - Intel: Scanner, Inverter, Double │
│ - Sustain: Pocket Pill, Shield │
│ - Control: Handcuffs, Force Feed │
│ - Chaos: Shuffle, Discard │
│ ↓ │
│ 2. Seleciona ate 5 itens (click para toggle) │
│ - Contador mostra X/5 │
│ ↓ │
│ 3. Clica "Confirmar Selecao" │
│ - confirmItemSelection('player1') │
│ ↓ │
│ 4. IA seleciona automaticamente (useAIItemSelection) │
│ - 5 itens aleatorios │
│ - Auto-confirma apos delay │
│ ↓ │
│ 5. Ambos confirmados → phase = 'playing' │
│ │
└─────────────────────────────────────────────────────────────────────┘

```

## Turn Flow with Items Rules

```

┌─────────────────────────────────────────────────────────────────────┐
│ TURNO DO JOGADOR │
├─────────────────────────────────────────────────────────────────────┤
│ │
│ 0. Verifica se jogador esta algemado (Handcuffs) │
│ - Se sim: pula turno, remove efeito, passa para proximo │
│ ↓ │
│ 1. [OPCIONAL] Jogador usa item do inventario │
│ - Clica no item → startItemUsage(itemId) │
│ - Se requer alvo → ItemTargetSelector │
│ - Executa efeito → remove do inventario │
│ - NAO consome turno (pode ainda escolher pilula) │
│ ↓ │
│ 2. Jogador seleciona pilula (click ou IA automatica) │
│ ↓ │
│ 3. startConsumption(pillId, forcedTarget?) │
│ - Verifica Shield do jogador (bloqueia dano se ativo) │
│ - Busca pilula no pool │
│ - Considera flags: inverted, doubled │
│ - Simula efeito (preview) │
│ ↓ │
│ 4. PillReveal exibe overlay com countdown │
│ - Usuario clica ou countdown termina │
│ ↓ │
│ 5. confirmReveal() │
│ - Chama consumePill(pillId) no store │
│ - Decrementa efeitos do jogador (Shield, etc) │
│ ↓ │
│ 6. Toast + AnimatedPlayerArea feedback │
│ - FloatingNumber exibe +/-valor │
│ ↓ │
│ 7. Turno passa para proximo jogador │
│ - Verifica Handcuffs do proximo │
│ - Se IA: useAIPlayer agenda jogada automatica │
│ │
└─────────────────────────────────────────────────────────────────────┘

```

---

## Item Usage Flow Rules

```

┌─────────────────────────────────────────────────────────────────────┐
│ FLUXO DE USO DE ITEM │
├─────────────────────────────────────────────────────────────────────┤
│ │
│ [Jogador clica item no inventario] │
│ │ │
│ ▼ │
│ [useItemUsage.startUsage(itemId)] │
│ │ │
│ ▼ │
│ ┌─────────────────────────────────┐ │
│ │ Item requer alvo? │ │
│ └─────────┬───────────┬───────────┘ │
│ NAO SIM │
│ │ │ │
│ ▼ ▼ │
│ [Executa efeito] [ItemTargetSelector] │
│ │ │ │
│ │ ▼ │
│ │ [Jogador clica alvo] │
│ │ │ │
│ │ ▼ │
│ │ [executeItem(itemId, targetId)] │
│ │ │ │
│ ▼ ▼ │
│ [gameStore.executeItem()] │
│ │ │
│ ▼ │
│ [Aplica efeito especifico] │
│ - Scanner: revela pilula (adiciona em revealedPills) │
│ - Inverter: marca pilula como inverted │
│ - Double: marca pilula como doubled │
│ - Pocket Pill: +2 resistencia │
│ - Shield: adiciona efeito 'shield' (1 rodada) │
│ - Handcuffs: adiciona efeito 'handcuffed' no oponente │
│ - Force Feed: delega para startConsumption(pillId, opponentId) │
│ - Shuffle: embaralha pillPool │
│ - Discard: remove pilula (verifica se pool esvaziou) │
│ │ │
│ ▼ │
│ [Remove item do inventario] │
│ │ │
│ ▼ │
│ [ItemEffectOverlay + Toast] │
│ │ │
│ ▼ │
│ [Continua turno - jogador ainda pode escolher pilula] │
│ │
└─────────────────────────────────────────────────────────────────────┘

```

---

## AI Flow Rules (with Items)

```

┌─────────────────────────────────────────────────────────────────────┐
│ useAIPlayer Hook │
├─────────────────────────────────────────────────────────────────────┤
│ │
│ useEffect detecta: │
│ - gamePhase === 'playing' │
│ - currentPlayer.isAI === true │
│ - phase === 'idle' │
│ - pillPool.length > 0 │
│ - !hasScheduledRef.current │
│ ↓ │
│ Se todas condicoes TRUE: │
│ 1. hasScheduledRef.current = true │
│ 2. delay = getAIThinkingDelay() // 1000-2000ms │
│ 3. setTimeout(() => { │
│ ↓ │
│ // DECISAO DE USO DE ITEM │
│ if (!hasUsedItemRef && shouldAIUseItem(currentPlayer)) { │
│ - 35% chance base de usar item │
│ - Prioriza: Shield (baixa vida), Scanner (muitas pills) │
│ - selectedItem = selectAIItem(currentPlayer, pillPool) │
│ - targetId = selectAIItemTarget(itemType, pillPool, opp) │
│ - executeItem(selectedItem.id, targetId) │
│ - hasUsedItemRef = true │
│ - Agenda consumo de pilula apos delay │
│ } │
│ ↓ │
│ // CONSUMO DE PILULA │
│ // Usa getState() para evitar stale closure │
│ currentPillPool = useGameStore.getState().pillPool │
│ pillId = selectRandomPill(currentPillPool) │
│ startConsumption(pillId) │
│ }, delay) │
│ │
│ // Reset flags quando turno muda ou pilula e consumida │
│ │
└─────────────────────────────────────────────────────────────────────┘

```

---

## Pill Consumption Flow Rules

### Diagrama de Sequencia

```

┌────────┐ ┌───────────┐ ┌──────────────────┐ ┌───────────┐ ┌────────────┐
│ User │ │ GameBoard │ │usePillConsumption│ │ gameStore │ │ PillReveal │
└────┬───┘ └─────┬─────┘ └────────┬─────────┘ └────┬──────┘ └─────┬──────┘
│ │ │ │ │
│ click pill │ │ │ │
│───────────→│ │ │ │
│ │ │ │ │
│ │ handlePillSelect│ │ │
│ │────────────────→│ │ │
│ │ │ │ │
│ │ │ startConsumption│ │
│ │ │ (pillId, forcedTarget?) │
│ │ │────────────────→│ getPillById │
│ │ │ │←──────────────│
│ │ │ │ │
│ │ │ verifica Shield │ │
│ │ │ considera inverted/doubled │
│ │ │ │ │
│ │ │ applyPillEffect │ │
│ │ │ (simula) │ │
│ │ │ │ │
│ │ │ phase='revealing' │
│ │ │────────────────────────────────→│
│ │ │ │ │ render
│ │ │ │ │
│ countdown/click │ │ │
│───────────────────────────────────────────────────────────────→│
│ │ │ │ │
│ │ │ confirmReveal │ │
│ │ │────────────────→│ consumePill │
│ │ │ │ + decrement │
│ │ │ │ effects │
│ │ │ phase='feedback'│ │
│ │ │────────────────────────────────→│
│ │ │ │ │ exit anim
│ │ │ │ │
│ │ onExitComplete │ │ │
│ │←──────────────────────────────────────────────────│
│ │ │ │ │
│ │ showToast │ │ │
│ │ (feedback) │ │ │
│ │ │ │ │

```

---

## Pill Effects System Rules

### Tipos de Pilula e Efeitos

```

┌───────────┬─────────────────────────────────────────────────────────┐
│ Tipo │ Efeito │
├───────────┼─────────────────────────────────────────────────────────┤
│ SAFE │ Nenhum efeito │
├───────────┼─────────────────────────────────────────────────────────┤
│ DMG_LOW │ Dano 1-2 na resistencia │
├───────────┼─────────────────────────────────────────────────────────┤
│ DMG_HIGH │ Dano 3-4 na resistencia │
├───────────┼─────────────────────────────────────────────────────────┤
│ FATAL │ Morte instantanea (eliminado) │
├───────────┼─────────────────────────────────────────────────────────┤
│ HEAL │ Cura 1-3 de resistencia (cap no maximo) │
└───────────┴─────────────────────────────────────────────────────────┘

```

### Modificadores de Pilula (Itens)

```

┌─────────────┬───────────────────────────────────────────────────────┐
│ Modificador │ Efeito │
├─────────────┼───────────────────────────────────────────────────────┤
│ inverted │ Dano vira cura, cura vira dano │
├─────────────┼───────────────────────────────────────────────────────┤
│ doubled │ Valor do efeito e multiplicado por 2 │
├─────────────┼───────────────────────────────────────────────────────┤
│ revealed │ Tipo visivel para quem usou Scanner │
└─────────────┴───────────────────────────────────────────────────────┘

```

### Logica de Colapso

```

┌─────────────────────────────────────────────────────────────────────┐
│ applyPillEffect(pill, player, options?) │
├─────────────────────────────────────────────────────────────────────┤
│ │
│ 1. Verifica Shield do jogador │
│ - Se ativo e dano: bloqueia, retorna { blocked: true } │
│ ↓ │
│ 2. Calcula valor base do efeito │
│ ↓ │
│ 3. Aplica modificadores da pilula: │
│ - Se inverted: inverte sinal do efeito │
│ - Se doubled: multiplica por 2 │
│ ↓ │
│ 4. Aplica na resistencia │
│ ↓ │
│ 5. Se resistencia <= 0: │
│ - COLAPSO! │
│ - vidas -= 1 │
│ - resistencia = maxResistance │
│ ↓ │
│ 6. Se vidas <= 0: │
│ - ELIMINADO! │
│ - Jogo termina │
│ │
│Retorna: { player, damageDealt, healReceived, collapsed, eliminated }|
└─────────────────────────────────────────────────────────────────────┘

```

---

## Animation System Rules (Framer Motion)

### Componentes Animados

```

┌─────────────────────────────────────────────────────────────────────┐
│ HIERARQUIA DE ANIMACOES │
├─────────────────────────────────────────────────────────────────────┤
│ │
│ GameBoard │
│ ├── TurnIndicator │
│ │ ├── [Rodada] AnimatePresence mode="wait" │
│ │ ├── [Turno] AnimatePresence mode="wait" (scale+fade) │
│ │ └── [IA msg] motion.p (opacity pulse) │
│ │ │
│ ├── AnimatedPlayerArea (x2) │
│ │ ├── motion.div (shake/glow/shield via variants) │
│ │ ├── FloatingNumber (opacity+y via AnimatePresence) │
│ │ ├── Badge (Shield/Handcuffs indicator) │
│ │ ├── LivesDisplay │
│ │ │ └── Hearts (AnimatePresence + exit animation) │
│ │ ├── ResistanceDisplay │
│ │ │ └── motion.div (useSpring para largura) │
│ │ └── InventoryBar │
│ │ └── InventorySlot (x5) - AnimatePresence para saida │
│ │ │
│ ├── PillPool │
│ │ └── Pill (motion.button - hover, tap, scale, target highlight) │
│ │ │
│ ├── ItemTargetSelector (overlay de selecao) │
│ │ │
│ └── OverlayManager │
│ ├── PillReveal (AnimatePresence mode="wait") │
│ ├── ItemEffectOverlay (scale + glow animation) │
│ ├── NewRoundOverlay (AnimatePresence) │
│ └── GameOverDialog (AnimatePresence) │
│ │
│ ToastManager │
│ └── PlayerToasts (contextuais por jogador) │
│ └── Toast (AnimatePresence + slide animation) │
│ │
└─────────────────────────────────────────────────────────────────────┘

```

---

## Game Lifecycle Rules

```

┌─────────────────────────────────────────────────────────────────────┐
│ CICLO COMPLETO │
├─────────────────────────────────────────────────────────────────────┤
│ │
│ [SETUP] │
│ │ │
│ │ Usuario clica "Iniciar Partida" │
│ │ initGame() → cria players, gera pillPool │
│ ↓ │
│ [ITEM SELECTION] │
│ │ │
│ │ ItemSelectionScreen exibe catalogo │
│ │ Usuario seleciona 5 itens │
│ │ IA seleciona 5 itens automaticamente │
│ │ Ambos confirmam → phase = 'playing' │
│ ↓ │
│ [PLAYING - Rodada 1] │
│ │ │
│ │ ┌───────────────────────────────────────────┐ │
│ │ │ LOOP DE TURNOS │ │
│ │ │ │ │
│ │ │ Verifica Handcuffs (pula se algemado) │ │
│ │ │ │ │
│ │ │ Player 1 (humano): │ │
│ │ │ - [Opcional] usa item do inventario │ │
│ │ │ - Seleciona pilula │ │
│ │ │ - Reveal → feedback → turno passa │ │
│ │ │ │ │
│ │ │ Player 2 (IA): │ │
│ │ │ - [35% chance] usa item │ │
│ │ │ - Auto-seleciona pilula │ │
│ │ │ - Reveal → feedback → turno passa │ │
│ │ │ │ │
│ │ │ Repete ate pool esvaziar │ │
│ │ └───────────────────────────────────────────┘ │
│ │ │
│ │ Pool vazio? → Verifica wantsStore │
│ │ │
│ │ ┌───────────────────────────────────────────┐ │
│ │ │ PILL STORE (OPCIONAL) │ │
│ │ │ │ │
│ │ │ Durante a rodada: │ │
│ │ │ - Jogador clica icone Pill Coins │ │
│ │ │ - Se pillCoins > 0: toggle wantsStore │ │
│ │ │ - Se pillCoins = 0: toast de aviso │ │
│ │ │ │ │
│ │ │ Ao pool esvaziar: │ │
│ │ │ - Ninguem wantsStore? → resetRound() │ │
│ │ │ │ │
│ │ │ [shopping] Timer 30s (se alguem) │ │
│ │ │ - Quem sinalizou: ve loja │ │
│ │ │ - Quem nao: "Aguardando..." │ │
│ │ │ - Um confirma → timer outro reduz 50% │ │
│ │ │ - Timeout → confirma automatico │ │
│ │ │ - Compras: Power-Ups, Boosts │ │
│ │ │ │ │
│ │ │ Todos confirmados → applyBoosts() │ │
│ │ │ → resetRound() → Nova rodada │ │
│ │ └───────────────────────────────────────────┘ │
│ │ │
│ │ Jogador eliminado? │
│ ↓ │
│ [ENDED] │
│ │ │
│ │ GameOverDialog exibe vencedor + stats │
│ │ Usuario clica "Jogar Novamente" │
│ │ resetGame() → volta para SETUP │
│ ↓ │
│ [SETUP] ... │
│ │
└─────────────────────────────────────────────────────────────────────┘

```

---

## Dependency Rules

### Imports Criticos

```

App.tsx
├── hooks/index.ts (useGameActions, useGamePhase, usePlayers, ...)
├── components/game/GameBoard.tsx
├── components/game/ItemSelectionScreen.tsx
├── components/game/InfoPanel.tsx
└── components/overlays/OverlayManager.tsx

ItemSelectionScreen.tsx
├── hooks/useItemSelection.ts
├── hooks/useAIItemSelection.ts
├── stores/gameStore.ts
├── utils/itemCatalog.ts
└── components/game/ItemCard.tsx

GameBoard.tsx
├── stores/gameStore.ts (useGameStore)
├── stores/overlayStore.ts (useOverlayStore)
├── hooks/usePillConsumption.ts
├── hooks/useAIPlayer.ts
├── hooks/useItemUsage.ts
├── hooks/useToast.ts
├── utils/itemCatalog.ts
├── components/game/AnimatedPlayerArea.tsx
├── components/game/PillPool.tsx
├── components/game/TurnIndicator.tsx
└── components/game/ItemTargetSelector.tsx

AnimatedPlayerArea.tsx
├── components/game/LivesDisplay.tsx
├── components/game/ResistanceDisplay.tsx
├── components/game/InventoryBar.tsx
├── components/game/FloatingNumber.tsx
└── components/toasts/PlayerToasts.tsx

gameStore.ts
├── types/index.ts
├── utils/constants.ts
├── utils/gameLogic.ts
├── utils/pillGenerator.ts
├── utils/itemCatalog.ts
└── utils/itemLogic.ts

```

---

## Component Responsibility Rules

| Arquivo | Responsabilidade |
|---------|-----------------|
| `gameStore.ts` | Estado global, actions de jogo e itens, selectors |
| `overlayStore.ts` | Gerencia overlays bloqueantes (PillReveal, ItemEffect, etc) |
| `toastStore.ts` | Fila de notificacoes contextuais |
| `usePillConsumption.ts` | Fluxo reveal → feedback → idle |
| `useAIPlayer.ts` | Jogada automatica + decisao de uso de item |
| `useItemSelection.ts` | Selecao de itens pre-jogo |
| `useItemUsage.ts` | Uso de itens durante partida |
| `useAIItemSelection.ts` | Selecao automatica de itens pela IA |
| `GameBoard.tsx` | Orquestracao de componentes e handlers |
| `ItemSelectionScreen.tsx` | Tela de selecao pre-jogo |
| `AnimatedPlayerArea.tsx` | Card do jogador + inventario + efeitos visuais |
| `InventoryBar.tsx` | Barra de 5 slots de itens |
| `ItemTargetSelector.tsx` | Overlay de selecao de alvo |
| `ItemEffectOverlay.tsx` | Feedback visual de item usado |
| `PillReveal.tsx` | Overlay de revelacao com countdown |
| `TurnIndicator.tsx` | Indicador de turno/rodada |

---

## Extension Points Rules

Para adicionar novas funcionalidades:

1. **Novos tipos de pilula**: `utils/constants.ts` + `utils/gameLogic.ts`
2. **Novos itens**: `types/item.ts` + `utils/itemCatalog.ts` + `utils/itemLogic.ts` + case no `gameStore.executeItem`
3. **Multiplayer**: Substituir store local por WebSocket/Firebase
4. **Persistencia**: Adicionar middleware no Zustand (persist)
5. **Sons**: Hook `useSoundEffects` + arquivos de audio
6. **Balanceamento de itens**: Ajustar `AI_ITEM_USE_CHANCE` e heuristicas em `aiLogic.ts`

---

## Multiplayer Flow Rules

### Criação e Entrada em Salas

```

HOST GUEST
┌─────────────────┐ ┌─────────────────┐
│ CreateRoomForm │ │ JoinRoomForm │
│ • hostName │ │ • roomId │
│ • createRoom() │ │ • guestName │
└─────────────────┘ │ • joinRoom() │
│ └─────────────────┘
↓ │
┌─────────────────┐ ↓
│ WaitingRoom │ ←─── Supabase ────→ ┌─────────────────┐
│ • roomId │ Realtime │ Conectando... │
│ • aguardando │ │ • validação │
└─────────────────┘ │ • entrada │
│ └─────────────────┘
↓ │
┌─────────────────┐ ↓
│ ItemSelection │ ←─── Sync Events ────→ ┌─────────────────┐
│ • ambos online │ │ ItemSelection │
│ • seleção │ │ • seleção │
└─────────────────┘ └─────────────────┘

```

### Sincronização de Estado

```

EVENTO LOCAL SUPABASE REALTIME EVENTO REMOTO
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ consumePill() │ ─────────→ │ pill_consumed │ ───────────→ │ handleEvent() │
│ • pillId │ │ • playerId │ │ • sync state │
│ • playerId │ │ • pillId │ │ • update UI │
└─────────────────┘ │ • sequence │ └─────────────────┘
└─────────────────┘

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ useItem() │ ─────────→ │ item_used │ ───────────→ │ handleEvent() │
│ • itemType │ │ • itemType │ │ • apply effect │
│ • targetId │ │ • targetId │ │ • remove item │
└─────────────────┘ └─────────────────┘ └─────────────────┘

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ nextTurn() │ ─────────→ │ turn_ended │ ───────────→ │ handleEvent() │
│ • currentTurn │ │ • nextPlayer │ │ • update turn │
│ • nextPlayer │ │ • sequence │ │ • enable UI │
└─────────────────┘ └─────────────────┘ └─────────────────┘

```

### Sistema de Heartbeat

```

CLIENTE A SUPABASE CLIENTE B
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ heartbeat │ ────────→ │ broadcast │ ──────────→ │ receive │
│ • timestamp │ 5s │ • playerId │ │ • update last │
│ • playerId │ │ • timestamp │ │ • reset timeout │
└─────────────────┘ └─────────────────┘ └─────────────────┘
↑ │
│ ↓
┌─────────────────┐ ┌─────────────────┐
│ check timeout │ │ check timeout │
│ • 15s limit │ │ • 15s limit │
│ • disconnect │ │ • disconnect │
└─────────────────┘ └─────────────────┘

```

---

## Architectural Patterns Rules

### Separation of Concerns

```

┌─────────────────────────────────────────────────────────────────────────────┐
│ CAMADAS │
├─────────────────────────────────────────────────────────────────────────────┤
│ COMPONENTS (UI) │ HOOKS (Bridge) │ STORES (State) │
│ • Renderização pura │ • Lógica de UI │ • Estado global │
│ • Props/eventos │ • Selectors │ • Actions │
│ • Sem lógica de negócio │ • Side effects │ • Immutable updates │
├─────────────────────────────────────────────────────────────────────────────┤
│ UTILS (Business Logic) │ SERVICES (External) │ TYPES (Contracts) │
│ • Funções puras │ • Supabase Realtime │ • Interfaces │
│ • Sem side effects │ • WebSocket │ • Type safety │
│ • Testáveis │ • API calls │ • Documentation │
└─────────────────────────────────────────────────────────────────────────────┘

```

### Data Flow

```

USER INTERACTION
↓
┌─────────────────┐
│ COMPONENT │ ← Props/State
└─────────────────┘
↓ Event
┌─────────────────┐
│ HOOK │ ← useGameActions, useGameState
└─────────────────┘
↓ Action
┌─────────────────┐
│ STORE │ ← Zustand Store
└─────────────────┘
↓ Business Logic
┌─────────────────┐
│ UTILS │ ← Pure Functions
└─────────────────┘
↓ Side Effect
┌─────────────────┐
│ SERVICE │ ← Supabase, External APIs
└─────────────────┘

```

### Error Boundaries

```

┌─────────────────────────────────────────────────────────────────────────────┐
│ ERROR HANDLING │
├─────────────────────────────────────────────────────────────────────────────┤
│ COMPONENT LEVEL │ STORE LEVEL │ SERVICE LEVEL │
│ • Try/catch em hooks │ • Validation │ • Network errors │
│ • Fallback UI │ • State consistency │ • Timeout handling │
│ • Error boundaries │ • Rollback actions │ • Retry logic │
├─────────────────────────────────────────────────────────────────────────────┤
│ USER FEEDBACK │ LOGGING │ RECOVERY │
│ • Toast notifications │ • Console errors │ • Reconnection │
│ • Error overlays │ • Action history │ • State sync │
│ • Graceful degradation │ • Debug snapshots │ • Fallback modes │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## Performance Rules

**OPTIMIZATION PRIORITIES**:
1. **Selective Subscriptions**: Components subscribe only to relevant state slices
2. **Memoization**: Use `useMemo`/`useCallback` for expensive computations
3. **Immutable Updates**: Enable efficient change detection
4. **Modular Stores**: Prevent unnecessary re-renders across domains

### Rendering Optimizations

- **Selectors Otimizados**: Hooks com dependências específicas
- **Memoização**: `useMemo` e `useCallback` em componentes críticos
- **Lazy Loading**: Componentes carregados sob demanda
- **Virtual Scrolling**: Para listas grandes (futuro)

### State Management

- **Stores Modulares**: Reduz re-renders desnecessários
- **Immutable Updates**: Garante detecção de mudanças
- **Selective Subscriptions**: Componentes ouvem apenas estado relevante
- **Debounced Actions**: Evita spam de eventos multiplayer

### Asset Optimization

- **PNG com Transparência**: Shapes de pílulas otimizadas
- **SVG Icons**: Ícones escaláveis e leves
- **Code Splitting**: Bundle dividido por rotas
- **Tree Shaking**: Remove código não utilizado

### Multiplayer Performance

- **Event Batching**: Agrupa eventos relacionados
- **Compression**: Reduz payload de sincronização
- **Heartbeat Optimization**: Frequência balanceada
- **Connection Pooling**: Reutiliza conexões WebSocket

---

## Development & Debugging Rules

### DevTools (CTRL+SHIFT+D)

```

┌─────────────────────────────────────────────────────────────────────────────┐
│ FLOATING DEVTOOL │
├─────────────────────────────────────────────────────────────────────────────┤
│ GAME STATE │ STORES SNAPSHOT │ ACTIONS │
│ • Current phase │ • gameFlowStore │ • Force phase │
│ • Players status │ • playerStore │ • Add pills │
│ • Pill pool │ • pillPoolStore │ • Modify resistance │
│ • Round/turn info │ • effectsStore │ • Trigger events │
├─────────────────────────────────────────────────────────────────────────────┤
│ MULTIPLAYER DEBUG │ DISTRIBUTION SIM │ REALTIME MONITOR │
│ • Connection status │ • Pill progression │ • Event log │
│ • Room info │ • Shape distribution │ • Latency stats │
│ • Event history │ • Balance testing │ • Connection health │
└─────────────────────────────────────────────────────────────────────────────┘

```

### Testing Strategy

**DUAL TESTING APPROACH** (Enhanced with property-based testing):
- **Unit Tests**: Specific examples and edge cases for utils (Vitest)
- **Property-Based Tests**: Universal properties with fast-check (min 100 iterations)
- **Integration Tests**: Complete game flows
- **E2E Tests**: Multiplayer scenarios (future)

**TESTING RULES**:
- All utils must have both unit and property tests
- Pure functions are easily testable
- Mock external dependencies (Supabase, etc.)
- Test immutability and state consistency

### Monitoring

- **Action History**: Log de todas as ações do jogo
- **State Snapshots**: Capturas de estado para debug
- **Performance Metrics**: Tempo de renderização
- **Error Tracking**: Captura e análise de erros

---

## Summary: Critical Rules for AI Assistants

### DO NOT:
1. **Extend `gameStore.ts`** - it's legacy code marked for removal
2. **Add business logic to components** - keep them pure UI
3. **Use `any` types** - strict TypeScript required
4. **Create more than 8 event types** - multiplayer constraint
5. **Add side effects to utils** - pure functions only

### DO:
1. **Use modular stores** in `src/stores/game/` for new features
2. **Follow 4-phase architecture** (LOBBY → DRAFT → MATCH → RESULTS)
3. **Implement event-driven patterns** with pure functions
4. **Write both unit and property-based tests** for utils
5. **Use hooks as bridge layer** between UI and business logic
6. **Ensure immutable state updates** for reliable change detection
7. **Follow naming conventions** (PascalCase components, camelCase hooks/stores/utils)

### Architecture Layers (Strict Separation):
```

COMPONENTS (UI) → HOOKS (Bridge) → STORES (State) → UTILS (Logic) → SERVICES (External)

```

### Migration Priority:
- **Legacy**: Maintain existing functionality
- **Transition**: Use modular stores for new features
- **Target**: Event-driven clean architecture with 4 phases
```
