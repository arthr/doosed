# Relatório de Diagnóstico de Bugs - 2025-12-25

**Feature**: DOSED MVP - Pill Roulette Game  
**Escopo**: Bugs críticos identificados em testes manuais  
**Status**: ANÁLISE COMPLETA - Aguardando aprovação para correção

---

## Resumo Executivo

**Bugs Críticos Identificados**: 3  
**Severidade**: ALTA - Bloqueiam gameplay core  
**Causa Raiz**: Erros de lógica na aplicação de efeitos e falta de detecção de fim de rodada  
**Impacto**: MVP inoperante - mecânicas core não funcionam

---

## Bug #1: Efeitos de Pills Não São Aplicados (CRÍTICO)

### Descrição
Pills são consumidas corretamente, efeitos são calculados pelo `resolvePillEffect()`, mas **não são aplicados** ao jogador. Resistência/vidas não mudam após consumo.

### Evidência nos Logs
```text
ℹ️ [pill] Jogador consumiu pill coin (DMG_LOW) 
{effect: {type: "DAMAGE", value: -2, originalValue: -2}}
```
- Efeito calculado: `value: -2` (dano de 2 pontos)
- **Resistência do jogador permanece inalterada** (não diminui)

### Análise Técnica

**Arquivo**: `src/hooks/useGameLoop.ts` (L87-96)

```typescript
// Aplica efeito baseado no type
if (effect.type === 'HEAL' && effect.value > 0) {
  applyHeal(playerId, effect.value);
} else if (effect.type === 'DAMAGE' && effect.value > 0) { // ❌ BUG AQUI
  applyDamage(playerId, effect.value);
} else if (effect.type === 'LIFE' && effect.value > 0) {
  updatePlayer(playerId, (p) => {
    p.lives = Math.min(3, p.lives + effect.value);
  });
}
```

**Problema**: Condição `effect.value > 0` para dano está **INCORRETA**.

**Análise da Convenção de Sinais**:

Verificando `src/types/pill.ts`:
```typescript
export const PILL_BASE_VALUES: Record<PillType, number> = {
  [PillType.SAFE]: 0,
  [PillType.DMG_LOW]: -2,   // ← Valor NEGATIVO
  [PillType.DMG_HIGH]: -4,  // ← Valor NEGATIVO
  [PillType.HEAL]: 2,       // ← Valor POSITIVO
  [PillType.FATAL]: -999,   // ← Valor NEGATIVO
  [PillType.LIFE]: 1,       // ← Valor POSITIVO
};
```

**Convenção estabelecida**:
- **Dano**: valores NEGATIVOS (-2, -4, -999)
- **Cura**: valores POSITIVOS (+2, +3, etc)
- **Vida**: valores POSITIVOS (+1)

**Fluxo de Resolução**:
1. `resolvePillEffect()` retorna `{type: 'DAMAGE', value: -2}`
2. `useGameLoop` checa: `effect.type === 'DAMAGE' && effect.value > 0`
3. Condição **FALHA** porque `-2 > 0` é `false`
4. `applyDamage()` **NUNCA é chamado**
5. Resistência não muda

### Verificação contra Specs

**FR-093** (spec.md L285-291):
> Sistema DEVE aplicar efeitos da pílula (com modificadores se houver) imediatamente após revelação:
> - DMG_LOW: -2 Resistência
> - DMG_HIGH: -4 Resistência

**Expectativa**: Consumir DMG_LOW deve reduzir resistência em 2 pontos.  
**Realidade**: Resistência não muda.

### Causa Raiz
Condição incorreta para aplicação de dano. A lógica assume que `value > 0` para todos os tipos, mas dano usa valores negativos.

---

## Bug #2: Pool Não Avança para Nova Rodada Quando Esgota (CRÍTICO)

### Descrição
Quando todas as pills do pool são consumidas, o jogo **não avança** para Round 2. O pool fica vazio e os jogadores ficam travados (timer expira mas não há pills para consumir).

### Evidência nos Logs
```text
ℹ️ [pill] Jogador consumiu pill oval (SAFE) {...}
ℹ️ [turn] Turno de Jogador {roundNumber: 1}
```
- Última pill do Round 1 consumida
- Novo turno inicia **mas ainda no Round 1**
- Pool vazio (0 pills)
- **Round 2 NUNCA é iniciado**

