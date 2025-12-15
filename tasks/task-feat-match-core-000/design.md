# Design — Core do Match (Gameplay)

## Contexto

### Por que implementar agora
- É o coração do jogo (core gameplay loop)
- Navegação já estará funcional (depende de TASK-FEAT-NAVEGACAO-000)
- MatchScreen já existe estruturalmente (GameTable, HUD, OpponentsBar)
- Especificações de Pills já estão documentadas (`docs/02-gameplay/pills.md`)
- Especificações de IA já estão documentadas (`docs/02-gameplay/ai.md`)

### Estado atual
- `MatchScreen` renderiza UI mas sem lógica
- `GameTable`, `PlayerDashboard`, `OpponentsBar` são componentes visuais placeholder
- `gameStore` existe mas precisa ser expandido
- Nenhuma lógica de pool, turnos, efeitos ou IA

## Alternativas Consideradas

### Opção 1: Lógica no `gameStore` (Zustand) (ESCOLHIDA)
```ts
// src/stores/gameStore.ts
interface GameStore {
  // Estado do match
  round: number;
  turn: number;
  currentPlayer: 'player' | 'opponent';
  
  // Pool
  pool: Pill[];
  counters: Record<PillType, number>;
  
  // Jogadores
  player: PlayerState;
  opponents: OpponentState[];
  
  // Ações
  initMatch: (difficulty: AIDifficulty) => void;
  choosePill: (pillId: string) => void;
  processTurn: () => void;
  checkGameOver: () => void;
}
```

**Prós:**
- Consistente com arquitetura existente (Zustand)
- Estado reativo (UI atualiza automaticamente)
- Simples para Solo Dev (sem camada extra)

**Contras:**
- Lógica de negócio misturada com estado
- Dificultar migração para multiplayer server-authoritative

**Decisão:** Usar por ora, mas preparar para refatoração futura (extrair lógica pura para `src/core/`).

### Opção 2: Lógica em `src/core/game-engine/`
**Prós:** Separação clara, fácil migração para multiplayer, testável
**Contras:** Over-engineering para MVP solo

**Decisão:** Adiar para quando multiplayer for prioridade. Por ora, manter lógica no store mas organizá-la em funções puras quando possível.

## Contratos

### Tipos de Pílulas (já definidos em docs)
```ts
// src/types/game.ts
type PillType = 'SAFE' | 'DMG_LOW' | 'DMG_HIGH' | 'HEAL' | 'FATAL' | 'LIFE';

interface Pill {
  id: string;
  type: PillType;
  round: number; // rodada em que foi gerada
}
```

### Estado do Jogador
```ts
interface PlayerState {
  id: string;
  name: string;
  avatar: string;
  health: number;
  maxHealth: number;
  isAlive: boolean;
  inventory: Item[]; // futuro: itens do Draft
}
```

### Estado do Oponente
```ts
interface OpponentState extends PlayerState {
  difficulty: AIDifficulty;
}
```

### IA
```ts
type AIDifficulty = 'easy' | 'normal' | 'hard' | 'insane';

interface AIConfig {
  riskTolerance: number;      // 0.3 / 0.5 / 0.7 / 0.9
  itemUsageProbability: number; // 0.4 / 0.6 / 0.8 / 0.9 (futuro)
  scannerPriority: number;     // 0.8 / 0.6 / 0.4 / 0.2 (futuro)
  aggressiveness: number;      // 0.2 / 0.4 / 0.7 / 0.9
}
```

### Funções de Pool (a serem criadas)
```ts
// src/core/game-engine/pillPool.ts (ou no store por ora)
function generatePool(round: number): Pill[];
function getPillDistribution(round: number): Record<PillType, number>;
function calculatePoolSize(round: number): number;
```

### Funções de IA (a serem criadas)
```ts
// src/core/game-engine/ai.ts (ou no store por ora)
function chooseAIPill(
  pool: Pill[],
  counters: Record<PillType, number>,
  aiState: OpponentState,
  config: AIConfig
): string; // retorna pillId
```

## Plano Incremental

### Fase 1: Expandir tipos e estado
1. Atualizar `src/types/game.ts` com tipos completos (Pill, PlayerState, OpponentState, PillType)
2. Expandir `gameStore` com estado do match (round, turn, pool, counters, player, opponents)
3. Criar ações básicas: `initMatch`, `resetMatch`

### Fase 2: Sistema de Pool
1. Criar função `calculatePoolSize(round)` seguindo especificação
2. Criar função `getPillDistribution(round)` seguindo progressão
3. Criar função `generatePool(round)` que retorna array de Pill
4. Adicionar ao `gameStore`: `pool: Pill[]`, `counters: Record<PillType, number>`
5. Testar: gerar pool da rodada 1, verificar distribuição

