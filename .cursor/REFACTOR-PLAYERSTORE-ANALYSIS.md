# Análise: Consolidação do playerStore

## 🔍 Problema Identificado

**Violação DRY e Single Source of Truth:**

```typescript
// playerStore.ts
players: Player[]  // ❌ Duplicado

// matchStore.ts  
match: {
  players: Player[]  // ❌ Duplicado
}
```

**Situação atual:**
- `playerStore.players` e `matchStore.match.players` coexistem
- playerStore sincroniza manualmente com matchStore após cada mutação (linhas 51-56, 70-78)
- Complexidade alta + risco de dessincronia

---

## ✅ Solução Proposta: Single Source of Truth

### Opção A: matchStore como fonte única (RECOMENDADO)

**Princípio:** `matchStore.match.players` é a **ÚNICA** fonte da verdade

```typescript
// playerStore.ts (refatorado)
interface PlayerState {
  // ❌ REMOVER: players: Player[]
  
  // ✅ Getters derivados de matchStore
  getPlayers: () => Player[]
  getPlayer: (id: string) => Player | undefined
  
  // ✅ Actions que manipulam matchStore.match.players diretamente
  updatePlayer: (playerId: string, updater: (p: Player) => void) => void
  applyDamage: (playerId: string, damage: number) => void
  // ... etc
}
```

**Implementação:**
```typescript
export const usePlayerStore = create<PlayerState>()(
  immer((set) => ({
    // Getters
    getPlayers: () => {
      const { match } = useMatchStore.getState();
      return match?.players || [];
    },
    
    getPlayer: (playerId: string) => {
      const { match } = useMatchStore.getState();
      return match?.players.find(p => p.id === playerId);
    },
    
    // Actions manipulam matchStore diretamente
    updatePlayer: (playerId, updater) => {
      const matchStore = useMatchStore.getState();
      if (!matchStore.match) return;
      
      matchStore.updateMatch((m) => {
        const player = m.players.find(p => p.id === playerId);
        if (player) updater(player);
      });
    },
    
    applyDamage: (playerId, damage) => {
      // Manipula matchStore.match.players diretamente
      // ...
    },
  }))
);
```

**Vantagens:**
- ✅ Elimina duplicação completamente
- ✅ Impossível ter dessincronia
- ✅ Menos memória (1 array ao invés de 2)
- ✅ matchStore permanece como fonte única da verdade

**Desvantagens:**
- ⚠️ Componentes precisam referenciar `matchStore.match.players` ao invés de `playerStore.players`
- ⚠️ Ligeiramente mais código de acesso

---

### Opção B: playerStore como fonte única

**Princípio:** `playerStore.players` é a fonte, `matchStore.match.players` é derivado

**Vantagens:**
- ✅ Menor mudança no código existente

**Desvantagens:**
- ❌ Match state incompleto sem players (viola modelo de domínio)
- ❌ `Match` type teria `players` opcional, quebrando invariantes
- ❌ Não faz sentido semântico (players fazem parte do Match)

---

## 🎯 Recomendação Final

**Implementar Opção A:**
1. Refatorar playerStore para usar getters derivados de matchStore
2. Remover `players: Player[]` do playerStore
3. Atualizar componentes para usar `useMatchStore().match?.players`
4. Validar com testes

---

## 📊 Impacto nos Componentes

### Antes:
```typescript
const { players } = usePlayerStore();
```

### Depois (Opção A):
```typescript
const match = useMatchStore((s) => s.match);
const players = match?.players || [];
```

**Arquivos afetados:**
- `src/screens/MatchScreen.tsx` ✅ JÁ DESINTEGRADO
- `src/screens/DraftScreen.tsx` ✅ JÁ DESINTEGRADO
- `src/screens/LobbyScreen.tsx` ✅ JÁ DESINTEGRADO
- `src/screens/ResultsScreen.tsx` ✅ JÁ DESINTEGRADO
- `src/hooks/useGameLoop.ts` ✅ REFATORADO (usa hooks especializados)
- `src/hooks/usePillConsumption.ts` - precisa atualizar
- `src/hooks/useTurnManagement.ts` - precisa atualizar
- `src/hooks/useBotExecution.ts` - precisa atualizar
- `src/hooks/useMatchEndDetection.ts` - precisa atualizar
- `src/hooks/useItemActions.ts` - precisa atualizar

**Total estimado:** ~10 hooks + componentes (mas a maioria já está desintegrada)

---

## ⏭️ Próximos Passos

1. ✅ Aprovar Opção A
2. Refatorar playerStore (remover `players`, adicionar getters)
3. Atualizar hooks especializados
4. Reintegrar componentes com nova API
5. Testar fluxo completo

