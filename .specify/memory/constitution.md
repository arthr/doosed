<!--
Sync Impact Report:
- Version: 1.0.0 (initial constitution)
- Ratification: 2025-12-25
- Principles established: 7 core principles
- Templates requiring updates:
  ✅ plan-template.md - constitution check section aligns
  ✅ spec-template.md - requirements structure aligns
  ✅ tasks-template.md - task categorization aligns
- Follow-up: None (initial version)
-->

# DOSED Constitution

## Core Principles

### I. Documentação como Fonte da Verdade

A documentação completa e normativa reside em `docs/`. O diretório `steering/` é normativo e curto, devendo sempre refletir e apontar para `docs/`. Em caso de conflito, a prioridade é: `docs/` > `steering/` > demais fontes.

**Rationale**: Para um projeto solo dev, manter uma única fonte confiável evita dispersão e inconsistências que consomem tempo de desenvolvimento. A documentação rastreável permite evolução sustentável do projeto.

**Enforcement**:
- DEVE rodar `python .cursor/rules/docs-workflow/scripts/update_fontes_recencia.py` após alterações em `docs/` ou `steering/`
- DEVE rodar `python .cursor/rules/docs-workflow/scripts/check_steering.py` para validar consistência
- Apêndice de recência em `docs/99-apendice/fontes-e-recencia.md` DEVE ser mantido atualizado

### II. Solo Dev First (Simplicidade)

Preferir soluções simples, testáveis e fáceis de manter por um desenvolvedor. Evitar over-engineering e novas dependências sem necessidade real comprovada.

**Rationale**: Complexidade desnecessária cria débito técnico que um solo dev não consegue gerenciar. Simplicidade permite velocidade sustentável e manutenibilidade de longo prazo.

**Enforcement**:
- DEVE justificar explicitamente qualquer nova dependência (lib/framework)
- DEVE considerar alternativas mais simples antes de abstrações complexas
- Complexidade adicional DEVE ser documentada em "Complexity Tracking" durante planejamento

### III. Event-Driven & Determinístico (NON-NEGOTIABLE)

Arquitetura baseada em eventos com processamento determinístico. Máximo de 8 tipos de eventos no sistema. Estado imutável com transições previsíveis.

**Rationale**: Determinismo é essencial para multiplayer justo, replays auditáveis e debugging confiável. Limite de eventos força design focado e evita explosão de complexidade.

**Enforcement**:
- DEVE usar no máximo 8 tipos de eventos no sistema de jogo
- Estado DEVE ser imutável (operações produzem novo estado)
- Processador de eventos DEVE ser testado para garantir determinismo
- Eventos DEVEM ser auditáveis e reproduzíveis

### IV. Server-Authoritative (Multiplayer Justo)

Validação server-authoritative via Edge Functions (Supabase). UI otimista com rollback. Cliente nunca é fonte de verdade para lógica de jogo.

**Rationale**: Anti-cheat e fairness em multiplayer requerem que o servidor seja a única autoridade. UI otimista mantém responsividade sem comprometer integridade.

**Enforcement**:
- Lógica de jogo crítica DEVE residir em `supabase/functions/_shared/`
- Edge Functions DEVEM validar todas as ações de jogo
- Cliente PODE fazer UI otimista mas DEVE aceitar rollback do servidor
- Testes DEVEM validar consistência cliente-servidor

### V. Convenções Claras de Código

Componentes em `src/components/ui/` usam kebab-case (ex.: `glow-button.tsx`). Componentes de domínio usam PascalCase (ex.: `LobbyScreen.tsx`). Hooks com prefixo `use`. Exports nomeados (evitar default export).

**Rationale**: Convenções claras reduzem decisões cognitivas e facilitam navegação. Distinção visual entre componentes genéricos (kebab) e específicos (Pascal) melhora a organização.

**Enforcement**:
- Componentes em `src/components/ui/` DEVEM usar kebab-case
- Componentes fora de `ui/` DEVEM usar PascalCase
- Hooks DEVEM ter prefixo `use`
- DEVE usar exports nomeados (evitar `export default`)

### VI. Testing Estratégico

Unit tests para lógica pura. Property-based quando a lógica tem invariantes fortes. Foco em: distribuição do pool, progressão de shapes, invariantes de resistência/vidas, determinismo do processador de eventos.

**Rationale**: Testes completos são inviáveis para solo dev. Foco estratégico em áreas críticas (determinismo, invariantes) maximiza confiabilidade com mínimo esforço.