### Análise Técnica

**Especificação**: FR-045 (spec.md L222)
> Sistema DEVE avançar para nova Rodada automaticamente quando pool atual esgota E ainda há 2+ jogadores vivos

**Busca no código por detecção de pool vazio**:

```bash
grep -r "pool.pills.length === 0" src/
```

**Resultado**: Encontrado em 2 lugares:

1. **`useGameLoop.ts` L212**: `if (!activePlayer || pool.pills.length === 0) return;`
   - Contexto: `handleTurnTimeout` - apenas ABORTA timeout se pool vazio
   - **NÃO chama `nextRound()`**

2. **`PillPool.tsx` L28**: Renderiza mensagem "Nenhuma pill disponível"
   - Contexto: UI apenas
   - **NÃO chama `nextRound()`**

**Conclusão**: **NÃO EXISTE lógica que checa pool vazio e chama `nextRound()`**.

### Locais Onde a Lógica Deveria Estar

**Opção 1**: Dentro de `handlePillConsume` (após remover pill do pool)

```typescript
// Após remover pill
updateMatch((m) => {
  if (!m.currentRound) return;
  const pillIndex = m.currentRound.pool.pills.findIndex((p) => p.id === pillId);
  if (pillIndex !== -1) {
    m.currentRound.pool.pills.splice(pillIndex, 1);
    m.currentRound.pool.size = m.currentRound.pool.pills.length;
  }
  
  // ❌ FALTA: Checar se pool esgotou
});
```

**Opção 2**: No `useEffect` do `MatchScreen` (detectar mudança de pool.size)

```typescript
React.useEffect(() => {
  // ❌ FALTA: Lógica de detecção de pool vazio
}, [pool?.size]);
```

### Verificação contra Specs

**FR-044** (spec.md L221):
> Cada Rodada DEVE corresponder a uma Poll completa de pílulas (baralho sem reposição)

**FR-045** (spec.md L222):
> Sistema DEVE avançar para nova Rodada automaticamente quando pool atual esgota E ainda há 2+ jogadores vivos

**FR-046** (spec.md L223):
> Sistema DEVE gerar nova Poll (com tamanho e distribuição progressiva) ao iniciar cada nova Rodada

**Expectativa**: Pool esgota → Round 2 com novo pool gerado  
**Realidade**: Pool esgota → Jogo trava com pool vazio

### Causa Raiz
Falta implementação completa da lógica de transição de rodada. A função `nextRound()` existe no `matchStore`, mas **nunca é chamada** quando o pool esgota.

---

## Bug #3: Bot Para de Jogar Após Primeira Ação (CRÍTICO)

### Descrição
Bot executa uma ação no turno inicial, mas depois **não volta a jogar**. Apenas o jogador humano continua jogando (via timeout).

### Evidência nos Logs
```text
Turno 1: Jogador (humano) - OK ✅
Turno 2: Bot 1 - OK ✅
Turno 3: Jogador (humano, timeout) ✅
Turno 4: Jogador (humano, timeout) ✅  ← Bot não joga
Turno 5: Jogador (humano, timeout) ✅  ← Bot não joga
```

**Padrão**: Após Bot 1 jogar uma vez, apenas o Jogador continua jogando.

### Análise Técnica

**Fluxo esperado após consumo de pill**:

1. `handlePillConsume()` é chamado (L65-119)
2. Pill é removida do pool
3. Efeito é calculado
4. **Após 500ms** (L107):
   - `checkMatchEnd()` - verifica fim de jogo
   - `clearActiveTurns()` - limpa flags `isActiveTurn`
   - `nextTurn()` - incrementa `activeTurnIndex`
5. **`MatchScreen` useEffect** detecta `!activePlayer` (L44-50)
6. Chama `startNextTurn()` que:
   - Define novo `activePlayer` via `setActiveTurn()`
   - Se for bot, chama `executeBotTurn()` após 2s

**Problema identificado**: **Race condition no fluxo assíncrono**.

**Arquivo**: `src/hooks/useGameLoop.ts` (L106-116)

