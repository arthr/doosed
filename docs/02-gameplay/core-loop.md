# Core loop e fases

## Fases
- LOBBY: configurar sala/jogadores/bots
- DRAFT: selecionar/comprar loadout sob timer
- MATCH: gameplay por turnos + loja como overlay
- RESULTS: stats, XP, rematch

## Loop de turno (MATCH)
- (Opcional) usar item
- escolher pílula
- revelar e aplicar efeitos
- resolver colapsos/eliminações
- passar turno

## Contratos de estado
- Estado deve ser determinístico e serializável.
- Transições são guiadas por eventos (<= 8 tipos).
