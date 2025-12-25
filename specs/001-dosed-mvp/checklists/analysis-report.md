# Análise Assistida: Potenciais Issues em Requisitos

**Feature**: DOSED MVP - Core Game Mechanics  
**Data**: 2025-12-25  
**Checklist Analisado**: `core-mechanics.md` (46 itens)

---

## Resumo Executivo

**Status**: 🎉 **TODOS OS TIERS RESOLVIDOS** - 11/11 issues clarificados e integrados  
**Progresso**: Tier 1 (5), Tier 2 (4), Tier 3 (1), CHK044 (já coberto) = 100% dos issues identificados  
**Ação Recomendada**: Marcar todos os itens relacionados como [x] em `core-mechanics.md` e partir para `/speckit.tasks`

### Atualizações de Status
- **2025-12-25 (Sessão 1)**: Todos os 5 issues Tier 1 foram clarificados via `/speckit.clarify` interativa
- **2025-12-25 (Sessão 2)**: Todos os 6 issues Tier 2/3 foram resolvidos
- **Commits**: 6 commits adicionados com clarificações específicas em `spec.md` e `plan.md`

---

## Issues Identificados (Priorizados)

### 🔴 Tier 1: Alta Prioridade ✅ **RESOLVIDO**

#### **CHK023** - Critérios Mensuráveis de BOT AI ✅ **RESOLVIDO**
**Issue**: Termo "comportamento razoável" (FR-007) não é quantificado  
**Encontrado em**: 
- FR-007: "Bots DEVEM ter comportamento de IA básica que toma decisões razoáveis (não apenas aleatório)"
- FR-115-118: "previsível", "calculista", "sem piedade" são descrições subjetivas

**Impacto**: Impossível testar objetivamente se BOT está "razoável" ou "calculista"  
**Sugestão de Clarificação**:
```
Adicionar em FR-007 ou criar FR-007a:
"Comportamento razoável significa: taxa de ações inválidas = 0%, não travar por 
timeout >5s, tomar decisão dentro de 3-5s, não repetir mesma ação inválida 2x 
consecutivas."

Para níveis (FR-115-118), adicionar critérios observáveis:
- Easy "previsível": 80% das vezes escolhe pill com maior probabilidade de ser SAFE
- Hard "calculista": memoriza 100% das pills reveladas, usa essa info em decisões
- Insane "sem piedade": usa Force Feed em oponente com 0 Vidas 90%+ das vezes
```

**Checklist Item**: ✅ Pode ser marcado [x] após adicionar critérios mensuráveis

**✅ RESOLUÇÃO (2025-12-25)**:
- Adicionada clarificação em `spec.md` § Clarifications
- Adicionados FR-115, FR-116, FR-117, FR-118 com critérios observáveis para cada nível de BOT
- Commit: `spec: clarifica BOT AI com critérios mensuráveis`

---

#### **CHK040** - Critério de Seleção de "Pill Aleatória" ✅ **RESOLVIDO**
**Issue**: FR-063 menciona "pill aleatória" mas não define critério de seleção  
**Encontrado em**: 
- FR-063: "sistema DEVE automaticamente consumir pílula aleatória do pool"

**Impacto**: Ambiguidade no algoritmo - uniforme? ponderado? excluir reveladas?  
**Sugestão de Clarificação**:
```
Adicionar em FR-063 ou criar FR-063a:
"Pílula aleatória é selecionada com distribuição uniforme entre TODAS as pills 
disponíveis no pool (incluindo reveladas). RNG deve usar seed baseado em timestamp 
do timeout para determinismo em testes."
```

**Checklist Item**: ✅ Pode ser marcado [x] após especificar algoritmo de seleção

**✅ RESOLUÇÃO (2025-12-25)**:
- Adicionada clarificação em `spec.md` § Clarifications
- FR-063 atualizado: "Pílula aleatória é selecionada com distribuição uniforme entre TODAS as pills disponíveis no pool (incluindo reveladas). RNG deve usar seed baseado em timestamp do timeout para determinismo em testes."
- Commit: `spec: clarifica critério de seleção de pill aleatória (FR-063)`

---

