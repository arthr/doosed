# Tasks: DOSED MVP - Pill Roulette Game

**Feature**: DOSED MVP - Vertical Slice (Home → Lobby Solo → Draft → Match vs IA → Results)  
**Branch**: `feat/core-game`  
**Generated**: 2025-12-25

**Input Design Documents**:
- `plan.md` - Implementation strategy, tech stack, architecture
- `spec.md` - 4 User Stories (P1-P4), 187 Functional Requirements, 42 Success Criteria
- `data-model.md` - 15 core entities with validations and relationships
- `research.md` - Technical decisions (Zustand, localStorage, error handling, performance)
- `quickstart.md` - Development workflow and structure

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3) - omit for Setup/Foundational/Polish phases
- Include exact file paths in descriptions

**Tests**: Tasks do NOT include tests (not requested in feature specification). Focus is 100% on implementing mechanics with minimal UI.

---

## Phase 1: Setup (Project Initialization) ✅ COMPLETO

**Purpose**: Initialize project structure and dependencies

- [X] T001 Verify project dependencies installed (React 18+, TypeScript 5+, Vite, Zustand, Immer, Tailwind CSS) in package.json
- [X] T002 [P] Create TypeScript types structure in src/types/ (game.ts, pill.ts, item.ts, status.ts, events.ts, config.ts)
- [X] T003 [P] Create core logic structure in src/core/ (empty files for pool-generator, effect-resolver, collapse-handler, inventory-manager, quest-generator, state-machine, turn-manager, event-processor)
- [X] T004 [P] Create bot AI structure in src/core/bot/ (bot-interface.ts, bot-easy.ts, bot-normal.ts, bot-hard.ts, bot-insane.ts)
- [X] T005 [P] Create Zustand stores structure in src/stores/ usando Slices Pattern (slices/types.ts, slices/matchSlice.ts, slices/playersSlice.ts, slices/poolSlice.ts, gameStore.ts, economyStore.ts, progressionStore.ts, logStore.ts)
- [X] T006 [P] Create UI components structure in src/components/ui/ (button.tsx, pill-display.tsx, player-card.tsx, inventory-slot.tsx, timer-display.tsx, log-viewer.tsx)
- [X] T007 [P] Create game components structure in src/components/game/ (PillPool.tsx, PlayerHUD.tsx, OpponentLine.tsx, ShopGrid.tsx, QuestTracker.tsx)
- [X] T008 [P] Create screens structure in src/screens/ (HomeScreen.tsx, LobbyScreen.tsx, DraftScreen.tsx, MatchScreen.tsx, ShoppingScreen.tsx, ResultsScreen.tsx)
- [X] T009 [P] Create hooks structure in src/hooks/ (useGameLoop.ts, useTurnTimer.ts, useEventLogger.ts)
- [X] T010 Create game configuration file in src/config/game-config.ts with all balance values (timers, health, economy, pool, shapes, items, boosts per FR-182 to FR-186)

---

## Phase 2: Foundational (Core Types & Configuration) ✅ COMPLETO

**Purpose**: Core data structures that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 [P] Define PillType, PillModifier, PillState enums in src/types/pill.ts
- [X] T012 [P] Define Pill interface with id, type, shape, modifiers, isRevealed, position, state in src/types/pill.ts
- [X] T013 [P] Define Shape interface with id, name, assetPath, unlockRound, isSeasonal, seasonalTheme in src/types/pill.ts
- [X] T014 [P] Define ItemCategory, Targeting, Availability enums in src/types/item.ts
- [X] T015 [P] Define Item interface with id, name, description, category, cost, targeting, isStackable, stackLimit, availability in src/types/item.ts
- [X] T016 [P] Define InventorySlot interface with slotIndex, item, quantity in src/types/item.ts
- [X] T017 [P] Define StatusType enum and Status interface with id, type, duration, appliedAt, playerId in src/types/status.ts
- [X] T018 [P] Define Player interface with all attributes (id, name, avatar, isBot, botLevel, lives, resistance, resistanceCap, extraResistance, inventory, pillCoins, activeStatuses, isEliminated, isLastChance, isActiveTurn, totalCollapses, shapeQuest, wantsShop) in src/types/game.ts
- [X] T019 [P] Define Pool interface with roundNumber, pills, size, counters, revealed, unlockedShapes in src/types/game.ts
- [X] T020 [P] Define ShapeQuest interface with id, roundNumber, playerId, sequence, progress, reward, status in src/types/game.ts
- [X] T021 [P] Define Turn interface with playerId, timerRemaining, itemsUsed, pillConsumed, statusesApplied, startedAt, endedAt, targetingActive in src/types/game.ts
- [X] T022 [P] Define Round interface with number, pool, turns, shapeQuests, boostsToApply, state, startedAt, endedAt in src/types/game.ts
- [X] T023 [P] Define MatchPhase enum and Match interface with id, phase, players, rounds, currentRound, turnOrder, activeTurnIndex, seasonalShapes, shopSignals, winnerId, startedAt, endedAt in src/types/game.ts
- [X] T024 [P] Define ShoppingPhase interface with qualifiedPlayers, timerRemaining, carts, confirmations, state in src/types/game.ts
- [X] T025 [P] Define Profile interface with id, name, avatar, level, xp, schmeckles, gamesPlayed, wins, totalRoundsSurvived, mostUsedItems, lastUpdated in src/types/game.ts
- [X] T026 [P] Define 8 core GameEvent types (PLAYER_JOINED, TURN_STARTED, ITEM_USED, PILL_CONSUMED, EFFECT_APPLIED, COLLAPSE_TRIGGERED, ROUND_COMPLETED, MATCH_ENDED) in src/types/events.ts with all required payload fields per research.md Decision 6
- [X] T027 [P] Define GameConfig interface in src/types/config.ts matching structure from data-model.md section "Configuration Schema" with timers, health, economy, pool, shapes, items, boosts, inventory, xp sections
- [X] T028 Implement DEFAULT_GAME_CONFIG in src/config/game-config.ts with all values from FR-182 specification (30s turn timer, 60s draft, 3 lives, 6 resistance, 100 initial coins, base pool size 6, 16 base shapes, etc.)

