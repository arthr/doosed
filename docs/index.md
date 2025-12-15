# DOSED Renovada — Documentação

Esta pasta contém a documentação oficial (PT-BR) para iniciar o desenvolvimento greenfield da versão Renovada do DOSED.

## Como ler (ordem recomendada)
- [00-start-here/index.md](00-start-here/index.md)
  - [/dev-workflow.md](00-start-here/dev-workflow.md)
  - [/setup-local.md](00-start-here/setup-local.md)
  - [/estrutura-do-projeto.md](00-start-here/estrutura-do-projeto.md)
- [01-produto/visao-e-pilares.md](01-produto/visao-e-pilares.md)
  - [/modos-de-jogo.md](01-produto/modos-de-jogo.md)
  - [/progressao-meta.md](01-produto/progressao-meta.md)
- [02-gameplay/core-loop.md](02-gameplay/core-loop.md)
  - [/itens-e-loja.md](02-gameplay/itens-e-loja.md)
  - [/balance.md](02-gameplay/balance.md)
  - [/pills.md](02-gameplay/pills.md)
  - [/shapes-e-quests.md](02-gameplay/shapes-e-quests.md)
  - [/mecanicas_e_extras.md](02-gameplay/mecanicas_e_extras.md)
  - [/ai.md](02-gameplay/ai.md)
- [03-ux-ui/design-system.md](03-ux-ui/design-system.md)
  - [/home.md](03-ux-ui/home.md)
  - [/lobby.md](03-ux-ui/lobby.md)
  - [/draft.md](03-ux-ui/draft.md)
  - [/match.md](03-ux-ui/match.md)
  - [/results.md](03-ux-ui/results.md)
- [04-arquitetura/visao-geral.md](04-arquitetura/visao-geral.md)
  - [/maquina-de-estados.md](04-arquitetura/maquina-de-estados.md)
  - [/eventos.md](04-arquitetura/eventos.md)
  - [/replays-e-auditoria.md](04-arquitetura/replays-e-auditoria.md)
  - [/detalhes.md](04-arquitetura/detalhes.md)
- [05-backend-supabase/modelo-de-dados.md](05-backend-supabase/modelo-de-dados.md)
  - [/realtime.md](05-backend-supabase/realtime.md)
  - [/edge-functions.md](05-backend-supabase/edge-functions.md)
  - [/anti-cheat.md](05-backend-supabase/anti-cheat.md)
- [06-frontend/stack-e-convencoes.md](06-frontend/stack-e-convencoes.md)
  - [/state-management.md](06-frontend/state-management.md)
  - [/performance.md](06-frontend/performance.md)
  - [/animacoes-e-feedback.md](06-frontend/animacoes-e-feedback.md)
- [08-roadmap/mvp.md](08-roadmap/mvp.md)
  - [/backlog.md](08-roadmap/backlog.md)

## Decisões normativas (Renovada)
- Inventário padrão: 8 slots (2x4)
- Economia separada:
  - Schmeckles: meta-moeda persistente (cosméticos, daily challenges)
  - Pill Coins/Tokens: moeda de partida (Shape Quests -> Loja)
- Pool de pílulas: baralho (sem reposição) + contadores visíveis (card counting)
- Fases do jogo: LOBBY -> DRAFT -> MATCH -> RESULTS
- Multiplayer: server-authoritative (Edge Functions) + UI otimista com rollback
- Arquitetura: event-driven, determinística, no máximo 8 tipos de eventos

## Nota sobre recência
As fontes foram avaliadas por autoridade + recência (Git + mtime). Veja: [99-apendice/fontes-e-recencia.md](99-apendice/fontes-e-recencia.md)