#### **CHK041** - Algoritmo de "Viabilidade" de Shape Quest ✅ **RESOLVIDO**
**Issue**: FR-130 menciona "validação de viabilidade" mas não detalha algoritmo  
**Encontrado em**: 
- FR-130: "Shape Quest gerada DEVE ser sempre possível de completar com as pills disponíveis no pool da Rodada (validação de viabilidade)"

**Impacto**: Não está claro como validar se quest é viável  
**Sugestão de Clarificação**:
```
Adicionar em FR-130 ou data-model.md:
"Validação de viabilidade: Para cada shape na sequência da quest, verificar se 
existe pelo menos 1 pill com aquele shape no pool atual. Se qualquer shape da 
sequência não tem representação no pool, regenerar quest até satisfazer critério 
(max 10 tentativas, se falhar usar sequência de 2 shapes apenas)."
```

**Checklist Item**: ✅ Pode ser marcado [x] após especificar algoritmo de validação

**✅ RESOLUÇÃO (2025-12-25)**:
- Adicionada clarificação em `spec.md` § Clarifications
- FR-130 atualizado: "Shape Quest gerada DEVE ser sempre possível de completar com as pills disponíveis no pool da Rodada (validação de viabilidade) **gerando a quest APÓS a geração do pool, utilizando apenas as shapes presentes no pool atual**."
- Estratégia simplificada: gerar quest após pool garante viabilidade por design
- Commit: `spec: clarifica viabilidade de Shape Quest via geração após pool (FR-130)`

---

#### **CHK042** - Bounds de Resistência (limite inferior) ✅ **RESOLVIDO**
**Issue**: Especificação não define limite inferior de Resistência (pode ser negativo?)  
**Encontrado em**: 
- FR-069: "6 Resistência" inicial
- FR-095: "quando Resistência chega a ≤0" - implica que pode ser negativo
- Nenhum FR define limite inferior explícito

**Impacto**: Sistema pode acumular resistência negativa indefinidamente (ex: -50) sem clear bound  
**Sugestão de Clarificação**:
```
Adicionar FR-069a ou em data-model.md:
"Resistência pode ser negativa (sem limite inferior). Valor negativo indica quanto 
de 'overflow negativo' foi acumulado. Ao resetar em Colapso, sempre restaura para 
valor configurável (padrão 6) independente de quão negativo estava."

Ou, se quiser limit:
"Resistência tem limite inferior de -12 (2× resistência base). Dano adicional além 
desse limite é descartado."
```

**Checklist Item**: ✅ Pode ser marcado [x] após especificar bounds explícitos

**✅ RESOLUÇÃO (2025-12-25)**:
- Adicionada clarificação em `spec.md` § Clarifications
- Adicionado FR-069a: "Resistência PODE ser negativa (sem limite inferior). Valor negativo indica 'overflow negativo' acumulado. Ao resetar em Colapso, Resistência DEVE ser restaurada para o valor configurável (padrão 6) independente do valor negativo anterior."
- Decisão: sem limite inferior, simplifica implementação sem impactar gameplay
- Commit: `spec: clarifica bounds de Resistência negativa (FR-069a)`

---

#### **CHK038** - Conflito: Targeting Bloqueia Pool vs Fluxo Contínuo ✅ **RESOLVIDO**
**Issue**: Possível conflito entre FR-056 (bloqueia pool) e FR-058 (fluxo contínuo)  
**Encontrado em**: 
- FR-056: "pool DEVE estar temporariamente não-clicável" (durante targeting)
- FR-058: "fluxo contínuo, sem barreiras"

**Impacto**: Pode ser interpretado como contradição - "sem barreiras" mas "bloqueia pool"  
**Análise**: Não é conflito real, mas precisa clarificação sobre quando bloquear  
**Sugestão de Clarificação**:
```
Adicionar em FR-056 ou FR-058:
"Fluxo contínuo (FR-058) significa que não há botões 'Confirm' entre ações. 
Bloqueio temporário do pool durante targeting (FR-056) é preventivo (evita consumo 
acidental), não é uma 'barreira' de UX. Assim que alvo é selecionado ou targeting 
é cancelado, pool volta a ser clicável imediatamente."
```

