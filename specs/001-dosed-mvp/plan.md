# Implementation Plan: DOSED MVP - Pill Roulette Game

**Feature**: DOSED MVP - Vertical Slice (Home → Lobby Solo → Draft → Match vs IA → Results)  
**Branch**: `feat/core-game`  
**Created**: 2025-12-25  
**Status**: Planning

## User Context

Vamos usar React + Zustand + Vite + Typescript na construção do jogo. Foco em implementar 100% das mecânicas do jogo antes de focar na UI. Implementaremos o mínimo necessário de UI para testar as funcionalidades e recursos criados. O objetivo é ter um MVP testável com o fluxo completo e consistente do jogo.

## Technical Context

### Stack Confirmado
- **Frontend**: React 18+ com TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand (stores por domínio)
- **Persistence**: localStorage (namespace `dosed:profile`)
- **Styling**: Tailwind CSS + CSS modules (mínimo necessário para testes)
- **Animation**: CSS transitions (performance: 30 FPS target, <100ms transitions)
- **Testing**: Vitest + React Testing Library (foco em lógica pura e invariantes)

### Architecture Decisions
- **UI Strategy**: UI mínima funcional - componentes básicos sem polish visual
- **Implementation Order**: Core mechanics → Minimal UI → Polish (futuro)
- **Error Handling**: Dual-mode (retry + fallback produção / pause + debug dev)
- **Logging**: Structured logs (JSON) + Game Log UI in-game
- **Performance Target**: 30 FPS consistente, transições <100ms

## Constitution Check

### ✅ I. Documentação como Fonte da Verdade
- Spec completo em `specs/001-dosed-mvp/spec.md` (187 FRs, 42 SCs)
- Plano técnico documentado neste arquivo
- Constitution referenciada em `.specify/memory/constitution.md`

### ✅ II. Solo Dev First (Simplicidade)
- Stack minimalista: React + Zustand + Vite + TypeScript (zero bloat)
- Zustand escolhido por simplicidade vs Redux (menos boilerplate)
- localStorage suficiente para MVP (sem complexidade de backend)
- UI mínima reduz escopo e acelera validação de mecânicas

### ✅ III. Event-Driven & Determinístico
**Core Events (8 tipos - design choice dentro do limite constitucional 8-12)**:
1. `PLAYER_JOINED` - Jogador entra no lobby
2. `TURN_STARTED` - Turno de jogador inicia
3. `ITEM_USED` - Item do inventário usado
4. `PILL_CONSUMED` - Pílula consumida (core action)
5. `EFFECT_APPLIED` - Efeito de pill/item aplicado
6. `COLLAPSE_TRIGGERED` - Colapso ocorre (Resistência ≤ 0)
7. `ROUND_COMPLETED` - Rodada termina (pool esgotado)
8. `MATCH_ENDED` - Partida termina (1 sobrevivente)

**Rationale para 8 eventos (não 12)**: 8 eventos cobrem 100% do state space do MVP. Eventos adicionais (SHOPPING_STARTED, QUEST_COMPLETED, LEVEL_UP, BOOST_APPLIED) seriam redundantes - são sub-estados já capturados pelos 8 core events. Simplicidade (8) vs granularidade excessiva (12) alinha com Princípio II (Solo Dev First).

**Estado Imutável**: Zustand stores com reducer pattern (produce novo estado via Immer)
**Determinismo**: Mesma sequência de eventos → mesmo estado final (testável)

### ✅ IV. Server-Authoritative (Multiplayer Futuro)
- MVP solo: lógica client-side (core/ folder)
- Arquitetura preparada para migração: lógica pura separada de UI
- Quando implementar multiplayer: mover core logic para Edge Functions
- Cliente mantém UI otimista + event log para rollback

### ✅ V. Convenções Claras de Código
- **UI kit genérico**: `src/components/ui/` (kebab-case) - ex: `pill-button.tsx`
- **Domínio de jogo**: `src/components/game/`, `src/screens/` (PascalCase) - ex: `MatchScreen.tsx`, `PlayerHUD.tsx`
- **Hooks**: prefixo `use` - ex: `useGameLoop.ts`, `useTurnTimer.ts`
- **Exports**: nomeados (evitar default export)

### ✅ VI. Testing Estratégico
**Áreas Críticas para Testes**:
- Pool generation (distribuição de tipos, tamanho progressivo, shapes unlock)
- Turn/Round state machine transitions
- Collapse mechanics (Vidas → Resistência → Última Chance → Eliminado)
- Invariantes: Vidas ≥ 0, Resistência -∞ a cap, inventário ≤ 5 slots
- Bot decision making (deterministico dado mesmo state seed)
- Event processor (determinismo: mesmos eventos → mesmo estado)

**Property-Based Testing**: Pool distribution, Shape Quest viability

