# Fontes e recencia (Git + mtime)

Este arquivo registra as fontes .md usadas como insumo para a documentacao Renovada (docs/v2) e como o criterio de recencia foi aplicado.

## Regras de precedencia

- Autoridade por contexto (primario): steering/* e .cursor/rules/* (normativo) > docs/screens/* (requisitos de UX) > docs/PROMPT-*.md (insumo) > docs/generated_docs/* (derivado).

- Recencia (secundario): usar data do ultimo commit (Git) como principal e mtime local como nota; dentro do mesmo nivel de autoridade, o mais recente tem preferencia.

## Tabela (ordenada por Git desc, depois mtime)

| Ultimo_commit_git | mtime_local | Autoridade | Contexto | Arquivo |
|---|---|---|---|---|
| 2025-12-14T18:10:03-03:00 | 2025-12-14T18:34:30 | Normativo | steering | steering/structure.md |
| 2025-12-14T18:10:03-03:00 | 2025-12-14T18:01:58 | Normativo | steering | steering/game-balance.md |
| 2025-12-14T18:10:03-03:00 | 2025-12-14T18:01:58 | Normativo | steering | steering/game-flow.md |
| 2025-12-14T18:10:03-03:00 | 2025-12-14T18:01:58 | Normativo | steering | steering/product.md |
| 2025-12-14T18:10:03-03:00 | 2025-12-14T17:52:02 | Normativo | steering | steering/tech.md |
| 2025-12-14T17:47:06-03:00 | 2025-12-14T18:38:19 | Docs | docs | docs/NOTES.md |
| 2025-12-14T17:47:06-03:00 | 2025-12-14T17:45:23 | Normativo | .cursor/rules | .cursor/rules/coding-style.md |
| 2025-12-14T17:47:06-03:00 | 2025-12-13T20:33:29 | Insumo | docs/PROMPT-* | docs/prompts/PROMPT-ASSETS.md |
| 2025-12-14T17:47:06-03:00 | 2025-12-13T20:33:29 | Insumo | docs/PROMPT-* | docs/prompts/PROMPT-PILLS.md |
| 2025-12-14T17:47:06-03:00 | 2025-12-13T20:33:29 | Insumo | docs/PROMPT-* | docs/prompts/PROMPT-SCREENS-UI.md |
| 2025-12-14T17:47:06-03:00 | 2025-12-13T13:55:23 | Insumo | docs/PROMPT-* | docs/prompts/PROMPT-UI-MOBILE.md |
| 2025-12-14T17:47:06-03:00 | 2025-12-13T13:55:23 | Insumo | docs/PROMPT-* | docs/prompts/PROMPT-UI.md |
| 2025-12-14T14:54:13-03:00 | 2025-12-14T18:34:30 | Derivado | docs/generated_docs | docs/generated_docs/relatorio_completo.md |
| 2025-12-14T14:54:13-03:00 | 2025-12-14T18:34:30 | Derivado | docs/generated_docs | docs/generated_docs/structure.md |
| 2025-12-14T14:54:13-03:00 | 2025-12-14T14:53:11 | Derivado | docs/generated_docs | docs/generated_docs/codigo_exemplo.md |
| 2025-12-14T14:54:13-03:00 | 2025-12-14T14:53:02 | Derivado | docs/generated_docs | docs/generated_docs/product.md |
| 2025-12-14T14:54:13-03:00 | 2025-12-14T14:53:02 | Derivado | docs/generated_docs | docs/generated_docs/tech-stack.md |
| 2025-12-13T20:42:17-03:00 | 2025-12-13T20:33:30 | Requisito_UX | docs/screens | docs/screens/home.md |
| 2025-12-13T20:42:17-03:00 | 2025-12-13T20:33:30 | Requisito_UX | docs/screens | docs/screens/lobby.md |
| 2025-12-13T20:42:17-03:00 | 2025-12-13T20:33:30 | Requisito_UX | docs/screens | docs/screens/match.md |
| 2025-12-13T20:42:17-03:00 | 2025-12-13T20:33:30 | Requisito_UX | docs/screens | docs/screens/results.md |
| 2025-12-13T20:42:17-03:00 | 2025-12-13T20:33:29 | Normativo | .cursor/rules | .cursor/rules/observation-log.md |
| 2025-12-13T20:42:17-03:00 | 2025-12-13T20:33:29 | Requisito_UX | docs/screens | docs/screens/draft.md |
| - | 2025-12-14T18:24:45 | Outro | repo | AGENTS.md |
| - | 2025-12-14T18:24:45 | Docs | docs | docs/rules/docs-workflow/RULE.md |
| - | 2025-12-14T18:23:46 | Docs | docs | docs/rules/core/RULE.md |
| - | 2025-12-14T18:23:46 | Docs | docs | docs/rules/frontend/RULE.md |
| - | 2025-12-14T18:23:46 | Docs | docs | docs/rules/game-architecture/RULE.md |
| - | 2025-12-14T18:23:46 | Docs | docs | docs/rules/git/RULE.md |
