# Máquina de estados

## Fases (alto nível)
- LOBBY → DRAFT → MATCH → SHOPPING → RESULTS

> Nota: a **Home** (ex.: `HomeScreen`) é uma Screen **fora** da máquina de estados de Phases.
> A FSM de Phases começa quando o jogador entra no fluxo do jogo (ex.: criar/entrar em sala).

## Estado do App (alto nível)
Antes da FSM completa, o app deve ter um estado mínimo para evitar misturar Home com Phases:
- `AppScreen=HOME`: renderiza `HomeScreen`
- `AppScreen=GAME`: renderiza Screen derivada da Phase (`LOBBY/DRAFT/MATCH/SHOPPING/RESULTS`)

## Subestados sugeridos
- MATCH: idle -> itemUsage -> revealing -> feedback

## Regras
- Sem booleans soltas.
- Transições apenas por eventos.

## Transições (resumo)
- LOBBY → DRAFT: iniciar partida
- DRAFT → MATCH: confirmar draft ou timer expirar
- MATCH → SHOPPING: ao fim da rodada, se alguém sinalizou loja e tem coins
- MATCH → MATCH: ao fim da rodada, se ninguém qualifica para SHOPPING (nova rodada direto)
- MATCH → RESULTS: quando restar apenas 1 sobrevivente
- SHOPPING → MATCH: após compras (ou timeout), iniciar próxima rodada
- RESULTS → LOBBY: jogar novamente