**Checkpoint**: Foundation ready - core types and configuration complete.

---

## Phase 2.5: Testing Infrastructure (Constitution Principle VI)

**Purpose**: Unit tests for pure logic, property-based tests for invariants, integration tests for determinism per Constitution Principle VI

**⚠️ IMPORTANT**: Tests MUST be written BEFORE implementation (TDD approach) or immediately after core logic tasks

### Unit Tests - Core Logic

- [ ] T029a [P] Write unit tests for calculatePoolSize in src/core/__tests__/pool-generator.test.ts validating size progression (base 6, +1 per 3 rounds, cap 12) for rounds 1-20
- [ ] T030a [P] Write unit tests for calculateDistribution in src/core/__tests__/pool-generator.test.ts validating linear interpolation between initial/final percentages
- [ ] T032a [P] Write unit tests for generatePool in src/core/__tests__/pool-generator.test.ts validating: (a) correct size, (b) types match distribution ±5%, (c) min 3 shapes diversity
- [ ] T034a [P] Write unit tests for resolvePillEffect in src/core/__tests__/effect-resolver.test.ts covering all 6 pill types (SAFE, DMG_LOW, DMG_HIGH, HEAL, FATAL, LIFE)
- [ ] T035a [P] Write unit tests for modifier handling in src/core/__tests__/effect-resolver.test.ts: (a) INVERTED flips DMG/HEAL, (b) DOUBLED multiplies by 2, (c) FATAL/LIFE unaffected
- [ ] T036a [P] Write unit tests for Shield blocking in src/core/__tests__/effect-resolver.test.ts: damage blocked when SHIELDED active, heal passes through
- [ ] T038a [P] Write unit tests for handleCollapse in src/core/__tests__/collapse-handler.test.ts: (a) lives -1, (b) resistance reset to 6, (c) isLastChance when lives=0, (d) isEliminated when collapse in last chance
- [ ] T041a [P] Write unit tests for addItemToInventory in src/core/__tests__/inventory-manager.test.ts: (a) stackable items increment quantity, (b) non-stackable add new slot, (c) reject when 5 slots full
- [ ] T042a [P] Write unit tests for removeItemFromInventory in src/core/__tests__/inventory-manager.test.ts: (a) decrement stack, (b) remove slot when quantity=0
- [ ] T045a [P] Write unit tests for initializeTurnOrder in src/core/__tests__/turn-manager.test.ts validating randomization produces valid permutation
- [ ] T046a [P] Write unit tests for getNextPlayer in src/core/__tests__/turn-manager.test.ts: (a) skips eliminated players, (b) maintains round-robin order, (c) wraps correctly
- [ ] T052a [P] Write unit tests for processEvent reducer in src/core/__tests__/event-processor.test.ts covering all 8 core event types with valid payloads
- [ ] T056a [P] Write unit tests for botEasyDecision in src/core/bot/__tests__/bot-easy.test.ts: (a) prefers revealed SAFE pills 80%+, (b) uses defensive items when health low, (c) takes decision in 3-5s

### Property-Based Tests - Invariants

- [ ] T029b [P] Write property-based test in src/core/__tests__/pool-generator.property.test.ts: for any round 1-100, pool size in range [6, 12]
- [ ] T032b [P] Write property-based test in src/core/__tests__/pool-generator.property.test.ts: for any generated pool, (a) type distribution within ±5% of configured, (b) min 3 shapes present
- [ ] T038b [P] Write property-based test in src/core/__tests__/collapse-handler.property.test.ts: for any player state, after collapse lives >= 0, resistance = 6
- [ ] T041b [P] Write property-based test in src/core/__tests__/inventory-manager.property.test.ts: for any sequence of add/remove operations, inventory.length <= 5
- [ ] T052b [P] Write property-based test in src/core/__tests__/event-processor.property.test.ts: for any event sequence, same events produce same final state (determinism)

### Integration Tests - Full Flow

- [ ] T082a Write integration test in src/__tests__/integration/full-game-flow.test.ts: Home → Lobby → Draft → Match (complete with bot) → Results with assertions at each phase
- [ ] T082b Write integration test in src/__tests__/integration/bot-determinism.test.ts: Bot vs Bot with fixed seed produces identical match outcome across 3 runs
- [ ] T082c Write integration test in src/__tests__/integration/edge-cases.test.ts: (a) timer expiration auto-consumes pill, (b) elimination skips turns, (c) pool exhaust generates new round

### Test Configuration & Utilities

- [X] T028a [P] Setup Vitest config in vitest.config.ts with coverage thresholds: statements 70%, branches 60%, functions 70%
- [X] T028b [P] Setup fast-check integration in src/core/__tests__/setup.ts for property-based testing
- [X] T057a [P] Implement seeded RNG utility in src/core/utils/random.ts (mersenne twister or similar) ensuring deterministic output for testing

**Checkpoint**: Testing infrastructure complete. Core logic can be implemented with TDD approach.

---

## Phase 3: User Story 1 - Jogar Partida Solo Completa (Priority: P1) - MVP

**Goal**: Jogador pode jogar partida completa do início ao fim: Home → Lobby Solo → Draft → Match vs Bot → Results, experimentando todo o core loop (selecionar loadout, consumir pills, usar itens, ver resultados)

**Independent Test**: Iniciar jogo, criar sala solo com 1 bot, completar draft, jogar match até ver resultados finais. Valida experiência fundamental de "roleta russa farmacêutica".

**Why P1**: Este é o coração do jogo - vertical slice MVP. Sem isso, não há jogo jogável.

---

### Core Logic for User Story 1

#### Pool Generation (FR-170 to FR-181) ✅

