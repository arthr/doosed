# Design — Results Funcional

## Contexto

### Por que implementar agora
- ResultScreen já existe visualmente (`src/screens/ResultScreen.tsx`)
- É a última etapa do core loop (Home -> Lobby -> Draft -> Match -> Results)
- Depende de Match Core estar funcional (TASK-FEAT-MATCH-CORE-000)
- Fecha o ciclo do MVP

### Estado atual
- `ResultScreen` renderiza UI mas sem lógica funcional
- Não há store para estado de progressão (XP, level, Schmeckles)
- Não há cálculo de XP ou estatísticas

## Alternativas Consideradas

### Opção 1: Criar `progressionStore` (Zustand) (ESCOLHIDA)
```ts
// src/stores/progressionStore.ts
interface ProgressionStore {
  // Perfil do player
  level: number;
  xp: number;
  xpToNextLevel: number;
  schmeckles: number;
  
  // Ações
  addXP: (amount: number) => void;
  addSchmeckles: (amount: number) => void;
  reset: () => void; // para debug
}
```

**Prós:**
- Separação de responsabilidades (progressão meta separada de gameplay)
- Fácil persistir no futuro (Supabase)
- Estado reativo

**Contras:**
- Mais um store

**Decisão:** Criar `progressionStore`. Progressão é um domínio meta, independente do gameplay.

### Opção 2: Integrar no `gameStore`
**Prós:** Um único store
**Contras:** Mistura gameplay (temporário) com progressão (persistente)

**Decisão:** Não. Manter separado.

## Contratos

### MatchStats (a ser adicionado ao `gameStore`)
```ts
// src/types/game.ts
interface MatchStats {
  roundsPlayed: number;
  pillsChosen: number;
  resistanceDamageTaken: number;
  resistanceHealingReceived: number;
  collapsesSuffered: number;
  livesLost: number;
  opponentsKilled: number;
  won: boolean;
}
```

### ProgressionStore (a ser criado)
```ts
interface ProgressionStore {
  level: number;
  xp: number;
  xpToNextLevel: number;
  schmeckles: number;
  
  addXP: (amount: number) => void; // retorna true se level up
  addSchmeckles: (amount: number) => void;
  reset: () => void;
}
```

### XP Calculation (a ser criado)
```ts
// src/lib/xpCalculation.ts
function calculateXP(stats: MatchStats): number {
  let xp = 0;
  xp += stats.won ? 50 : 10; // base
  xp += stats.roundsPlayed * 5; // bônus rodada
  xp += stats.opponentsKilled * 20; // bônus eliminação
  return xp;
}
```

### XP to Level (a ser criado)
```ts
// src/lib/xpCalculation.ts
function getXPForLevel(level: number): number {
  // Progressão quadrática: 100 * level^1.5
  return Math.floor(100 * Math.pow(level, 1.5));
}
```

## Plano Incremental

### Fase 1: Criar progressionStore
1. Criar `src/stores/progressionStore.ts`
2. Definir estado inicial (level: 1, xp: 0, xpToNextLevel: 100, schmeckles: 0)
3. Criar ações: `addXP`, `addSchmeckles`, `reset`

### Fase 2: Estatísticas do Match
1. Adicionar `MatchStats` ao `gameStore`
2. Incrementar stats durante o match (ex.: `pillsChosen++` ao escolher pílula)
3. Setar `won` ao terminar match
4. Testar: stats corretas ao terminar match

### Fase 3: Cálculo de XP
1. Criar `src/lib/xpCalculation.ts`
2. Implementar `calculateXP(stats)` e `getXPForLevel(level)`
3. Testar: XP calculado corretamente para diferentes cenários

### Fase 4: Conectar ResultScreen
1. Atualizar `ResultScreen` para ler `matchStats` do `gameStore`
2. Exibir stats (rodadas, pílulas, dano em Resistência, cura de Resistência, colapsos, vidas perdidas, eliminações)
3. Exibir resultado (vitória/derrota)
4. Testar: stats exibidas corretamente

### Fase 5: Progressão de XP
1. Ao entrar no ResultScreen, calcular XP ganho
2. Chamar `progressionStore.addXP(xpGanho)`
3. Animar barra de XP (animação simples: incremento gradual)
4. Detectar level up e exibir feedback
5. Testar: XP incrementa, level up funciona

### Fase 6: Recompensas (Schmeckles)
1. Calcular Schmeckles ganhos (baseado em vitória/stats)
2. Chamar `progressionStore.addSchmeckles(schmecklesGanhos)`
3. Exibir recompensa no ResultScreen
4. Testar: Schmeckles incrementam corretamente

### Fase 7: Ações Pós-Partida
1. Conectar botão "Play Again":
   - Chamar `flowStore.resetRun()` (volta para LOBBY)
   - Resetar `gameStore`
2. Conectar botão "Main Menu":
   - Chamar `flowStore.setPhaseGuarded('HOME')`
   - Resetar `gameStore`
3. Testar: ambos botões funcionam

### Fase 8: Polimento
1. Adicionar animação de entrada do ResultScreen
2. Melhorar animação da barra de XP
3. Adicionar som/feedback ao level up (futuro)
4. Rodar `pnpm lint && pnpm build`
5. Teste manual completo

## Riscos e Mitigação

### Risco 1: Stats não rastreadas corretamente
**Mitigação:** Incrementar stats nos pontos certos do match. Testar cada stat individualmente.

### Risco 2: XP overflow (nível máximo)
**Mitigação:** Definir cap de nível (ex.: 100). Parar progressão ao atingir.

### Risco 3: Animação de XP lenta/bugada
**Mitigação:** Usar animação simples (setTimeout/setInterval). Garantir cleanup correto.

### Risco 4: Estado não resetado entre partidas
**Mitigação:** Garantir que `gameStore.reset()` é chamado ao sair do ResultScreen.

## Decisões Arquiteturais

1. **progressionStore separado**: Progressão meta é independente de gameplay
2. **XP Calculation**: Lógica pura em `lib/` para facilitar testes
3. **Stats incrementais**: Rastrear durante o match, não calcular no final
4. **Mock de persistência**: Por ora, estado vive apenas na sessão. Supabase no futuro.
5. **Animação simples**: Priorizar funcionalidade sobre estética por ora

## Dependências
- TASK-FEAT-MATCH-CORE-000 (stats do match precisam existir)
- TASK-FEAT-NAVEGACAO-000 (para transições funcionais)
- Nenhuma dependência nova de bibliotecas
