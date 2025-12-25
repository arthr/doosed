# Quickstart Guide: DOSED MVP

**Feature**: DOSED MVP  
**Date**: 2025-12-25

## Pré-requisitos

- **Node.js**: 18+ (LTS recomendado)
- **pnpm**: 8+ (gerenciador de pacotes)
- **Git**: Para controle de versão
- **VSCode**: Editor recomendado (extensões TS/React)

## Setup Inicial

### 1. Clonar Repositório

```bash
git clone <repo-url>
cd dosed
git checkout feat/core-game
```

### 2. Instalar Dependências

```bash
pnpm install
```

**Dependências Principais**:
- `react` (18+)
- `react-dom`
- `zustand` (state management)
- `immer` (imutabilidade)
- `tailwindcss` (styling mínimo)
- `typescript` (5+)
- `vite` (build tool)
- `vitest` (testing)

### 3. Configurar Ambiente

Criar `.env.local` (se necessário):

```bash
# Dev mode (habilita DevTools overlay)
VITE_DEV_MODE=true

# Log level
VITE_LOG_LEVEL=debug
```

### 4. Estrutura de Pastas (A Ser Criada)

```
src/
├── types/              # TypeScript types (baseado em data-model.md)
│   ├── game.ts
│   ├── pill.ts
│   ├── item.ts
│   ├── status.ts
│   ├── events.ts
│   └── config.ts
│
├── core/               # Lógica pura (testável, sem React)
│   ├── pool-generator.ts
│   ├── effect-resolver.ts
│   ├── collapse-handler.ts
│   ├── inventory-manager.ts
│   ├── quest-generator.ts
│   ├── state-machine.ts
│   ├── turn-manager.ts
│   ├── event-processor.ts
│   ├── bot/
│   │   ├── bot-easy.ts
│   │   ├── bot-normal.ts
│   │   ├── bot-hard.ts
│   │   ├── bot-insane.ts
│   │   └── bot-interface.ts
│   └── utils/
│       ├── random.ts        # Seeded RNG para determinismo
│       └── validation.ts    # Validações de invariantes
│
├── stores/             # Zustand stores
│   ├── matchStore.ts
│   ├── playerStore.ts
│   ├── poolStore.ts
│   ├── economyStore.ts
│   ├── progressionStore.ts  # Com persist para localStorage
│   └── logStore.ts
│
├── components/
│   ├── ui/            # UI kit genérico (kebab-case)
│   │   ├── button.tsx
│   │   ├── pill-display.tsx
│   │   ├── player-card.tsx
│   │   ├── inventory-slot.tsx
│   │   ├── timer-display.tsx
│   │   └── log-viewer.tsx
│   │
│   └── game/          # Game components (PascalCase)
│       ├── PillPool.tsx
│       ├── PlayerHUD.tsx
│       ├── OpponentLine.tsx
│       ├── ShopGrid.tsx
│       └── QuestTracker.tsx
│
├── screens/           # Screens principais (PascalCase)
│   ├── HomeScreen.tsx
│   ├── LobbyScreen.tsx
│   ├── DraftScreen.tsx
│   ├── MatchScreen.tsx
│   ├── ShoppingScreen.tsx
│   └── ResultsScreen.tsx
│
├── hooks/             # Custom hooks
│   ├── useGameLoop.ts
│   ├── useTurnTimer.ts
│   └── useEventLogger.ts
│
├── App.tsx            # Entry point (phase router)
├── DevTools.tsx       # Debug overlay (DEV mode only)
└── main.tsx           # React mount
```

## Comandos Disponíveis

### Desenvolvimento

```bash
# Iniciar dev server (Hot Module Reload)
pnpm dev

# Dev server com DevTools habilitado
VITE_DEV_MODE=true pnpm dev
```

**Acesso**: `http://localhost:5173`

### Build

```bash
# Build para produção
pnpm build

# Preview build de produção
pnpm preview
```

### Testes

```bash
# Rodar todos os testes
pnpm test

# Testes em watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Linting & Formatting

```bash
# Lint TypeScript/React
pnpm lint

# Format com Prettier
pnpm format

# Type check (sem emitir arquivos)
pnpm typecheck
```

### Scripts de Documentação

```bash
# Atualizar apêndice de recência
python .cursor/rules/docs-workflow/scripts/update_fontes_recencia.py