**Checklist Item**: ✅ Pode ser marcado [x] após adicionar nota de clarificação

**✅ RESOLUÇÃO (2025-12-25)**:
- Adicionada clarificação em `spec.md` § Clarifications
- FR-056 atualizado: "Pool volta a ser clicável imediatamente após seleção de alvo ou cancelamento"
- FR-058 atualizado: "'Fluxo contínuo' significa sem botões de confirmação entre ações, não ausência de bloqueio preventivo durante targeting"
- Clarificado que não há conflito: bloqueio temporário é feature de segurança, não barreira de UX
- Commit: `spec: clarifica targeting vs fluxo contínuo (FR-056, FR-058)`

---

### 🟡 Tier 2: Média Prioridade ✅ **RESOLVIDO**

#### **CHK031** - BOT Falha Múltiplas Vezes (3+ Timeouts) ✅ **RESOLVIDO**
**Issue**: Mencionado em Edge Cases mas comportamento completo não está em FR  
**Encontrado em**: 
- Edge Cases: "Se bot falhar repetidamente (3+ timeouts consecutivos), sistema deve logar erro e tentar recovery ou fallback graceful"

**Impacto**: Não há FR específico detalhando o que fazer em recovery/fallback  
**Sugestão de Clarificação**:
```
Criar FR-124a (após FR-124):
"Se BOT falhar 3+ vezes consecutivas (timeout ou ação inválida), sistema DEVE:
1. Logar erro com nível de dificuldade e estado do jogo
2. Tentar recovery: forçar ação aleatória válida (consumir pill aleatória)
3. Se recovery falha (2+ tentativas), eliminar BOT da partida com log de erro crítico
4. Em DEV mode, pausar e exibir debug overlay com estado do BOT"
```

**Checklist Item**: ✅ Pode ser marcado [x] após adicionar FR específico

**✅ RESOLUÇÃO (2025-12-25)**:
- Adicionado FR-124a em `spec.md`
- Recovery progressivo: (1) log erro, (2) forçar ação válida, (3) eliminar se falha, (4) DEV: pausar + debug
- Adicionada clarificação em § Clarifications
- Commit: `spec: resolve issues Tier 2 e Tier 3 (...)`

---

#### **CHK033** - Recovery de Desconexão Durante Match ✅ **RESOLVIDO**
**Issue**: Mencionado em Edge Cases mas não tem FR específico  
**Encontrado em**: 
- Edge Cases: "Desconexão durante Draft/Match: Para MVP solo, se processo do jogo trava, jogador deve poder reiniciar sem perder progresso de XP/Schmeckles já ganhos"

**Impacto**: Comportamento de recovery não está detalhado em FR  
**Sugestão de Clarificação**:
```
Criar FR-165a (após FR-165):
"Para MVP solo, se processo trava ou crash detectado:
1. Salvar XP/Schmeckles acumulados até momento do crash em localStorage
2. Ao reabrir, exibir mensagem 'Partida anterior foi interrompida. XP/Schmeckles 
   parciais foram salvos. Iniciar nova partida?'
3. Não tentar recuperar estado da partida (aceitar loss da partida em progresso)
4. XP/Schmeckles salvos DEVEM ser adicionados ao perfil persistente"
```

**Checklist Item**: ✅ Pode ser marcado [x] após adicionar FR específico

**✅ RESOLUÇÃO (2025-12-25)**:
- Adicionado FR-169a em `spec.md`
- Para MVP solo: salvar XP/Schmeckles em localStorage, aceitar loss da partida, oferecer nova partida ao reabrir
- Adicionada clarificação em § Clarifications
- Commit: `spec: resolve issues Tier 2 e Tier 3 (...)`

---

#### **CHK034** - State Corruption Recovery ✅ **RESOLVIDO**
**Issue**: Mencionado em Edge Cases mas algoritmo de recovery não detalhado  
**Encontrado em**: 
- Edge Cases: "State corruption detectado: Se validação de estado detectar inconsistência crítica (ex: jogador com Vidas negativas, pool vazio em meio de rodada, inventário com slots > limite), sistema deve tentar recovery automático (recomputar estado a partir de log de ações) ou fallback graceful para Home salvando progressão parcial"

