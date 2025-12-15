# Core loop e fases

## Fases
- LOBBY: configurar sala/jogadores/bots
- DRAFT: selecionar/comprar loadout sob timer
- MATCH: gameplay por turnos + loja como overlay
- RESULTS: stats, XP, rematch

## Sistema de saúde (Saúde Dupla)

### Conceitos
- **Vidas (Lives)**: contador discreto de sobrevivência. **0 vidas = eliminado**.
- **Resistência (Resistance)**: escudo numérico que absorve dano (e pode ser curado).
- **Resistência extra (Over-resistance)**: segunda camada acima da Resistência máxima, obtida por **Overflow positivo**.

### Colapso (normativo)
- **Quando** a Resistência chegar a **0** após a resolução de um efeito, o jogador sofre **Colapso**:
  - **Vidas -= 1**
  - **Resistência é restaurada ao máximo automaticamente**
  - O jogo continua imediatamente (**sem perder turno**)
- **Se** as Vidas chegarem a **0**, o jogador é eliminado.

### Modificadores (conceituais)
- **Overflow (negativo)**: permite que um único evento de dano cause **cascata de Colapsos** (dano restante continua após o reset da Resistência).
- **Piercing**: ignora Resistência e causa **perda direta de Vida** (não gera reset de Resistência por Colapso).
- **Overflow positivo**: permite que cura excedente gere **Resistência extra** (acima do máximo), e pode criar cascatas de cura conforme o design do efeito.

## Loop de turno (MATCH)
- (Opcional) usar item
- escolher pílula
- revelar e aplicar efeitos
- resolver colapsos/eliminações
- passar turno

## Contratos de estado
- Estado deve ser determinístico e serializável.
- Transições são guiadas por eventos (<= 8 tipos).