# Validar consistência do steering
python .cursor/rules/docs-workflow/scripts/check_steering.py
```

## Workflow de Desenvolvimento

### Fase 1: Core Domain Logic (Mechanics-First)

**Objetivo**: Implementar 100% da lógica de jogo SEM UI

#### 1.1 Implementar Types

```bash
# Criar types baseado em data-model.md
touch src/types/{game,pill,item,status,events,config}.ts
```

**Validação**: TypeScript compila sem erros

#### 1.2 Implementar Core Logic

```bash
# Criar core/ modules
touch src/core/{pool-generator,effect-resolver,collapse-handler,inventory-manager,quest-generator,state-machine,turn-manager,event-processor}.ts
```

**Validação**: Unit tests passando

```bash
# Criar testes
touch src/core/__tests__/{pool-generator,effect-resolver}.test.ts

# Rodar testes
pnpm test
```

#### 1.3 Implementar Bot AI

```bash
# Começar com Easy bot
touch src/core/bot/{bot-interface,bot-easy}.ts

# Testar bot Easy
pnpm test src/core/bot/__tests__/bot-easy.test.ts
```

**Validação**: Bot Easy toma decisões válidas e razoáveis

#### 1.4 Implementar Zustand Stores

```bash
# Criar stores
touch src/stores/{matchStore,playerStore,poolStore,economyStore,progressionStore,logStore}.ts
```

**Validação**: Stores compilam e têm tipos corretos

### Fase 2: Minimal UI (Testability-First)

**Objetivo**: UI funcional mínima para testar mecânicas

#### 2.1 UI Kit Básico

```bash
# Criar componentes UI
touch src/components/ui/{button,pill-display,player-card,inventory-slot,timer-display,log-viewer}.tsx
```

**Validação**: Componentes renderizam sem crash

#### 2.2 Game Components

```bash
# Criar componentes de jogo
touch src/components/game/{PillPool,PlayerHUD,OpponentLine,ShopGrid,QuestTracker}.tsx
```

**Validação**: Componentes conectam com stores

#### 2.3 Screens

```bash
# Criar screens
touch src/screens/{HomeScreen,LobbyScreen,DraftScreen,MatchScreen,ShoppingScreen,ResultsScreen}.tsx
```

**Validação**: Navegação entre screens funciona

#### 2.4 Integration

```bash
# Criar App router
touch src/App.tsx src/DevTools.tsx
```

**Validação**: Fluxo completo jogável (Home → Match → Results)

### Fase 3: Testing & Validation

#### 3.1 Unit Tests (Core Logic)

**Priority 1**:
- `pool-generator.test.ts` - Distribuição, tamanho, shapes
- `effect-resolver.test.ts` - Todos os tipos de pill + modificadores
- `collapse-handler.test.ts` - Vidas → Resistência transitions
- `inventory-manager.test.ts` - 5 slots, stackables, validações
- `quest-generator.test.ts` - Viabilidade com pool atual
- `event-processor.test.ts` - Determinismo

#### 3.2 Property-Based Tests

```bash
# Instalar fast-check
pnpm add -D @fast-check/vitest

# Criar property tests
touch src/core/__tests__/pool-distribution.property.test.ts
```

**Validação**: Invariantes mantidos em 1000+ casos gerados

#### 3.3 Integration Tests

```bash
# Criar integration tests
touch src/__tests__/integration/full-game-flow.test.ts
```

**Validação**: Fluxo completo executável programaticamente

## Debugging

### DevTools Overlay (DEV Mode)

Habilitar em `.env.local`:

```bash
VITE_DEV_MODE=true
```

**Features**:
- Pular entre phases (Lobby/Draft/Match/Results)
- Alterar Pill Coins, Vidas, Resistência
- Aplicar/remover Status
- Revelar/ocultar pills
- Visualizar estado completo (JSON)
- Exportar logs estruturados

### Zustand DevTools

Instalar extensão Redux DevTools no Chrome/Firefox.

**Acesso**: Abrir DevTools → Redux tab → Visualizar state de todas as stores

### Logs Estruturados

Logs são automaticamente escritos no console e Game Log UI.

**Filtrar por categoria**:

```typescript
// No DevTools overlay
filterLogs({ category: 'bot_decision', severity: 'info' });
```

**Exportar logs**:

```typescript
// No DevTools overlay
exportLogs(); // Baixa JSON com todos os logs da sessão
```

### Performance Monitoring

```typescript
// Em DevTools overlay, habilitar FPS monitor
enableFPSMonitor();

