# IA

## Objetivo
Ser previsível no fácil e estratégica no difícil, mantendo determinismo (mesma entrada -> mesma saída).

## Níveis
- easy (Paciente)
- normal (Cobaia)
- hard (Sobrevivente)
- insane (Hofmann)

## Metas (win rate)
| Dificuldade | Alvo | Faixa aceitável |
|---|---:|---:|
| Easy | 30% | 25–35% |
| Normal | 50% | 45–55% |
| Hard | 70% | 65–75% |
| Insane | 85% | 80–90% |

## Parâmetros recomendados (conceitual)
- riskTolerance: 0.3 / 0.5 / 0.7 / 0.9
- itemUsageProbability: 0.4 / 0.6 / 0.8 / 0.9
- scannerPriority: 0.8 / 0.6 / 0.4 / 0.2
- aggressiveness: 0.2 / 0.4 / 0.7 / 0.9

## Regras
- Decisões determinísticas.
- Ajustar apenas parâmetros e heurísticas, sem "cheats" ocultos.
- Se sair da faixa de win rate: ajustar IA antes de mexer no balance do core.
