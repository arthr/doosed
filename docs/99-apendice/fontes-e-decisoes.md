# Fontes e decisões

Este apêndice registra decisões arquiteturais e de design do projeto, com justificativas curtas para manter consistência ao longo do tempo.

## Decisões principais

### Inventário: 5 slots
- Motivo: forçar trade-offs reais no Draft e durante a partida (decisão estratégica, não “coleção de tudo”).
- Impacto: balance de itens/stackability e clareza de UI.

### Economia separada
- **Schmeckles**: meta-moeda persistente (progressão).
- **Pill Coins**: economia da partida (Draft + Partida + Shopping). Começa em 100, acumula entre rodadas e reseta a cada nova partida.
- Motivo: escolhas econômicas multi-fase sem misturar com progressão persistente.

### Multiplayer server-authoritative
- Motivo: reduzir cheating e manter integridade competitiva.
- UX: UI otimista para manter game feel.

### Pool como baralho (sem reposição)
- Motivo: habilitar estratégia via contagem e reduzir “RNG injusto”.

### Fases do jogo (Phase)
- `LOBBY -> DRAFT -> MATCH -> SHOPPING -> RESULTS` (Home é Screen fora das Phases)

### Eventos core (8 tipos)
- Manter event log reproduzível (determinismo) com um conjunto pequeno de eventos (8) que cobre o MVP.

## Referências
- Para recência (Git + mtime): fontes-e-recencia.md
