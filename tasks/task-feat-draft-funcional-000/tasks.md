# Tasks — Draft Funcional

## Legenda
- `[ ]` - Pendente
- `[~]` - Aguardando Revisão
- `[x]` - Finalizada
- `[-]` - Cancelada

## Lista

### Fase 1: Criar draftStore
- [ ] 1.1 Criar `src/stores/draftStore.ts`
  - DoD: Store criado com estado inicial (pillCoins, inventory, timeRemaining, timerActive); `pnpm lint` passa.

- [ ] 1.2 Criar ações `initDraft` e `reset`
  - DoD: `initDraft(initialCoins)` inicializa estado; `reset()` limpa estado; ambas funcionam.

### Fase 2: Sistema de Economia
- [ ] 2.1 Criar ação `buyItem(item)` no `draftStore`
  - DoD: Verifica Pill Coins e espaço; deduz custo; adiciona item ao inventário; retorna `true` se sucesso.

- [ ] 2.2 Criar ação `removeItem(slotIndex)` no `draftStore`
  - DoD: Remove item do slot; reembolsa 50% do custo; atualiza inventário.

- [ ] 2.3 Testar economia
  - DoD: Comprar item deduz saldo; remover item reembolsa 50%; validações funcionam.

### Fase 3: Timer
- [ ] 3.1 Criar ação `tickTimer()` no `draftStore`
  - DoD: Decrementa `timeRemaining` em 1; se chegar a 0, chama `autoComplete()`.

- [ ] 3.2 Integrar timer no `DraftScreen` com `useEffect`
  - DoD: Timer inicia ao montar; decrementa a cada 1s; limpa interval ao desmontar ou confirmar.

- [ ] 3.3 Testar timer
  - DoD: Timer decrementa visualmente; para ao confirmar; chama autoComplete ao expirar.

### Fase 4: Autocompletar
- [ ] 4.1 Criar ação `autoComplete()` no `draftStore`
  - DoD: Preenche slots vazios com item padrão (ou nada); transiciona para `MATCH`.

- [ ] 4.2 Testar autocompletar
  - DoD: Timer expirando autocompleta loadout; transição para Match funciona.

### Fase 5: Confirmação de Loadout
- [ ] 5.1 Criar ação `confirmLoadout()` no `draftStore`
  - DoD: Para timer; salva loadout no `gameStore` (ou estado persistente); transiciona para `MATCH`.

- [ ] 5.2 Conectar botão "Confirmar" no `DraftScreen`
  - DoD: Botão chama `confirmLoadout()`; timer para; transição funciona.

### Fase 6: Conectar UI
- [ ] 6.1 Atualizar `Header` para ler do `draftStore`
  - DoD: `Header` exibe `pillCoins` e `timeRemaining` do store; atualiza em tempo real.

- [ ] 6.2 Atualizar `InventorySlot` para ler do `draftStore`
  - DoD: `InventorySlot` renderiza itens do `inventory`; permite remover item ao clicar.

- [ ] 6.3 Atualizar `ShopItem` para chamar `buyItem`
  - DoD: `ShopItem` chama `buyItem(item)` ao clicar; validações funcionam (desabilitado se sem coins/espaço).

- [ ] 6.4 Testar UI conectada
  - DoD: Comprar item atualiza inventário e saldo; remover item reembolsa; timer decrementa visualmente.

### Fase 7: Validações e Feedback
- [ ] 7.1 Desabilitar botão de compra se não tiver condições
  - DoD: Botão desabilitado se `pillCoins < item.cost` ou inventário cheio (8 slots).

- [ ] 7.2 Adicionar feedback visual ao tentar comprar sem condições
  - DoD: Exibir notificação (via `notificationStore`) quando compra falhar.

- [ ] 7.3 Testar validações
  - DoD: Não consegue comprar sem Pill Coins; não consegue comprar com inventário cheio.

### Fase 8: Shop Items (dados reais)
- [ ] 8.1 Criar `src/data/shopItems.ts` com itens do MVP
  - DoD: Lista de itens definida (ex.: Pill Scanner, Medkit, Shield, etc.); cada item tem nome, descrição, custo, tipo, rarity.

- [ ] 8.2 Substituir mock por dados reais no `DraftScreen`
  - DoD: `DraftScreen` usa `shopItems.ts`; itens exibidos corretamente na UI.

### Fase 9: Polimento e Testes
- [ ] 9.1 Melhorar UX do timer (mudar cor quando <10s)
  - DoD: Timer muda cor/estilo quando tempo restante é baixo.

- [ ] 9.2 Adicionar animação de feedback ao comprar/remover (opcional)
  - DoD: Feedback visual suave (ex.: item "pulsa" ao ser adicionado).

- [ ] 9.3 Teste manual completo
  - DoD: Fluxo Draft funciona: comprar itens, remover, confirmar, timer expirar, autocompletar; sem erros.

- [ ] 9.4 Verificação final
  - DoD: `pnpm lint && pnpm build` passam; nenhum warning.

- [ ] 9.5 Atualizar docs se necessário
  - DoD: Se houver mudanças arquiteturais, atualizar documentação.

- [ ] 9.6 Commit final
  - DoD: Commit com mensagem: `feat(draft): implementa draft funcional (economia, timer, inventario, confirmacao)`.

## Verificações
Antes de finalizar cada item:
- `pnpm lint`
- `pnpm build`
- Teste manual (quando aplicável)
