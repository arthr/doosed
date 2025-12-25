# Testing Infrastructure

Estrutura de testes do DOSED MVP baseada em **research.md Decision 9** (Testing Strategy).

## Estrutura

```
src/
├── core/__tests__/
│   ├── setup.ts                    # Setup global + utilities
│   ├── pool-generator.test.ts      # Unit tests (T029a-T032a)
│   ├── pool-generator.property.test.ts  # Property tests (T029b-T032b)
│   ├── effect-resolver.test.ts     # Unit tests (T034a-T036a)
│   ├── collapse-handler.test.ts    # Unit tests (T038a)
│   ├── inventory-manager.test.ts   # Unit tests (T041a-T042a)
│   ├── turn-manager.test.ts        # Unit tests (T045a-T046a)
│   └── event-processor.test.ts     # Unit tests (T052a)
│
└── __tests__/integration/
    ├── full-game-flow.test.ts      # Integration (T082a)
    ├── bot-determinism.test.ts     # Integration (T082b)
    └── edge-cases.test.ts          # Integration (T082c)
```

## Comandos

```bash
# Rodar todos os testes
pnpm test

# Rodar testes em watch mode
pnpm test

# Rodar testes uma vez (CI)
pnpm test:run

# UI interativa (recomendado)
pnpm test:ui

# Coverage report
pnpm test:coverage
```

## Estratégia de Testes

### Priority 1 - Core Logic (Unit Tests)
- Pool generation (distribuição, tamanho, shapes)
- Effect resolution (pill types + modifiers)
- Collapse mechanics (lives → resistance)
- Inventory management (5 slots, stackables)
- Turn management (round-robin, skip eliminated)
- Event processor (determinismo)

### Priority 2 - Invariantes (Property-Based)
- Pool distribution dentro de bounds
- Lives sempre ≥ 0
- Resistance pode ser negativo (sem limite inferior)
- Inventory nunca excede 5 slots

### Priority 3 - Integration
- Fluxo completo (Home → Match → Results)
- Bot vs Bot determinístico
- Edge cases (timer, eliminações)

## Helpers Disponíveis

```typescript
import { createTestSeed, assertDeterministic } from './setup';

// Seed determinístico para testes
const seed = createTestSeed('test-pool-generation');

// Validar determinismo
assertDeterministic(() => generatePool(1, config), 3);
```

## Coverage Targets

Conforme **research.md Decision 9**:

| Métrica | Target |
|---------|--------|
| Statements | 70% |
| Branches | 60% |
| Functions | 70% |
| Lines | 70% |

## Convenções

1. **Naming**: `<module>.test.ts` para unit, `<module>.property.test.ts` para property-based
2. **Organization**: 1 arquivo de teste por módulo core
3. **Determinism**: Sempre usar seeds fixos para RNG
4. **Fast**: Testes devem rodar em <3s cada
5. **PT-BR**: Mensagens de erro em português

## Próximos Passos

1. ✅ Setup completo (vitest.config.ts, scripts, estrutura)
2. ⏸️ Escrever testes (T029a-T082c) - Phase 2.5
3. ⏸️ Implementar lógica com TDD - Phase 3

