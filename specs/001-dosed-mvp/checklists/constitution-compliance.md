# Checklist: Constitution Compliance Gate - DOSED MVP

**Feature**: DOSED MVP - Pill Roulette Game  
**Checklist Type**: Constitution Compliance Gate (Pre-Implementation & PR Review)  
**Created**: 2025-12-25  
**Constitution Version**: v1.3.0  
**Purpose**: Validar qualidade e compliance de requirements/plan/tasks com os 8 princípios da Constitution antes de continuar implementação e durante code reviews.

---

## Checklist Scope & Usage

**Timing**: 
- **Implementador**: Validar ANTES de continuar tasks restantes (T058, T081-minimal, T091c/d, T092)
- **Revisor**: Gate obrigatório em TODOS os PRs (verificar código respeita requirements compliant)

**Authority**: Constitution v1.3.0 linha 205: "Constitution checks são gates obrigatórios antes de Phase 0 (research)" - este checklist valida compliance APÓS research/planning, ANTES de continuar implementação core.

**Focus Areas**:
- Princípio VIII (DRY/KISS/YAGNI/SOLID) - recém-adicionado, enforcement rigoroso
- Event System (8 eventos fixos) - design choice crítico
- Bot Recovery & DevTools - recém-documentados após remediação
- Todos os 8 princípios da Constitution v1.3.0

---

## Princípio I: Documentação como Fonte da Verdade

### Requirement Completeness

- [ ] CHK001 - A documentação normativa está centralizada em `docs/` conforme especificado? [Completeness, Constitution §I]
- [ ] CHK002 - Os artifacts em `specs/001-dosed-mvp/` (spec.md, plan.md, tasks.md, research.md, data-model.md, quickstart.md) estão completos e sincronizados? [Completeness, Constitution §I]
- [ ] CHK003 - A estrutura do projeto documentada (Constitution linha 174-186) reflete a estrutura real implementada? [Consistency, Constitution §I]

### Requirement Clarity

- [ ] CHK004 - Em caso de conflito entre artifacts, a hierarquia de precedência está clara (docs/ > specs/ > código)? [Clarity, Constitution §I]
- [ ] CHK005 - Referências entre artifacts estão atualizadas após remediação recente (ANALYSIS-REMEDIATION-SUMMARY.md)? [Traceability, Gap]

---

## Princípio II: Solo Dev First (Simplicidade)

### Requirement Completeness

- [ ] CHK006 - Todas as novas dependências introduzidas têm justificativa explícita documentada? [Completeness, Constitution §II]
- [ ] CHK007 - Alternativas mais simples foram consideradas e documentadas em "Complexity Tracking" (plan.md linhas 112-118)? [Completeness, Constitution §II]

### Requirement Clarity

- [ ] CHK008 - A escolha de 8 eventos (não 9-12) está claramente justificada com rationale técnico? [Clarity, Plan.md L43-52, Constitution §II]
- [ ] CHK009 - O stack técnico (React + Zustand + Vite + TS) tem rationale documentado vs alternativas mais complexas (Redux, etc)? [Clarity, Plan.md L14-22]

### KISS Validation

- [ ] CHK010 - Requirements evitam abstrações prematuras desnecessárias? Exemplo: funções puras preferidas a state machines complexos quando possível? [KISS, Constitution §VIII]
- [ ] CHK011 - Configurações estão centralizadas em `src/config/game-config.ts` conforme FR-182 a FR-186? [DRY + KISS, Spec.md L446-516]

---

## Princípio III: Event-Driven & Determinístico (NON-NEGOTIABLE)

### Requirement Completeness

- [ ] CHK012 - Os 8 core events estão completamente definidos com payloads em `src/types/events.ts` (T026)? [Completeness, Plan.md L43-52]
- [ ] CHK013 - Requirements de estado imutável estão documentados (Zustand stores com reducer pattern + Immer)? [Completeness, Plan.md L55]
- [ ] CHK014 - Requirements de determinismo estão explícitos (mesma sequência de eventos → mesmo estado final)? [Completeness, Plan.md L56]

