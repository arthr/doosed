# Requirements — Refatoração de estrutura do src

## Objetivo
Alinhar a estrutura do `src/` ao target definido em `docs/00-start-here/estrutura-do-projeto.md`, com migração incremental e baixo risco.

## Requirements (EARS)
- Quando um arquivo precisar importar stores Zustand, o sistema deve expor stores em `src/stores/` e permitir import via alias `@/stores/...`.
- Quando o projeto for compilado, o sistema deve passar em `pnpm build` sem alterações manuais pós-refator.
- Quando o lint for executado, o sistema deve passar em `pnpm lint` com `--max-warnings 0`.
- Quando a estrutura de camadas for expandida, o sistema deve prover `src/core/adapters/` e `src/core/state-machines/` como pontos de extensão.
- Se um caminho antigo deixar de existir, o sistema deve garantir que não há imports quebrados ou referências remanescentes.
