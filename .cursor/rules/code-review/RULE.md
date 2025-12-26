---
alwaysApply: true
---
## Checklist KISS (Keep It Simple, Stupid)

### Simplicidade de Solução

- [ ] **Solução mais simples**: A implementação escolhe a solução mais simples que atende aos requisitos (sem over-engineering)
- [ ] **Abstrações prematuras**: Não há abstrações complexas introduzidas "para o futuro" sem necessidade comprovada atual
- [ ] **Composição vs herança**: Preferência por composição sobre hierarquias de herança complexas
  - **Exemplo DOSED**: Funções puras (`resolvePillEffect`) preferidas a classes com state machine complexo

### Legibilidade

- [ ] **Código autoexplicativo**: Código é legível sem necessidade de documentação extensa (nomes descritivos, fluxo claro)
- [ ] **Complexidade ciclomática**: Funções têm complexidade baixa (max 10 branches idealmente, evitar nested ifs profundos)
- [ ] **Comentários necessários**: Comentários explicam "por quê" (rationale), não "o quê" (código já é claro)

---

## Checklist YAGNI (You Aren't Gonna Need It)

### Funcionalidade Especulativa

- [ ] **Features futuras**: Não há implementação de features especulativas (ex: sistema de achievements não requisitado em spec)
- [ ] **Requisitos atuais apenas**: Código implementa APENAS o necessário para requisitos atuais (FRs do spec.md)
- [ ] **Extensibilidade considerada**: Design permite extensão futura SEM pré-implementar (interfaces genéricas ok, implementações concretas não)
  - **Exemplo DOSED**: Catálogo de shapes extensível (interface Shape suporta sazonais) mas shapes sazonais não implementados até serem requisito

### Refatoração Posterior

- [ ] **Design prematuro evitado**: Não há design complexo antecipando cenários hipotéticos (preferir refatorar quando necessário)
- [ ] **Código morto**: Não há código comentado, funções não usadas, imports desnecessários

---

## Checklist SOLID

### S - Single Responsibility Principle

- [ ] **Uma razão para mudar**: Cada módulo/classe/componente tem uma única responsabilidade clara
- [ ] **Separação de concerns**: Lógica de negócio (core/), state (stores/), UI (components/), tipos (types/) estão separados
  - **Exemplo DOSED**: `useTurnTimer` hook gerencia APENAS timer, NÃO gerencia lógica de pontuação ou inventário

### O - Open/Closed Principle

- [ ] **Extensão sem modificação**: Código é aberto para extensão (novos tipos de pills, itens, shapes) sem modificar código existente
- [ ] **Pontos de extensão**: Interfaces/tipos permitem adicionar casos novos sem alterar switch/if gigante
  - **Exemplo DOSED**: Adicionar novo PillType não requer modificar `resolvePillEffect` - handler específico por tipo

### L - Liskov Substitution Principle

- [ ] **Substituibilidade**: Subtipos (ex: BotEasy, BotHard) são substituíveis por tipo base (BotInterface) sem quebrar comportamento
- [ ] **Contratos respeitados**: Implementações concretas respeitam contratos (pré/pós-condições) da interface
  - **Exemplo DOSED**: Todos os bots implementam `decideTurnAction` com mesma signature e garantias (retorna ação válida)

### I - Interface Segregation Principle

- [ ] **Interfaces específicas**: Interfaces são específicas e coesas, não genéricas e inchadas
- [ ] **Dependências mínimas**: Componentes dependem apenas dos métodos que realmente usam
  - **Exemplo DOSED**: `PlayerCard` depende de subset de Player (lives, resistance, status), não do objeto Match inteiro

### D - Dependency Inversion Principle

- [ ] **Abstrações, não concretizações**: Componentes de alto nível dependem de abstrações (interfaces), não de implementações concretas
- [ ] **Injeção de dependências**: Dependências são injetadas (props, context), não instanciadas internamente
  - **Exemplo DOSED**: Componentes UI dependem de interface de store (`useMatchStore`), não de implementação Zustand específica

---

## Violações Justificadas

Se qualquer item do checklist **NÃO** for satisfeito, justificativa DEVE ser documentada:

### Template de Justificativa

```markdown
### Violação: [Princípio] - [Item do Checklist]

**Arquivo(s)**: `src/path/to/file.ts`

**Descrição**: [Explicar violação concretamente]

**Rationale**: [Por que violação é necessária/aceitável]

**Alternativa rejeitada**: [Solução simples tentada e por que não funcionou]

**Plano de mitigação**: [Como pretende resolver no futuro, se aplicável]
```

