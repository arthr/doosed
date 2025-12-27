# Start Here (Solo Dev)

## Objetivo
Permitir que 1 dev (modo solo) consiga:
- rodar o projeto localmente
- entender as regras do jogo e os contratos
- evoluir features sem introduzir dívida técnica

## Princípios (modo Solo Development)
- Evitar “plataformas” e over-engineering: priorizar vertical slice.
- Documentar decisões (por quê) antes de expandir escopo.
- Fazer features que fecham loop de valor: jogar -> ganhar -> progredir -> retornar.

## O que é o DOSED (MVP)
- Fluxo jogável (vertical slice): **Home → Lobby (solo) → Draft → Partida vs IA → Results**
- Phases do jogo (dentro de `GAME`): **LOBBY → DRAFT → MATCH → SHOPPING → RESULTS**
  - **Home** é uma Screen fora das Phases (entrada/menú)
- Inventário: **5 slots**
- Economia:
  - **Pill Coins**: moeda da partida (começa em 100, acumula entre rodadas, reseta a cada nova partida)
  - **Schmeckles**: meta-moeda persistente (progressão)
- Multiplayer (futuro): preparado para server-authoritative (Edge Functions)
- UI/UX: React + Tailwind (foco em clareza e feedback rápido, sem over-engineering)

## Links rápidos
- Setup local: setup-local.md
- Workflow: dev-workflow.md
- Estrutura do projeto (target): estrutura-do-projeto.md
- Glossário e terminologia: [dosed-game.md (seção Glossário)](../dosed-game.md#glossário)
