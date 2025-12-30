# Technical Research & Decisions

**Feature**: DOSED MVP  
**Date**: 2025-12-25

## Executive Summary

Este documento consolida todas as decisões técnicas tomadas durante a fase de clarificação e planejamento do MVP. Todas as decisões foram validadas contra a Constitution e alinhadas com o objetivo de implementar mecânicas completas com UI mínima testável.

---

## Decision 1: State Management - Zustand

### Context
Jogo turn-based complexo com state distribuído: match state, player state, pool state, economy, progression. Necessário gerenciar transições de fase (Lobby → Draft → Match → Shopping → Results), turnos, inventários, status ativos.

### Decision
**Usar Zustand** como biblioteca de state management.

### Rationale
1. **Simplicidade**: ~1KB, API mínima, menos boilerplate que Redux
2. **Solo Dev Friendly**: Fácil de ler e manter por um desenvolvedor
3. **Performance**: Re-renders otimizados com selectors
4. **DevTools**: Suporta Redux DevTools para debugging
5. **Precedente**: Projeto já tem stores Zustand em `src_bkp/stores/`
6. **State Machines**: Adequado para implementar state machines (fases do jogo)

### Alternatives Considered
- **Redux Toolkit**: Mais robusto mas muito boilerplate para solo dev
- **Context API**: Zero deps mas performance questionável para updates frequentes de jogo
- **XState**: Especializado em state machines mas curva de aprendizado maior, over-engineering para MVP

### Implementation Details

