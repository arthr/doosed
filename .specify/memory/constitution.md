<!--
Sync Impact Report:
- Version: 1.2.0 → 1.3.0 (MINOR - simplificação de princípio existente)
- Last Amended: 2025-12-25
- Changes: Princípio I simplificado - removido enforcement obrigatório e referências a steering/
- Rationale: 
  * Simplificar governança de documentação focando apenas em docs/ como fonte única
  * Remover overhead de scripts e validações que não agregavam valor proporcional
  * Manter essência do princípio (docs como verdade) sem burocracia excessiva
- Impact:
  * Scripts .cursor/rules/docs-workflow/scripts/ não são mais obrigatórios
  * Diretório steering/ não é mais mencionado na constitution (pode ser deprecated)
  * Apêndice docs/99-apendice/fontes-e-recencia.md não requer manutenção obrigatória
  * Reduz fricção no workflow de desenvolvimento mantendo clareza documental
- Templates requiring updates:
  * ✅ Nenhuma mudança necessária - templates não referenciam enforcement específico do Princípio I
- Follow-up:
  * Avaliar deprecação do diretório steering/
  * Considerar remoção de scripts em .cursor/rules/docs-workflow/ se não mais utilizados
  * Atualizar docs/ se houver menções ao processo antigo
- Previous versions:
  * 1.2.0 (2025-12-25): Princípio VIII adicionado (DRY/KISS/YAGNI/SOLID enforcement)
  * 1.1.0 (2025-12-25): Event limit relaxed from "máximo 8" to "8-12 principais"
  * 1.0.0 (2025-12-25): Initial constitution with rigid 8-event limit
-->

# DOSED Constitution

## Core Principles

### I. Documentação como Fonte da Verdade

A documentação completa e normativa reside em `docs/`.

**Rationale**: Para um projeto solo dev, manter uma única fonte confiável evita dispersão e inconsistências que consomem tempo de desenvolvimento. A documentação rastreável permite evolução sustentável do projeto.

### II. Solo Dev First (Simplicidade)

Preferir soluções simples, testáveis e fáceis de manter por um desenvolvedor. Evitar over-engineering e novas dependências sem necessidade real comprovada.

**Rationale**: Complexidade desnecessária cria débito técnico que um solo dev não consegue gerenciar. Simplicidade permite velocidade sustentável e manutenibilidade de longo prazo.

**Enforcement**:
- DEVE justificar explicitamente qualquer nova dependência (lib/framework)
- DEVE considerar alternativas mais simples antes de abstrações complexas
- Complexidade adicional DEVE ser documentada em "Complexity Tracking" durante planejamento

### III. Event-Driven & Determinístico (NON-NEGOTIABLE)

Arquitetura baseada em eventos com processamento determinístico. 
Sistema DEVE usar aproximadamente 8-12 tipos de eventos principais. 
Estado imutável com transições previsíveis.

**Rationale**: Determinismo é essencial para multiplayer justo, replays 
auditáveis e debugging confiável. Limite pragmático de eventos força 
design focado sem ser restritivo demais para expansões naturais.

**Enforcement**:
- DEVE usar entre 8-12 tipos de eventos principais no sistema de jogo
- Eventos adicionais além de 8 DEVEM ser justificados com rationale claro (não micro-eventos triviais)
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

### VIII. Princípios de Design de Software (DRY, KISS, YAGNI, SOLID)

Aderência rigorosa aos princípios fundamentais de engenharia de software. Código DEVE ser DRY (Don't Repeat Yourself), KISS (Keep It Simple, Stupid), YAGNI (You Aren't Gonna Need It) e seguir princípios SOLID. Duplicação e complexidade prematura são violações não-negociáveis.

**Rationale**: Estes princípios são pilares da engenharia de software sustentável. Para um solo dev, violá-los resulta em débito técnico exponencial que compromete velocidade e qualidade de longo prazo. Enforcement rigoroso previne erosão gradual da qualidade do código.

**DRY (Don't Repeat Yourself)**:
- NUNCA duplicar lógica de negócio
- DEVE extrair código duplicado em funções/componentes reutilizáveis após segunda ocorrência
- Configurações e constantes DEVEM estar centralizadas
- EXCEÇÃO: Duplicação acidental (código similar mas com propósitos distintos) é aceitável

**KISS (Keep It Simple, Stupid)**:
- DEVE escolher a solução mais simples que atende aos requisitos
- EVITAR abstrações prematuras sem necessidade comprovada
- PREFERIR composição sobre herança complexa
- Código DEVE ser legível por humanos sem necessidade de documentação extensa

**YAGNI (You Aren't Gonna Need It)**:
- NÃO implementar funcionalidade especulativa (features "para o futuro")
- DEVE implementar apenas o necessário para requisitos atuais
- Extensibilidade DEVE ser considerada mas não pré-implementada
- Refatoração posterior é preferível a design prematuro

**SOLID Principles**:
- **S (Single Responsibility)**: Cada módulo/classe DEVE ter uma única razão para mudar
- **O (Open/Closed)**: Código DEVE ser aberto para extensão, fechado para modificação
- **L (Liskov Substitution)**: Subtipos DEVEM ser substituíveis por seus tipos base
- **I (Interface Segregation)**: Interfaces específicas são melhores que interfaces gerais
- **D (Dependency Inversion)**: Depender de abstrações, não de implementações concretas

**Enforcement**:
- Code reviews DEVEM incluir checklist DRY/KISS/YAGNI/SOLID explícito
- Violações DEVEM ser justificadas em "Complexity Tracking" com rationale forte
- Pull requests com duplicação não justificada DEVEM ser rejeitados
- Refactoring para compliance DEVE ser priorizado em debt management
- Constitution checks DEVEM validar conformidade antes de Phase 0 research
- Exemplos práticos:
  * DRY: Lógica de validação de eventos NÃO DEVE existir em cliente e servidor separadamente
  * KISS: Preferir funções puras a state machines complexas quando possível
  * YAGNI: NÃO implementar sistema de achievements até ser requisito de spec
  * SOLID-S: Hook de timer NÃO DEVE também gerenciar lógica de pontuação
  * SOLID-D: Componentes UI DEVEM depender de interfaces de stores, não de implementações Zustand específicas

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
└── docs/                  # Documentação oficial (fonte da verdade)
```

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
- Princípio VIII (DRY/KISS/YAGNI/SOLID) DEVE ter checklist explícito em code reviews

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

**Version**: 1.3.0 | **Ratified**: 2025-12-25 | **Last Amended**: 2025-12-25