```typescript
// Checa eliminação e fim de jogo, depois avança turno
setTimeout(() => {
  checkMatchEnd();
  
  // Limpa turno ativo atual ANTES de incrementar
  clearActiveTurns();  // ← Todos players.isActiveTurn = false
  
  // Incrementa índice
  nextTurn();  // ← activeTurnIndex++
  // Note: useEffect detectará !activePlayer e chamará startNextTurn()
}, 500);
```

**Análise do useEffect no MatchScreen**:

```typescript
React.useEffect(() => {
  if (match?.phase !== MatchPhase.MATCH || !currentRound) return;

  // Se não há activePlayer, inicia o próximo turno
  if (!activePlayer) {  // ← Depende de players array do playerStore
    const timer = setTimeout(() => {
      startNextTurn();
    }, 100);
    return () => clearTimeout(timer);
  }
}, [match?.phase, currentRound, activePlayer, startNextTurn]);
```

**Problema**: Dependencies array `[match?.phase, currentRound, activePlayer, startNextTurn]`

- `activePlayer` é derivado de `players.find((p) => p.isActiveTurn)` (L33)
- `players` vem do `playerStore` via Zustand
- **Zustand não está nas dependencies**, então mudanças em `players` podem não triggar o useEffect

**Verificação do fluxo**:
1. `clearActiveTurns()` altera `playerStore.players` (todos `isActiveTurn = false`)
2. `nextTurn()` altera `matchStore.match.activeTurnIndex`
3. `activePlayer` deveria recalcular
4. **MAS**: Se React não detectar mudança em `activePlayer`, useEffect não roda
5. `startNextTurn()` nunca é chamado
6. Próximo turno não inicia

**Outro problema**: `startNextTurn()` está nas dependencies do useEffect (L51), criando **novo callback a cada render**, o que pode causar loops ou timing issues.

### Verificação contra Specs

**FR-049** (spec.md L226):
> Dentro de cada Rodada, jogadores DEVEM alternar Turnos na ordem fixa determinada aleatoriamente

**FR-065** (spec.md L245):
> Quando turno de jogador eliminado chega na ordem, sistema DEVE automaticamente pular para próximo jogador vivo

**Expectativa**: Jogador → Bot → Jogador → Bot (alternância contínua)  
**Realidade**: Jogador → Bot → Jogador → Jogador (bot para de jogar)

### Causa Raiz
Race condition + dependency tracking issue no ciclo de turnos. O fluxo assíncrono (`setTimeout` + `useEffect`) não está sincronizado corretamente, causando perda de turnos.

---

## Análise de Impacto

| Bug | Impacto | Bloqueia MVP? | Severidade |
|-----|---------|---------------|------------|
| #1: Efeitos não aplicados | Mecânica core quebrada - sem dano/cura | ✅ SIM | CRÍTICO |
| #2: Pool não avança | Jogo trava após Round 1 | ✅ SIM | CRÍTICO |
| #3: Bot para de jogar | Gameplay mono-player, sem adversário | ✅ SIM | CRÍTICO |

**Conclusão**: Todos os 3 bugs bloqueiam completamente o MVP. Nenhum fluxo de jogo funciona de ponta a ponta.

---

## Soluções Propostas

### Solução Bug #1: Corrigir Aplicação de Efeitos

**Arquivo**: `src/hooks/useGameLoop.ts` (L87-96)

**Mudança Proposta**:

```typescript
// ANTES (incorreto):
if (effect.type === 'HEAL' && effect.value > 0) {
  applyHeal(playerId, effect.value);
} else if (effect.type === 'DAMAGE' && effect.value > 0) {  // ❌ BUG
  applyDamage(playerId, effect.value);
}

// DEPOIS (correto):
if (effect.type === 'HEAL' && effect.value > 0) {
  applyHeal(playerId, effect.value);
} else if (effect.type === 'DAMAGE' && effect.value < 0) {  // ✅ CORRETO
  applyDamage(playerId, Math.abs(effect.value));  // ✅ Passa valor POSITIVO
}
```