**Arquitetura: Zustand Slices Pattern** ([documentacao oficial](https://zustand.docs.pmnd.rs/guides/slices-pattern))

Apos analise, a arquitetura original de 5 stores separados foi refatorada para usar o Slices Pattern oficial do Zustand, eliminando problemas de sincronizacao entre stores.

**Store Organization**:
```
src/stores/
  slices/
    types.ts           # Tipos compartilhados (GameStore, SliceCreator)
    matchSlice.ts      # Match lifecycle (phases, turns, rounds)
    playersSlice.ts    # Player management (health, inventory, status)
    poolSlice.ts       # Pool operations (consume, reveal, modify)
  gameStore.ts         # Bounded store (combina todos os slices)
  index.ts             # Re-exports
  economyStore.ts      # Pill Coins, Shape Quests, Shopping Phase
  progressionStore.ts  # XP, Schmeckles, nivel (com persist para localStorage)
  logStore.ts          # Event log + Game Log para UI
```

**Rationale para Slices Pattern**:
1. **Zero sincronizacao**: Store unico elimina necessidade de sincronizar estado entre stores
2. **SOLID-S mantido**: Cada slice em arquivo separado com responsabilidade unica
3. **Performance**: Players em `Map<string, Player>` para O(1) lookup
4. **Slices colaboram**: Acessam estado uns dos outros via `get()` sem overhead

**Pattern (Slices)**:
```typescript
// src/stores/slices/matchSlice.ts
import type { SliceCreator, MatchSlice } from './types';

export const createMatchSlice: SliceCreator<MatchSlice> = (set, get) => ({
  match: null,
  currentRound: null,
  
  startMatch: (players) => set((state) => {
    // Usa playersSlice para armazenar players via get()
    get().setPlayers(players);
    // ... inicializa match
  }),
});

// src/stores/gameStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createMatchSlice } from './slices/matchSlice';
import { createPlayersSlice } from './slices/playersSlice';
import { createPoolSlice } from './slices/poolSlice';

export const useGameStore = create(
  immer((...a) => ({
    ...createMatchSlice(...a),
    ...createPlayersSlice(...a),
    ...createPoolSlice(...a),
  }))
);
```

**Uso nos componentes**:
```typescript
import { useGameStore } from '../stores/gameStore';

// Selecionar apenas o que precisa (performance)
const match = useGameStore((state) => state.match);
const applyDamage = useGameStore((state) => state.applyDamage);
const players = useGameStore((state) => state.getAllPlayers());
```

**References**:
- [Zustand Slices Pattern](https://zustand.docs.pmnd.rs/guides/slices-pattern)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Immer Middleware](https://docs.pmnd.rs/zustand/integrations/immer-middleware)

---

## Decision 2: Data Persistence - localStorage

### Context
MVP solo requer persistência de progressão do jogador (XP, Schmeckles, nível) entre sessões. Multiplayer é futuro (não implementar backend agora).

### Decision
**Usar localStorage** com namespace `dosed:profile`.

### Rationale
1. **Simplicidade**: API síncrona nativa do browser, zero setup
2. **Suficiente para MVP**: ~5-10MB limite, dados de perfil são pequenos (<1KB)
3. **Funciona Offline**: Não depende de conexão
4. **Fácil Migração**: Quando implementar backend, migrar dados é trivial
5. **Solo Dev First**: Evita complexidade de autenticação e sincronização

### Alternatives Considered
- **IndexedDB**: API assíncrona, mais robusto, útil se precisar armazenar replays (overkill para MVP)
- **Supabase local-first**: Hybrid, sincroniza quando online, complexo demais para MVP solo
- **sessionStorage**: Perde dados ao fechar aba (inaceitável)

### Implementation Details
**Schema**:
```typescript
// dosed:profile
{
  "version": "1.0.0",
  "playerId": "uuid",
  "level": 1,
  "xp": 0,
  "schmeckles": 0,
  "gamesPlayed": 0,
  "wins": 0,
  "lastUpdated": "2025-12-25T10:00:00Z"
}
```

**Validação**: Validar schema ao carregar, fallback para defaults se corrompido.

**Integration com Zustand**:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProgressionStore = create(
  persist(
    (set) => ({
      level: 1,
      xp: 0,
      schmeckles: 0,
      // ...
    }),
    { name: 'dosed:profile' }
  )
);
```

**References**:
- [Zustand Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)

---

## Decision 3: Error Recovery - Dual Mode

### Context
Erros fatais (bot timeout, state corruption) podem impedir partida de continuar. Necessário UX graceful em produção + debugging eficiente em dev.

### Decision
**Dual-mode error handling**:
- **Produção**: Retry automático (1-2x) + fallback graceful para Home salvando XP/Schmeckles parcial
- **Dev**: Pause + Debug Mode (congela jogo, exibe DevTools overlay com estado, permite reload manual)

### Rationale
1. **UX em Produção**: Jogador não perde progressão parcial, tem opção de sair gracefully
2. **Debugging em Dev**: Permite inspecionar estado exato do erro, acelera correção
3. **Constitution Compliance**: Solo dev precisa debugging eficiente
4. **Recovery Strategy**: Tenta recuperar automaticamente antes de desistir

### Implementation Details
**Error Boundary** (React):
```typescript
class GameErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      // Pause + Debug Mode
      pauseGame();
      showDebugOverlay({ error, state: captureState() });
    } else {
      // Retry + Fallback
      attemptRecovery(error, MAX_RETRIES).catch(() => {
        savePartialProgression();
        navigateToHome({ reason: 'error' });
      });
    }
    logError({ error, errorInfo, state: captureState() });
  }
}
```

**Edge Cases Cobertos**:
- Bot timeout (3+ consecutivos) → força ação automática ou fallback
- State corruption (validação detecta inconsistência) → recovery ou fallback
- Timer failures → forçar ação default

**References**:
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

## Decision 4: Performance Targets

### Context
Turn-based web game com animações (consumo pills, colapsos, transições de turno). Necessário definir targets realistas.

### Decision
**30 FPS consistente + transições <100ms**.

### Rationale
1. **Realista para Web**: 30 FPS é smooth suficiente para turn-based, não requer GPU potente
2. **Consistency > Peak**: Melhor 30 FPS constante que 60 FPS com drops para 20
3. **Feedback Imediato**: <100ms transições é perceptivamente instantâneo
4. **Solo Dev**: Atingir 60 FPS requer otimizações agressivas (tempo vs benefício marginal)
5. **Cross-Device**: Funciona bem em hardware médio/baixo

### Alternatives Considered
- **60 FPS + <50ms**: Buttery smooth mas difícil manter consistência, exige otimizações agressivas
- **No hard target**: Pragmático mas arriscado, pode resultar em jank
- **Híbrido**: 60 FPS só em animações críticas (complexo de implementar)

### Implementation Details
**Animation Strategy**:
- **CSS Transitions/Animations**: Usar quando possível (GPU-accelerated, não bloqueia JS thread)
- **React Spring / Framer Motion**: Para animações complexas (physics-based)
- **Evitar**: JavaScript animation loops (requestAnimationFrame), bloqueiam thread principal

**Measurement**:
- Monitor FPS com `performance.now()` em DEV mode
- Log warnings se frame time > 33ms (below 30 FPS)
- Track transition durations para validar <100ms

**References**:
- [CSS Animations Performance](https://web.dev/animations-guide/)
- [React Spring](https://www.react-spring.dev/)

---

## Decision 5: Observability - Structured Logs + Game Log UI

### Context
Debugging de edge cases complexos (bot decisions, state transitions, invariantes). Necessário balance entre usabilidade e poder de diagnóstico.

### Decision
**Structured logs (JSON format) + Game Log UI in-game**.

### Rationale
1. **Debugging Técnico**: Logs estruturados permitem filtrar por categoria, exportar para análise
2. **UX + Replay**: Game Log UI mostra histórico de ações para jogadores (já especificado em FR-103)
3. **Solo Dev**: Permite diagnosticar bugs sem ferramentas externas complexas
4. **Determinismo**: Event log permite replay de bugs (mesmos eventos → mesmo erro)
5. **Simplicidade**: Não requer telemetry/analytics complexo (overhead desnecessário para MVP)

### Alternatives Considered
- **Console.log básico**: Minimalista mas dificulta debugging de edge cases
- **Full telemetry**: Tracking detalhado, útil para analytics mas overhead para MVP solo
- **Time-travel debugging**: Redux DevTools style, poderoso mas complexo

### Implementation Details
**Log Categories**:
- `turn` - Início/fim de turno, jogador ativo
- `item` - Item usado, alvo, efeito
- `pill` - Pill consumida, tipo revelado, efeito aplicado
- `status` - Status aplicado/removido, duração
- `bot_decision` - Nível de dificuldade, reasoning, ação escolhida
- `state_transition` - Mudanças de fase/rodada
- `error` - Erros capturados
- `performance` - FPS warnings, long frames

**Schema**:
```typescript
interface LogEntry {
  timestamp: string; // ISO8601
  category: LogCategory;
  severity: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context: {
    playerId?: string;
    roundNumber?: number;
    turnIndex?: number;
    // ... relevant data
  };
}
```

**Game Log UI**: Renderiza logs de categorias `turn`, `item`, `pill`, `status` em formato user-friendly:
```
[Rodada 3, Turno 2] Jogador 1 usou Scanner em Pill #5
[Rodada 3, Turno 2] Pill #5 revelada: DMG_HIGH (-4 Resistência)
[Rodada 3, Turno 2] Jogador 1 consumiu Pill #5 (Triangle)
[Rodada 3, Turno 2] Efeito: -4 Resistência (6 → 2)
```

**DevTools Integration**: Em DEV mode, permite filtrar logs, exportar como JSON, limpar.

**References**:
- [Structured Logging Best Practices](https://www.honeycomb.io/blog/structured-logging-and-your-team)

---

## Decision 6: Event System Architecture

### Context
Constitution Principle III (Event-Driven & Determinístico) requer máximo 8 tipos de eventos, estado imutável, processamento determinístico.

### Decision
**8 core events** processados por event processor determinístico com estado imutável, com driver único (engine) para comandos/eventos e scheduler centralizado para timers.

### Rationale
1. **Determinismo**: Essencial para testes, replays, futuro multiplayer
2. **Auditabilidade**: Event log permite rastrear qualquer mudança de estado
3. **Testabilidade**: Mesma sequência de eventos → mesmo estado final (verificável)
4. **Limite de Complexidade**: 8 eventos força design focado (evita explosão)

### Core Events (8 tipos)
1. `PLAYER_JOINED` - Jogador entra no lobby
2. `TURN_STARTED` - Turno de jogador inicia
3. `ITEM_USED` - Item do inventário usado
4. `PILL_CONSUMED` - Pílula consumida (core action)
5. `EFFECT_APPLIED` - Efeito de pill/item aplicado
6. `COLLAPSE_TRIGGERED` - Colapso ocorre (Resistência ≤ 0)
7. `ROUND_COMPLETED` - Rodada termina (pool esgotado)
8. `MATCH_ENDED` - Partida termina (1 sobrevivente)

### Implementation Details
**Event Processor** (reducer pattern):
```typescript
type GameEvent = 
  | { type: 'PILL_CONSUMED'; playerId: string; pillId: string; timestamp: number }
  | { type: 'EFFECT_APPLIED'; playerId: string; effect: Effect; timestamp: number }
  | { type: 'COLLAPSE_TRIGGERED'; playerId: string; newLives: number; timestamp: number }
  // ... outros eventos

