# Design — Navegação entre Telas

## Contexto

### Por que implementar agora
- O `flowStore` e a função `canTransition` já existem (`src/stores/flowStore.ts`, `src/core/state-machines/phase.ts`)
- As screens principais já estão criadas (Home, Lobby, Draft, Match, Results)
- É o próximo passo natural após a refatoração de estrutura (TASK-REFAC-ESTRUTURA-SRC-000)
- Sem navegação funcional, não conseguimos testar o fluxo completo do jogo

### Estado atual
- `flowStore`: implementado com `phase`, `setPhaseGuarded`, `resetRun`
- `Phase`: tipo definido (`HOME | LOBBY | DRAFT | MATCH | RESULTS`)
- `canTransition`: guard function que valida transições válidas
- Screens: todas existem mas são renderizadas apenas no `DevScreen` (preview)
- `App.tsx`: renderiza apenas `HomeScreen` + `DevScreen` (em DEV)

## Alternativas Consideradas

### Opção 1: Renderização Condicional em App.tsx (ESCOLHIDA)
```tsx
// App.tsx
const currentPhase = useFlowStore(state => state.phase);

return (
  <>
    {currentPhase === 'HOME' && <HomeScreen />}
    {currentPhase === 'LOBBY' && <LobbyScreen />}
    {currentPhase === 'DRAFT' && <DraftScreen />}
    {currentPhase === 'MATCH' && <MatchScreen />}
    {currentPhase === 'RESULTS' && <ResultScreen />}
    <Chat mode="dock" />
    <NotificationBar />
    {import.meta.env.DEV ? <DevScreen /> : null}
  </>
);
```

**Prós:**
- Simples e direto
- Sem dependências extras (React Router, etc.)
- Alinhado com a filosofia Solo Dev
- Cada fase tem controle total sobre seu layout

**Contras:**
- Sem histórico de navegação (não é problema para este jogo)
- Sem deep linking (não é necessário no MVP)

### Opção 2: React Router
**Prós:** Histórico, deep linking, padrão da comunidade
**Contras:** Over-engineering para o escopo atual, dependência extra

**Decisão:** Opção 1. Para o MVP de um jogo de sessão única, renderização condicional é suficiente.

## Contratos

### flowStore (já existente)
```ts
interface FlowStore {
  phase: Phase;
  setPhaseGuarded: (newPhase: Phase) => void;
  resetRun: () => void;
}
```

### Phase (já existente)
```ts
type Phase = 'HOME' | 'LOBBY' | 'DRAFT' | 'MATCH' | 'RESULTS';
```

### canTransition (já existente)
```ts
function canTransition(from: Phase, to: Phase): boolean;
```

### Novos Contratos (a serem criados)

#### NavigationActions (opcional, mas recomendado)
```ts
// src/stores/flowStore.ts ou src/lib/navigation.ts
export const navigationActions = {
  goToLobby: () => useFlowStore.getState().setPhaseGuarded('LOBBY'),
  startDraft: () => useFlowStore.getState().setPhaseGuarded('DRAFT'),
  startMatch: () => useFlowStore.getState().setPhaseGuarded('MATCH'),
  showResults: () => useFlowStore.getState().setPhaseGuarded('RESULTS'),
  returnHome: () => useFlowStore.getState().setPhaseGuarded('HOME'),
  resetFlow: () => useFlowStore.getState().resetRun(),
};
```

## Plano Incremental

### Fase 1: Preparar App.tsx
1. Importar `useFlowStore` e todas as screens
2. Implementar renderização condicional baseada em `phase`
3. Garantir que `DevScreen` permanece acessível (em DEV)
4. Manter `Chat` e `NotificationBar` globais

### Fase 2: Conectar HomeScreen
1. Criar handlers `onClick` nos botões "ENTER THE VOID" e "MULTIPLAYER"
2. Chamar `flowStore.setPhaseGuarded('LOBBY')`
3. Testar transição Home -> Lobby

### Fase 3: Conectar LobbyScreen
1. Criar botão "Start" (ou equivalente)
2. Chamar `flowStore.setPhaseGuarded('DRAFT')`
3. Testar transição Lobby -> Draft

### Fase 4: Conectar DraftScreen
1. No evento de "confirmar" ou "timer expirado", chamar `setPhaseGuarded('MATCH')`
2. Testar transição Draft -> Match

### Fase 5: Conectar MatchScreen (placeholder)
1. Criar botão temporário "End Match" (será removido quando lógica real existir)
2. Chamar `setPhaseGuarded('RESULTS')`
3. Testar transição Match -> Results

### Fase 6: Conectar ResultScreen
1. Criar botões "Play Again" e "Main Menu"
2. "Play Again": chamar `resetRun()` (volta para LOBBY)
3. "Main Menu": chamar `setPhaseGuarded('HOME')`
4. Testar transições Results -> Home e Results -> Lobby

### Fase 7: Polimento
1. Remover/ajustar botão placeholder do MatchScreen
2. Verificar DevScreen (controles de phase devem continuar funcionando)
3. Rodar `pnpm lint && pnpm build`
4. Teste manual do fluxo completo

## Riscos e Mitigação

### Risco 1: Transições inválidas não tratadas
**Mitigação:** O `canTransition` já está implementado e o `setPhaseGuarded` já rejeita transições inválidas. Adicionar logs/notificações quando transições forem rejeitadas (usar `notificationStore`).

### Risco 2: Estado não resetado entre ciclos
**Mitigação:** A função `resetRun()` já existe. Garantir que cada store (game, draft, etc.) tenha sua própria função de reset e que sejam chamadas no momento certo.

### Risco 3: DevScreen interferindo com fluxo real
**Mitigação:** DevScreen já está isolado e só aparece em `DEV`. Garantir que ele não afete o comportamento de navegação (apenas observa/modifica estado para debug).

### Risco 4: Performance (re-renders desnecessários)
**Mitigação:** Usar seletores granulares do Zustand (`state => state.phase` ao invés de desestruturar o store inteiro).

## Decisões Arquiteturais

1. **Renderização Condicional**: Preferir sobre React Router para simplicidade
2. **Global Chat/NotificationBar**: Permanecem montados em todas as fases
3. **DevScreen**: Sempre disponível em DEV, independente da fase
4. **Sem Animações (nesta task)**: Transições instantâneas; animações podem ser adicionadas depois
5. **Sem Persistência (nesta task)**: Ao recarregar, sempre volta para HOME

## Dependências
- Nenhuma dependência nova
- Usa estrutura existente: `flowStore`, `Phase`, `canTransition`
- Todas as screens já existem