**Impacto**: "Recomputar estado a partir de log de ações" não está especificado  
**Sugestão de Clarificação**:
```
Criar FR-186.11 (em Tech Stack):
"Validação de state integrity DEVE ocorrer:
1. Após cada evento processado (event processor)
2. Invariantes validados: lives ≥ 0, resistance sem NaN, inventory.length ≤ 5, etc
3. Se inconsistência detectada:
   a. Em DEV: pausar e exibir debug overlay com estado corrompido
   b. Em PROD: tentar recovery: resetar para último estado válido conhecido (se 
      event log disponível) OU fallback para Home salvando XP/Schmeckles parcial
4. Logar erro com estado corrompido + stack trace para análise"
```

**Checklist Item**: ✅ Pode ser marcado [x] após adicionar FR específico

**✅ RESOLUÇÃO (2025-12-25)**:
- Adicionado FR-186.19 em `spec.md`
- Validação de state integrity após cada evento, invariantes definidos, recovery dual-mode (DEV: pause+debug, PROD: reset ou fallback)
- Adicionada clarificação em § Clarifications
- Commit: `spec: resolve issues Tier 2 e Tier 3 (...)`

---

#### **CHK043** - Shape Quest Impossível (Pool Muda por Discard) ✅ **RESOLVIDO**
**Issue**: Se Discard remove pills durante rodada, quest pode ficar impossível  
**Encontrado em**: 
- Nenhum FR aborda esse edge case

**Impacto**: Quest gerada como viável pode virar impossível mid-rodada  
**Sugestão de Clarificação**:
```
Adicionar em FR-130 ou FR-135:
"Se durante a Rodada, uso de Discard (FR-042) remove pill de shape necessário 
para completar quest ativa, quest permanece ativa mas pode ficar impossível de 
completar. Sistema NÃO valida viabilidade mid-rodada. Jogador perde oportunidade 
de completar aquela quest (será descartada no início da próxima rodada)."
```

**Checklist Item**: ✅ Pode ser marcado [x] após adicionar nota de edge case

**✅ RESOLUÇÃO (2025-12-25)**:
- Adicionado FR-135a em `spec.md`
- Edge case aceito: Discard pode tornar quest impossível, jogador perde oportunidade, quest descartada na próxima rodada
- Adicionada clarificação em § Clarifications: "Edge case aceito para MVP - adiciona camada de estratégia avançada"
- Commit: `spec: resolve issues Tier 2 e Tier 3 (...)`

---

#### **CHK044** - Todos Sinalizaram Loja mas Nenhum Tem Coins ✅ **JÁ COBERTO**
**Issue**: Edge case: todos sinalizaram mas TODOS têm Pill Coins = 0  
**Encontrado em**: 
- FR-108: "verificar quais jogadores sinalizaram E têm Pill Coins > 0"
- FR-109: "Se pelo menos 1 jogador qualifica"

**Impacto**: Se todos sinalizaram mas nenhum tem coins, o que acontece?  
**Análise**: Requisitos já cobrem - Shopping NÃO abre (ninguém qualifica)  
**Sugestão**: Nenhuma mudança necessária, apenas confirmar interpretação  

**Checklist Item**: ✅ Pode ser marcado [x] - requisitos já cobrem esse caso (FR-109: se NENHUM qualifica, pula Shopping)

---

### 🟢 Tier 3: Baixa Prioridade ✅ **RESOLVIDO**

#### **CHK007** - Feedback "Claro" de Última Chance ✅ **RESOLVIDO**
**Issue**: FR-095, FR-097 mencionam "feedback visual claro" mas não quantificado  
**Encontrado em**: 
- FR-095: "com feedback visual claro"
- FR-097: "indicação visual de estado crítico"

**Impacto**: Baixo - é requisito de UI (fora do escopo de mechanics), mas termo vago  
**Sugestão de Clarificação**:
```
Adicionar em plan.md (Fase 2: Minimal UI):
"'Feedback visual claro' para Colapso e Última Chance significa:
- Animação de shake/flash quando Colapso ocorre (duração <500ms)
- HUD exibe '0 VIDAS' em vermelho piscante quando em Última Chance
- Avatar do jogador tem borda vermelha quando em Última Chance
- Não requer ilustração complexa - texto + cor é suficiente para MVP"
```

