# Resumo das Tasks de Correção de Bugs - 2025-12-25

**Feature**: DOSED MVP - Pill Roulette Game  
**Contexto**: Tasks criadas para corrigir 3 bugs críticos identificados em testes manuais  
**Status**: PRONTO PARA IMPLEMENTAÇÃO via /implement

---

## Tasks Adicionadas ao tasks.md

### Sub-fase: Bug Fixes Críticos (T091a-T091d)

**Localização**: Inseridas após T091 e antes de T092 na Phase 3 (User Story 1)

#### Implementação dos Fixes (4 tasks)

| Task ID | Descrição | Arquivo | Bug |
|---------|-----------|---------|-----|
| T091a | Fix pill effect application logic - remover checagem de sinal, usar Math.abs() | src/hooks/useGameLoop.ts (L87-96) | Bug #1 |
| T091b | Implement pool exhaustion detection - detectar pool.pills.length === 0 e chamar nextRound() | src/hooks/useGameLoop.ts handlePillConsume | Bug #2 |
| T091c | Fix turn cycle race condition - chamar startNextTurn() diretamente | src/hooks/useGameLoop.ts (L106-116) | Bug #3 |
| T091d | Simplify turn initialization useEffect - remover dependencies problemáticas | src/screens/MatchScreen.tsx (L41-50) | Bug #3 |

#### Validação dos Fixes (3 tasks)

| Task ID | Descrição | Cenário de Teste |
|---------|-----------|------------------|
| T092a | Validate Bug #1 fix | Consumir DMG pills → resistência reduz → colapso ocorre |
| T092b | Validate Bug #2 fix | Esgotar Round 1 → avança para Round 2 com novo pool |
| T092c | Validate Bug #3 fix | Observar alternância Player → Bot contínua |

---

## Ordem de Execução Recomendada

### 1️⃣ Implementar Fixes (Sequencial)

```bash
# Ordem recomendada (do mais simples ao mais complexo):
T091a → T091b → T091c → T091d
```

**Razão**:
- T091a: Fix isolado, mais simples (1 bloco de código)
- T091b: Adiciona lógica, depende de T091a estar funcionando
- T091c + T091d: Refatoração de fluxo, mais complexa, deve ser feita por último

### 2️⃣ Validar Fixes (Sequencial)

```bash
# Após todas as implementações:
T092a → T092b → T092c → T092 (validação completa)
```

---

## Detalhes Técnicos das Correções

### T091a: Effect Application Fix

**Mudança**:
```typescript
// ANTES (incorreto):
if (effect.type === 'HEAL' && effect.value > 0) {
  applyHeal(playerId, effect.value);
} else if (effect.type === 'DAMAGE' && effect.value > 0) {  // ❌ BUG
  applyDamage(playerId, effect.value);
}

// DEPOIS (correto):
if (effect.type === 'HEAL') {
  applyHeal(playerId, Math.abs(effect.value));
} else if (effect.type === 'DAMAGE') {
  applyDamage(playerId, Math.abs(effect.value));  // ✅ Math.abs()
} else if (effect.type === 'LIFE') {
  updatePlayer(playerId, (p) => {
    p.lives = Math.min(3, p.lives + Math.abs(effect.value));
  });
}
```

**Validação**: Consumir DMG_LOW → resistência 6→4 ✅

---

### T091b: Pool Exhaustion Detection

**Mudança**:
```typescript
setTimeout(() => {
  checkMatchEnd();
  
  // ✅ NOVO: Checar se pool esgotou
  const currentPool = match?.currentRound?.pool;
  const alivePlayers = players.filter((p) => !p.isEliminated);
  
  if (currentPool && currentPool.pills.length === 0 && alivePlayers.length >= 2) {
    // Pool esgotou → próxima rodada
    nextRound();
    setTimeout(() => startNextTurn(), 200);
  } else {
    // Pool não esgotou → próximo turno
    clearActiveTurns();
    nextTurn();
    setTimeout(() => startNextTurn(), 200);
  }
}, 500);
```

**Validação**: Esgotar 6 pills Round 1 → Round 2 com 7 pills ✅

---

### T091c + T091d: Turn Cycle Fix

**T091c - useGameLoop.ts**:
```typescript
// Adicionar chamada direta a startNextTurn() após nextTurn()
setTimeout(() => startNextTurn(), 200);  // ✅ Direto
```

**T091d - MatchScreen.tsx**:
```typescript
// Simplificar useEffect - apenas primeiro turno
React.useEffect(() => {
  if (match?.phase !== MatchPhase.MATCH || !currentRound) return;
  
  const activePlayer = players.find((p) => p.isActiveTurn);
  if (!activePlayer && match.rounds.length === 1) {
    const timer = setTimeout(() => {
      startNextTurn();
    }, 100);
    return () => clearTimeout(timer);
  }
}, [match?.phase, currentRound?.number]); // ✅ Dependencies limpas
```

**Validação**: Player → Bot → Player → Bot (contínuo) ✅

---

## Checklist de Implementação

### Antes de Começar
- [ ] Ler bug-report-2025-12-25.md completo
- [ ] Entender causa raiz de cada bug
- [ ] Revisar soluções propostas

### Durante Implementação
- [X] Implementar T091a (effect application)
- [X] Fix adicional: Corrigir lógica de Colapso em playerStore.ts
- [ ] Testar manualmente: consumir DMG_LOW e validar Colapso
- [X] Implementar T091b (pool exhaustion)
- [X] Fix adicional: Corrigir closure stale (usar getState() direto)
- [X] Testar manualmente: esgotar pool e validar Round 2 ✅ PASSOU
- [ ] Implementar T091c (turn cycle - useGameLoop)
- [ ] Implementar T091d (turn cycle - MatchScreen)
- [ ] Testar manualmente: alternância de turnos

### Após Implementação
- [ ] Executar T092a (validar Bug #1)
- [ ] Executar T092b (validar Bug #2)
- [ ] Executar T092c (validar Bug #3)
- [ ] Executar T092 (validação completa quickstart.md)
- [ ] Marcar todas as tasks como [x] no tasks.md

---

## Impacto Esperado

### Antes dos Fixes
- ❌ Pills consumidas mas sem efeito
- ❌ Jogo trava após Round 1
- ❌ Bot joga uma vez e para

### Depois dos Fixes
- ✅ Dano/cura aplicados corretamente
- ✅ Transição automática para Round 2+
- ✅ Bot joga continuamente
- ✅ MVP jogável de ponta a ponta

---

## Estimativas

| Task | Tempo | Complexidade | Risco |
|------|-------|--------------|-------|
| T091a | 15 min | BAIXA | BAIXO |
| T091b | 20 min | MÉDIA | BAIXO |
| T091c | 15 min | BAIXA | BAIXO |
| T091d | 10 min | BAIXA | BAIXO |
| T092a-c | 30 min | - | - |
| T092 | 45 min | - | - |
| **TOTAL** | **~2h15min** | - | BAIXO |

---

## Referências

- **Bug Report**: `specs/001-dosed-mvp/checklists/bug-report-2025-12-25.md`
- **Integration Review**: `specs/001-dosed-mvp/checklists/integration-review.md`
- **Tasks**: `specs/001-dosed-mvp/tasks.md` (T091a-T092)
- **Specs**: `specs/001-dosed-mvp/spec.md` (FR-045, FR-049, FR-093, FR-095)

---

**Próximo Passo**: Usar `/implement` para executar tasks T091a-T091d sequencialmente

**Gerado**: 2025-12-25  
**Status**: Pronto para implementação

