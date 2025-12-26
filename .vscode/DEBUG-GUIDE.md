# Guia de Debug - DOSED MVP

## Configurações Criadas

### 1. Launch Configurations (`.vscode/launch.json`)

#### Debug no Chrome
- **Uso**: Debug principal da aplicação React no Chrome
- **Como usar**: 
  1. Pressione `F5` ou vá em "Run and Debug" (Ctrl+Shift+D)
  2. Selecione "Debug no Chrome"
  3. O Vite será iniciado automaticamente e o Chrome abrirá
- **Breakpoints**: Coloque breakpoints diretamente nos arquivos `.ts`/`.tsx`
- **Hot Reload**: Funciona normalmente durante debug

#### Debug no Edge
- **Uso**: Mesma funcionalidade, mas usando Edge
- **Útil para**: Testar compatibilidade cross-browser

#### Attach to Chrome
- **Uso**: Para anexar a uma instância do Chrome já em execução
- **Como usar**:
  1. Inicie o Chrome com debug habilitado:
     ```bash
     chrome.exe --remote-debugging-port=9222
     ```
  2. Execute `pnpm dev` manualmente
  3. Selecione "Attach to Chrome" no Debug panel

#### Debug Testes (Vitest)
- **Debug Current Test File**: 
  - Abre o arquivo de teste que você quer debugar
  - Pressione `F5` com a configuração selecionada
  - Breakpoints funcionam normalmente
  
- **Debug Todos os Testes**:
  - Roda toda a suite de testes com debug habilitado

---

## Como Debugar o Fluxo de Turnos (Bug #3)

### Arquivos-Chave para Debug

#### 1. `src/hooks/useGameLoop.ts`
**Breakpoints recomendados:**
- Linha 107: `setTimeout(() => {` - Início do fluxo pós-consumo de pill
- Linha 122: `nextRound()` - Transição de rodada
- Linha 126: `nextTurn()` - Próximo turno
- Linha 130: `clearActiveTurns()` - Limpa turnos ativos
- Linha 165: `const startNextTurn = useCallback(() => {` - Início de novo turno
- Linha 194: `if (currentPlayer.isBot && pool) {` - Execução de IA do bot

#### 2. `src/screens/MatchScreen.tsx`
**Breakpoints recomendados:**
- Linha 41: `React.useEffect(() => {` - useEffect que inicia turnos
- Linha 45: `if (!activePlayer) {` - Condição para iniciar próximo turno
- Linha 47: `startNextTurn();` - Chamada que pode causar loop

#### 3. `src/stores/matchStore.ts`
**Breakpoints recomendados:**
- `nextTurn()`: Incremento de `activeTurnIndex`
- `nextRound()`: Geração de novo pool e reset de índice

---

## Fluxo Esperado (Sem Bug)

```
1. Player consume pill
   └─> handlePillConsume()
       └─> setTimeout(500ms)
           ├─> checkMatchEnd()
           ├─> nextTurn() ou nextRound()
           ├─> clearActiveTurns()
           └─> startNextTurn() [DIRETO, não via useEffect]
               └─> setActiveTurn(nextPlayerId)
                   └─> Se é bot: executeBotTurn()
                       └─> setTimeout(1000ms)
                           └─> handlePillConsume() [RECURSIVO]
```

### Fluxo Problemático Atual (Com Bug)

```
1. Player consume pill
   └─> handlePillConsume()
       └─> setTimeout(500ms)
           ├─> checkMatchEnd()
           ├─> nextTurn()
           ├─> clearActiveTurns()
           └─> [ESPERANDO useEffect DETECTAR !activePlayer]
               └─> MatchScreen useEffect (linha 41)
                   └─> if (!activePlayer) → startNextTurn()
                       └─> RACE CONDITION:
                           - startNextTurn muda frequentemente (dependencies)
                           - useEffect pode não disparar
                           - Bot não joga
```

---

## Passo a Passo: Debugar Bug #3

### 1. Preparação
```bash
# Terminal 1: Iniciar dev server
pnpm dev
```

### 2. Iniciar Debug
- Pressione `F5` ou selecione "Debug no Chrome"
- Navegue até a tela de Match (criar partida com 1 bot)

### 3. Coloque Breakpoints
**useGameLoop.ts:**
- [ ] Linha 126: `nextTurn()`
- [ ] Linha 130: `clearActiveTurns()`
- [ ] Linha 165: `const startNextTurn = useCallback`

**MatchScreen.tsx:**
- [ ] Linha 45: `if (!activePlayer)`
- [ ] Linha 47: `startNextTurn()`

