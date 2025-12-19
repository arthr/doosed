---
trigger: always_on
glob:
description: Always apply: arquitetura do jogo (fases, eventos, determinismo, multiplayer)
---

## Contratos do jogo (Renovada)
- Fases: LOBBY -> DRAFT -> MATCH -> RESULTS.
- Pool: baralho (sem reposição) + contadores visíveis.
- Economia: Schmeckles (meta) separado de Pill Coins/Tokens (partida).

## Eventos
- Manter no máximo 8 tipos.
- Preferir tipos “macro” (ex.: MATCH) e granularidade via `action`/`subtype` no payload.
- Processamento determinístico (mesma entrada -> mesma saída).

## Multiplayer
- Diretriz: server-authoritative (Edge Functions) + UI otimista com rollback.
- Sequencing obrigatório (ordenação/deduplicação).

## Referências
- `docs/04-arquitetura/eventos.md`
- `docs/04-arquitetura/maquina-de-estados.md`
- `docs/02-gameplay/`