// Logs de warnings se frame time > 33ms (below 30 FPS)
```

## Configuration de Balance

Todas as configurações de balance estão em `src/config/game-config.ts`:

```typescript
export const DEFAULT_GAME_CONFIG: GameConfig = {
  timers: {
    turn: 30, // segundos
    draft: 60,
    shopping: 30,
    botTimeout: 5,
  },
  
  health: {
    initialLives: 3,
    initialResistance: 6,
    resistanceCap: 6,
    extraResistanceCap: 6,
  },
  
  economy: {
    initialPillCoins: 100,
    shapeQuestBaseReward: 10,
    questMultipliers: { early: 1.0, mid: 1.5, late: 2.0 },
  },
  
  pool: {
    baseSize: 6,
    incrementEveryNRounds: 3,
    maxSize: 12,
    minShapeDiversity: 3,
    distribution: { /* ... */ },
  },
  
  // ... outros configs
};
```

**Editar**: Alterar valores em `game-config.ts`, recarregar página.

**Reset**: Apagar localStorage e recarregar.

## Troubleshooting

### Problema: Build falha com erro de tipo

**Solução**:

```bash
# Verificar tipos sem build
pnpm typecheck

# Se houver erros, corrigir em src/types/
```

### Problema: Testes falham com erro de módulo

**Solução**:

```bash
# Re-instalar dependências
pnpm install

# Limpar cache do Vitest
pnpm test --clearCache
```

### Problema: localStorage corrompido

**Solução**:

```typescript
// No console do browser
localStorage.removeItem('dosed:profile');
location.reload();
```

### Problema: DevTools não aparecem

**Solução**:

```bash
# Verificar env var
echo $VITE_DEV_MODE

# Deve ser "true". Se não, adicionar em .env.local:
echo "VITE_DEV_MODE=true" >> .env.local

# Reiniciar dev server
pnpm dev
```

### Problema: FPS abaixo de 30

**Solução**:

1. Abrir DevTools overlay → Performance tab
2. Identificar componentes re-renderizando excessivamente
3. Usar React DevTools Profiler
4. Adicionar `React.memo()` em componentes puros
5. Otimizar selectors do Zustand

## Testing Checklist (Manual)

Após implementar Fase 1 + Fase 2:

- [ ] **Home Screen**: Clicar "ENTER THE VOID" leva para Lobby
- [ ] **Lobby**: Adicionar 1 bot Easy, selecionar dificuldade, clicar "Start"
- [ ] **Draft**: Comprar Scanner (15 coins), ver saldo atualizar (85 coins), timer contar
- [ ] **Match - Turno**: Usar Scanner em pill, ver tipo revelado, consumir pill
- [ ] **Match - Efeito**: Consumir DMG_LOW, verificar Resistência reduz (6 → 4)
- [ ] **Match - Colapso**: Forçar Resistência a 0, verificar Colapso (Vidas 3 → 2, Resistência reseta para 6)
- [ ] **Match - Última Chance**: Forçar Vidas a 0, verificar "0 Vidas" mas ainda vivo
- [ ] **Match - Eliminação**: Colapsar em Última Chance, verificar "ELIMINATED"
- [ ] **Match - Shape Quest**: Consumir pills na sequência correta, verificar progresso, completar e ganhar coins
- [ ] **Match - Bot**: Bot toma decisões válidas (não trava, não ação inválida)
- [ ] **Match - Timer**: Deixar timer expirar, verificar pill aleatória consumida automaticamente
- [ ] **Match - Rodada**: Pool esgota, nova Rodada inicia com novo pool
- [ ] **Shopping**: Sinalizar loja, terminar rodada, Shopping Phase abre, comprar boost
- [ ] **Results**: Apenas 1 sobrevive, Results exibe stats, XP, Schmeckles
- [ ] **Persistência**: Fechar e reabrir, verificar XP/Schmeckles mantidos

## Next Steps

Após completar setup e validar Fase 1 (Core Logic):

1. **Implementar Fase 2** (Minimal UI) conforme plan.md
2. **Validar Manual Testing Checklist**
3. **Rodar `/speckit.tasks`** para decompor em tarefas técnicas executáveis
4. **Implementar tarefas** seguindo ordem de prioridade
5. **Iterar**: Core Logic → UI → Polish (futuro)

## Recursos Adicionais

- **Spec Completo**: `specs/001-dosed-mvp/spec.md`
- **Plan Técnico**: `specs/001-dosed-mvp/plan.md`
- **Data Model**: `specs/001-dosed-mvp/data-model.md`
- **Research**: `specs/001-dosed-mvp/research.md`
- **Constitution**: `.specify/memory/constitution.md`
- **Docs**: `docs/` (fonte da verdade)

---

**Última Atualização**: 2025-12-25  
**Status**: Ready for Implementation

