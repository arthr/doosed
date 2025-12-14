# Supabase — Edge Functions

## Objetivo
Validar ações e transmitir estado atualizado (server-authoritative).

## Endpoints sugeridos
- match: processa MATCH
- matchmaking/create-lobby: cria sala
- draft-buy: transação de itens

## Regras
- Validar payload (schema)
- Persistir evento
- Broadcast do novo estado
