# Tasks — Refactor: decomposição das Screens

## Legenda
- `[ ]` - Pendente
- `[~]` - Aguardando Revisão
- `[x]` - Finalizada
- `[-]` - Cancelada

## Lista

- [x] 1.1 Consolidar convenção e critérios de extração no `design.md`
  - DoD: `design.md` define (a) onde os componentes vivem, (b) o que é candidato a UI kit, (c) mapeamento por Screen.

- [x] 1.2 Inventariar cada Screen (seções + subcomponentes + candidatos UI kit)
  - DoD: `design.md` tem lista/tabela por Screen com: responsabilidade, destino (`components/<dominio>` vs `components/ui`), e justificativa.

- [x] 2.1 Refatorar `HomeScreen` para usar `src/components/home/*`
  - DoD: `HomeScreen` fica “fina” (orquestração); componentes extraídos com nomes claros; `pnpm lint` passa.

- [ ] 2.2 Refatorar `LobbyScreen` para compor com `src/components/lobby/*` (remover duplicações inline)
  - DoD: `LobbyScreen` usa `RoomHeader/PlayerGrid/ActionControls/...` (ou equivalente); não existem duplicações grandes inline; `pnpm lint` passa.

- [ ] 2.3 Revisar `DraftScreen` (manter referência; mover apenas o que for ruído)
  - DoD: `DraftScreen` segue como referência; se houver constantes/mock grandes, mover para módulo apropriado sem regressão; `pnpm lint` passa.

- [ ] 2.4 Revisar `MatchScreen` e confirmar decomposição por domínio (`src/components/match/*`)
  - DoD: `MatchScreen` segue como orquestração; se necessário, ajustar apenas composição/nomes/props sem refazer UI; `pnpm lint` passa.

- [ ] 2.5 Refatorar `ResultScreen` para usar `src/components/results/*`
  - DoD: `ResultScreen` fica “fina”; `ResultsHero/ResultsStats/ResultsXpBar/ResultsActions` (ou equivalente) existem; `pnpm lint` passa.

- [ ] 2.6 Refatorar `DevScreen` para usar `src/components/dev/*`
  - DoD: preview por phase e seleção continuam funcionando; dock/menu/preview extraídos; `pnpm lint` passa.

- [ ] 3.1 Rodar checks finais
  - DoD: `pnpm lint` e `pnpm build` passam.

- [ ] 3.2 Atualizar docs se necessário
  - DoD: se a convenção de decomposição virar “norma prática”, adicionar nota curta em `docs/06-frontend/stack-e-convencoes.md`.

- [ ] 3.3 Atualizar fontes/recência
  - DoD: rodar `python .cursor/rules/docs-workflow/scripts/update_fontes_recencia.py`.

- [ ] 3.4 Commit e push
  - DoD: commits pequenos (preferencialmente 1 Screen por commit) com Conventional Commits; `git push`.
