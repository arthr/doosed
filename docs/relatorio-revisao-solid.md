# Relatorio de Revisao - Refatoracao SOLID

**Data**: 2025-12-26 (Atualizado: 2025-12-26)  
**Escopo**: Revisao completa dos hooks, stores e core apos refatoracao SOLID  
**Objetivo**: Identificar violacoes de principios, bugs e design inconsistente

---

## Sumario Executivo

### Status Geral - ATUALIZADO

**PROBLEMAS RESOLVIDOS** com implementacao do [Zustand Slices Pattern](https://zustand.docs.pmnd.rs/guides/slices-pattern):

- ✅ **Hooks especializados** com responsabilidades bem definidas (SOLID-S compliant)
- ✅ **RESOLVIDO**: Duplicacao de estado eliminada - gameStore unico combina matchSlice + playersSlice + poolSlice
- ✅ **RESOLVIDO**: Pool integrado no poolSlice (opera sobre currentRound.pool via actions)
- ✅ **Orquestracao** em `useGameLoop` bem estruturada (composicao > monolito)
- ⚠️ **PENDENTE**: `useItemActions` e apenas stub (TODO US2)

### Arquitetura Atual (Slices Pattern)

```
src/stores/
  slices/
    types.ts           # Tipos compartilhados (GameStore, SliceCreator)
    matchSlice.ts      # Match lifecycle (phases, turns, rounds)
    playersSlice.ts    # Player management (health, inventory, status) 
    poolSlice.ts       # Pool operations (consume, reveal, modify)
  gameStore.ts         # Bounded store (combina todos os slices)
  index.ts             # Re-exports
```

### Beneficios Alcancados
- **Zero sincronizacao**: Store unico elimina necessidade de sincronizar estado
- **SOLID-S mantido**: Cada slice em arquivo separado com responsabilidade unica
- **Performance**: Players em `Map<string, Player>` para O(1) lookup
- **Padrao oficial**: Segue documentacao do Zustand

### Pendencias Restantes
1. ⚠️ **PENDENTE**: Implementar `useItemActions` (US2 - nao bloqueador para US1)
2. 🟢 **OPCIONAL**: Refatorar recursao em `startNextTurn` para loop iterativo

---

## 1. Análise dos Hooks

### 1.1 ✅ `useGameLoop` - Orquestrador

**Arquivo**: `src/hooks/useGameLoop.ts`

#### Pontos Positivos
- ✅ Composição bem implementada (5 hooks especializados)
- ✅ Responsabilidade clara: orquestração
- ✅ Handlers públicos bem definidos (compatibilidade com MatchScreen)
- ✅ Single Responsibility Principle respeitado

#### Violações Identificadas

**V1.1: Dependency Inversion (SOLID-D) - BAIXA PRIORIDADE**
```typescript
// Linha 17-24: Dependências de implementações concretas
import { usePillConsumption } from './usePillConsumption';
import { useTurnManagement } from './useTurnManagement';
// ... etc
```
**Impacto**: Baixo - hooks são estáveis, não há necessidade de trocar implementações  
**Recomendação**: Aceitar violação (YAGNI - não há necessidade de abstrair interfaces de hooks)

**V1.2: Recursão Perigosa - MÉDIA PRIORIDADE**
```typescript
// Linha 111-116: Recursão sem limite garantido
if (!currentPlayer || currentPlayer.isEliminated) {
  skipEliminatedPlayerTurn();
  setTimeout(() => {
    startNextTurn(); // ⚠️ Recursão pode causar stack overflow
  }, 100);
  return;
}
```
**Problema**: Se houver muitos players eliminados consecutivos, recursão acumula  
**Recomendação**: Substituir por loop iterativo:
```typescript
// Sugestão de correção
while (true) {
  const currentPlayer = getCurrentTurnPlayer();
  
  if (!currentPlayer) break; // Ninguém vivo
  
  if (!currentPlayer.isEliminated) {
    // Player válido encontrado
    startTurnForPlayer(currentPlayer);
    if (canBotAct(currentPlayer)) {
      setTimeout(() => executeBotTurnAction(currentPlayer), 2000);
    }
    break;
  }
  
  // Player eliminado, avança
  skipEliminatedPlayerTurn();
}
```

**V1.3: Leitura de pool inconsistente - BAIXA PRIORIDADE**
```typescript
// Linha 44: Pool vem de currentRound (correto)
const pool = match?.currentRound?.pool || null;

// MAS: poolStore existe e não é usado aqui!
```
**Problema**: `poolStore` está desconectado do fluxo real  
**Impacto**: Confusão sobre qual é a fonte da verdade  
**Recomendação**: Ver seção 2.3 (consolidar poolStore)

---

### 1.2 ✅ `usePillConsumption` - Consumo de Pills

**Arquivo**: `src/hooks/usePillConsumption.ts`

#### Pontos Positivos
- ✅ Single Responsibility: apenas consumo de pills
- ✅ Integração correta com core (`resolvePillEffect`)
- ✅ Logging estruturado

#### Violações Identificadas

**V1.4: Mutação direta de matchStore em hook - BAIXA PRIORIDADE**
```typescript
// Linha 26-33: Mutação via updateMatch (correto por Immer)
updateMatch((m) => {
  if (!m.currentRound) return;
  const pillIndex = m.currentRound.pool.pills.findIndex((p) => p.id === pill.id);
  if (pillIndex !== -1) {
    m.currentRound.pool.pills.splice(pillIndex, 1);
    m.currentRound.pool.size = m.currentRound.pool.pills.length;
  }
});
```
**Observação**: Tecnicamente correto (Immer garante imutabilidade), mas:
- Pool está sendo manipulado diretamente no hook
- `poolStore.consumePill` existe mas não é usado aqui

**Recomendação**: 
- Opção A: Usar `poolStore.consumePill` (requer consolidar poolStore)
- Opção B: Aceitar mutação direta (mais direto, menos indireção)

**DECISÃO RECOMENDADA**: Aceitar Opção B (KISS - evitar indireção desnecessária)

---

### 1.3 ✅ `useTurnManagement` - Gestão de Turnos

**Arquivo**: `src/hooks/useTurnManagement.ts`

#### Pontos Positivos
- ✅ Single Responsibility: apenas turnos
- ✅ Lógica clara de next/skip
- ✅ Detecção de pool esgotado → nova rodada (FR-045)

#### Violações Identificadas

**V1.5: handleTurnTimeout retorna pillId mas não consume - MÉDIA PRIORIDADE**
```typescript
// Linha 89-107: Apenas retorna pillId
const handleTurnTimeout = useCallback((): string | null => {
  // ... seleciona pill aleatória
  return randomPill.id; // ⚠️ Quem consome?
}, [match, players, logTurn]);
```
**Problema**: Separação de responsabilidades está OK, mas fluxo é confuso  
**No useGameLoop**:
```typescript
// Linha 149-157: Consome a pill retornada
const handleTurnTimeout = useCallback(() => {
  const randomPillId = getTurnTimeoutPillId();
  if (randomPillId) {
    handlePillConsume(randomPillId, activePlayer.id); // ✅ Correto
  }
}, [players, getTurnTimeoutPillId, handlePillConsume]);
```
**Observação**: Design está correto, mas poderia ser mais direto  
**Recomendação**: Aceitar design atual (separação de concerns é válida)

---

### 1.4 ✅ `useBotExecution` - Bot AI

**Arquivo**: `src/hooks/useBotExecution.ts`

#### Pontos Positivos
- ✅ Single Responsibility: apenas bot AI
- ✅ Singleton de `BotEasy` (linha 21)
- ✅ Retorna decisão sem aplicar (separação de concerns)

#### Violações Identificadas

**V1.6: Seed não determinístico - MÉDIA PRIORIDADE (apenas para testes)**
```typescript
// Linha 38: Seed baseado em timestamp
const seed = Date.now() + Math.random() * 1000;
```
**Problema**: Violação de FR-186.19 (determinismo para testes)  
**Impacto**: BAIXO (apenas afeta replay/testes, não gameplay)  
**Recomendação**: 
```typescript
// Para jogo normal: seed aleatório OK
// Para testes: permitir injetar seed via prop ou context
const seed = testMode ? fixedSeed : Date.now() + Math.random() * 1000;
```

**DECISÃO**: Aceitar implementação atual para MVP, adicionar determinismo em fase de testes

---

### 1.5 ✅ `useMatchEndDetection` - Fim de Jogo

**Arquivo**: `src/hooks/useMatchEndDetection.ts`

#### Pontos Positivos
- ✅ Single Responsibility: apenas detecção de fim
- ✅ Cálculo de XP integrado
- ✅ Atualização de progressão

#### Violações Identificadas

**V1.7: Cálculo de XP simplificado - BAIXA PRIORIDADE (TODO US3)**
```typescript
// Linha 38-42: Cálculo muito básico
const calculateXPReward = useCallback((isWinner: boolean): number => {
  const baseXP = 100;
  const winBonus = isWinner ? 50 : 0;
  return baseXP + winBonus; // ⚠️ FR-161 requer mais fatores
}, []);
```
**FR-161 especifica**: rounds survived, quests completed, items used  
**Recomendação**: Implementar cálculo completo em US3 (aceitar simplificação no MVP)

---

### 1.6 🔴 `useItemActions` - Uso de Itens (CRÍTICO)

**Arquivo**: `src/hooks/useItemActions.ts`

#### CRÍTICO: Stub Incompleto

```typescript
// Linha 35-49: TODO US2
const useItem = useCallback(
  (player: Player, item: Item) => {
    logItem(`${player.name} usou ${item.name}`, { ... });
    
    // TODO US2: Implementar efeitos de itens ⚠️ BLOQUEADOR
  },
  [logItem]
);
```

**PROBLEMA CRÍTICO**:
- Hook existe mas não faz nada
- US1 requer itens funcionais (Scanner, Inverter, Shield, etc)
- Tasks T086 (wire item usage) está incompleta

**IMPACTO**: 🔴 **BLOQUEADOR PARA US1 COMPLETO**

**Recomendação URGENTE**: Implementar efeitos de itens básicos:
1. Scanner → `poolStore.revealPill(pillId)`
2. Inverter → `poolStore.applyModifierToPill(pillId, 'INVERTED')`
3. Pocket Pill → `playerStore.applyHeal(playerId, 4)`
4. Shield → `playerStore.applyStatus(playerId, status)`

**Prioridade**: 🔴 **CRÍTICA - Deve ser implementado imediatamente**

---

## 2. Análise das Stores

### 2.1 🔴 `matchStore` - Match Global (CRÍTICO)

**Arquivo**: `src/stores/matchStore.ts`

#### Pontos Positivos
- ✅ Single source of truth para match
- ✅ Immer middleware para imutabilidade
- ✅ Actions bem definidas
- ✅ Integração com core (`initializeTurnOrder`, `transitionToPhase`, `generatePool`)

#### 🔴 VIOLAÇÃO CRÍTICA: Dados duplicados com playerStore

```typescript
// matchStore.ts linha 14
interface Match {
  // ...
  players: Player[]; // ⚠️ DUPLICADO com playerStore.players
  // ...
}
```

**PROBLEMA**: 
- `matchStore.match.players` e `playerStore.players` existem simultaneamente
- Sincronização manual em 4+ lugares do playerStore (linhas 51-56, 68-80, 114-122, 145-154)
- Risco ALTO de desincronização

**Evidência de sincronização manual**:
```typescript
// playerStore.ts linha 51-56
setPlayers: (players: Player[]) =>
  set((state) => {
    state.players = players;
    
    // ⚠️ Sincronização manual
    const matchStore = useMatchStore.getState();
    if (matchStore.match) {
      matchStore.updateMatch((m) => {
        m.players = players;
      });
    }
  }),
```

**ANÁLISE**: Este padrão se repete em:
- `setPlayers` (linha 51)
- `updatePlayer` (linha 68)
- `applyDamage` (linha 114)
- `applyHeal` (linha 145)

**IMPACTO**: 🔴 **CRÍTICO**
- Violação de DRY (Don't Repeat Yourself)
- Violação de Single Source of Truth
- Bug potencial se sincronização falhar em algum ponto
- Complexidade cognitiva alta

---

### 2.2 🟡 Opções de Resolução - playerStore vs matchStore

#### Opção A: matchStore como Single Source of Truth (RECOMENDADO)

**Implementação**:
```typescript
// playerStore.ts - REMOVIDO

// Todos os hooks/componentes acessam players via:
const { match } = useMatchStore();
const players = match?.players || [];
```

**Vantagens**:
- ✅ Single source of truth (Constitution Principle I)
- ✅ Elimina sincronização manual (DRY)
- ✅ Menos stores = menos complexidade
- ✅ Players são parte intrínseca do Match

**Desvantagens**:
- ⚠️ Requer refatorar todos os hooks que usam `usePlayerStore`
- ⚠️ Actions de player ficam espalhadas (applyDamage, applyHeal)

**Mitigação**:
```typescript
// matchStore.ts - ADICIONAR actions de player
interface MatchState {
  // ... existing
  
  // Player actions (movidos de playerStore)
  applyDamage: (playerId: string, damage: number) => void;
  applyHeal: (playerId: string, heal: number) => void;
  updatePlayer: (playerId: string, updater: (p: Player) => void) => void;
  // ... etc
}
```

#### Opção B: playerStore como Single Source of Truth

**Implementação**:
```typescript
// matchStore.ts
interface Match {
  // ...
  playerIds: string[]; // ⚠️ Apenas IDs, não objetos
  // ...
}

// Hooks/componentes:
const { match } = useMatchStore();
const { players } = usePlayerStore();
const matchPlayers = match.playerIds.map(id => 
  players.find(p => p.id === id)
);
```

**Vantagens**:
- ✅ Players isolados (pode ser vantagem para testes)

**Desvantagens**:
- ❌ Mais complexo (lookup por ID sempre)
- ❌ Players são parte do Match conceptualmente
- ❌ Ainda requer sincronização de IDs

**RECOMENDAÇÃO**: ❌ **NÃO USAR** (complexidade > benefício)

#### Opção C: Manter duplicação com sincronização automática

**Implementação**:
```typescript
// matchStore.ts - Subscriber automático
useMatchStore.subscribe((state) => {
  if (state.match) {
    usePlayerStore.getState().setPlayers(state.match.players);
  }
});
```

**Vantagens**:
- ✅ Sincronização centralizada
- ✅ Menos refatoração necessária

**Desvantagens**:
- ❌ Ainda viola Single Source of Truth
- ❌ Overhead de sincronização (performance)
- ❌ Ordem de updates pode causar bugs

**RECOMENDAÇÃO**: ⚠️ **ACEITÁVEL como solução temporária**, mas não ideal

---

### ✅ DECISÃO FINAL: Opção A - matchStore como Single Source of Truth

**Justificativa**:
1. Alinhado com Constitution Principle I (Documentation as Source of Truth)
2. Elimina violação DRY (sincronização manual)
3. Reduz complexidade (menos stores)
4. Players são conceitualmente parte do Match (data-model.md)

**Plano de Implementação**:
1. Mover actions de player para matchStore
2. Refatorar hooks para usar apenas matchStore
3. Remover playerStore completamente
4. Validar com testes de integração

**Estimativa**: 2-3 horas de refatoração

---

### 2.3 🔴 `poolStore` - Pool de Pills (CRÍTICO)

**Arquivo**: `src/stores/poolStore.ts`

#### 🔴 PROBLEMA CRÍTICO: Store existe mas não é usado

**Evidência**:
```typescript
// useGameLoop.ts linha 44
const pool = match?.currentRound?.pool || null; // ⚠️ Lê de matchStore

// poolStore.ts existe com actions:
generateNewPool, setPool, revealPill, consumePill, etc. // ❌ NÃO USADAS
```

**ANÁLISE**:
- Pool está em `matchStore.currentRound.pool` (linha 107-121 matchStore.ts)
- `poolStore` é independente e não sincronizado
- Hooks leem pool de `matchStore`, não de `poolStore`

**IMPACTO**: 🔴 **CRÍTICO**
- Confusão sobre fonte da verdade
- `poolStore` é código morto (nunca usado)
- Violação de YAGNI (store desnecessário)

#### Opções de Resolução

**Opção A: Remover poolStore (RECOMENDADO)**
- Pool permanece em `matchStore.currentRound.pool`
- Actions de pool (revealPill, consumePill) movem para matchStore
- Elimina store desnecessário

**Vantagens**:
- ✅ YAGNI (menos código)
- ✅ Single source of truth
- ✅ Pool é parte da Round/Match conceptualmente

**Opção B: Usar poolStore como fonte única**
- Refatorar para pool NÃO estar em currentRound
- matchStore.currentRound referencia poolStore.pool
- Hooks leem de poolStore

**Desvantagens**:
- ❌ Maior refatoração
- ❌ Pool é parte da Round conceptualmente (data-model.md)

**DECISÃO**: ✅ **Opção A - Remover poolStore**

**Plano**:
1. Remover `src/stores/poolStore.ts`
2. Mover actions úteis para matchStore (revealPill, applyModifierToPill)
3. Atualizar imports nos hooks (se houver)

**Estimativa**: 30 minutos

---

### 2.4 ✅ Outras Stores

#### `logStore.ts`
- ✅ Correto: logging estruturado
- ✅ Usado em `useEventLogger`
- Sem problemas identificados

#### `economyStore.ts`
- ⏳ TODO US2 (Shape Quests + Shopping)
- Não implementado ainda (esperado)

#### `progressionStore.ts`
- ✅ Correto: XP/Schmeckles persistente
- ✅ Usado em `useMatchEndDetection`
- Sem problemas identificados

---

## 3. Análise do Core

### 3.1 ✅ Core Modules - Status Geral

**Módulos Implementados**:
- ✅ `pool-generator.ts` - Geração de pools
- ✅ `effect-resolver.ts` - Resolução de efeitos
- ✅ `collapse-handler.ts` - Mecânica de colapso
- ✅ `inventory-manager.ts` - Gestão de inventário
- ✅ `turn-manager.ts` - Gestão de turnos
- ✅ `state-machine.ts` - Transições de fase
- ✅ `event-processor.ts` - Processamento de eventos
- ✅ `bot/bot-easy.ts` - IA Easy
- ✅ `utils/random.ts` - RNG
- ✅ `utils/validation.ts` - Validações

**Status**: ✅ Implementações completas e funcionais

### 3.2 ⚠️ Observações de Validação

**V3.1: Validação de invariantes não integrada - ALTA PRIORIDADE**

`utils/validation.ts` existe mas não é usado após mutations:

```typescript
// Deveria ser chamado após cada mutação crítica
// playerStore.applyDamage → validatePlayerInvariants
// matchStore.nextRound → validateMatchInvariants
// poolStore.consumePill → validatePoolInvariants
```

**Recomendação**: Integrar validações em hooks/stores após mutations críticas (FR-186.19)

**Prioridade**: 🟡 **ALTA** (essencial para robustez)

---

## 4. Checklist de Conformidade com Constitution

### Princípio I: Documentação como Fonte da Verdade
- ✅ specs/ como referência implementada
- ⚠️ **VIOLAÇÃO**: playerStore + matchStore duplicam fonte da verdade

### Princípio III: Event-Driven & Determinístico
- ✅ event-processor implementado
- ⚠️ Bot seed não determinístico (aceitável para MVP)

### Princípio VIII: DRY, KISS, YAGNI, SOLID

#### DRY (Don't Repeat Yourself)
- ❌ **VIOLAÇÃO**: Sincronização playerStore repetida 4+ vezes
- ❌ **VIOLAÇÃO**: poolStore código duplicado/não usado

#### KISS (Keep It Simple)
- ✅ Hooks especializados são simples
- ⚠️ Complexidade da sincronização entre stores viola KISS

#### YAGNI (You Aren't Gonna Need It)
- ❌ **VIOLAÇÃO**: poolStore não é necessário (YAGNI violado)
- ✅ Hooks não têm abstrações prematuras

#### SOLID - Single Responsibility
- ✅ Hooks respeitam SR (cada hook tem 1 responsabilidade)
- ⚠️ matchStore + playerStore violam SR (responsabilidades sobrepostas)

#### SOLID - Open/Closed
- ✅ Core modules extensíveis (pool-generator, effect-resolver)

#### SOLID - Liskov Substitution
- ✅ BotInterface permite substituição (Easy/Normal/Hard/Insane)

#### SOLID - Interface Segregation
- ✅ Hooks têm interfaces coesas

#### SOLID - Dependency Inversion
- ⚠️ useGameLoop depende de implementações concretas (aceitável)

---

## 5. Bugs e Riscos Identificados

### 🔴 CRÍTICOS (Bloqueadores)

#### B1: useItemActions não implementado
- **Arquivo**: `src/hooks/useItemActions.ts`
- **Linha**: 35-49
- **Problema**: Stub vazio, itens não funcionam
- **Impacto**: US1 incompleto (Scanner, Shield, etc não funcionam)
- **Prioridade**: 🔴 **CRÍTICA**

#### B2: playerStore vs matchStore desincronização
- **Arquivos**: `src/stores/playerStore.ts`, `src/stores/matchStore.ts`
- **Problema**: Dados duplicados com sincronização manual
- **Impacto**: Bugs potenciais, estado inconsistente
- **Prioridade**: 🔴 **CRÍTICA**

#### B3: poolStore não usado
- **Arquivo**: `src/stores/poolStore.ts`
- **Problema**: Store existe mas pool vem de matchStore
- **Impacto**: Confusão, código morto
- **Prioridade**: 🔴 **CRÍTICA**

### 🟡 ALTOS (Importante mas não bloqueador)

#### B4: Validação de invariantes não integrada
- **Arquivo**: `src/core/utils/validation.ts`
- **Problema**: Funções existem mas não são chamadas
- **Impacto**: Bugs não detectados, violação FR-186.19
- **Prioridade**: 🟡 **ALTA**

### 🟢 MÉDIOS (Melhorias)

#### B5: Recursão em startNextTurn
- **Arquivo**: `src/hooks/useGameLoop.ts`
- **Linha**: 111-116
- **Problema**: Recursão pode causar stack overflow
- **Impacto**: Baixo (raro ter muitos eliminados consecutivos)
- **Prioridade**: 🟢 **MÉDIA**

#### B6: Seed de bot não determinístico
- **Arquivo**: `src/hooks/useBotExecution.ts`
- **Linha**: 38
- **Problema**: Date.now() + random não reproduzível
- **Impacto**: Apenas testes/replay afetados
- **Prioridade**: 🟢 **MÉDIA**

---

## 6. Plano de Ação Recomendado

### Fase 1: Correções Críticas (Prioridade 🔴)

#### 1.1 Implementar useItemActions (BLOQUEADOR US1)
**Tempo estimado**: 3-4 horas  
**Arquivos**: `src/hooks/useItemActions.ts`

**Tarefas**:
1. Implementar Scanner → `revealPill(pillId)`
2. Implementar Inverter → `applyModifierToPill(pillId, 'INVERTED')`
3. Implementar Pocket Pill → `applyHeal(playerId, 4)`
4. Implementar Shield → `applyStatus(playerId, { type: 'SHIELDED', duration: 1 })`
5. Testar cada item manualmente

#### 1.2 Resolver playerStore vs matchStore (ARQUITETURA)
**Tempo estimado**: 2-3 horas  
**Arquivos**: `src/stores/matchStore.ts`, `src/stores/playerStore.ts`, todos os hooks

**Tarefas**:
1. Mover actions de player para matchStore:
   - `applyDamage(playerId, damage)`
   - `applyHeal(playerId, heal)`
   - `updatePlayer(playerId, updater)`
   - `applyStatus`, `removeStatus`
   - `addToInventory`, `removeFromInventory`
   - `grantPillCoins`, `spendPillCoins`
   - `setActiveTurn`, `clearActiveTurns`
2. Refatorar hooks:
   - `usePillConsumption`: usar `matchStore.applyDamage/applyHeal`
   - `useGameLoop`: ler players de `matchStore.match.players`
   - `useTurnManagement`: idem
3. Remover `src/stores/playerStore.ts`
4. Validar funcionamento end-to-end

#### 1.3 Remover poolStore (SIMPLIFICAÇÃO)
**Tempo estimado**: 30 minutos  
**Arquivos**: `src/stores/poolStore.ts`, `src/stores/matchStore.ts`

**Tarefas**:
1. Mover actions úteis de poolStore para matchStore:
   - `revealPill(pillId)` → `matchStore.revealPill`
   - `applyModifierToPill(pillId, modifier)` → `matchStore.applyModifierToPill`
2. Remover `src/stores/poolStore.ts`
3. Atualizar imports (se houver)

**Estimativa Fase 1**: 6-7 horas

---

### Fase 2: Correções Altas (Prioridade 🟡)

#### 2.1 Integrar validação de invariantes
**Tempo estimado**: 2 horas  
**Arquivos**: `src/stores/matchStore.ts`, hooks

**Tarefas**:
1. Importar `validatePlayerInvariants`, `validateMatchInvariants`, `validatePoolInvariants`
2. Chamar após mutations:
   - `applyDamage` → `validatePlayerInvariants(player)`
   - `nextRound` → `validateMatchInvariants(match)`
   - `consumePill` → `validatePoolInvariants(pool)`
3. Em DEV: pausar se falha
4. Em PROD: logar erro e tentar recovery

**Estimativa Fase 2**: 2 horas

---

### Fase 3: Melhorias Médias (Prioridade 🟢)

#### 3.1 Corrigir recursão em startNextTurn
**Tempo estimado**: 30 minutos  
**Arquivo**: `src/hooks/useGameLoop.ts`

**Tarefas**:
1. Substituir recursão por loop iterativo (ver sugestão V1.2)

#### 3.2 Seed determinístico para bots (testes)
**Tempo estimado**: 1 hora  
**Arquivo**: `src/hooks/useBotExecution.ts`

**Tarefas**:
1. Adicionar prop `testMode` ou context
2. Se `testMode`, usar seed fixo
3. Caso contrário, usar `Date.now() + Math.random()`

**Estimativa Fase 3**: 1.5 horas

---

### Estimativa Total: 9-10 horas de refatoração

---

## 7. Conclusão

### Status da Refatoração SOLID

#### ✅ O que está correto
- Hooks especializados com responsabilidades bem definidas
- Separação de concerns (consumo, turnos, bot, fim de jogo)
- Orquestração em useGameLoop (composição > monolito)
- Core modules puros e testáveis
- Logging estruturado

#### ❌ O que precisa correção CRÍTICA
1. **playerStore vs matchStore**: duplicação de estado
2. **poolStore não usado**: código morto/confusão
3. **useItemActions stub**: bloqueador US1

#### ⚠️ O que precisa melhoria ALTA
1. **Validação de invariantes**: não integrada (FR-186.19)
2. **DRY violado**: sincronização manual repetida

### Recomendação Final

**PRIORIDADE IMEDIATA**:
1. Implementar `useItemActions` (bloqueador US1) - 3-4h
2. Consolidar stores (remover playerStore + poolStore) - 2.5-3h
3. Integrar validações - 2h

**Total crítico**: ~7-9 horas de refatoração

Após estas correções, a implementação estará:
- ✅ SOLID-compliant
- ✅ DRY (sem duplicação)
- ✅ KISS (stores simplificados)
- ✅ YAGNI (sem código morto)
- ✅ Constitution-compliant

---

**Próximo passo sugerido**: Começar por **Fase 1.1 (useItemActions)** pois é bloqueador para testar US1 end-to-end.