### Requirement Clarity

- [ ] CHK015 - O rationale de usar exatamente 8 eventos (não 9-12) está claramente documentado em Complexity Tracking? [Clarity, Plan.md L113-118, Constitution §III L59]
- [ ] CHK016 - A extensibilidade futura (eventos 9-12 para multiplayer) está documentada sem pré-implementar (YAGNI)? [Clarity + YAGNI, Plan.md L116-117]

### Requirement Consistency

- [ ] CHK017 - Task T153 valida exatamente 8 eventos, consistente com design choice documentado? [Consistency, Tasks.md L413]
- [ ] CHK018 - Não há eventos redundantes ou sub-estados mascarados como eventos core (ex: SHOPPING_STARTED já capturado por ROUND_COMPLETED)? [Consistency, Plan.md L114-115]

### Event System Quality

- [ ] CHK019 - Todos os 8 eventos são auditáveis e reproduzíveis conforme enforcement? [Completeness, Constitution §III L62-63]
- [ ] CHK020 - Event processor (T052) tem requirements de testes de determinismo documentados? [Completeness, Tasks.md L52a]

---

## Princípio IV: Server-Authoritative (Multiplayer Justo)

### Requirement Completeness

- [ ] CHK021 - Requirements de separação de lógica (core/ pura vs UI) estão documentados para futura migração server-side? [Completeness, Plan.md L58-61]
- [ ] CHK022 - UI otimista + rollback está planejado para quando implementar multiplayer real? [Completeness, Plan.md L61]

### Requirement Clarity

- [ ] CHK023 - Está claro que MVP solo usa lógica client-side mas arquitetura está preparada para server-authoritative? [Clarity, Plan.md L58]
- [ ] CHK024 - A estratégia de migração futura (mover core/ para Edge Functions) está documentada? [Clarity, Plan.md L60]

---

## Princípio V: Convenções Claras de Código

### Requirement Completeness

- [ ] CHK025 - Convenções de naming estão documentadas (kebab-case em ui/, PascalCase em domain, prefixo use em hooks)? [Completeness, Constitution §V L78-79]
- [ ] CHK026 - Requirement de exports nomeados (evitar default export) está explícito? [Completeness, Constitution §V L79]

### Requirement Consistency

- [ ] CHK027 - Tasks seguem convenções (ex: T064-T069 em ui/ usam kebab-case, T074-T078 em screens/ usam PascalCase)? [Consistency, Tasks.md L199-221]
- [ ] CHK028 - Estrutura de projeto (Constitution linha 174-186) reflete convenções documentadas? [Consistency, Constitution §V]

---

## Princípio VI: Testing Estratégico

### Requirement Completeness

- [ ] CHK029 - Phase 2.5 (Testing Infrastructure) tem tasks completas para unit/property-based/integration tests? [Completeness, Tasks.md L72-114]
- [ ] CHK030 - Áreas críticas identificadas (pool generation, collapse, inventory, determinism) têm test tasks mapeadas? [Completeness, Plan.md L70-77]

### Requirement Clarity

- [ ] CHK031 - Requirements de testes especificam claramente: unit para lógica pura, property-based para invariantes fortes? [Clarity, Constitution §VI L90-91]
- [ ] CHK032 - Edge cases críticos (pool vazio, vidas zeradas, bot timeout) têm requirements de cobertura documentados? [Clarity, Constitution §VI L99]

### Test Coverage Quality

- [ ] CHK033 - 26 test tasks (T029a-T082c) cobrem 100% das áreas críticas identificadas na Constitution? [Coverage, Tasks.md L79-107]
- [ ] CHK034 - Bot recovery (T058) agora MEDIUM priority tem test tasks associadas ou plano de validação? [Coverage, Tasks.md L182]

---

## Princípio VII: Comunicação em Português (Brasil)

### Requirement Consistency

