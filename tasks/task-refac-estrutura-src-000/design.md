# Design — Refatoração de estrutura do src

## Contexto
A estrutura atual do `src/` ainda não segue o target descrito em `docs/00-start-here/estrutura-do-projeto.md`. Precisamos migrar incrementalmente sem quebrar build e mantendo baixo churn.

## Estratégia
- Migração incremental por pastas, priorizando paths e compatibilidade primeiro.
- Criar pontos de extensão vazios (`src/core/...`) antes de mover lógica para lá.

## Decisões
- `src/store/` foi migrado para `src/stores/` e os imports foram atualizados.
- `src/core/adapters/` e `src/core/state-machines/` existem como esqueleto para próximas etapas.

## Riscos e mitigação
- Risco: imports quebrados.
  - Mitigação: busca por referências antigas + `pnpm lint` e `pnpm build` a cada commit.
- Risco: churn alto em refatorações grandes.
  - Mitigação: 1 task pequena por commit e aprovação antes de passos maiores.

## Próximos passos
- Introduzir `src/components/game/{table,hud}` e extrair componentes inline do `MatchScreen`.
- Preparar o fluxo oficial de fases (tirar dependência do `DevScreen` como app principal).