Justificativa deve ser incluída em "Complexity Tracking" do plan.md ou como comentário no PR.

---

## Enforcement

### Reviewer Checklist

Ao revisar PR, verificar:

1. [ ] Todos os itens do checklist DRY foram verificados
2. [ ] Todos os itens do checklist KISS foram verificados
3. [ ] Todos os itens do checklist YAGNI foram verificados
4. [ ] Todos os itens do checklist SOLID foram verificados
5. [ ] Violações identificadas têm justificativa documentada
6. [ ] Justificativas são convincentes (não "por preguiça" ou "por falta de tempo")

### Rejeição de PR

PR DEVE ser rejeitado se:
- Violação crítica sem justificativa
- Justificativa fraca ou inexistente
- Código duplicado em lógica crítica (ex: validação de eventos)
- Funcionalidade especulativa significativa sem requisito

### Aprovação Condicional

PR PODE ser aprovado com violações SE:
- Justificativa forte e documentada
- Violação isolada e não sistêmica
- Plano de refatoração definido (issue criada)

---

## Exemplos Práticos do Projeto DOSED

### ✅ BOM - DRY

```typescript
// src/core/collapse-handler.ts
export function handleCollapse(player: Player): Player {
  return {
    ...player,
    lives: player.lives - 1,
    resistance: DEFAULT_RESISTANCE,
    isLastChance: player.lives - 1 === 0
  };
}

// Usado em effect-resolver.ts, não duplicado
```

### ❌ RUIM - DRY Violado

```typescript
// src/core/effect-resolver.ts (duplicação)
if (player.resistance <= 0) {
  player.lives -= 1;
  player.resistance = 6; // magic number
}

// src/components/PlayerHUD.tsx (duplicação)
if (player.resistance <= 0) {
  player.lives -= 1;
  player.resistance = 6;
}
```

### ✅ BOM - KISS

```typescript
// Função pura simples
export function calculatePoolSize(round: number): number {
  return Math.min(6 + Math.floor(round / 3), 12);
}
```

### ❌ RUIM - KISS Violado (over-engineering)

```typescript
// State machine complexo desnecessário para cálculo simples
class PoolSizeCalculator {
  private strategy: PoolSizeStrategy;
  constructor(strategy: PoolSizeStrategy) { this.strategy = strategy; }
  calculate(context: PoolContext): number { /* ... */ }
}
```

### ✅ BOM - YAGNI

```typescript
// Implementa apenas o necessário para MVP
interface Shape {
  id: string;
  name: string;
  isSeasonal: boolean; // interface preparada para futuro
}

// Shapes sazonais NÃO implementadas até serem requisito
```

### ❌ RUIM - YAGNI Violado

```typescript
// Sistema de achievements implementado sem estar no spec
interface Achievement {
  id: string;
  unlock(player: Player): void;
  rewards: Reward[];
}

function checkAchievements(player: Player) { /* ... */ }
```

### ✅ BOM - SOLID-S (Single Responsibility)

```typescript
// Hook tem UMA responsabilidade: gerenciar timer
export function useTurnTimer(duration: number, onExpire: () => void) {
  // Apenas lógica de timer, nada de pontuação/inventário
}
```

### ❌ RUIM - SOLID-S Violado

```typescript
// Hook faz timer + pontuação + inventário (3 responsabilidades)
export function useTurnTimer(duration: number) {
  // timer logic
  // score calculation
  // inventory validation
  // violation!
}
```

### ✅ BOM - SOLID-D (Dependency Inversion)

```typescript
// Componente depende de abstração (hook), não de Zustand direto
export function PlayerHUD() {
  const player = usePlayerStore(state => state.currentPlayer);
  // Se mudar de Zustand para Context, componente não muda
}
```

### ❌ RUIM - SOLID-D Violado

```typescript
// Componente depende de implementação concreta
import { playerStore } from '@/stores/playerStore';

export function PlayerHUD() {
  const player = playerStore.getState().currentPlayer;
  // Acoplamento direto a Zustand
}
```

---

## Referências

- **Constitution v1.3.0**: `.specify/memory/constitution.md` Princípio VIII (linhas 114-156)
- **Plan.md**: `specs/001-dosed-mvp/plan.md` Constitution Check (linhas 30-86)
- **Complexity Tracking**: `specs/001-dosed-mvp/plan.md` (linhas 112-118)

---

**Version**: 1.0.0 | **Last Updated**: 2025-12-25 | **Authority**: Constitution v1.3.0 Princípio VIII