- [X] T029 [P] [US1] Implement calculatePoolSize(roundNumber) in src/core/pool-generator.ts (base 6, +1 per 3 rounds, cap 12 per FR-172)
- [X] T030 [P] [US1] Implement calculateDistribution(roundNumber, config) in src/core/pool-generator.ts with linear interpolation between initial and final percentages per FR-171
- [X] T031 [P] [US1] Implement getUnlockedShapes(roundNumber, config) in src/core/pool-generator.ts filtering shapes by unlockRound and including active seasonal shapes per FR-175 to FR-179
- [X] T032 [US1] Implement generatePool(roundNumber, config) in src/core/pool-generator.ts generating pills with types, shapes, validating min 3 shape diversity per FR-177, per data-model.md "Generation Algorithm"
- [X] T033 [US1] Add pool validation function validatePoolInvariants(pool) in src/core/pool-generator.ts checking size bounds, shape diversity, distribution within ±5% per data-model.md "Invariantes"

#### Effect Resolution (FR-090 to FR-099) ✅

- [X] T034 [P] [US1] Implement resolvePillEffect(pill, player) in src/core/effect-resolver.ts handling all 6 pill types (SAFE, DMG_LOW, DMG_HIGH, HEAL, FATAL, LIFE) per FR-093
- [X] T035 [P] [US1] Add modifier handling (INVERTED, DOUBLED) in resolvePillEffect per FR-092 and FR-093 (Inverted flips DMG/HEAL, Doubled multiplies by 2, FATAL/LIFE unaffected)
- [X] T036 [US1] Add Shield status check in resolvePillEffect blocking damage when SHIELDED active per FR-094 and FR-296 to FR-297
- [X] T037 [US1] Add resistance cap enforcement in resolvePillEffect respecting resistanceCap and extraResistanceCap per FR-070

#### Collapse Mechanics (FR-095 to FR-100) ✅

- [X] T038 [P] [US1] Implement handleCollapse(player) in src/core/collapse-handler.ts reducing lives by 1, resetting resistance to 6, checking if isLastChance (lives === 0) per FR-095 to FR-099
- [X] T039 [P] [US1] Add elimination check in handleCollapse: if already isLastChance and resistance <= 0, set isEliminated = true per FR-099
- [X] T040 [US1] Add collapse validation ensuring lives >= 0 always and resistance resets correctly per data-model.md "Player State Transitions"

#### Inventory Management (FR-012 to FR-018, FR-050 to FR-058) ✅

- [X] T041 [P] [US1] Implement addItemToInventory(player, item) in src/core/inventory-manager.ts handling stackable vs non-stackable, 5 slot limit per FR-012 to FR-017
- [X] T042 [P] [US1] Implement removeItemFromInventory(player, itemId) in src/core/inventory-manager.ts decrementing stack or removing slot per FR-018
- [X] T043 [P] [US1] Implement useItem(player, item, target) in src/core/inventory-manager.ts applying item effects (Scanner reveals pill, Inverter adds modifier, Shield applies status, etc.) per FR-021 to FR-042 and FR-050 to FR-058
- [X] T044 [US1] Add inventory validation function validateInventory(player) ensuring length <= 5, stackables within limits, per data-model.md "InventorySlot Invariantes"

#### Turn Management (FR-048 to FR-067) ✅

- [X] T045 [P] [US1] Implement initializeTurnOrder(players) in src/core/turn-manager.ts randomizing player order once at match start per FR-048
- [X] T046 [P] [US1] Implement getNextPlayer(turnOrder, currentIndex, players) in src/core/turn-manager.ts skipping eliminated players, maintaining round-robin order per FR-049, FR-065, FR-066
- [X] T047 [US1] Implement startTurn(match, playerId) in src/core/turn-manager.ts initializing turn timer (30s default), setting isActiveTurn per FR-062, FR-064
- [X] T048 [US1] Implement endTurn(match, turn) in src/core/turn-manager.ts finalizing turn when pill consumed or timer expires, auto-consuming random pill on timeout per FR-061, FR-063

#### State Machine (FR-001 to FR-020, FR-043 to FR-067) ✅

- [X] T049 [P] [US1] Define MatchPhase state machine (LOBBY → DRAFT → MATCH → SHOPPING → RESULTS) in src/core/state-machine.ts with transition validation per plan.md "Phase Transitions"
- [X] T050 [US1] Implement transitionToPhase(match, newPhase) in src/core/state-machine.ts validating allowed transitions, initializing phase-specific state (e.g., starting draft timer, generating first round pool)
- [X] T051 [US1] Implement checkMatchEnd(match) in src/core/state-machine.ts detecting when only 1 player alive, setting winnerId, transitioning to RESULTS per FR-111 to FR-113

#### Event Processor (FR-186.1 to FR-186.19, research.md Decision 6) ✅

- [X] T052 [P] [US1] Implement processEvent(state, event) reducer in src/core/event-processor.ts handling all 8 core event types deterministicly per research.md Decision 6
- [X] T053 [P] [US1] Add state validation after each event in processEvent checking invariants (lives >= 0, inventory <= 5, resistance valid, pool non-empty mid-round) per FR-186.19
- [X] T054 [US1] Add error recovery in processEvent: DEV mode pauses with debug overlay, PROD mode retries then fallback to Home saving XP/Schmeckles partial per FR-186.8 to FR-186.10 and research.md Decision 3

#### Bot AI - Easy Level (FR-007, FR-114 to FR-124a, research.md Decision 7) ✅

- [X] T055 [P] [US1] Define BotInterface with decideDraftAction, decideTurnAction, decideShoppingAction methods in src/core/bot/bot-interface.ts
- [X] T056 [US1] Implement botEasyDecision(state, seed) in src/core/bot/bot-easy.ts with conservative logic: prefer revealed SAFE pills (80% when available), use Pocket Pill/Shield when health low, avoid risks per FR-115
- [X] T057 [US1] Add deterministic seeded RNG in src/core/utils/random.ts ensuring same seed produces same decisions for replay and testing
- [ ] T058 [US1] **RECLASSIFIED: MEDIUM PRIORITY** - Implement bot timeout and recovery handling in src/core/turn-manager.ts: (1) if bot takes no action in 5s (configurable), force random pill consumption from available pool, (2) log timeout with bot level and state context (structured log category: bot_error), (3) if bot has 3+ consecutive timeouts/invalid actions, attempt recovery by forcing valid random action, (4) if recovery fails 2+ times, eliminate bot from match with critical log, (5) in DEV mode: pause and show debug overlay per FR-124a and research.md Decision 3. Edge case crítico que não pode ser ignorado no MVP.

