# Requirements Quality Checklist: Core Game Mechanics

**Purpose**: Validar qualidade, completude e clareza dos requisitos de mecânicas core do jogo DOSED MVP antes de iniciar implementação (Fase 1: Core Domain Logic).

**Feature**: DOSED MVP - Pill Roulette Game  
**Scope**: Core Game Mechanics (Match/Rodadas/Turnos, Sistema de Saúde, Itens, Status, Quests, Pool, Economy, Bot AI)  
**Created**: 2025-12-25  
**Depth**: Lightweight Pre-Implementation (~25 itens)  
**Coverage**: Primary Flows + Exception/Error Flows + Recovery Paths

---

## Requirement Completeness

### Estrutura de Partida/Rodadas/Turnos

- [ ] CHK001 - São as transições entre Partida → Rodadas → Turnos explicitamente definidas com condições de início e término? [Completeness, Spec §FR-043 to FR-049]

- [ ] CHK002 - São os critérios de avanço de Rodada (pool esgotado + 2+ jogadores vivos) claramente especificados? [Completeness, Spec §FR-045]

- [ ] CHK003 - São as regras de ordem de turnos após eliminações (manter ordem, pular eliminados) definidas sem ambiguidade? [Completeness, Spec §FR-065 to FR-067]

- [ ] CHK004 - São os requisitos de geração aleatória da ordem inicial de turnos (fairness) especificados com critérios de randomização? [Completeness, Spec §FR-048]

### Sistema de Saúde Dupla (Vidas + Resistência)

- [ ] CHK005 - São todos os estados possíveis do sistema de saúde (Vivo, Última Chance, Eliminado) explicitamente definidos com transições? [Completeness, Spec §FR-069, FR-095 to FR-099]

- [ ] CHK006 - São os requisitos de Colapso (trigger, efeitos, feedback) completos incluindo valores de reset de Resistência? [Completeness, Spec §FR-095]

- [ ] CHK007 - São os requisitos de "Última Chance" (0 Vidas mas não eliminado) claramente distinguidos do estado de eliminação? [Completeness, Spec §FR-096 to FR-099]

- [ ] CHK008 - São os requisitos de Resistência extra (overflow positivo) definidos incluindo cap e comportamento de excedente? [Completeness, Spec §FR-070, Edge Cases]

### Itens e Modificadores

- [ ] CHK009 - São os efeitos de TODOS os itens (10 itens: Scanner, Shape Scanner, Inverter, Double, Pocket Pill, Shield, Handcuffs, Force Feed, Shuffle, Discard) especificados com comportamento completo? [Completeness, Spec §FR-021 to FR-042]

- [ ] CHK010 - São as interações entre modificadores de pills (Inverted + Doubled aplicados juntos) claramente definidas? [Completeness, Spec §FR-093]

- [ ] CHK011 - São os requisitos de targeting de itens (self/opponent/pill/shape) especificados incluindo validações de alvo válido? [Completeness, Spec §FR-055 to FR-057]

- [ ] CHK012 - São os requisitos de stackability de itens (limites, comportamento de slot) consistentes entre Draft e inventário? [Completeness, Spec §FR-013, FR-152]

### Status Ativos

- [ ] CHK013 - São os requisitos de duração de Status (baseada em Rodadas, não turnos) claramente especificados para Shielded e Handcuffed? [Completeness, Spec §FR-082 to FR-088]

- [ ] CHK014 - São as regras de stackability de Status (múltiplos Handcuffs = múltiplos turnos pulados) definidas sem ambiguidade? [Completeness, Spec §FR-088]

- [ ] CHK015 - São os requisitos de interação entre Status e efeitos (Shield bloqueia dano mas não cura) especificados completamente? [Completeness, Spec §FR-083, FR-084, FR-094]

### Shape Quests & Pill Coins

- [ ] CHK016 - São os requisitos de geração de Shape Quest (baseada em pool atual, sempre viável) especificados com algoritmo de validação? [Completeness, Spec §FR-128 to FR-130]

- [ ] CHK017 - São os requisitos de reset de progresso de Quest (ao errar shape OU ao iniciar nova Rodada) claramente definidos? [Completeness, Spec §FR-131, FR-135]

- [ ] CHK018 - São os requisitos de persistência de Pill Coins (acumula entre Rodadas, reseta entre Partidas) especificados sem ambiguidade? [Completeness, Spec §FR-126, FR-127]

---

## Requirement Clarity

### Pool de Pílulas

- [ ] CHK019 - É a distribuição progressiva de tipos de pills por Rodada quantificada com percentuais inicial e final específicos? [Clarity, Spec §FR-171]

- [ ] CHK020 - É o conceito de "diversidade mínima de shapes" (pelo menos 3 diferentes) claramente definido como critério de validação do pool? [Clarity, Spec §FR-177]

- [ ] CHK021 - São as fórmulas de tamanho de pool (base 6, +1 a cada 3 Rodadas, cap 12) explicitamente especificadas? [Clarity, Spec §FR-172]

### Bot AI Behavior

- [ ] CHK022 - São os critérios de decisão do BOT para cada nível de dificuldade (Easy/Normal/Hard/Insane) mensuráveis ou observáveis? [Clarity, Spec §FR-115 to FR-118]

- [ ] CHK023 - É o termo "comportamento razoável" do BOT (FR-007) quantificado com critérios objetivos de validação? [Ambiguity, Spec §FR-007]

- [ ] CHK024 - São as regras de adaptação de agressividade do BOT por fase do jogo (early/mid/late) claramente definidas? [Clarity, Spec §FR-119]

---

## Requirement Consistency

### Timer Management

