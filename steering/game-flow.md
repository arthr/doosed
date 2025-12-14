---
inclusion: always
---

# Game Flow (Fonte Normativa)

Este arquivo define o fluxo do jogo e guardrails arquiteturais. Detalhes estão em `docs/v2/04-arquitetura` e `docs/v2/03-ux-ui`.

## Fases (contrato)
- LOBBY -> DRAFT -> MATCH -> RESULTS

## Loop de turno (MATCH)
- (Opcional) usar item
- escolher pílula
- revelar
- aplicar efeitos
- resolver colapso/eliminações
- próximo turno

## Arquitetura (guardrails)
- Estado imutável
- Processamento determinístico
- Separação: components (UI) -> hooks (bridge) -> store (state) -> core/utils (puro)

## Eventos (<= 8 tipos)
A Renovada trabalha com um conjunto pequeno de tipos de evento (ver `docs/v2/04-arquitetura/eventos.md`).

Recomendação: usar tipos “macro” (ex.: MATCH) e um campo `action`/`subtype` no payload para granularidade sem explodir o enum de tipos.

## Multiplayer
- Diretriz: server-authoritative (Edge Functions) + UI otimista com rollback.
- Sequencing obrigatório para ordenação e deduplicação.

## UX do feedback
- Feedback primário por Game Log e overlays de revelação/efeito.

## Referências
- Eventos: `docs/v2/04-arquitetura/eventos.md`
- FSM: `docs/v2/04-arquitetura/maquina-de-estados.md`
- UX Match: `docs/v2/03-ux-ui/match.md`