### 4. Reproduza o Bug
1. Clique em uma pill (seu turno)
2. **Observe o fluxo:**
   - Pause em `nextTurn()` → Continue (F8)
   - Pause em `clearActiveTurns()` → Continue
   - **PONTO CRÍTICO**: O useEffect em MatchScreen dispara?
     - Se SIM: startNextTurn() é chamado → Bot joga
     - Se NÃO: **BUG CONFIRMADO** → Bot não joga

### 5. Verifique Call Stack
Quando pausar em `startNextTurn()`:
- **Call Stack esperado**:
  ```
  startNextTurn()
  └─> setTimeout callback (useGameLoop linha 131)
      └─> handlePillConsume()
  ```
- **Call Stack problemático**:
  ```
  startNextTurn()
  └─> useEffect callback (MatchScreen linha 47)
      └─> React internals (re-render loop)
  ```

### 6. Inspecione Variáveis
No Debug Console, verifique:
```javascript
// Estado dos jogadores
players
players.filter(p => !p.isEliminated)
players.find(p => p.isActiveTurn)

// Estado do match
match.activeTurnIndex
match.turnOrder
match.currentRound.pool.pills.length

// Dependências problemáticas
startNextTurn // Muda a cada render?
```

---

## Aplicar Correção (Tasks T091c + T091d)

### T091c: Fix useGameLoop.ts

**Arquivo**: `src/hooks/useGameLoop.ts`

**Linha 120-131** - Substituir por:
```typescript
// Pool esgotou? Nova rodada (FR-045)
if (currentPool && currentPool.pills.length === 0) {
  nextRound();
  clearActiveTurns();
  setTimeout(() => startNextTurn(), 200); // FIX: Direto, não via useEffect
} else {
  // Pool tem pills → próximo turno normal
  nextTurn();
  clearActiveTurns();
  setTimeout(() => startNextTurn(), 200); // FIX: Direto, não via useEffect
}
```

### T091d: Fix MatchScreen.tsx

**Arquivo**: `src/screens/MatchScreen.tsx`

**Linha 41-51** - Substituir por:
```typescript
// Inicializa APENAS o primeiro turno da partida
React.useEffect(() => {
  if (match?.phase !== MatchPhase.MATCH) return;
  if (!currentRound) return;
  if (match.rounds.length !== 1) return; // Somente primeiro round
  if (activePlayer) return; // Já iniciou

  // Kickstart do primeiro turno
  const timer = setTimeout(() => {
    startNextTurn();
  }, 100);
  return () => clearTimeout(timer);
}, [match?.phase, currentRound?.number]); // Remove activePlayer/startNextTurn
```

---

## Validação Pós-Fix

### Checklist de Validação (T092c)

Após aplicar T091c + T091d, valide:

- [ ] **Turno 1**: Player joga → Bot responde
- [ ] **Turno 2**: Bot joga → Player responde
- [ ] **Turno 3+**: Alternância continua sem parar
- [ ] **Pool esgota**: Nova rodada inicia corretamente
- [ ] **Eliminação**: Jogador eliminado é pulado
- [ ] **Match termina**: Último sobrevivente vai para Results

### Debug Console: Comandos Úteis

```javascript
// Ver estado atual dos players
usePlayerStore.getState().players

// Ver turno ativo
useMatchStore.getState().match.activeTurnIndex

// Forçar próximo turno (emergência)
useMatchStore.getState().nextTurn()

// Ver logs estruturados
useLogStore.getState().logs.slice(-10)
```

---

## Troubleshooting

### Breakpoints não funcionam
- Verifique se sourcemaps estão habilitados (vite.config.ts)
- Limpe cache do browser (Ctrl+Shift+R)
- Restart o debug (Ctrl+Shift+F5)

### useEffect dispara infinitamente
- Verifique dependencies array
- Use React DevTools para ver re-renders

### Bot não responde mesmo com fix
- Verifique se `executeBotTurn()` está sendo chamado
- Verifique console para erros de IA
- Breakpoint em `src/core/bot/bot-easy.ts` linha 50

---

## Extensões Recomendadas

As seguintes extensões foram adicionadas em `.vscode/extensions.json`:

- **ESLint**: Linting de código
- **Prettier**: Formatação automática
- **Tailwind CSS IntelliSense**: Autocomplete de classes
- **Error Lens**: Mostra erros inline
- **Vitest Explorer**: UI para rodar testes
- **Code Spell Checker PT-BR**: Correção ortográfica

---

## Próximos Passos Após Debug

1. **Aplicar fixes** (T091c + T091d)
2. **Validar Bug #3** (T092c)
3. **Validação completa** (T092) - 15 itens do quickstart.md
4. **Implementar tasks restantes**:
   - T058: Bot recovery (MEDIUM priority)
   - T081-minimal: DevTools básico
5. **Deploy MVP** para testes de aceitação

---

**Última atualização**: 2025-12-26  
**Versão**: 1.0.0

