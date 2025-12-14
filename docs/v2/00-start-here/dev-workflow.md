# Workflow de desenvolvimento (Solo Dev)

## Branch/commits
- Trabalhe em branches curtas por feature.
- Commits pequenos, com mensagem focada no porquê.

## Guardrails
- Componentes: UI pura.
- Hooks: ponte entre UI e actions/selectors.
- Utils/core: funções puras e determinísticas.
- Evitar aumentar código legado sem motivo.

## Qualidade
- Lint sempre verde.
- Para lógica de jogo: testes unitários + (quando fizer sentido) property-based.

## Definição de pronto
- UX: estados vazios, loading e erros definidos.
- Multiplayer: eventos versionados e determinísticos.
- Balance: não quebrar guardrails (pool cap, unlocks, etc.).
