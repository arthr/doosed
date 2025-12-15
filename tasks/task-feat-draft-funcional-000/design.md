# Design — Draft Funcional

## Contexto

### Por que implementar agora
- DraftScreen já existe visualmente (`src/screens/DraftScreen.tsx`)
- Componentes visuais já criados (Header, InventorySlot, ShopItem)
- Hook mock já existe (`useDraftShopMock.ts`)
- É uma etapa crítica do core loop (Home -> Lobby -> Draft -> Match)

### Estado atual
- `DraftScreen` renderiza UI mas sem lógica funcional
- `Header` exibe timer e economia (mock)
- `InventorySlot` e `ShopItem` são componentes visuais sem interação
- `useDraftShopMock` retorna dados estáticos
- Não há store para estado do Draft

## Alternativas Consideradas

### Opção 1: Criar `draftStore` (Zustand) (ESCOLHIDA)
```ts
// src/stores/draftStore.ts
interface DraftStore {
  // Economia
  pillCoins: number;
  
  // Inventário
  inventory: (Item | null)[]; // 8 slots
  
  // Timer
  timeRemaining: number; // segundos
  timerActive: boolean;
  
  // Ações
  initDraft: (initialCoins: number) => void;
  buyItem: (item: Item) => void;
  removeItem: (slotIndex: number) => void;
  confirmLoadout: () => void;
  tickTimer: () => void;
  autoComplete: () => void;
}
```

**Prós:**
- Separação de responsabilidades (Draft tem seu próprio store)
- Consistente com arquitetura existente
- Estado reativo

**Contras:**
- Mais um store para gerenciar

**Decisão:** Criar `draftStore` dedicado. É um domínio específico que justifica separação.

### Opção 2: Integrar no `gameStore`
**Prós:** Um único store
**Contras:** Responsabilidades misturadas, dificulta manutenção

**Decisão:** Não. Manter separado.

## Contratos

### Item (já definido parcialmente em `types/draft.ts`)
```ts
// src/types/draft.ts
interface Item {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'consumable' | 'passive'; // futuro: mais tipos
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon?: string;
  effect?: ItemEffect; // futuro: efeitos in-match
}

type ItemEffect = {
  type: 'scan' | 'heal' | 'shield' | 'reroll'; // exemplos
  value?: number;
};
```

### DraftStore (a ser criado)
```ts
interface DraftStore {
  pillCoins: number;
  inventory: (Item | null)[]; // 8 slots
  timeRemaining: number;
  timerActive: boolean;
  
  initDraft: (initialCoins: number) => void;
  buyItem: (item: Item) => boolean; // retorna true se comprou
  removeItem: (slotIndex: number) => void;
  confirmLoadout: () => void;
  tickTimer: () => void;
  autoComplete: () => void;
  reset: () => void;
}
```

### Shop Items (a serem definidos)
```ts
// src/data/shopItems.ts (ou similar)
const SHOP_ITEMS: Item[] = [
  {
    id: 'scanner',
    name: 'Pill Scanner',
    description: 'Revela o tipo de uma pílula antes de escolher',
    cost: 30,
    type: 'consumable',
    rarity: 'common',
  },
  {
    id: 'medkit',
    name: 'Emergency Medkit',
    description: 'Recupera 2 de vida',
    cost: 25,
    type: 'consumable',
    rarity: 'common',
  },
  // ... mais itens
];
```

## Plano Incremental

### Fase 1: Criar draftStore
1. Criar `src/stores/draftStore.ts`
2. Definir estado inicial (pillCoins: 100, inventory: array de 8 nulls, timeRemaining: 60, timerActive: false)
3. Criar ações básicas: `initDraft`, `reset`

### Fase 2: Sistema de Economia
1. Adicionar ação `buyItem(item)`
   - Verificar se tem Pill Coins
   - Verificar se tem espaço no inventário
   - Deduzir custo
   - Adicionar item ao primeiro slot vazio
2. Adicionar ação `removeItem(slotIndex)`
   - Remover item do slot
   - Reembolsar 50% do custo
3. Testar: comprar item, saldo deduzido; remover item, reembolso funciona

### Fase 3: Timer
1. Adicionar ação `tickTimer()`
   - Decrementa `timeRemaining` em 1
   - Se chegar a 0, chama `autoComplete()`
2. Integrar timer com `useEffect` no `DraftScreen`
   - `setInterval` que chama `tickTimer()` a cada 1s
   - Limpar interval ao desmontar ou ao confirmar
3. Testar: timer decrementa visualmente

### Fase 4: Autocompletar
1. Adicionar ação `autoComplete()`
   - Preencher slots vazios com item padrão ("Placebo Pills" ou nada)
   - Transicionar para `MATCH`
2. Testar: timer expirar, loadout autocompletado, transição funciona

### Fase 5: Confirmação de Loadout
1. Adicionar ação `confirmLoadout()`
   - Parar timer (`timerActive = false`)
   - Salvar loadout no `gameStore` (futuro: passar para Match)
   - Transicionar para `MATCH`
2. Conectar botão "Confirmar" no `DraftScreen`
3. Testar: clicar confirmar, timer para, transição funciona

### Fase 6: Conectar UI
1. Atualizar `Header` para ler `pillCoins` e `timeRemaining` do `draftStore`
2. Atualizar `InventorySlot` para ler `inventory` do `draftStore`
3. Atualizar `ShopItem` para chamar `buyItem` ao clicar
4. Testar: UI reflete estado; compras funcionam

### Fase 7: Validações e Feedback
1. Desabilitar botão de compra se não tiver Pill Coins ou inventário cheio
2. Exibir feedback visual quando tentar comprar sem condições (notificação?)
3. Testar: validações funcionam

### Fase 8: Shop Items (dados reais)
1. Criar `src/data/shopItems.ts` com lista de itens do MVP
2. Substituir mock por dados reais
3. Testar: itens exibidos corretamente

### Fase 9: Polimento
1. Adicionar animação de feedback ao comprar/remover item (opcional)
2. Melhorar UX do timer (mudar cor quando <10s)
3. Rodar `pnpm lint && pnpm build`
4. Teste manual completo

## Riscos e Mitigação

### Risco 1: Timer dessincronizado
**Mitigação:** Usar `setInterval` com cleanup correto. Testar cenários (confirmar antes de expirar, deixar expirar).

### Risco 2: Estado do inventário inconsistente
**Mitigação:** Sempre validar slots disponíveis antes de comprar. Usar imutabilidade no Zustand.

### Risco 3: Reembolso incorreto
**Mitigação:** Calcular reembolso corretamente (50% do custo original). Testar com diferentes itens.

### Risco 4: Transição para Match antes de salvar loadout
**Mitigação:** `confirmLoadout` deve salvar no `gameStore` antes de transicionar.

## Decisões Arquiteturais

1. **draftStore separado**: Draft é um domínio específico, merece seu próprio store
2. **Inventário fixo (8 slots)**: Simplifica lógica, alinhado com docs
3. **Reembolso 50%**: Evita exploits de compra/venda infinita
4. **Autocompletar com item padrão**: Jogadores não são penalizados se timer expirar
5. **Timer client-side**: Por ora, ok para solo. Em multiplayer, será server-authoritative

## Dependências
- TASK-FEAT-NAVEGACAO-000 (para testar transição Draft -> Match)
- Nenhuma dependência nova de bibliotecas