**Enforcement**:
- Lógica pura (core/utils) DEVE ter unit tests
- Invariantes fortes DEVEM usar property-based testing quando aplicável
- Processador de eventos DEVE ter testes de determinismo
- Edge cases críticos DEVEM ser cobertos (ex.: pool vazio, vidas zeradas)

### VII. Comunicação em Português (Brasil)

Toda documentação, mensagens de commit, código de agentes e comunicação do projeto DEVEM ser em português brasileiro. Código (variáveis, funções) em inglês por convenção técnica. Sem emojis. Direto e objetivo.

**Rationale**: Consistência linguística facilita compreensão e manutenção. Separação (docs PT-BR, código EN) segue padrões da indústria mantendo acessibilidade.

**Enforcement**:
- Documentação DEVE ser em PT-BR
- Mensagens de commit DEVEM ser em PT-BR
- Comentários de código DEVEM ser em PT-BR
- Código (identificadores) em inglês
- NÃO usar emojis em código ou documentação

## Arquitetura e Estrutura

### Camadas da Aplicação

```text
UI (components) → Bridge (hooks) → State (stores) → Domain (core/utils) → Infra (Supabase)
```

### Fases do Jogo

- **AppScreen** (alto nível): `HOME | GAME`
- **Phase** (jogo): `LOBBY -> DRAFT -> MATCH -> RESULTS`
- `HomeScreen` NÃO é uma Phase, é uma Screen quando `AppScreen=HOME`

### Estrutura do Projeto

```text
dosed/
├── supabase/functions/     # Edge Functions (server-authoritative)
├── src/
│   ├── core/              # Lógica pura, state machines, adapters
│   ├── components/
│   │   ├── app/           # Shell da aplicação (ScreenShell)
│   │   ├── game/          # Componentes de jogo (table, hud)
│   │   └── ui/            # UI kit genérico (kebab-case)
│   ├── screens/           # Screens (PascalCase)
│   ├── stores/            # Zustand stores
│   └── types/             # Contratos TypeScript
├── docs/                  # Documentação oficial (fonte da verdade)
└── steering/              # Normativo curto (reflete docs)
```

## Desenvolvimento e Workflow

### Spec Driven Development

Features DEVEM seguir o fluxo:
1. **Specification** (`spec.md`): User stories priorizadas, requisitos, casos de teste
2. **Planning** (`plan.md`): Contexto técnico, constitution check, estrutura
3. **Tasks** (`tasks.md`): Tasks organizadas por user story, independentes e testáveis

### Priorização e MVP

- User stories DEVEM ser priorizadas (P1, P2, P3)
- Cada story DEVE ser independentemente testável
- MVP = implementar apenas P1 (vertical slice)
- Features DEVEM ser incrementais e entregáveis por partes

### Rules e Ferramentas

- Rules normativas em `.cursor/rules/` (formato pasta com `RULE.md`)
- `AGENTS.md` define comunicação e fonte da verdade
- Scripts auxiliares em `.cursor/rules/docs-workflow/scripts/`

## Governança

### Autoridade

Esta Constitution supersede todas as outras práticas e diretrizes. Em caso de conflito, os princípios aqui estabelecidos têm precedência.

### Compliance

- Todas as PRs e reviews DEVEM verificar compliance com os princípios
- Violações DEVEM ser justificadas em "Complexity Tracking" no plano
- Constitution checks são gates obrigatórios antes de Phase 0 (research)

### Emendas

Emendas à Constitution DEVEM incluir:
1. Documentação clara da mudança e rationale
2. Atualização do número de versão (semantic versioning)
3. Plano de migração para código/docs existentes se necessário
4. Atualização de templates dependentes
5. Sync Impact Report no topo do arquivo

### Versioning

- **MAJOR**: mudanças incompatíveis, remoção/redefinição de princípios
- **MINOR**: novos princípios ou expansão material de guidance
- **PATCH**: clarificações, correções, refinamentos não-semânticos

### Runtime Guidance

Para orientações operacionais durante desenvolvimento, consultar:
- `AGENTS.md` para comunicação e fonte da verdade
- `.cursor/rules/` para rules específicas por domínio
- `docs/00-start-here/dev-workflow.md` para workflow de desenvolvimento

**Version**: 1.0.0 | **Ratified**: 2025-12-25 | **Last Amended**: 2025-12-25