**Justificativa**:
- Convenção: dano usa valores negativos no `effect.value`
- `applyDamage()` espera receber o valor POSITIVO do dano (2, não -2)
- Verificar `effect.value < 0` detecta corretamente dano
- `Math.abs()` converte para positivo antes de passar

**Alternativa (mais robusta)**:

```typescript
// Usar apenas o tipo, sem checar sinal (mais seguro)
if (effect.type === 'HEAL') {
  applyHeal(playerId, Math.abs(effect.value));
} else if (effect.type === 'DAMAGE') {
  applyDamage(playerId, Math.abs(effect.value));
} else if (effect.type === 'LIFE') {
  updatePlayer(playerId, (p) => {
    p.lives = Math.min(3, p.lives + Math.abs(effect.value));
  });
}
```

**Recomendação**: Usar alternativa (mais robusta) - elimina dependência de sinal.

---

### Solução Bug #2: Implementar Detecção de Pool Vazio

**Arquivo**: `src/hooks/useGameLoop.ts`

**Opção A: Detectar dentro de `handlePillConsume`** (RECOMENDADA)

```typescript
const handlePillConsume = useCallback(
  (pillId: string, playerId: string) => {
    // ... código existente ...

    // Consume pill - atualiza no matchStore
    updateMatch((m) => {
      if (!m.currentRound) return;
      const pillIndex = m.currentRound.pool.pills.findIndex((p) => p.id === pillId);
      if (pillIndex !== -1) {
        m.currentRound.pool.pills.splice(pillIndex, 1);
        m.currentRound.pool.size = m.currentRound.pool.pills.length;
      }
    });

    // ... aplicar efeitos ...

    // Checa eliminação e fim de jogo, depois avança turno
    setTimeout(() => {
      checkMatchEnd();
      
      // ✅ NOVO: Checar se pool esgotou
      const currentPool = match?.currentRound?.pool;
      const alivePlayers = players.filter((p) => !p.isEliminated);
      
      if (currentPool && currentPool.pills.length === 0 && alivePlayers.length >= 2) {
        // Pool esgotou E ainda há 2+ jogadores vivos → próxima rodada
        nextRound();
        // Nota: nextRound() já reseta activeTurnIndex para 0
      } else {
        // Pool não esgotou → próximo turno normal
        clearActiveTurns();
        nextTurn();
      }
      // useEffect detectará !activePlayer e chamará startNextTurn()
    }, 500);
  },
  [/* dependencies */]
);
```

**Opção B: useEffect separado no MatchScreen** (menos preferível)

```typescript
// Detecta pool vazio e avança rodada
React.useEffect(() => {
  if (match?.phase !== MatchPhase.MATCH || !currentRound || !pool) return;
  
  const alivePlayers = players.filter((p) => !p.isEliminated);
  
  // Pool esgotou E ainda há 2+ jogadores vivos
  if (pool.pills.length === 0 && alivePlayers.length >= 2) {
    const timer = setTimeout(() => {
      nextRound();
    }, 1000); // Delay para mostrar "Pool vazio"
    return () => clearTimeout(timer);
  }
}, [pool?.pills.length, players, match?.phase, currentRound, nextRound]);
```

**Recomendação**: **Opção A** (dentro de `handlePillConsume`)  
**Razão**: Controle direto no momento do consumo, menos chances de race conditions.

---

### Solução Bug #3: Corrigir Race Condition no Ciclo de Turnos

**Problema**: Fluxo assíncrono complexo com `setTimeout` + `useEffect` + Zustand.

**Solução Proposta**: **Simplificar o fluxo** - iniciar próximo turno DIRETAMENTE após consumo, sem depender de useEffect.

**Arquivo**: `src/hooks/useGameLoop.ts` (L106-116)

**ANTES (complexo)**:
```typescript
setTimeout(() => {
  checkMatchEnd();
  clearActiveTurns();
  nextTurn();
  // Note: useEffect detectará !activePlayer e chamará startNextTurn()
}, 500);
```

