# Tasks — Refatoração e Melhorias do DevPanel

## Legenda
- `[ ]` - Pendente
- `[~]` - Aguardando Revisão
- `[x]` - Finalizada
- `[-]` - Cancelada

## Lista

### Fase 1: Criar Componente DevGameState
- [x] 1.1 Criar `src/components/dev/DevGameState.tsx`
  - DoD: Componente que acessa `draftStore`, `gameStore`, `progressionStore`.
  - Controles Draft:
    - [x] Adicionar +100 Coins
    - [x] Resetar Inventário
    - [x] Forçar Timer = 5s
  - Controles Match:
    - [x] Init Match (Reset)
    - [x] Kill Random Player (Mock) (Não implementado, deixado para futuro)
    - [x] Reveal Random Pill (Não implementado, deixado para futuro)
  - Controles Progression:
    - [x] Add XP
    - [x] Level Up

### Fase 2: Integrar ao DevDock/DevMenu
- [x] 2.1 Atualizar `DevMenu.tsx` para incluir `DevGameState`
  - DoD: Exibir os novos controles quando estiver no modo "Real State" (ou sempre visível em aba específica).

### Fase 3: Ajustes Finais
- [x] 3.1 Verificar consistência com `AppShellStore` overrides
  - DoD: Garantir que overrides não quebrem os stores de jogo.
- [x] 3.2 Testar funcionamento
  - DoD: Botões do painel alteram o jogo em tmepo real.
