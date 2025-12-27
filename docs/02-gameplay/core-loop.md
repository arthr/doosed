# Core loop e fases

## Fases
- LOBBY: configurar sala/jogadores/bots
- DRAFT: selecionar/comprar loadout sob timer
- MATCH: gameplay por turnos (itens + consumo) + contadores sempre visíveis
- SHOPPING: fase de compras **entre rodadas** (ativada por Shop Signal durante a rodada)
- RESULTS: stats, XP, rematch

## Sistema de saúde (Saúde Dupla)

### Conceitos
- **Vidas (Lives)**: contador discreto de sobrevivência.
- **Última Chance**: ao chegar em **0 Vidas**, o jogador **não é eliminado imediatamente** — continua vivo com Resistência resetada.
- **Eliminação**: ocorre apenas quando a Resistência zera novamente **já estando em 0 Vidas**.
- **Resistência (Resistance)**: escudo numérico que absorve dano (e pode ser curado).
- **Resistência extra (Over-resistance)**: segunda camada acima da Resistência máxima, obtida por **Overflow positivo**.

### Colapso (normativo)
- **Quando** a Resistência chegar a **≤ 0** após a resolução de um efeito, o jogador sofre **Colapso**:
  - **Vidas -= 1**
  - **Resistência é restaurada ao máximo automaticamente**
  - O jogo continua imediatamente (**sem perder turno**)
- **Se** após o Colapso as Vidas ficarem em **0**, o jogador entra em **Última Chance** (ainda vivo).

### Modificadores (conceituais)
- **Overflow positivo**: cura excedente acima da Resistência máxima vira **Resistência extra** (segunda camada acima da Resistência padrão).
- **Overflow (negativo)**: pode existir como extensão futura (cascata de Colapsos em um único efeito). Não é requisito do MVP.
- **Piercing**: pode existir como extensão futura (dano direto em Vida). Não é requisito do MVP.

## Loop de turno (MATCH)
- (Opcional) usar item
- escolher pílula
- revelar e aplicar efeitos
- resolver colapsos/eliminações
- passar turno

## Contratos de estado
- Estado deve ser determinístico e serializável.
- Transições são guiadas por eventos (<= 8 tipos).
