# Tasks — Refatoração: alinhar estrutura do src

## Legenda
- [ ] - Pendente
- [~] - Aguardando Revisão
- [x] - Finalizada
- [-] - Cancelada

## Lista
- [x] 1.1 Migrar `src/store/` para `src/stores/` e atualizar imports
  - DoD: `src/store/` removido; nenhum `@/store` no repo; `pnpm lint` e `pnpm build` passam.

- [x] 2.1 Criar esqueleto `src/core/adapters/`
  - DoD: pasta existe (placeholder versionável), sem alterar runtime.

- [x] 2.2 Criar esqueleto `src/core/state-machines/`
  - DoD: pasta existe (placeholder versionável), sem alterar runtime.

- [x] 3.1 Criar pastas `src/components/game/table/` e `src/components/game/hud/`
  - DoD: pastas existem (placeholders versionáveis), sem alterar runtime.

- [x] 3.2 Extrair componentes inline do `MatchScreen` para `components/game/*`
  - DoD: `MatchScreen` vira orquestrador; `pnpm lint` e `pnpm build` passam.

- [ ] 4.1 Criar `Phase` e guard de transição em `src/core/state-machines/`
  - DoD: existe tipo `Phase` + `canTransition(from,to)`.

- [ ] 4.2 Criar `flowStore` em `src/stores/`
  - DoD: `phase`, `setPhaseGuarded`, `resetRun`.

- [ ] 4.3 Ajustar `App.tsx` para renderizar screens por fase
  - DoD: fluxo jogável básico LOBBY -> DRAFT -> MATCH -> RESULTS sem depender do DevScreen.

- [ ] 5.1 Remover emojis do código em `src/`
  - DoD: nenhuma ocorrência de emoji em `src/`.

## Verificações
- Antes de finalizar cada item:
  - `pnpm lint`
  - `pnpm build`