### Fase 3: UI do Pool (Contadores)
1. Atualizar `GameTable` para exibir contadores visíveis
2. Conectar com `gameStore.counters`
3. Testar: contadores devem refletir pool corretamente

### Fase 4: Sistema de Turnos (básico)
1. Adicionar ao `gameStore`: `currentPlayer`, `turn`
2. Criar ação `processTurn()` que alterna entre player e opponent
3. Testar: turnos devem alternar corretamente

### Fase 5: Escolha de Pílulas (Player)
1. Adicionar ao `gameStore`: `choosePill(pillId)`
2. Quando player escolher pílula:
   - Revelar tipo
   - Aplicar efeito (dano, cura, fatal, life)
   - Remover do pool
   - Atualizar contadores
   - Passar turno
3. Atualizar `GameTable` para permitir clique em pílulas
4. Testar: escolher pílula, ver efeito aplicado, contador atualizado

### Fase 6: Aplicação de Efeitos
1. Criar função `applyPillEffect(pill: Pill, target: PlayerState)`
2. Implementar lógica para cada tipo:
   - SAFE: nada
   - DMG_LOW: -1 health
   - DMG_HIGH: -2 health
   - HEAL: +1 health (max: maxHealth)
   - FATAL: health = 0, isAlive = false
   - LIFE: +1 maxHealth (cap: initial + 2), +1 health
3. Testar: cada tipo de pílula aplica efeito correto

### Fase 7: IA Básica
1. Criar função `chooseAIPill(pool, counters, aiState, config)`
2. Implementar heurística simples:
   - Se health baixa: preferir HEAL/SAFE
   - Se health alta: aceitar risco (DMG_LOW/DMG_HIGH)
   - Evitar FATAL baseado em riskTolerance
3. Integrar com `processTurn()`: quando for turno do oponente, chamar IA
4. Testar: IA deve escolher pílulas e aplicar efeitos nela mesma

### Fase 8: Detecção de Vitória/Derrota
1. Criar função `checkGameOver()`:
   - Se player.isAlive === false: transicionar para RESULTS (derrota)
   - Se todos opponents.isAlive === false: transicionar para RESULTS (vitória)
2. Chamar `checkGameOver()` após cada efeito de pílula
3. Testar: match deve terminar quando player ou todos oponentes morrerem

### Fase 9: Feedback Visual
1. Atualizar `PlayerDashboard` para refletir health atual
2. Atualizar `OpponentsBar` para refletir health e status "morto"
3. Adicionar animação simples de reveal de pílula (opcional)
4. Testar: UI reflete estado corretamente

### Fase 10: Progressão de Rodadas
1. Quando pool esvaziar, incrementar `round` e gerar novo pool
2. Testar: rodadas devem progredir automaticamente

### Fase 11: Polimento
1. Adicionar delay entre turnos da IA (para jogabilidade)
2. Adicionar logs no GameLogPanel
3. Rodar `pnpm lint && pnpm build`
4. Teste manual: jogar partida completa

## Riscos e Mitigação

### Risco 1: Pool distribution incorreta
**Mitigação:** Seguir rigorosamente especificação em `pills.md`. Criar testes unitários (futuro) para validar distribuição.

### Risco 2: IA muito fácil/difícil
**Mitigação:** Começar com heurística simples. Iterar baseado em testes manuais. Ajustar parâmetros (riskTolerance, etc.) até atingir win rate alvo.

### Risco 3: Estado sincronizado incorretamente
**Mitigação:** Usar Zustand corretamente (imutabilidade). Evitar mutações diretas. Sempre criar novo estado.

### Risco 4: Performance (muitos re-renders)
**Mitigação:** Usar seletores granulares. Não desestruturar store em componentes que renderizam frequentemente.

### Risco 5: Migração para multiplayer difícil
**Mitigação:** Organizar lógica de negócio em funções puras quando possível. Documentar decisões para facilitar refatoração futura.

## Decisões Arquiteturais

1. **Lógica no gameStore**: Por ora, manter lógica no store Zustand. Preparar para extração futura.
2. **Determinismo**: IA deve ser determinística (mesma seed -> mesma escolha).
3. **Sem Animações Complexas**: Feedback visual básico (atualização de health, contadores). Animações sofisticadas podem ser adicionadas depois.
4. **Pool Generation**: Client-side por ora. Em multiplayer, será server-side.
5. **Turn System**: Simples (alternar player/opponent). Em multiplayer, será mais complexo (múltiplos jogadores, timeouts).

## Dependências
- TASK-FEAT-NAVEGACAO-000 (para testar transição Match -> Results)
- Nenhuma dependência nova de bibliotecas