### ✅ VII. Comunicação em Português (Brasil)
- Documentação: PT-BR ✅
- Commits: PT-BR ✅
- Comentários: PT-BR ✅
- Código (identificadores): EN ✅
- Sem emojis ✅

## Gates & Risks

### Pre-Research Gates (PASSED)
- [x] Stack técnico definido (React + Zustand + Vite + TS)
- [x] Persistência decidida (localStorage)
- [x] Performance targets claros (30 FPS, <100ms)
- [x] Logging strategy (structured + Game Log UI)
- [x] Constitution principles validated

### Known Risks
1. **Bot AI Complexity** (Medium)
   - **Risk**: 4 níveis de dificuldade podem ser over-engineered
   - **Mitigation**: Implementar Easy primeiro, validar comportamento, escalar progressivamente
   
2. **State Machine Complexity** (Medium)
   - **Risk**: 5 fases + turnos + rodadas = muitas transições
   - **Mitigation**: State machine explícita com testes de transição, usar XState se Zustand ficar complexo
   
3. **Turn Timer + Animations** (Low)
   - **Risk**: Timer preciso + animações podem conflitar
   - **Mitigation**: Separar timers lógicos (setTimeout) de animações (CSS), priorizar lógica

4. **Pool Generation Fairness** (Medium)
   - **Risk**: RNG pode gerar pools injustos (ex: 100% SAFE ou 100% FATAL)
   - **Mitigation**: Testes de distribuição, validar bounds (min/max por tipo)

### Complexity Tracking
- **Total Events**: 8 (design choice dentro do limite constitucional 8-12)
  - **Rationale**: 8 eventos cobrem todo o MVP state space. Eventos 9-12 seriam redundantes ou sub-estados (Shopping, Quest, LevelUp já capturados por ROUND_COMPLETED, EFFECT_APPLIED, MATCH_ENDED). Preferimos simplicidade (Princípio II) sem perder expressividade.
  - **Extensibilidade futura**: Se multiplayer real exigir eventos adicionais (PLAYER_DISCONNECTED, RECONNECT_ATTEMPT, SERVER_ROLLBACK), podemos expandir até 12 mantendo Constitution compliance.
- **Zustand Stores**: 5 (match, player, pool, economy, progression)
- **Key Entities**: 29 (alto mas necessário para domínio complexo)
- **FRs**: 187 (alto - priorizar P1 user story primeiro)

## Implementation Strategy

### Phase 0: Research & Decisions ✅ COMPLETE
- [x] Stack decisões confirmadas (spec clarifications)
- [x] Zustand store organization defined
- [x] Event taxonomy defined (8 core events)
- [x] Constitution compliance validated

### Phase 1: Core Domain Logic (Mechanics-First)

**Priority**: Implementar toda a lógica de jogo SEM UI

#### 1.1 Data Model & Types (`src/types/`)
- `game.ts` - Match, Round, Turn, Player, Pool
- `pill.ts` - Pill, PillType, Shape, Modifier
- `item.ts` - Item, ItemCategory, targeting
- `status.ts` - Status (Shielded, Handcuffed), durations
- `events.ts` - 8 core events with payload types

#### 1.2 Core Logic (`src/core/`)
- `pool-generator.ts` - Gerar pool por rodada (distribuição, shapes, tamanho)
- `effect-resolver.ts` - Resolver efeitos de pills (DMG/HEAL/FATAL/etc + modificadores)
- `collapse-handler.ts` - Mecânica de Colapso (Vidas → Resistência → Última Chance)
- `inventory-manager.ts` - Gerenciar inventário (5 slots, stackables, validações)
- `quest-generator.ts` - Gerar Shape Quests por rodada (baseado em pool)
- `state-machine.ts` - State machine de fases (Lobby → Draft → Match → Shopping → Results)
- `turn-manager.ts` - Gerenciar ordem de turnos (round-robin, skip eliminados)
- `event-processor.ts` - Processar eventos deterministicamente (reducer pattern)

#### 1.3 Bot AI (`src/core/bot/`)
- `bot-easy.ts` - Nível Easy (Paciente)
- `bot-normal.ts` - Nível Normal (Cobaia)
- `bot-hard.ts` - Nível Hard (Sobrevivente)
- `bot-insane.ts` - Nível Insane (Hofmann)
- `bot-interface.ts` - Interface comum para todos os bots

#### 1.4 Zustand Stores (`src/stores/`)
- `matchStore.ts` - Partida, rodadas, turnos, fase atual
- `playerStore.ts` - Jogadores, inventários, vidas, resistência, status
- `poolStore.ts` - Pool atual, pills, revelações, modificadores
- `economyStore.ts` - Pill Coins, Shape Quests, Shopping
- `progressionStore.ts` - XP, Schmeckles, nível (persiste em localStorage)
- `logStore.ts` - Event log + Game Log para UI