---

### Zustand Stores for User Story 1 ✅

**Arquitetura: Zustand Slices Pattern** ([documentacao oficial](https://zustand.docs.pmnd.rs/guides/slices-pattern))

- [X] T059 [P] [US1] Implement matchSlice in src/stores/slices/matchSlice.ts managing match lifecycle (phase, turnOrder, activeTurnIndex, currentRound, rounds) with actions: navigateToLobby, startMatch, transitionPhase, nextRound, nextTurn, endMatch, resetMatch
- [X] T060 [P] [US1] Implement playersSlice in src/stores/slices/playersSlice.ts managing players Map<string, Player> with lives, resistance, inventory, activeStatuses, pillCoins with actions: setPlayers, updatePlayer, applyDamage, applyHeal, applyStatus, addToInventory, removeFromInventory + queries: getPlayer, getAllPlayers, getAlivePlayers
- [X] T061 [P] [US1] Implement poolSlice in src/stores/slices/poolSlice.ts with actions that operate on currentRound.pool: revealPill, consumePill, applyModifierToPill, shufflePool + queries: getPool, getPill
- [X] T059b [P] [US1] Implement gameStore in src/stores/gameStore.ts combining all slices using Slices Pattern: createMatchSlice + createPlayersSlice + createPoolSlice with Immer middleware
- [X] T062 [P] [US1] Implement logStore in src/stores/logStore.ts managing event log array with structured logs (timestamp, category, severity, message, context) with actions: addLog, filterLogs, exportLogs per FR-186.14 to FR-186.17
- [X] T063 [US1] Implement progressionStore in src/stores/progressionStore.ts managing level, xp, schmeckles, gamesPlayed, wins with Zustand persist middleware to localStorage namespace "dosed:profile" per research.md Decision 2 and FR-165 to FR-169

---

### Minimal UI for User Story 1

#### UI Kit Básico ✅

- [X] T064 [P] [US1] Create basic Button component in src/components/ui/button.tsx with Tailwind classes, accepting onClick, disabled, children props
- [X] T065 [P] [US1] Create PillDisplay component in src/components/ui/pill-display.tsx showing pill shape (emoji or text), revealed type (if revealed), modifiers (Inverted/Doubled icons)
- [X] T066 [P] [US1] Create PlayerCard component in src/components/ui/player-card.tsx showing player avatar, name, lives, resistance bar, active status icons per FR-068, FR-069
- [X] T067 [P] [US1] Create InventorySlot component in src/components/ui/inventory-slot.tsx showing item icon, name, quantity (if stackable), clickable for use per FR-102
- [X] T068 [P] [US1] Create TimerDisplay component in src/components/ui/timer-display.tsx showing countdown in seconds with visual warning when < 10s per FR-062
- [X] T069 [P] [US1] Create LogViewer component in src/components/ui/log-viewer.tsx rendering logs from logStore in user-friendly format per FR-103 and FR-186.16

#### Game Components ✅

- [X] T070 [P] [US1] Create PillPool component in src/components/game/PillPool.tsx rendering grid of pills using PillDisplay, handling click to consume (when not targeting), showing counters per FR-071, FR-072, FR-090
- [X] T071 [P] [US1] Create PlayerHUD component in src/components/game/PlayerHUD.tsx showing lives, resistance bar, pill coins, inventory (5 slots), active statuses, using PlayerCard and InventorySlot per FR-102
- [X] T072 [P] [US1] Create OpponentLine component in src/components/game/OpponentLine.tsx rendering horizontal line of opponent PlayerCards with compact view per FR-068
- [X] T073 [US1] Add turn indicator to PlayerHUD highlighting active player with border/glow per FR-064

#### Screens ✅

- [X] T074 [P] [US1] Create HomeScreen in src/screens/HomeScreen.tsx with "ENTER THE VOID" button, displaying profile info (level, xp, schmeckles from progressionStore) per FR-001, FR-003
- [X] T075 [P] [US1] Create LobbyScreen in src/screens/LobbyScreen.tsx with add bot controls (quantity 1-5, difficulty selector Easy/Normal/Hard/Insane), participants list, "Start" button per FR-004 to FR-006
- [X] T076 [P] [US1] Create DraftScreen in src/screens/DraftScreen.tsx with 60s timer, shop grid (items filtered by DRAFT/BOTH availability), inventory display (5 slots), pill coins counter, confirm button per FR-008 to FR-020
- [X] T077 [US1] Create MatchScreen in src/screens/MatchScreen.tsx composing PillPool, PlayerHUD, OpponentLine, LogViewer, showing round number, turn timer, action buttons (Shop Signal, Leave) per FR-101, FR-190 to FR-196
- [X] T078 [P] [US1] Create ResultsScreen in src/screens/ResultsScreen.tsx displaying winner, match stats (pills consumed by type, items used, damage dealt/received, collapses, quests completed, pill coins earned/spent, total rounds), XP/Schmeckles earned, "Jogar Novamente" and "Menu Principal" buttons per FR-159 to FR-164

#### App Integration

- [X] T079 [US1] Implement App router in src/App.tsx using gameStore.match.phase to switch between screens (HOME -> HomeScreen, LOBBY -> LobbyScreen, DRAFT -> DraftScreen, MATCH -> MatchScreen, SHOPPING -> ShoppingScreen, RESULTS -> ResultsScreen) per FR-002
- [X] T080 [US1] Add Error Boundary to App.tsx wrapping all screens, implementing dual-mode error handling (DEV pause + debug, PROD retry + fallback) per FR-186.7 to FR-186.10 and research.md Decision 3
- [ ] T081-minimal [US1] **DEV MODE MINIMO (US1)** - Create basic DevTools overlay in src/DevTools.tsx (DEV mode only, triggered by VITE_DEV_MODE=true) with: (1) toggle visibility (keyboard shortcut: Ctrl+Shift+D), (2) Pause/Resume game button (congela state), (3) Current state viewer (JSON display of gameStore state - read-only), (4) Simple log viewer showing last 50 structured logs with severity colors per FR-186.9 and research.md Decision 3. Suficiente para debugging durante desenvolvimento US1.
- [ ] T081-full [Phase 6] **DEV MODE COMPLETO (Phase 6 Polish)** - Expand DevTools com 4 tabs completos per FR-187: (a) Phase Controls (skip phases, force round/turn end), (b) State Manipulation (add/remove coins/lives/resistance, apply status, reveal pills, add modifiers), (c) Advanced Logs (filter by category/severity, export JSON, clear), (d) Performance (FPS graph, frame time histogram, transition tracking). Implementar apenas após US1 completo e validado.

---

### Integration & Validation for User Story 1

- [ ] T082 [US1] Wire HomeScreen "ENTER THE VOID" button to gameStore.navigateToLobby()
- [ ] T083 [US1] Wire LobbyScreen "Start" button to gameStore.startMatch() generating initial state (players, turn order), transitioning to DRAFT
- [ ] T084 [US1] Wire DraftScreen timer expiration and "Confirm" button to gameStore.transitionPhase('MATCH'), generating first round pool, initializing turn 1
- [ ] T085 [US1] Wire MatchScreen pill clicks to gameStore.consumePill() triggering effect resolution, collapse check, turn end, next player turn
- [ ] T086 [US1] Wire MatchScreen item usage to gameStore.removeFromInventory() + item effect application (Scanner reveals, Inverter modifies, Shield applies status)
- [ ] T087 [US1] Wire turn timer expiration in MatchScreen to auto-consume random pill per FR-063
- [ ] T088 [US1] Wire match end detection (1 survivor) to gameStore.endMatch() calculating XP/Schmeckles, transitioning to RESULTS per FR-111 to FR-113, FR-161, FR-162
- [ ] T089 [US1] Wire ResultsScreen "Jogar Novamente" to gameStore.resetMatch() and navigate to LOBBY
- [ ] T090 [US1] Wire ResultsScreen "Menu Principal" to gameStore.resetMatch() and navigate to HOME
- [ ] T091 [US1] Add all event logging throughout match flow: PLAYER_JOINED on lobby, TURN_STARTED on turn start, ITEM_USED on item use, PILL_CONSUMED on pill consume, EFFECT_APPLIED on damage/heal, COLLAPSE_TRIGGERED on collapse, ROUND_COMPLETED on round end, MATCH_ENDED on match end per FR-186.14 to FR-186.18

---

### Final Validation for User Story 1

- [ ] T091 [US1] Validate complete flow manually per quickstart.md checklist (lines 463-481): (a) Home→Lobby→Draft flow (items 1-4), (b) Match core mechanics (items 5-11: Scanner, pills, collapse, última chance, elimination), (c) Results and persistence (items 12-15). All 15 checklist items MUST pass before US1 considered complete.

**Checkpoint**: User Story 1 (P1) MVP is complete and independently testable. Can deploy/demo vertical slice.

---

## Phase 4: User Story 2 - Economia de Partida (Pill Coins + Loja) (Priority: P2)

**Goal**: Jogador completa Shape Quests para ganhar Pill Coins e pode abrir loja durante turno para comprar itens estratégicos, transformando sorte pura em escolhas significativas.

**Independent Test**: Jogar partida, observar Shape Quest aparecer na HUD, completar sequência de shapes para ganhar coins, sinalizar interesse na loja, usar Shopping Phase para comprar boost.

**Why P2**: Adiciona profundidade estratégica e economia interna. Essencial para pilar "Escolhas significativas". Não bloqueia User Story 1.

---

### Core Logic for User Story 2

#### Shape Quest Generation (FR-125 to FR-137)

- [ ] T093 [P] [US2] Implement generateShapeQuest(roundNumber, pool, config) in src/core/quest-generator.ts generating quest with 2-5 shapes (based on round), using only shapes present in pool, calculating reward with progressive multiplier (1.0x/1.5x/2.0x) per FR-128 to FR-136 and data-model.md "Quest Generation"
- [ ] T094 [P] [US2] Implement trackQuestProgress(quest, consumedPill) in src/core/quest-generator.ts advancing progress if correct shape, resetting to 0 if incorrect, marking COMPLETED when sequence done per FR-133 to FR-135 and data-model.md "Progress Tracking"
- [ ] T095 [US2] Add quest lifecycle management in src/core/quest-generator.ts: generate at round start, discard at new round start (progress lost), grant reward on completion per FR-131, FR-134

#### Shopping Phase (FR-104 to FR-110, FR-138 to FR-158)

- [ ] T096 [P] [US2] Implement checkShoppingActivation(match) in src/core/state-machine.ts checking if any player has wantsShop=true AND pillCoins > 0 at round end per FR-108, FR-109
- [ ] T097 [P] [US2] Implement startShoppingPhase(match) in src/core/state-machine.ts creating ShoppingPhase with qualifiedPlayers, 30s timer, empty carts per FR-138 to FR-141
- [ ] T098 [P] [US2] Implement addToCart(shopping, playerId, item) in src/core/inventory-manager.ts validating player has coins, item availability (MATCH or BOTH), boost requirements (1-Up needs lives < 3) per FR-146 to FR-149, FR-154
- [ ] T099 [P] [US2] Implement confirmPurchases(shopping, playerId) in src/core/inventory-manager.ts deducting pillCoins, adding power-ups to inventory or queueing boosts for next round, accelerating timer (half remaining time on first confirmation) per FR-143, FR-156 to FR-158
- [ ] T100 [US2] Add shopping timeout handling: auto-confirm current cart when timer expires per FR-144

#### Economy Integration

- [ ] T101 [P] [US2] Implement grantPillCoins(player, amount, reason) in economyStore adding coins to player.pillCoins, logging transaction per FR-126, FR-134
- [ ] T102 [P] [US2] Implement spendPillCoins(player, amount, reason) in economyStore deducting coins, validating sufficient balance per FR-126
- [ ] T103 [US2] Add Pill Coins persistence within match (accumulates between rounds) and reset on new match start to 100 per FR-127

---

### Zustand Stores for User Story 2

- [ ] T104 [P] [US2] Implement economyStore in src/stores/economyStore.ts managing pill coins per player, active shape quests, shopping phase state (qualified players, carts, confirmations, timer) with actions: grantCoins, spendCoins, createQuest, completeQuest, startShopping, addToCart, confirmCart
- [ ] T105 [US2] Add Shape Quest tracking to playersSlice updating player.shapeQuest on round start, progress on pill consume, completion reward per FR-128 to FR-137

---

### Minimal UI for User Story 2

- [ ] T106 [P] [US2] Create QuestTracker component in src/components/game/QuestTracker.tsx showing quest sequence (shapes with icons), progress indicator (current position in sequence), reward amount, visual feedback on correct/incorrect shape consume per FR-132
- [ ] T107 [P] [US2] Create ShopGrid component in src/components/game/ShopGrid.tsx rendering items filtered by availability (MATCH or BOTH), showing name, cost, description, targeting, add-to-cart button per FR-184, FR-151 to FR-153
- [ ] T108 [US2] Create ShoppingScreen in src/screens/ShoppingScreen.tsx with 30s timer, ShopGrid, cart preview (total cost), confirm button, "Aguardando outros jogadores" message for non-qualified players per FR-140, FR-141, FR-142

#### UI Updates for User Story 2

- [ ] T109 [US2] Add QuestTracker to PlayerHUD in MatchScreen showing active quest per FR-132
- [ ] T110 [US2] Add "Shop Signal" toggle button to MatchScreen action dock, enabling/disabling wantsShop flag, showing visual indicator per FR-104, FR-106, FR-107
- [ ] T111 [US2] Add pill coins display to PlayerHUD showing current balance (updates on quest completion, shopping purchases) per FR-137

---

### Integration & Validation for User Story 2

- [ ] T112 [US2] Wire round start to economyStore.createQuest() generating new quest for each alive player based on new pool shapes per FR-128
- [ ] T113 [US2] Wire pill consumption to economyStore.trackQuestProgress() checking shape match, updating progress or resetting, granting coins on completion per FR-133 to FR-135
- [ ] T114 [US2] Wire round end to checkShoppingActivation() and conditionally start Shopping Phase or go directly to next round per FR-108 to FR-110
- [ ] T115 [US2] Wire ShoppingScreen cart actions to economyStore.addToCart() and economyStore.confirmCart() with validation per FR-154 to FR-158
- [ ] T116 [US2] Wire shopping timer expiration to auto-confirm all carts and transition to next round per FR-144, FR-145
- [ ] T117 [US2] Wire next round start to apply boosts (1-Up adds life, Reboot restores resistance, Scanner-2X reveals 2 random pills) per FR-157 and data-model.md "Application"
- [ ] T118 [US2] Validate Shape Quest flow manually: start match, see quest in HUD, consume correct shapes in sequence, see progress advance, complete quest, verify coins granted, see new quest on next round per acceptance scenarios in spec.md lines 46-52
- [ ] T119 [US2] Validate Shopping Phase flow manually: signal shop during turn, finish round, see Shopping Phase open, add items to cart, confirm purchase, see coins deducted, see boost applied next round per acceptance scenarios in spec.md lines 53-60

**Checkpoint**: User Stories 1 AND 2 are both independently functional. Economy system working.

---

## Phase 5: User Story 3 - Progressão Persistente (XP + Schmeckles) (Priority: P3)

**Goal**: Jogador acumula XP e ganha Schmeckles ao finalizar partidas, criando senso de progressão e retenção ao longo de múltiplas sessões.

**Independent Test**: Jogar 2-3 partidas, verificar XP acumulando, nível subindo, Schmeckles sendo ganhos, fechar e reabrir jogo verificando valores persistidos.

**Why P3**: Adiciona retenção e motivação para múltiplas partidas. Importante mas não bloqueia gameplay core.

---

### Core Logic for User Story 3

#### XP & Schmeckles Calculation (FR-161, FR-162, FR-165 to FR-169)

- [ ] T120 [P] [US3] Implement calculateXPReward(match, player, isWinner) in src/core/progression-calculator.ts calculating XP based on: rounds survived (10 XP each), victory bonus (100 XP), quests completed (25 XP each), items used strategically per FR-161 and data-model.md "XP & Schmeckles Rewards"
- [ ] T121 [P] [US3] Implement calculateSchmecklesReward(match, player, isWinner) in src/core/progression-calculator.ts calculating Schmeckles for winners: base 50 + 5 per round survived per FR-162
- [ ] T122 [P] [US3] Implement calculateLevelFromXP(xp) in src/core/progression-calculator.ts using curve: level = floor(sqrt(xp / 100)) + 1 per data-model.md "XP Progression"
- [ ] T123 [US3] Implement detectLevelUp(oldXP, newXP) in src/core/progression-calculator.ts checking if level increased, returning level-up event for UI feedback per FR-169

#### Persistence (FR-165 to FR-169, FR-186.5 to FR-186.6, research.md Decision 2)

- [ ] T124 [P] [US3] Add Zustand persist middleware to progressionStore saving to localStorage key "dosed:profile" per research.md Decision 2
- [ ] T125 [P] [US3] Implement loadProfile() in src/stores/progressionStore.ts loading from localStorage, validating schema version "1.0.0", falling back to defaults if corrupted per FR-186.6 and data-model.md "Persistence"
- [ ] T126 [P] [US3] Implement saveProfile() in src/stores/progressionStore.ts triggered on XP/Schmeckles update, wrapping data with version for future compatibility per data-model.md "Persistence"
- [ ] T127 [US3] Add profile reset utility clearProfile() in src/stores/progressionStore.ts for debugging (accessible via DevTools)

---

### Minimal UI for User Story 3

- [ ] T128 [P] [US3] Add level-up modal/notification to App.tsx showing "LEVEL UP! Now Level X" with animation when progressionStore.level increases per FR-169
- [ ] T129 [P] [US3] Update HomeScreen to display profile info from progressionStore: level, XP bar (progress to next level), Schmeckles balance per FR-003
- [ ] T130 [US3] Update ResultsScreen to show XP breakdown (rounds survived, quests completed, victory bonus) and Schmeckles earned with totals before/after per FR-161, FR-162

---

### Integration & Validation for User Story 3

- [ ] T131 [US3] Wire match end to calculate XP and Schmeckles rewards using calculateXPReward and calculateSchmecklesReward, updating progressionStore per FR-161, FR-162
- [ ] T132 [US3] Wire XP update to check for level-up with detectLevelUp, showing level-up modal if level increased per FR-169
- [ ] T133 [US3] Wire progressionStore updates to trigger saveProfile() automatically (Zustand persist middleware handles this)
- [ ] T134 [US3] Add crash recovery: if match crashes mid-game, save partial XP/Schmeckles to progressionStore before fallback to Home per FR-169a and research.md Decision 3
- [ ] T135 [US3] Validate persistence manually: play match, gain XP, close browser, reopen, verify XP/Schmeckles/level maintained per acceptance scenario in spec.md line 78
- [ ] T136 [US3] Validate level-up manually: grind XP to next level threshold, verify level-up modal appears, XP bar resets per acceptance scenario in spec.md line 75

**Checkpoint**: All P1-P3 user stories independently functional. MVP feature-complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories, performance, robustness

- [ ] T137 [P] Implement state validation after every event: validatePlayerInvariants (lives >= 0, inventory <= 5, resistance valid), validatePoolInvariants (size bounds, distribution), validateMatchInvariants (turnOrder length, currentRound sync) in src/core/utils/validation.ts per FR-186.19
- [ ] T153 [P] Validate event system has exactly 8 core event types per Constitution Principle III and plan.md design choice in src/types/events.ts - add compile-time check or runtime validation that GameEvent union has exactly 8 members (PLAYER_JOINED, TURN_STARTED, ITEM_USED, PILL_CONSUMED, EFFECT_APPLIED, COLLAPSE_TRIGGERED, ROUND_COMPLETED, MATCH_ENDED)
- [ ] T154 [P] Setup performance profiling infrastructure: (a) FPS monitoring in DevTools using performance.now(), (b) track frame time and warn if >33ms (below 30 FPS), (c) measure transition durations for pill consume, collapse, turn change, (d) display FPS graph in DevTools per FR-186.11 to FR-186.13
- [ ] T155 [P] Validate game config schema in src/config/game-config.ts: (a) all required sections present (timers, health, economy, pool, shapes, items, boosts), (b) fallback to defaults if any section missing/corrupted, (c) validate types and ranges (e.g., timers > 0, lives >= 1), (d) export validateConfig() utility
- [ ] T138 [P] Add structured logging throughout: logTurn, logItem, logPill, logStatus, logBotDecision, logStateTransition, logError, logPerformance in src/hooks/useEventLogger.ts per FR-186.14 to FR-186.18
- [ ] T139 [P] Implement FPS monitoring in DevTools: track frame time with performance.now(), warn if > 33ms (below 30 FPS), display FPS graph per research.md Decision 4
- [ ] T140 [P] Optimize animations: use CSS transitions for pill consume, collapse, turn change ensuring < 100ms duration, avoid JavaScript animation loops per FR-186.11 to FR-186.13
- [ ] T141 [P] Add bot Normal, Hard, Insane implementations in src/core/bot/ (post-MVP, Easy sufficient for initial validation) per research.md Decision 7
- [ ] T142 [P] Add visual feedback for Collapse and Última Chance: shake/flash animation (< 500ms), "0 VIDAS" red text, red border on player card per FR-095, FR-097 and clarification in spec.md line 133
- [ ] T143 [P] Add Status icons to PlayerCard: shield icon for SHIELDED, handcuffs icon for HANDCUFFED with duration remaining per FR-077
- [ ] T144 [P] Add pill counters display to MatchScreen showing count by type (SAFE, DMG_LOW, DMG_HIGH, HEAL, FATAL, LIFE) and total revealed per FR-072, FR-081
- [ ] T145 [P] Add Game Log filtering in LogViewer: filter by category (turn, item, pill, status, bot_decision), export logs as JSON per FR-186.17
- [ ] T146 [P] Add targeting UX: when item with targeting selected, highlight valid targets (pills glow for Scanner/Inverter/Discard, opponents glow for Handcuffs/Force Feed), block pill pool clicks during targeting per FR-055, FR-056
- [ ] T147 [P] Add Draft inventory management: allow removing items to free slots, refunding pills coins per FR-018
- [ ] T148 [P] Optimize pool generation: cache shapes catalog, reuse RNG instances, validate performance (generation should be < 50ms) per performance targets
- [ ] T149 [P] Add confirmation dialog for "Leave" button in MatchScreen warning XP/Schmeckles will be lost if quit mid-match
- [ ] T150 Code cleanup: remove console.logs, ensure all strings are in PT-BR, remove unused imports, format with Prettier per AGENTS.md
- [ ] T151 Documentation: update README.md with quickstart instructions, add inline JSDoc comments to core logic functions, update steering/ if needed
- [ ] T152 Manual validation: run full testing checklist from quickstart.md lines 463-481 ensuring all acceptance scenarios pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - Core MVP vertical slice
- **User Story 2 (Phase 4)**: Depends on Foundational - Can start in parallel with US1 if staffed, adds economy
- **User Story 3 (Phase 5)**: Depends on Foundational - Can start in parallel with US1/US2 if staffed, adds persistence
- **Polish (Phase 6)**: Depends on desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories - independently testable vertical slice
- **US2 (P2)**: No dependencies on other stories - economy system is independent (though more fun with US1 gameplay)
- **US3 (P3)**: No dependencies on other stories - progression system is independent (though needs US1 to generate XP)
- **US4 (P4)**: Future work - not in MVP scope

### Parallel Opportunities

- **Within Setup**: All T002-T009 (structure creation) can run in parallel
- **Within Foundational**: All T011-T027 (type definitions) can run in parallel
- **Across User Stories**: Once Foundational complete, US1, US2, US3 can be implemented in parallel by different developers
- **Within US1 Core Logic**: T029-T031 (pool), T034-T037 (effects), T038-T040 (collapse), T041-T044 (inventory) can run in parallel (different files)
- **Within US1 Stores**: T059-T063 (all stores) can run in parallel (different files)
- **Within US1 UI Kit**: T064-T069 (UI components) can run in parallel (different files)
- **Within US1 Game Components**: T070-T073 (game components) can run in parallel (different files)
- **Within US1 Screens**: T074-T078 (screens) can run in parallel (different files)
- **Within US2 Core Logic**: T093-T095 (quests) and T096-T100 (shopping) can run in parallel (different subsystems)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Fastest path to playable game**:

1. Complete **Phase 1: Setup** (T001-T010)
2. Complete **Phase 2: Foundational** (T011-T028) - CRITICAL BLOCKER
3. Complete **Phase 2.5: Testing Infrastructure** (T028a-T082c) - TDD setup
4. Complete **Phase 3: User Story 1** (T029-T092) - Write tests first, then implement
5. **STOP and VALIDATE**: Run all tests, play full match Home → Results
6. Demo vertical slice, gather feedback

**Estimated Effort**: ~70-90 tasks (including 26 tests), 3-4 weeks solo dev with TDD approach

### Incremental Delivery (MVP + Economy + Progression)

**Full MVP with all P1-P3 features**:

1. Setup + Foundational + Testing Infrastructure → Foundation ready with TDD
2. User Story 1 (write tests, implement, validate) → **Deploy/Demo MVP v1** ✅
3. User Story 2 (write tests, implement, validate) → **Deploy/Demo MVP v2** (with economy) ✅
4. User Story 3 (write tests, implement, validate) → **Deploy/Demo MVP v3** (with progression) ✅
5. Polish (Phase 6) → Final refinements → **Deploy/Demo MVP Final** ✅

**Estimated Effort**: ~168 tasks (including 26 tests), 5-7 weeks solo dev with TDD approach

### Parallel Team Strategy

**If multiple developers available**:

1. **Week 1**: Everyone on Setup + Foundational together
2. **Week 2-3**: Split into streams:
   - Dev A: User Story 1 (Core gameplay)
   - Dev B: User Story 2 (Economy)
   - Dev C: User Story 3 (Progression)
3. **Week 4**: Integration, testing, polish together

---

## Parallel Example: User Story 1 Core Logic

```bash
# Launch all pool logic together (no dependencies):
T029: Implement calculatePoolSize
T030: Implement calculateDistribution  
T031: Implement getUnlockedShapes

# Launch all effect resolution together (no dependencies):
T034: Implement resolvePillEffect
T035: Add modifier handling
T036: Add Shield check
T037: Add resistance cap enforcement
```

---

## Notes

- **[P] marker**: Tasks marked [P] operate on different files with no dependencies - can run in parallel
- **[Story] label**: Maps task to user story (US1, US2, US3) for traceability and independent delivery
- **File paths**: All tasks include explicit file paths (e.g., src/core/pool-generator.ts)
- **Tests omitted**: No test tasks included (not requested in spec, focus is mechanics-first per plan.md)
- **Constitution compliance**: 8 core events design choice (T026, T153), deterministic event processor (T052), structured logs (T138), Portuguese BR (all strings), no emojis per AGENTS.md, DRY/KISS/YAGNI/SOLID checklist in .cursor/rules/code-review/
- **DevTools split**: T081-minimal (basic debugging para US1) vs T081-full (4 tabs completos em Phase 6)
- **Bot recovery**: T058 reclassified from GAP to MEDIUM priority (edge case crítico)
- **Checkpoints**: End of each user story phase is independently testable and deployable
- **MVP scope**: User Story 1 (P1) alone is sufficient for playable vertical slice demo
- **Full MVP scope**: User Stories 1-3 (P1-P3) deliver complete feature set with gameplay, economy, and progression

---

**Total Tasks**: 181 (includes 26 test tasks + 6 additional validation/performance tasks)  
**Testing Tasks**: 26 (Phase 2.5 - unit, property-based, integration tests)  
**Bot Recovery Task**: T058 reclassified from GAP to MEDIUM priority (critical edge case)
**MVP Tasks (US1 only)**: 124 (Setup + Foundational + Testing + US1 + Bot Recovery + minimal Polish)  
**Full MVP Tasks (US1-US3)**: 168 (Setup + Foundational + Testing + US1 + US2 + US3 + minimal Polish)

**Suggested Next Step**: 
- **CURRENT STATUS (2025-12-26 - REFATORACAO SLICES PATTERN COMPLETA)**: 
  - Setup, Foundational, Core Logic phases complete (T001-T081)
  - **Refatoracao de Stores COMPLETA** usando Zustand Slices Pattern:
    - Hooks especializados criados (usePillConsumption, useTurnManagement, useBotExecution, useMatchEndDetection, useItemActions)
    - useGameLoop refatorado como orquestrador (composicao > monolito)
    - **gameStore unico combinando 3 slices** (matchSlice, playersSlice, poolSlice)
    - Zero sincronizacao entre stores (problema anterior resolvido)
    - Players em `Map<string, Player>` para O(1) lookup
    - SOLID-S mantido via arquivos separados por dominio
  - Screens atualizados para usar useGameStore
  - Stores legados removidos (matchStore.ts, playerStore.ts, poolStore.ts)
  - TypeScript compila sem erros
- **IMMEDIATE ACTION REQUIRED**: 
  1. Reintegrar screens desintegrados com hooks refatorados (T082-T091)
  2. Validar fluxo completo (T091) contra quickstart.md checklist
- **After Reintegration**: Validacao manual completa (T091) - todos os 15 items do checklist devem passar
- **Next Phase**: Once US1 is validated with clean implementation, proceed to User Story 2 (Economy) or Polish phase