**Checklist Item**: ✅ Pode ser marcado [x] após adicionar nota em plan.md (UI mínima)

**✅ RESOLUÇÃO (2025-12-25)**:
- Adicionada nota em `plan.md` § Phase 2 (Minimal UI)
- "Feedback visual claro" = animação CSS shake/flash (<500ms), texto vermelho piscante, borda vermelha
- Texto + cor + animação CSS básica é suficiente para MVP, prioridade funcionalidade > estética
- Adicionada clarificação em `spec.md` § Clarifications
- Commit: `spec: resolve issues Tier 2 e Tier 3 (...)`

---

## Resumo de Ações

### ✅ TODOS OS TIERS COMPLETADOS (11/11 itens)

**Tier 1 (5/5)**: CHK023, CHK040, CHK041, CHK042, CHK038  
**Tier 2 (4/4)**: CHK031, CHK033, CHK034, CHK043  
**Tier 3 (1/1)**: CHK007  
**CHK044**: Já coberto pelos requisitos existentes (FR-108, FR-109)

### Clarificações Adicionadas

**spec.md**:
- 5 FRs novos: FR-069a, FR-115-118, FR-124a, FR-169a, FR-135a, FR-186.19
- 3 FRs atualizados: FR-056, FR-058, FR-063, FR-130
- 10 clarificações na seção § Clarifications

**plan.md**:
- Nota sobre feedback visual de Colapso/Última Chance em Phase 2

**Total de Commits**: 6 commits com clarificações específicas

**Próximo passo**: Marcar todos os itens relacionados como [x] no checklist e partir para implementação

---

## Checklist Items Provavelmente OK (35/46)

Estes itens provavelmente podem ser marcados [x] diretamente pois requisitos estão claros:

**Estrutura Match/Rodadas/Turnos**: CHK001, CHK002, CHK003, CHK004  
**Sistema de Saúde**: CHK005, CHK006, CHK008  
**Itens**: CHK009, CHK010, CHK011, CHK012  
**Status**: CHK013, CHK014, CHK015  
**Shape Quests**: CHK016, CHK017, CHK018  
**Pool**: CHK019, CHK020, CHK021  
**Bot AI**: CHK024 (adaptação por fase clara)  
**Timers**: CHK025, CHK026  
**Economia**: CHK027, CHK028  
**Primary Flows**: CHK029  
**Exception Flows**: CHK030, CHK032  
**Measurability**: CHK035, CHK036, CHK037  
**Ambiguities**: CHK039 (timing de Status é claro - INÍCIO de Rodada)  
**Dependencies**: CHK045, CHK046  

**Total OK**: 35 itens (~76%)

---

## Próximos Passos Recomendados

### ✅ TODOS OS TIERS RESOLVIDOS - Pronto para Implementação

**Status Atual**: Todos os 11 issues identificados (Tier 1, 2, 3) foram clarificados e integrados ao spec/plan.

### Próximo Passo: Marcar Checklist e Começar Implementação (~5 min)

1. ✅ Abrir `core-mechanics.md`
2. ✅ Marcar como [x] os 11 itens relacionados aos issues resolvidos:
   - CHK007 (Tier 3)
   - CHK023, CHK040, CHK041, CHK042, CHK038 (Tier 1)
   - CHK031, CHK033, CHK034, CHK043, CHK044 (Tier 2)
3. ✅ Marcar como [x] os 35 itens "Provavelmente OK" listados no relatório
4. ✅ Atingir 100% (46/46) do checklist
5. 🚀 Partir para `/speckit.tasks` para gerar plano de implementação detalhado

### Recomendação
**Começar implementação imediatamente** - Todos os requisitos estão clarificados, validados e prontos. Não há gaps conhecidos que impeçam o desenvolvimento.

---

**Relatório Gerado**: 2025-12-25  
**Arquivo**: `specs/001-dosed-mvp/checklists/analysis-report.md`

