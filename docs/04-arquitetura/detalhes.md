### Supabase Architecture Strategy

1. **Database Schema (Postgres):**
   - `profiles`: Armazena Schmeckles, XP, Cosméticos desbloqueados (Inventory).
   - `matches`: Estado macro da sala (status, current_turn_index, host_id).
   - `match_states`: Tabela de alta frequência (JSONB) contendo o 'Public Game State' (Health, Itens Visíveis, Pílulas Reveladas).
   - `match_secrets`: (RLS: Ninguém ver exceto Server) Contém a ordem real das pílulas no frasco.

2. **Realtime Strategy (Channels):**
   - Canal `room_X`: Usa 'Broadcast' para movimentos de cursor e emotes (baixa latência, sem persistência).
   - Usa 'Postgres Changes' em `match_states` para atualizações de turno críticas (garantia de entrega).

3. **Edge Functions (Server Authority):**
   - `game-engine`: Endpoint único que recebe Actions (Type: 'CONSUME' | 'USE_ITEM'). Ele valida se o jogador tem o item, processa a lógica RNG no server, atualiza o `match_states` e retorna o resultado.
   - `matchmaking`: Lógica para agrupar jogadores por MMR.