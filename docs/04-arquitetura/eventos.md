# Eventos (<= 8 tipos)

## Objetivo
Simplificar sincronização multiplayer e manter determinismo.

## Tipos iniciais propostos
- LOBBY
- PLAYER
- DRAFT
- ITEM
- MATCH
- QUEST
- RESULTS

## Regras
- Eventos são versionados.
- Payload validado no servidor.
- Sequencing para ordenar e rejeitar duplicados.