- [ ] CHK035 - Documentação (spec.md, plan.md, tasks.md, Constitution) está 100% em PT-BR? [Consistency, Constitution §VII L102]
- [ ] CHK036 - Código (identificadores, variáveis, funções) está em inglês por convenção técnica? [Consistency, Constitution §VII L103]
- [ ] CHK037 - Comentários de código e mensagens de commit estão planejados em PT-BR? [Completeness, Constitution §VII L109-110]
- [ ] CHK038 - Não há emojis em código ou documentação conforme enforcement? [Consistency, Constitution §VII L112]

### Terminology Consistency

- [ ] CHK039 - Terminologia é consistente (ex: "Partida" em docs PT-BR, "Match" em código EN)? [Consistency, Issue I4 em ANALYSIS-REMEDIATION-SUMMARY.md]

---

## Princípio VIII: DRY, KISS, YAGNI, SOLID (NON-NEGOTIABLE)

**NOTA CRÍTICA**: Princípio recém-adicionado em Constitution v1.3.0 (2025-12-25). Enforcement rigoroso obrigatório. Checklist detalhado em `.cursor/rules/code-review/RULE.md`.

### DRY (Don't Repeat Yourself) - Requirements Quality

- [ ] CHK040 - Lógica de negócio NÃO está duplicada entre spec/plan/tasks? Exemplo: validação de Colapso definida apenas em FR-095, não repetida? [DRY, Spec.md L294]
- [ ] CHK041 - Configurações estão centralizadas em FR-182 a FR-186 (game-config.ts), não espalhadas? [DRY + Completeness, Spec.md L446-516]
- [ ] CHK042 - Requirements de validação (eventos, inventário, pool, player state) estão definidas UMA VEZ, não duplicadas entre cliente/servidor? [DRY, Constitution §VIII L152]

### KISS (Keep It Simple, Stupid) - Requirements Quality

- [ ] CHK043 - Requirements escolhem soluções mais simples que atendem requisitos (sem over-engineering)? Exemplo: funções puras vs state machines complexos? [KISS, Constitution §VIII L127]
- [ ] CHK044 - Não há abstrações prematuras nos requirements (ex: sistema de achievements não requisitado)? [KISS + YAGNI, Constitution §VIII L128]
- [ ] CHK045 - Complexidade ciclomática está controlada? Requirements evitam nested ifs profundos e complexidade desnecessária? [KISS, RULE.md L45]

### YAGNI (You Aren't Gonna Need It) - Requirements Quality

- [ ] CHK046 - Não há funcionalidade especulativa nos requirements (features "para o futuro" sem necessidade atual)? [YAGNI, Constitution §VIII L133]
- [ ] CHK047 - Requirements implementam APENAS o necessário para FRs atuais (187 FRs no spec.md)? [YAGNI, Constitution §VIII L134]
- [ ] CHK048 - Extensibilidade está considerada sem pré-implementar? Exemplo: Shape interface suporta sazonais (FR-178-179) mas não implementados até serem requisito? [YAGNI, Constitution §VIII L135-136]
- [ ] CHK049 - DevTools está dividido em minimal (US1) vs full (Phase 6), evitando implementação prematura? [YAGNI, Tasks.md T081-minimal vs T081-full]

### SOLID - Single Responsibility - Requirements Quality

- [ ] CHK050 - Cada módulo/componente documentado tem uma única responsabilidade clara? Exemplo: useTurnTimer gerencia APENAS timer, não pontuação? [SOLID-S, Constitution §VIII L139, RULE.md L76]
- [ ] CHK051 - Separação de concerns está clara nos requirements (core/ = lógica, stores/ = state, components/ = UI, types/ = contratos)? [SOLID-S, Constitution §VIII L140]

### SOLID - Open/Closed - Requirements Quality

- [ ] CHK052 - Requirements permitem extensão sem modificação? Exemplo: adicionar novo PillType não requer modificar resolvePillEffect? [SOLID-O, Constitution §VIII L142, RULE.md L81]
- [ ] CHK053 - Pontos de extensão estão documentados (interfaces/tipos para novos casos)? [SOLID-O, Constitution §VIII L143]

