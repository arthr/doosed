# UX — Match

## Objetivo
Gameplay por turnos com leitura de contadores e uso de itens.

## Regras
- Destaque claro do turno atual.
- Contadores do pool sempre visíveis.
- Oponentes eliminados ficam “mortos” visualmente.
- Sistema de saúde é **duplo**: Vidas + Resistência (com possível Resistência extra).
- Colapso deve ter feedback visual claro (perda de Vida + reset de Resistência).

## Componentes
- Linha de oponentes
- Máquina central (pool + pílulas)
- HUD do jogador
- Action dock (Shop/Leave) + Game Log/Chat

## Saúde Dupla — UI (normativo)
- **Vidas (Lives)**: exibir como ícones discretos (ex.: corações) e/ou contador numérico.
- **Resistência (Resistance)**: exibir como barra/escudos com valor atual e máximo.
- **Resistência extra (Over-resistance)** (quando existir):
  - deve aparecer como **camada adicional** acima da Resistência padrão (ex.: segmento/barra secundária)
  - deve ser consumida antes da Resistência padrão ao receber dano
- **Colapso**:
  - ao ocorrer, animar/indicar: “COLAPSO”, -1 Vida, e reset imediato da Resistência para o máximo
