# Requirements — Results Funcional (EARS)

## Objetivo
Implementar a lógica funcional da tela de Results: exibir resultado da partida (vitória/derrota), estatísticas do match, progressão de XP, recompensas (futuro), e ações pós-partida (Play Again, Main Menu).

## Requirements (EARS)

### Resultado da Partida
- **Quando** a partida terminar, o sistema **deve** transicionar para a fase `RESULTS` com status (vitória/derrota).
- **Se** o player vencer, o sistema **deve** exibir "VICTORY" ou equivalente.
- **Se** o player perder, o sistema **deve** exibir "DEFEAT" ou equivalente.

### Estatísticas do Match
- **Quando** a tela de Results for exibida, o sistema **deve** mostrar as seguintes estatísticas:
  - Total de rodadas jogadas
  - Pílulas escolhidas (total)
  - Dano em Resistência recebido (total)
  - Cura de Resistência recebida (total)
  - Colapsos sofridos (total)
  - Vidas perdidas (total)
  - Oponentes eliminados
- **Enquanto** a tela estiver ativa, as estatísticas **devem** ser lidas do estado do `gameStore`.

### Progressão de XP
- **Quando** a tela de Results for exibida, o sistema **deve** calcular XP ganho baseado em:
  - Vitória: +50 XP base
  - Derrota: +10 XP base
  - Bônus por rodada sobrevivida: +5 XP por rodada
  - Bônus por oponente eliminado: +20 XP por oponente
- **Quando** o XP for calculado, o sistema **deve** animar a barra de XP do player.
- **Se** o player subir de nível durante a animação, o sistema **deve** exibir feedback visual (ex.: "LEVEL UP!").

### Recompensas (Futuro - Placeholder)
- **Quando** a tela de Results for exibida, o sistema **deve** exibir recompensas ganhas (Schmeckles).
- **Se** a vitória for uma Daily Challenge, o sistema **deve** exibir recompensa extra (placeholder por ora).

### Ações Pós-Partida
- **Quando** o player clicar em "Play Again", o sistema **deve** resetar o estado do jogo e transicionar para `LOBBY`.
- **Quando** o player clicar em "Main Menu", o sistema **deve** resetar o estado do jogo e transicionar para `HOME`.
- **Se** o ambiente for multiplayer (futuro), o sistema **deve** exibir botão "Report" (placeholder por ora).

### Persistência de Dados (Futuro - Placeholder)
- **Quando** o XP for calculado, o sistema **deve** salvar o progresso do player (mock por ora).
- **Quando** Schmeckles forem ganhos, o sistema **deve** atualizar o saldo do player (mock por ora).

## Critérios de Aceitação
1. Tela exibe resultado correto (vitória/derrota)
2. Estatísticas do match são exibidas corretamente
3. XP é calculado e animado; level up detectado
4. Botões "Play Again" e "Main Menu" funcionam
5. UI reflete estado atual (stats, XP, recompensas)
6. Nenhum warning/erro no `pnpm lint` e `pnpm build`

## Fora do Escopo (nesta task)
- Recompensas cosméticas (skins, emotes)
- Persistência real (Supabase)
- Daily Challenges completos
- Multiplayer (Report, ranking)
- Animações complexas (apenas feedback básico)