### SOLID - Liskov Substitution - Requirements Quality

- [ ] CHK054 - Subtipos documentados são substituíveis por tipo base? Exemplo: BotEasy/Hard substituíveis por BotInterface? [SOLID-L, Constitution §VIII L144, RULE.md L86]
- [ ] CHK055 - Contratos (pré/pós-condições) estão respeitados nos requirements? [SOLID-L, Constitution §VIII L145]

### SOLID - Interface Segregation - Requirements Quality

- [ ] CHK056 - Interfaces nos requirements são específicas e coesas, não genéricas e inchadas? [SOLID-I, Constitution §VIII L146, RULE.md L91]
- [ ] CHK057 - Requirements especificam dependências mínimas (componentes dependem apenas do que usam)? Exemplo: PlayerCard depende de subset de Player, não Match inteiro? [SOLID-I, Constitution §VIII L147]

### SOLID - Dependency Inversion - Requirements Quality

- [ ] CHK058 - Requirements especificam dependências de abstrações, não concretizações? Exemplo: componentes UI dependem de interface de store, não de Zustand específico? [SOLID-D, Constitution §VIII L150, RULE.md L96]
- [ ] CHK059 - Injeção de dependências está documentada (props, context), não instanciação interna? [SOLID-D, Constitution §VIII L151]

### Enforcement & Compliance

- [ ] CHK060 - Checklist DRY/KISS/YAGNI/SOLID existe e está completo em `.cursor/rules/code-review/RULE.md`? [Enforcement, Constitution §VIII L146]
- [ ] CHK061 - Requirements de code review incluem verificação obrigatória do checklist SOLID? [Enforcement, Constitution §VIII L146-150]
- [ ] CHK062 - Violações de Princípio VIII têm justificativa documentada em "Complexity Tracking" (plan.md)? [Enforcement, Constitution §VIII L147]

---

## Remediação Recente - Validação de Fixes

**Context**: 4 issues CRITICAL/HIGH foram remediados em 2025-12-25. Validar que remediação está completa e documentada.

### C1 - Event Count (CRITICAL - RESOLVIDO)

- [ ] CHK063 - Rationale de 8 eventos (não 9-12) está documentado em plan.md Complexity Tracking? [Remediation C1, Plan.md L113-118]
- [ ] CHK064 - Task T153 foi atualizada para validar exatamente 8 eventos? [Remediation C1, Tasks.md L413]
- [ ] CHK065 - Extensibilidade futura (eventos 9-12 para multiplayer) está documentada sem pré-implementar? [Remediation C1, Plan.md L116-117]

### C3 - Checklist SOLID (HIGH - RESOLVIDO)

- [ ] CHK066 - Checklist DRY/KISS/YAGNI/SOLID foi criado em `.cursor/rules/code-review/RULE.md`? [Remediation C3, RULE.md criado]
- [ ] CHK067 - Checklist contém 30+ itens verificáveis com exemplos práticos do DOSED? [Remediation C3, RULE.md L10-260]
- [ ] CHK068 - Template de justificativa para violações está documentado? [Remediation C3, RULE.md L110-120]
- [ ] CHK069 - Enforcement guidelines (rejeição de PR, aprovação condicional) estão claros? [Remediation C3, RULE.md L122-140]

### G1/U1 - Bot Recovery (HIGH - RESOLVIDO)

- [ ] CHK070 - Task T058 foi reclassificada de GAP para MEDIUM PRIORITY? [Remediation G1, Tasks.md L182]
- [ ] CHK071 - T058 tem descrição expandida com 5 steps de recovery progressivo? [Remediation G1, Tasks.md L182]
- [ ] CHK072 - Edge case de bot timeout está documentado como crítico (não pode ser ignorado no MVP)? [Remediation G1, Tasks.md L182]

### U2/G4 - DevTools Split (HIGH - RESOLVIDO)