function processEvent(state: GameState, event: GameEvent): GameState {
  // Reducer puro: state atual + evento → novo state
  // DETERMINÍSTICO: mesmos inputs → mesmo output
  switch (event.type) {
    case 'PILL_CONSUMED':
      return handlePillConsumed(state, event);
    // ...
  }
}
```

**Estado Imutável**: Usar Immer com Zustand para garantir imutabilidade sem boilerplate.

### Runtime Driver (Engine)

O runtime do jogo é dirigido por um único fluxo:
- Comandos (intents) entram por um dispatcher único
- O dispatcher enfileira e aplica eventos no reducer
- Após cada evento, o engine executa auto-avanços determinísticos (fim de turno, fim de rodada, fim de partida)
- Timers (turn timeout, bot timeout, delays) são geridos por um scheduler central que emite eventos para o dispatcher

**Testes de Determinismo**:
```typescript
test('same events produce same state', () => {
  const events = [
    { type: 'PILL_CONSUMED', playerId: 'p1', pillId: 'pill1', timestamp: 1000 },
    { type: 'EFFECT_APPLIED', playerId: 'p1', effect: { type: 'DMG_LOW', value: -2 }, timestamp: 1001 },
  ];
  
  const state1 = events.reduce(processEvent, initialState);
  const state2 = events.reduce(processEvent, initialState);
  
  expect(state1).toEqual(state2); // DEVE ser idêntico
});
```

**References**:
- [Event Sourcing Basics](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Immer for Immutability](https://immerjs.github.io/immer/)

---

## Decision 7: Bot AI Strategy (Levels)

### Context
Spec define 4 níveis de dificuldade (Easy/Normal/Hard/Insane) com comportamentos distintos. Risco de over-engineering vs necessidade de desafio progressivo.

### Decision
**Implementar Easy primeiro, validar, escalar progressivamente**.

### Rationale
1. **Solo Dev**: Implementar 4 níveis simultaneamente é alto risco
2. **Validation First**: Easy bot valida mecânicas core antes de otimizar IA
3. **Incremental Complexity**: Hard/Insane podem ser refinados após MVP
4. **Determinismo**: Bot decisions devem ser determínisticas (dado mesmo state seed)

### Implementation Details
**Bot Easy (Paciente)** - MVP Priority:
- Evita riscos: prefere pills reveladas seguras
- Usa itens defensivos (Pocket Pill, Shield)
- Decision tree simples: `if (health < 50%) use(Shield) else consumeSafestPill()`

**Bot Normal/Hard/Insane** - Post-MVP:
- Normal: Balancea risco/recompensa
- Hard: Usa itens estrategicamente (combos)
- Insane: Memoriza pool revelado, otimiza Shape Quests

**Determinismo**:
```typescript
function botDecision(state: GameState, botLevel: BotLevel, seed: number): Action {
  const rng = seededRandom(seed); // Determinístico
  
  if (botLevel === 'EASY') {
    return makeConservativeDecision(state, rng);
  }
  // ...
}
```

**Testing**: Bot vs Bot com seed fixo deve produzir mesma partida sempre.

---

## Decision 8: UI Strategy - Minimal Functional

### Context
User input: "Implementar o mínimo necessário de UI para testar as funcionalidades". Foco em mecânicas primeiro, polish visual futuro.

### Decision
**UI mínima funcional sem polish visual** - componentes básicos HTML/CSS, zero design.

### Rationale
1. **Velocity**: Menos tempo em CSS = mais tempo validando mecânicas
2. **Testability**: UI funcional permite testar todas as interações
3. **Solo Dev**: Polish visual pode ser feito depois (não bloqueia validação)
4. **Refactor Safe**: UI mínima é mais fácil de refatorar com design system futuro

### Implementation Details
**UI Kit Básico** (`src/components/ui/`):
- Botões: `<button>` HTML com classes Tailwind mínimas
- Cards: `<div>` com border/padding
- Inputs: HTML nativo (`<input>`, `<select>`)
- **Zero**: ilustrações, animações complexas, gradientes, shadows elaborados

**Game Components** (`src/components/game/`):
- `PillPool`: Grid de pills com `<button>` clicável mostrando shape (emoji ou texto)
- `PlayerHUD`: Linha de texto `Vidas: 3 | Resistência: 6/6 | Coins: 50`
- `Inventory`: 5 `<div>` quadrados numerados (1-5) mostrando nome do item

**Exemplo Visual**:
```
┌─────────────────────────────────────┐
│ MATCH - Rodada 3, Turno 2           │
├─────────────────────────────────────┤
│ Jogador 1: Vidas 3 | Resist 5/6     │
│ Coins: 45  Quest: 🔵→🔺 (1/2)       │
│                                     │
│ Pool:                               │
│ [🔵] [🔺] [⚪] [🔵] [🔺] [⬜]       │
│                                     │
│ Inventário:                         │
│ [Scanner] [Shield] [ ] [ ] [ ]      │
│                                     │
│ Oponentes:                          │
│ Bot 1: Vidas 2 | Resist 3/6         │
│ Bot 2: Vidas 3 | Resist 6/6 🛡️     │
└─────────────────────────────────────┘
```

**Polish Futuro** (Post-MVP):
- Design system (Figma)
- Ilustrações 8-bit Rick & Morty
- Animações de feedback (juice)
- Sound effects

---

## Decision 9: Testing Strategy

### Context
Constitution Principle VI (Testing Estratégico): Unit tests para lógica pura, property-based para invariantes fortes.

### Decision
**Testes focados em áreas críticas** com Vitest + React Testing Library.

### Rationale
1. **Solo Dev**: Cobertura 100% é inviável, focar em high-risk areas
2. **Determinismo**: Testes validam que core logic é determinístico
3. **Invariantes**: Property-based testa bounds (ex: Vidas sempre ≥ 0)
4. **Regression**: Testes de edge cases previnem regressões

### Testing Priorities (High to Low)

**Priority 1 - Core Logic** (Unit Tests):
- Pool generation (distribuição, tamanho, shapes unlock)
- Effect resolution (todos os tipos de pill + modificadores)
- Collapse mechanics (Vidas → Resistência → Última Chance)
- Inventory management (5 slots, stackables, validações)
- Quest generation (viabilidade com pool)
- Event processor (determinismo)

**Priority 2 - Invariantes** (Property-Based):
- Pool distribution dentro de bounds configurados
- Vidas sempre ≥ 0 (mesmo após múltiplos Colapsos)
- Resistência dentro de range válido (-∞ a cap)
- Inventário nunca excede 5 slots

**Priority 3 - Integration**:
- Fluxo completo (Home → Match → Results)
- Bot vs Bot deterministico
- Edge cases (timer expiration, eliminações)

**Priority 4 - UI** (Baixa para MVP):
- Testar apenas interações críticas (clicar pill, usar item)
- Snapshot tests evitar (quebram facilmente)

### Implementation Example
```typescript
// Unit Test
test('DMG_LOW pill reduces resistance by 2', () => {
  const player = { lives: 3, resistance: 6 };
  const pill = { type: 'DMG_LOW', modifiers: [] };
  
  const result = applyPillEffect(player, pill);
  
  expect(result.resistance).toBe(4);
});

