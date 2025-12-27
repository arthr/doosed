# Eventos (<= 8 tipos)

## Objetivo
Manter o core do jogo **auditável**, **determinístico** e extensível, sem explodir a complexidade.

## Eventos core (8 tipos)
Os eventos abaixo cobrem o espaço de estados do MVP sem redundância:

1. `PLAYER_JOINED` — jogador entrou/foi adicionado à sala
2. `TURN_STARTED` — início de um turno (jogador ativo definido)
3. `ITEM_USED` — item do inventário foi usado (inclui alvo/payload)
4. `PILL_CONSUMED` — uma pílula foi consumida (inclui pillId e jogador)
5. `EFFECT_APPLIED` — efeito resolvido/aplicado (dano/cura/status/modificadores)
6. `COLLAPSE_TRIGGERED` — colapso ocorreu (Resistência ≤ 0 após efeito)
7. `ROUND_COMPLETED` — rodada terminou (pool esgotado) e decisão de próximo passo
8. `MATCH_ENDED` — partida terminou (1 sobrevivente)

## Regras
- Eventos devem ser **imutáveis** e **serializáveis** (JSON-friendly).
- Mesma sequência de eventos deve produzir o mesmo estado final (**determinismo**).
- Eventos devem ser **suficientes para replay** e diagnóstico (incluindo timestamps e IDs).
- Para MVP solo, os eventos podem ser produzidos no client; para multiplayer futuro, a validação passa a ser server-authoritative.