- [ ] CHK025 - São os requisitos de timer de Turno (30s), Draft (60s) e Shopping (30s) consistentes com comportamentos de timeout especificados? [Consistency, Spec §FR-008, FR-062, FR-142]

- [ ] CHK026 - São os requisitos de consumo automático de pill ao timeout do Turno (pill aleatória) consistentes com a lógica de finalização de turno? [Consistency, Spec §FR-061, FR-063]

### Economia e Loja

- [ ] CHK027 - São os requisitos de saldo inicial de Pill Coins (100) consistentes entre Draft (FR-009) e Partida (FR-125)? [Consistency, Spec §FR-009, FR-125]

- [ ] CHK028 - São os requisitos de disponibilidade de itens (DRAFT/MATCH/AMBOS) consistentes entre catálogo Draft e Pill Store? [Consistency, Spec §FR-010, FR-151]

---

## Scenario Coverage (Primary + Exception + Recovery)

### Primary Flows

- [ ] CHK029 - São os requisitos do fluxo primário (Home → Lobby → Draft → Match → Results) completos sem gaps de transição? [Coverage, Spec §FR-002]

### Exception/Error Flows

- [ ] CHK030 - São os requisitos de comportamento quando timer de Turno expira sem ação do jogador especificados? [Coverage, Exception Flow, Spec §FR-063, Edge Cases]

- [ ] CHK031 - São os requisitos de comportamento quando BOT falha múltiplas vezes (3+ timeouts) definidos? [Coverage, Exception Flow, Edge Cases]

- [ ] CHK032 - São os requisitos para cenário de pool com todas pills do mesmo tipo (raro mas possível) especificados? [Coverage, Edge Case, Edge Cases]

### Recovery Paths

- [ ] CHK033 - São os requisitos de recovery quando jogador perde conexão durante Draft/Match definidos? [Gap, Recovery Flow, Edge Cases]

- [ ] CHK034 - São os requisitos de estado quando validação de state corruption é detectada especificados (recovery automático vs fallback)? [Gap, Recovery Flow, Edge Cases]

---

## Measurability & Acceptance Criteria

### Quantifiable Requirements

- [ ] CHK035 - Podem os requisitos de progressão de dificuldade de Shape Quest (2-5 shapes, multiplicadores 1.0x/1.5x/2.0x) ser objetivamente testados? [Measurability, Spec §FR-136]

- [ ] CHK036 - Podem os requisitos de distribuição de pool (±5% da configurada) ser validados com testes automatizados? [Measurability, Success Criteria §SC-016]

- [ ] CHK037 - São os requisitos de "decisões razoáveis" do BOT traduzidos em critérios mensuráveis (ex: taxa de ações inválidas = 0%)? [Measurability, Spec §FR-007, SC-007]

---

## Ambiguities & Conflicts

### Potential Conflicts

- [ ] CHK038 - Há conflito entre requisitos de "fluxo contínuo sem barreiras" (FR-058) e "targeting bloqueia pool" (FR-056)? Os requisitos clarificam quando bloquear vs quando permitir? [Conflict, Spec §FR-056, FR-058]

- [ ] CHK039 - Há ambiguidade sobre quando Status é removido: "no INÍCIO de cada Rodada" (FR-086) vs comportamento durante turno do jogador? [Ambiguity, Spec §FR-086]

### Missing Definitions

- [ ] CHK040 - É o termo "pill aleatória" (FR-063 timeout) definido com critério de seleção (uniforme? ponderado? excluir reveladas?)? [Gap, Spec §FR-063]

- [ ] CHK041 - São os critérios de "viabilidade" de Shape Quest (FR-130) claramente definidos (algoritmo de validação específico)? [Clarity, Spec §FR-130]

---

## Edge Cases & Boundary Conditions

### Boundary Validations

- [ ] CHK042 - São os requisitos de bounds de Resistência (pode ser negativo? limite inferior?) explicitamente definidos? [Gap, Edge Case, Spec §FR-069]

- [ ] CHK043 - São os requisitos de comportamento quando Shape Quest tem sequência impossível (pool muda durante rodada por Discard) especificados? [Gap, Edge Case]

- [ ] CHK044 - São os requisitos de comportamento quando todos os jogadores sinalizaram loja mas NENHUM tem Pill Coins > 0 claramente definidos? [Coverage, Edge Case, Spec §FR-108]

---

## Dependencies & Assumptions

### External Dependencies

- [ ] CHK045 - São os requisitos de persistência (localStorage) incluindo schema de dados e validação ao carregar especificados? [Dependency, Spec §FR-165 to FR-167]

- [ ] CHK046 - São as assumptions de configurações centralizadas (todos os valores de balance configuráveis) validadas e documentadas? [Assumption, Spec §FR-182]

---

## Summary

**Total Items**: 46  
**Categories Covered**: 9  
**Traceability**: 95% (44/46 items have spec references)

**Focus Areas**:
- Core Game Mechanics (Match/Rodadas/Turnos estrutura)
- Sistema de Saúde Dupla (Vidas/Resistência/Colapso/Última Chance)
- Itens, Modificadores e Status
- Shape Quests e Pill Coins
- Pool generation e distribuição
- Bot AI behavior
- Timer management
- Exception/Error/Recovery flows

**Next Actions**:
1. Revisar checklist item por item
2. Marcar [x] itens onde requisitos estão claros e completos
3. Para itens não marcados: adicionar clarificações necessárias no spec ou plan
4. Quando ≥80% dos itens estiverem marcados [x], requisitos estão prontos para Fase 1 (Core Logic Implementation)

**Recommended Threshold**: ≥37/46 items (80%) devem estar [x] antes de iniciar implementação.