// Property-Based Test (fast-check)
test('pool distribution always within configured bounds', () => {
  fc.assert(
    fc.property(fc.integer({ min: 1, max: 20 }), (roundNumber) => {
      const pool = generatePool(roundNumber, testConfig);
      
      const safeCount = pool.filter(p => p.type === 'SAFE').length;
      const totalCount = pool.length;
      const safePercentage = safeCount / totalCount;
      
      const expectedRange = getExpectedRange('SAFE', roundNumber, testConfig);
      return safePercentage >= expectedRange.min && safePercentage <= expectedRange.max;
    })
  );
});
```

**References**:
- [Vitest](https://vitest.dev/)
- [Fast-Check (Property-Based)](https://github.com/dubzzz/fast-check)

---

## Open Questions / Future Research

### Post-MVP (Not Blocking)
1. **Multiplayer Architecture**: Migrar lógica para Edge Functions (Supabase Realtime)
2. **Advanced Bot AI**: Machine learning para bot Insane (se necessário)
3. **Replay System**: Armazenar event log completo para replays auditáveis
4. **Performance Profiling**: Otimizações específicas se 30 FPS não for atingido
5. **Design System**: Figma + componentes polished quando validar mecânicas

---

## References & Further Reading

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vitest Testing Framework](https://vitest.dev/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Event Sourcing Patterns](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Property-Based Testing](https://hypothesis.works/articles/what-is-property-based-testing/)

---

**Document Status**: Complete  
**Last Updated**: 2025-12-25  
**Next**: Generate `data-model.md` and `quickstart.md`