- [ ] CHK073 - Task T081 foi dividida em T081-minimal (US1) e T081-full (Phase 6)? [Remediation U2, Tasks.md L227-228]
- [ ] CHK074 - T081-minimal define subset mínimo suficiente para debugging (pause, state viewer, logs)? [Remediation U2, Tasks.md L227]
- [ ] CHK075 - T081-full adia funcionalidades avançadas (4 tabs) para Phase 6 conforme YAGNI? [Remediation U2, Tasks.md L228]

---

## Edge Cases & Resilience

### Requirement Completeness

- [ ] CHK076 - Edge case de timer de turno expirado está documentado (FR-063)? [Completeness, Spec.md L242-243]
- [ ] CHK077 - Edge case de "Última Chance" (0 Vidas mas não eliminado) está claramente especificado (FR-096-FR-098)? [Completeness, Spec.md L295-297]
- [ ] CHK078 - Edge case de todos jogadores eliminados exceto 1 está documentado? [Completeness, Spec.md L135-136]
- [ ] CHK079 - Edge case de pool esgotado com múltiplos jogadores vivos está especificado? [Completeness, Spec.md L139]

### Recovery & Error Handling

- [ ] CHK080 - Requirements de bot timeout e recovery estão completos (FR-124a)? [Completeness, Spec.md L343-344]
- [ ] CHK081 - Requirements de crash recovery (FR-169a) estão documentados para salvar XP/Schmeckles parcial? [Completeness, Spec.md L421-422]
- [ ] CHK082 - Requirements de state corruption (validação de invariantes) estão especificados (FR-186.19)? [Completeness, Spec.md L537-538]
- [ ] CHK083 - Dual-mode error handling (DEV pause + debug, PROD retry + fallback) está documentado? [Completeness, Plan.md L27, Spec.md L526-528]

---

## Traceability & Coverage

### Requirements Traceability

- [ ] CHK084 - 187 FRs têm IDs únicos e são referenciáveis? [Traceability, Spec.md L149-538]
- [ ] CHK085 - 191 tasks mapeiam para FRs com traceability explícita? [Traceability, Tasks.md]
- [ ] CHK086 - Coverage de 96% (178/187 FRs com tasks) está documentado? [Coverage, ANALYSIS-REMEDIATION-SUMMARY.md L77]
- [ ] CHK087 - 9 FRs sem coverage direta têm justificativa (DevTools completo, shapes sazonais post-MVP)? [Gap, ANALYSIS-REMEDIATION-SUMMARY.md L78-79]

### Success Criteria Quality

- [ ] CHK088 - 43 Success Criteria (SC-001 a SC-043) são mensuráveis e objetivamente verificáveis? [Measurability, Spec.md L585-628]
- [ ] CHK089 - SCs impossíveis de testar em MVP (SC-004, SC-017) têm alternativas definidas ou estão marcados post-MVP? [Measurability, ANALYSIS-REMEDIATION-SUMMARY.md Issue A2/A4]

---

## Non-Functional Requirements

### Performance

- [ ] CHK090 - Targets de performance estão quantificados (30 FPS consistente, transições <100ms)? [Clarity, Spec.md L529-532]
- [ ] CHK091 - Requirements de animações (CSS/bibliotecas leves, evitar JS loops) estão documentados? [Completeness, Spec.md L531-532]

### Observability

- [ ] CHK092 - Requirements de logging estruturado (JSON format, categorias, severity) estão completos? [Completeness, Spec.md L533-535]
- [ ] CHK093 - Game Log UI (FR-103) está especificado com filtragem e export? [Completeness, Spec.md L305]

### Accessibility

- [ ] CHK094 - Requirements de acessibilidade (keyboard navigation, ARIA) estão documentados onde aplicável? [Gap]

---

## Dependencies & Assumptions

### External Dependencies