**DEPOIS (simplificado)**:
```typescript
setTimeout(() => {
  checkMatchEnd();
  
  const alivePlayers = players.filter((p) => !p.isEliminated);
  
  // Se jogo terminou, não avança turno
  if (alivePlayers.length <= 1) return;
  
  // Pool esgotou? Avança rodada
  const currentPool = match?.currentRound?.pool;
  if (currentPool && currentPool.pills.length === 0 && alivePlayers.length >= 2) {
    nextRound();
    // nextRound reseta activeTurnIndex, então começará do primeiro jogador
    setTimeout(() => startNextTurn(), 200);
  } else {
    // Pool ainda tem pills, avança turno
    clearActiveTurns();
    nextTurn();
    setTimeout(() => startNextTurn(), 200);  // ✅ Chama diretamente
  }
}, 500);
```

**Mudança no MatchScreen**: Remover useEffect que detecta `!activePlayer`

**ANTES** (`MatchScreen.tsx` L41-50):
```typescript
// Gerencia ciclo de turnos
React.useEffect(() => {
  if (match?.phase !== MatchPhase.MATCH || !currentRound) return;

  // Se não há activePlayer, inicia o próximo turno
  if (!activePlayer) {
    const timer = setTimeout(() => {
      startNextTurn();
    }, 100);
    return () => clearTimeout(timer);
  }
}, [match?.phase, currentRound, activePlayer, startNextTurn]);
```

**DEPOIS** (simplificado):
```typescript
// Inicia primeiro turno ao entrar no MATCH
React.useEffect(() => {
  if (match?.phase !== MatchPhase.MATCH || !currentRound) return;
  
  // Apenas inicializa primeiro turno da partida
  const activePlayer = players.find((p) => p.isActiveTurn);
  if (!activePlayer && match.rounds.length === 1) {
    const timer = setTimeout(() => {
      startNextTurn();
    }, 100);
    return () => clearTimeout(timer);
  }
}, [match?.phase, currentRound?.number]); // ✅ Dependencies simplificadas
```

**Justificativa**:
- Remove dependência de `activePlayer` no useEffect (fonte de race conditions)
- `startNextTurn()` é chamado EXPLICITAMENTE após `nextTurn()`
- Fluxo mais previsível e fácil de debugar
- Reduz complexidade assíncrona

---

## Validação Proposta

Após aplicar as 3 correções, executar cenário de teste:

### Cenário de Teste #1: Dano e Colapso
1. Iniciar partida (Player vs 1 Bot Easy)
2. Consumir pill DMG_LOW
3. **Validar**: Resistência reduz de 6 para 4 ✅
4. Consumir pills DMG_LOW/DMG_HIGH até resistência ≤ 0
5. **Validar**: Colapso ocorre (Vidas 3→2, Resistência reseta para 6) ✅

### Cenário de Teste #2: Transição de Rodada
1. Consumir todas as 6 pills do Round 1
2. **Validar**: Rodada avança automaticamente para Round 2 ✅
3. **Validar**: Novo pool é gerado (7 pills no Round 2) ✅
4. **Validar**: Turno inicia no primeiro jogador (ordem preservada) ✅

### Cenário de Teste #3: Alternância Bot/Player
1. Observar sequência de turnos em Round 1
2. **Validar**: Jogador → Bot → Jogador → Bot (alternância correta) ✅
3. Consumir pills e avançar para Round 2
4. **Validar**: Alternância continua no Round 2 ✅

---

## Checklist de Aprovação

Antes de proceder com implementação, validar:

- [ ] **Bug #1 - Solução**: Usar `Math.abs()` e remover checagem de sinal?
- [ ] **Bug #2 - Solução**: Implementar detecção de pool vazio dentro de `handlePillConsume`?
- [ ] **Bug #3 - Solução**: Simplificar fluxo chamando `startNextTurn()` diretamente?
- [ ] **Alternativa**: Usar solução alternativa para algum dos bugs?
- [ ] **Testes**: Executar cenários de validação após correções?

---

## Estimativa de Correção

**Tempo estimado**: 1-2 horas  
**Arquivos afetados**: 2 (`useGameLoop.ts`, `MatchScreen.tsx`)  
**Linhas modificadas**: ~40 linhas  
**Risco**: BAIXO (mudanças localizadas e bem definidas)

---

**Relatório Gerado**: 2025-12-25  
**Analista**: AI Assistant  
**Status**: Aguardando aprovação para implementação

