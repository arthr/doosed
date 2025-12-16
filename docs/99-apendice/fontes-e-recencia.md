# Fontes e recencia (Git + mtime)

Este arquivo registra as fontes .md usadas como insumo para a documentação oficial e como o critério de recência foi aplicado.

## Regras de precedencia

- Autoridade por contexto (primario): steering/* e .cursor/rules/* (normativo) > docs/* (documentação oficial). Conteúdo legado fica em docs/legacy/*.

- Recencia (secundario): usar data do ultimo commit (Git) como principal e mtime local como nota; dentro do mesmo nivel de autoridade, o mais recente tem preferencia.

## Tabela (ordenada por Git desc, depois mtime)

| Ultimo_commit_git | mtime_local | Autoridade | Contexto | Arquivo |
|---|---|---|---|---|
| 2025-12-16T00:25:44-03:00 | 2025-12-16T00:17:01 | Docs | docs | docs/06-frontend/stack-e-convencoes.md |
| 2025-12-15T07:24:35-03:00 | 2025-12-15T07:23:55 | Normativo | .cursor/rules | .cursor/rules/task-planning/RULE.md |
| 2025-12-15T07:17:10-03:00 | 2025-12-15T07:19:09 | Requisito | tasks | tasks/task-refac-decomposicao-screens-000/tasks.md |
| 2025-12-15T06:04:58-03:00 | 2025-12-15T05:30:12 | Requisito | tasks | tasks/task-refac-estrutura-screens-000/tasks.md |
| 2025-12-15T05:56:09-03:00 | 2025-12-15T05:57:42 | Requisito | tasks | tasks/task-refac-decomposicao-screens-000/design.md |
| 2025-12-15T05:49:36-03:00 | 2025-12-15T05:36:24 | Requisito | tasks | tasks/task-refac-decomposicao-screens-000/requirements.md |
| 2025-12-15T04:38:51-03:00 | 2025-12-15T04:39:10 | Requisito | tasks | tasks/task-refac-estrutura-screens-000/design.md |
| 2025-12-15T04:38:51-03:00 | 2025-12-15T04:39:10 | Requisito | tasks | tasks/task-refac-estrutura-screens-000/requirements.md |
| 2025-12-15T04:23:57-03:00 | 2025-12-15T04:21:48 | Outro | repo | AGENTS.md |
| 2025-12-15T04:23:57-03:00 | 2025-12-15T04:19:01 | Normativo | .cursor/rules | .cursor/rules/docs-workflow/RULE.md |
| 2025-12-15T04:23:57-03:00 | 2025-12-15T04:18:04 | Normativo | .cursor/rules | .cursor/rules/task-execute/RULE.md |
| 2025-12-15T04:23:57-03:00 | 2025-12-15T00:25:41 | Normativo | .cursor/rules | .cursor/rules/observation-log/RULE.md |
| 2025-12-15T04:23:57-03:00 | 2025-12-15T00:23:20 | Normativo | .cursor/rules | .cursor/rules/code-style/RULE.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Docs | docs | docs/01-produto/visao-e-pilares.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Docs | docs | docs/02-gameplay/core-loop.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Docs | docs | docs/02-gameplay/itens-e-loja.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Docs | docs | docs/02-gameplay/mecanicas_e_extras.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Docs | docs | docs/02-gameplay/pills.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Docs | docs | docs/03-ux-ui/match.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Docs | docs | docs/04-arquitetura/detalhes.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Requisito | tasks | tasks/task-feat-match-core-000/design.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Requisito | tasks | tasks/task-feat-match-core-000/requirements.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Requisito | tasks | tasks/task-feat-match-core-000/tasks.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Requisito | tasks | tasks/task-feat-results-funcional-000/design.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Requisito | tasks | tasks/task-feat-results-funcional-000/requirements.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-15T02:23:48 | Requisito | tasks | tasks/task-feat-results-funcional-000/tasks.md |
| 2025-12-15T02:23:15-03:00 | 2025-12-12T19:34:11 | Legado | docs | docs/legacy/GAME-IDEA.md |
| 2025-12-15T01:53:10-03:00 | 2025-12-15T01:53:48 | Requisito | tasks | tasks/task-feat-draft-funcional-000/design.md |
| 2025-12-15T01:53:10-03:00 | 2025-12-15T01:53:48 | Requisito | tasks | tasks/task-feat-draft-funcional-000/requirements.md |
| 2025-12-15T01:53:10-03:00 | 2025-12-15T01:53:48 | Requisito | tasks | tasks/task-feat-draft-funcional-000/tasks.md |
| 2025-12-15T01:53:10-03:00 | 2025-12-15T01:53:48 | Requisito | tasks | tasks/task-feat-navegacao-000/design.md |
| 2025-12-15T01:53:10-03:00 | 2025-12-15T01:53:48 | Requisito | tasks | tasks/task-feat-navegacao-000/requirements.md |
| 2025-12-15T01:53:10-03:00 | 2025-12-15T01:53:48 | Requisito | tasks | tasks/task-feat-navegacao-000/tasks.md |
| 2025-12-14T23:04:32-03:00 | 2025-12-14T22:50:53 | Docs | docs | docs/index.md |
| 2025-12-14T23:04:32-03:00 | 2025-12-14T22:39:05 | Docs | docs | docs/critica_tecnica.md |
| 2025-12-14T19:29:17-03:00 | 2025-12-14T19:27:26 | Docs | docs | docs/README.md |
| 2025-12-14T19:23:25-03:00 | 2025-12-14T19:20:28 | Docs | docs | docs/00-start-here/index.md |
| 2025-12-14T19:23:25-03:00 | 2025-12-14T19:20:28 | Docs | docs | docs/06-frontend/state-management.md |
| 2025-12-14T19:23:25-03:00 | 2025-12-14T19:20:28 | Docs | docs | docs/99-apendice/fontes-e-decisoes.md |
| 2025-12-14T19:23:25-03:00 | 2025-12-14T19:20:28 | Normativo | steering | steering/structure.md |
| 2025-12-14T19:23:25-03:00 | 2025-12-14T19:14:13 | Docs | docs | docs/00-start-here/estrutura-do-projeto.md |
| 2025-12-14T19:12:28-03:00 | 2025-12-16T00:17:08 | Normativo | steering | steering/tech.md |
| 2025-12-14T19:12:28-03:00 | 2025-12-14T19:11:07 | Normativo | .cursor/rules | .cursor/rules/core/RULE.md |
| 2025-12-14T19:12:28-03:00 | 2025-12-14T19:11:07 | Normativo | .cursor/rules | .cursor/rules/game-architecture/RULE.md |
| 2025-12-14T19:12:28-03:00 | 2025-12-14T19:11:07 | Legado | docs | docs/legacy/generated_docs/structure.md |
| 2025-12-14T19:12:28-03:00 | 2025-12-14T19:11:07 | Normativo | steering | steering/game-balance.md |
| 2025-12-14T19:12:28-03:00 | 2025-12-14T19:11:07 | Normativo | steering | steering/game-flow.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T19:05:54 | Legado | docs | docs/legacy/NOTES.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T19:05:54 | Normativo | steering | steering/product.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T18:34:30 | Docs | docs | docs/05-backend-supabase/edge-functions.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T18:34:30 | Legado | docs | docs/legacy/generated_docs/relatorio_completo.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T18:23:46 | Normativo | .cursor/rules | .cursor/rules/frontend/RULE.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T18:23:46 | Normativo | .cursor/rules | .cursor/rules/git/RULE.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T18:01:24 | Docs | docs | docs/02-gameplay/shapes-e-quests.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T18:00:54 | Docs | docs | docs/02-gameplay/balance.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T18:00:52 | Docs | docs | docs/02-gameplay/ai.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T17:21:10 | Docs | docs | docs/08-roadmap/mvp.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T17:19:30 | Docs | docs | docs/06-frontend/animacoes-e-feedback.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T17:16:11 | Docs | docs | docs/04-arquitetura/eventos.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T17:11:32 | Docs | docs | docs/03-ux-ui/home.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T17:10:42 | Docs | docs | docs/03-ux-ui/draft.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T17:09:33 | Docs | docs | docs/03-ux-ui/design-system.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:59:34 | Docs | docs | docs/01-produto/progressao-meta.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/00-start-here/dev-workflow.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/00-start-here/setup-local.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/01-produto/modos-de-jogo.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/03-ux-ui/lobby.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/03-ux-ui/results.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/04-arquitetura/maquina-de-estados.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/04-arquitetura/replays-e-auditoria.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/04-arquitetura/visao-geral.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/05-backend-supabase/anti-cheat.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/05-backend-supabase/modelo-de-dados.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/05-backend-supabase/realtime.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/06-frontend/performance.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/07-qualidade/observabilidade.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/07-qualidade/testing.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/08-roadmap/backlog.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T16:58:54 | Docs | docs | docs/99-apendice/prompts-assets.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T14:53:11 | Legado | docs | docs/legacy/generated_docs/codigo_exemplo.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T14:53:02 | Legado | docs | docs/legacy/generated_docs/product.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-14T14:53:02 | Legado | docs | docs/legacy/generated_docs/tech-stack.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-13T20:33:30 | Legado | docs | docs/legacy/screens/home.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-13T20:33:30 | Legado | docs | docs/legacy/screens/lobby.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-13T20:33:30 | Legado | docs | docs/legacy/screens/match.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-13T20:33:30 | Legado | docs | docs/legacy/screens/results.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-13T20:33:29 | Legado | PROMPT-* | docs/legacy/prompts/PROMPT-ASSETS.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-13T20:33:29 | Legado | PROMPT-* | docs/legacy/prompts/PROMPT-PILLS.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-13T20:33:29 | Legado | PROMPT-* | docs/legacy/prompts/PROMPT-SCREENS-UI.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-13T20:33:29 | Legado | docs | docs/legacy/screens/draft.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-13T13:55:23 | Legado | PROMPT-* | docs/legacy/prompts/PROMPT-UI-MOBILE.md |
| 2025-12-14T19:04:53-03:00 | 2025-12-13T13:55:23 | Legado | PROMPT-* | docs/legacy/prompts/PROMPT-UI.md |
