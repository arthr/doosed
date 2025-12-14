# Pílulas

## Princípio
O pool é um **baralho (sampling sem reposição)**. A HUD mostra **contadores por tipo** (card counting é parte da estratégia).

## Tipos (base)
- SAFE
- DMG_LOW
- DMG_HIGH
- HEAL
- FATAL
- LIFE

## Mapeamento de fantasia (opcional)
- "Placebo" = SAFE (e/ou pílulas sem dano)
- "Live" = DMG_* e FATAL (pílulas com dano/eliminações)

## Progressão por rodada (normativa)
As porcentagens são normalizadas por rodada (não absolutas). Valores alvo:

```ts
// PROGRESSION (conceitual)
SAFE:     unlock 1, start 45%, end 15%
DMG_LOW:  unlock 1, start 40%, end 20%
DMG_HIGH: unlock 3, start 15%, end 25%
HEAL:     unlock 2, start 10%, end 15%
FATAL:    unlock 6, start  5%, end 18%
LIFE:     unlock 5, start  6%, end 13%
```

### Guardrails
- SAFE precisa começar alto (tutorial/onboarding).
- FATAL não entra cedo (ideal: apenas a partir da rodada 6).

## Escala do pool (tamanho do baralho)
```ts
// getPillCount(round) (conceitual)
baseCount=6
increaseBy=1
frequency=3
maxCap=12

count = min(baseCount + floor((round-1)/frequency)*increaseBy, maxCap)
```

## Invariantes
- Pool cap fixo (ex.: 12).
- Distribuição proporcional/normalizada.
- Sem RNG puro sem reposição (não usar "sorteio com reposição" no core loop).
