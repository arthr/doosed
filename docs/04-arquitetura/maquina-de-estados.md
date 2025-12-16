# Máquina de estados

## Fases (alto nível)
- LOBBY -> DRAFT -> MATCH -> RESULTS

> Nota: a **Home** (ex.: `HomeScreen`) é uma Screen **fora** da máquina de estados de Phases.
> A FSM de Phases começa quando o jogador entra no fluxo do jogo (ex.: criar/entrar em sala).

## Subestados sugeridos
- MATCH: idle -> itemUsage -> revealing -> feedback

## Regras
- Sem booleans soltas.
- Transições apenas por eventos.
