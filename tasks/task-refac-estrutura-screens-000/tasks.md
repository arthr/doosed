# Tasks — Refactor: padronizar estrutura das Screens

## Legenda
- `[ ]` - Pendente
- `[~]` - Aguardando Revisão
- `[x]` - Finalizada
- `[-]` - Cancelada

## Lista

- [x] 1.1 Definir contrato de wrapper no `design.md` (se necessário, ajustar com exemplos)
  - DoD: `design.md` descreve padrão alvo (root/seções/scroll) e mapeamento por screen.

- [x] 2.1 Padronizar wrapper do `HomeScreen`
  - DoD: `src/screens/HomeScreen.tsx` segue o contrato; sem mudança visual relevante; `pnpm lint` passa.

- [x] 2.2 Padronizar wrapper do `LobbyScreen`
  - DoD: `src/screens/LobbyScreen.tsx` segue o contrato; scroll permanece funcional; `pnpm lint` passa.

- [x] 2.3 Revisar `DraftScreen` (apenas simplificação estrutural, mantendo referência)
  - DoD: `src/screens/DraftScreen.tsx` continua referência; se houver duplicidade de altura/scroll, reduzir sem regressão; `pnpm lint` passa.

- [x] 2.4 Padronizar wrapper do `MatchScreen`
  - DoD: `src/screens/MatchScreen.tsx` segue o contrato; comportamento em desktop/mobile preservado; `pnpm lint` passa.

- [x] 2.5 Padronizar wrapper do `ResultScreen` + remover emojis (regra do projeto)
  - DoD: `src/screens/ResultScreen.tsx` segue o contrato; nenhum emoji no arquivo; `pnpm lint` passa.

- [x] 2.6 Padronizar/validar `DevScreen` (preview + overlay)
  - DoD: preview continua funcionando (phase + seleção); não duplica scroll indevidamente; `pnpm lint` passa.

- [x] 3.1 Rodar checks finais
  - DoD: `pnpm lint` e `pnpm build` passam.

- [-] 3.2 Atualizar docs se necessário
  - DoD: se o contrato de wrapper for relevante para contribuição, adicionar nota em `docs/06-frontend/stack-e-convencoes.md` (curta).

- [x] 3.3 Atualizar fontes/recência
  - DoD: rodar `python .cursor/rules/docs-workflow/scripts/update_fontes_recencia.py`.

- [x] 3.4 Commit final
  - DoD: commits pequenos por screen (preferencial); ou um commit final se você preferir. Mensagens sugeridas:
    - `refactor(screens): padroniza wrapper das screens (estrutura e scroll)`
