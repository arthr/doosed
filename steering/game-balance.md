---
inclusion: always
---

# Balance (Fonte Normativa)

Este arquivo é a referência normativa para balance e progressão. Versão detalhada em `docs/02-gameplay/balance.md`.

## Filosofia (não violar)
- Tensão escalonada
- Escolhas significativas
- Comeback potencial
- Estratégia vs sorte: ~70/30

## Metas
- Duração: 8–12 rodadas
- Sucesso em quests: 60–80%
- Sobrevivência late game (rodadas 9+): 15–25% por rodada
- Uso de itens: 2–3 itens/rodada (média)

## Pílulas (progressão alvo)
Regras por rodada (percentuais normalizados):
- SAFE: unlock 1, start 45%, end 15%
- DMG_LOW: unlock 1, start 40%, end 20%
- DMG_HIGH: unlock 3, start 15%, end 25%
- HEAL: unlock 2, start 10%, end 15%
- FATAL: unlock 6, start 5%, end 18%
- LIFE: unlock 5, start 6%, end 13%

Guardrails:
- SAFE precisa começar alto.
- FATAL não entra cedo (ideal: rodada 6+).

## Tamanho do pool
- base 6
- +1 a cada 3 rodadas
- cap 12

## Quests (tamanho)
- early: 2
- mid: 3
- late: 4 e 5 (apenas se manter 60–80% de sucesso)

## IA (metas)
| Dificuldade | Alvo | Faixa |
|---|---:|---:|
| Easy | 30% | 25–35% |
| Normal | 50% | 45–55% |
| Hard | 70% | 65–75% |
| Insane | 85% | 80–90% |

## Risco de mudanças
- Baixo risco: UI, timings, delays
- Médio risco: custos +-1, parâmetros +-0.1
- Alto risco: percentuais >5%, unlocks, fórmula de pool, riskTolerance >0.2

## Referências
- Balance detalhado: `docs/02-gameplay/balance.md`
- Pílulas: `docs/02-gameplay/pills.md`
- IA: `docs/02-gameplay/ai.md`
