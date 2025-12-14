# Fontes e decisões (Renovada)

Este apêndice registra decisões arquiteturais e de design tomadas para a versão Renovada, com justificativas.

## Decisões principais

### Inventário: 8 slots
- Motivo: consistência com UX (telas de draft mostram 8 slots) e mais espaço para builds.
- Impacto: balance/economia e UI (grid 2x4).

### Economia separada
- Schmeckles: meta-progresso (cosméticos, daily challenges).
- Pill Coins/Tokens: economia da partida (Shape Quests -> Loja).
- Motivo: reduzir confusão e permitir tuning independente.

### Multiplayer server-authoritative
- Motivo: reduzir cheating e manter integridade competitiva.
- UX: UI otimista para manter game feel.

### Pool como baralho (sem reposição)
- Motivo: habilitar estratégia via contagem e reduzir “RNG injusto”.

## Referências
- Para recência (Git + mtime): fontes-e-recencia.md
