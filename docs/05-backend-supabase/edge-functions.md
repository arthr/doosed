# Supabase — Edge Functions

## Objetivo
Validar ações e transmitir estado atualizado (server-authoritative).

## Endpoints sugeridos
- match-action: processa ações/turnos (MATCH)
- create-match: inicializa sala/partida

## Regras
- Validar payload (schema)
- Persistir evento
- Broadcast do novo estado