### Phase 2: Minimal UI (Testability-First)

**Priority**: UI funcional SEM polish visual - apenas para testar mecânicas

#### 2.1 UI Kit Básico (`src/components/ui/`)
- `button.tsx` - Botão genérico
- `pill-display.tsx` - Exibir pílula (shape + revelação)
- `player-card.tsx` - Card de jogador (vidas, resistência, status)
- `inventory-slot.tsx` - Slot de inventário
- `timer-display.tsx` - Timer visual simples
- `log-viewer.tsx` - Visualizar Game Log

#### 2.2 Game Components (`src/components/game/`)
- `PillPool.tsx` - Grid de pílulas (clicável)
- `PlayerHUD.tsx` - HUD do jogador (vidas, resistência, inventário, coins)
- `OpponentLine.tsx` - Linha de oponentes
- `ShopGrid.tsx` - Grade de itens da loja

**Nota sobre Feedback Visual de Colapso/Última Chance (FR-095, FR-097)**:
"Feedback visual claro" para eventos críticos no MVP significa:
- Animação de shake/flash quando Colapso ocorre (duração <500ms, CSS transition simples)
- HUD exibe "0 VIDAS" em vermelho piscante quando jogador entra em Última Chance
- Avatar/card do jogador com borda vermelha espessa quando em Última Chance
- NÃO requer ilustração complexa - texto + cor + animação CSS é suficiente para MVP
- Prioridade: funcionalidade > estética (polish visual vem depois de 100% mecânicas funcionando)
- `QuestTracker.tsx` - Tracker de Shape Quest

#### 2.3 Screens (`src/screens/`)
- `HomeScreen.tsx` - Tela inicial (ENTER THE VOID)
- `LobbyScreen.tsx` - Configurar sala (bots, dificuldade)
- `DraftScreen.tsx` - Draft de itens (timer, loja, inventário)
- `MatchScreen.tsx` - Partida (pool, turnos, HUD, log)
- `ShoppingScreen.tsx` - Shopping Phase (entre rodadas)
- `ResultsScreen.tsx` - Resultados (stats, XP, schmeckles)

#### 2.4 Integration
- `App.tsx` - Router de fases (AppScreen + Phase)
- `DevTools.tsx` - Overlay de debug (DEV mode only)

### Phase 3: Testing & Validation

#### 3.1 Unit Tests (Vitest)
- Pool generation (distribuição, shapes, bounds)
- Effect resolution (todos os tipos de pill + modificadores)
- Collapse mechanics (Vidas → Resistência transitions)
- Inventory management (slots, stackables, validations)
- Quest generation (viabilidade com pool atual)
- Event processor (determinismo)

#### 3.2 Integration Tests
- Fluxo completo: Home → Lobby → Draft → Match → Results
- Bot vs Bot (deterministico com seed)
- Edge cases: timer expiration, eliminações, pool vazio

#### 3.3 Manual Testing Checklist
- [ ] Jogar partida completa solo vs 1 bot Easy
- [ ] Testar todos os itens (Scanner, Inverter, Shield, etc)
- [ ] Validar Colapso e Última Chance (0 Vidas)
- [ ] Completar Shape Quest
- [ ] Usar Shopping Phase (comprar boost)
- [ ] Verificar persistência (fechar e reabrir, XP mantido)

## Deliverables

### Artifacts Generated
- [x] `plan.md` - Este documento
- [x] `research.md` - Decisões técnicas e rationale
- [ ] `data-model.md` - Modelo de dados detalhado
- [ ] `quickstart.md` - Guia de setup e execução

### Code Structure (to be created)
```
src/
├── types/           # Contratos TypeScript
├── core/            # Lógica pura (testável)
│   ├── bot/        # IA dos bots
│   └── utils/      # Utilities
├── stores/          # Zustand stores
├── components/
│   ├── ui/         # UI kit (kebab-case)
│   └── game/       # Game components (PascalCase)
├── screens/         # Screens principais
└── App.tsx          # Entry point
```

### Success Criteria (MVP)
- [ ] Fluxo completo jogável (Home → Match → Results)
- [ ] Bot Easy funcional e razoável
- [ ] Mecânicas core 100% implementadas (FR-001 a FR-187)
- [ ] Persistência de XP/Schmeckles funciona
- [ ] UI mínima permite testar todas as mecânicas
- [ ] Testes de lógica core passando (pool, collapse, inventory)
- [ ] Performance: 30 FPS consistente, transições <100ms

## Next Steps

1. **Generate research.md** - Consolidar decisões técnicas
2. **Generate data-model.md** - Documentar entidades e relações
3. **Generate quickstart.md** - Setup de ambiente de dev
4. **Create tasks** - Decompor em tarefas executáveis (`/speckit.tasks`)
5. **Start Phase 1.1** - Implementar types e data model