- [ ] CHK095 - Stack técnico (React 18+, TypeScript, Vite, Zustand) está documentado com versões mínimas? [Completeness, Plan.md L14-22]
- [ ] CHK096 - Dependências de persistência (localStorage, namespace "dosed:profile") estão claras? [Completeness, Plan.md L18]

### Assumptions Validation

- [ ] CHK097 - Assumptions documentados (spec.md linhas 630-677) foram validados ou marcados para validação futura? [Completeness, Spec.md L630-677]
- [ ] CHK098 - Assumption de "8 eventos suficientes" foi validado com rationale em Complexity Tracking? [Validation, Plan.md L113-118]

---

## Ambiguities & Conflicts

### Known Ambiguities (Resolved)

- [ ] CHK099 - Ambiguidade A1 (FR-007 "comportamento razoável" de BOT) foi clarificada com critérios mensuráveis (FR-115-118)? [Clarity, ANALYSIS-REMEDIATION-SUMMARY.md Issue A1]

### Known Conflicts (Resolved)

- [ ] CHK100 - Conflito I1 (8 eventos vs ~20 ações) foi resolvido com clarificação de granularidade (eventos vs sub-payloads)? [Consistency, ANALYSIS-REMEDIATION-SUMMARY.md Issue I1]

### Pending Clarifications

- [ ] CHK101 - Issue I4 (terminologia Partida vs Match) foi resolvido ou está no backlog? [Consistency, ANALYSIS-REMEDIATION-SUMMARY.md Issue I4]
- [ ] CHK102 - Issue I3 (FR-182 completo vs plan Technical Context subset) foi alinhado ou está documentado como subset intencional? [Consistency, ANALYSIS-REMEDIATION-SUMMARY.md Issue I3]

---

## Final Readiness Gates

### Pre-Implementation Validation

- [ ] CHK103 - Todos os items CRITICAL deste checklist estão resolvidos (CHK012-CHK020 Event System, CHK040-CHK062 Princípio VIII, CHK063-CHK075 Remediação)? [Gate]
- [ ] CHK104 - Complexity Tracking (plan.md L112-118) documenta TODAS as violações justificadas de Constitution? [Gate, Constitution §II-VIII]
- [ ] CHK105 - ANALYSIS-REMEDIATION-SUMMARY.md está completo com status de todos os 24 findings? [Gate, ANALYSIS-REMEDIATION-SUMMARY.md]

### PR Review Validation

- [ ] CHK106 - Code review usará checklist SOLID (`.cursor/rules/code-review/RULE.md`) como gate obrigatório? [Gate, Constitution §VIII L146]
- [ ] CHK107 - PRs com violações DRY/KISS/YAGNI/SOLID terão justificativa em "Complexity Tracking" ou serão rejeitados? [Gate, Constitution §VIII L147]

---

## Summary Statistics

- **Total Checklist Items**: 107
- **Constitution Principles Covered**: 8/8 (100%)
- **Focus Areas**:
  - Princípio VIII (DRY/KISS/YAGNI/SOLID): 23 items (CHK040-CHK062)
  - Event System (Princípio III): 9 items (CHK012-CHK020)
  - Remediação Recente: 13 items (CHK063-CHK075)
  - Edge Cases & Resilience: 8 items (CHK076-CHK083)
  - Traceability & Coverage: 6 items (CHK084-CHK089)
- **Critical Gates**: 5 items (CHK103-CHK107)

---

## Next Steps After Checklist Completion

1. ✅ Resolver todos os items CRITICAL (focus: CHK012-CHK020, CHK040-CHK062, CHK063-CHK075)
2. ✅ Documentar violações justificadas em Complexity Tracking
3. ✅ Versionar artifacts (spec.md, plan.md, tasks.md, Constitution.md) se houver mudanças
4. ✅ Iniciar implementação de tasks restantes (T058, T081-minimal, T091c/d, T092)
5. ✅ Usar este checklist como gate em todos os PRs subsequentes

---

**Checklist Version**: 1.0.0 | **Authority**: Constitution v1.3.0 | **Last Updated**: 2025-12-25

