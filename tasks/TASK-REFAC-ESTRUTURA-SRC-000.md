# TASK-REFAC-ESTRUTURA-SRC-000 — Refatoração: alinhar estrutura do `src/` ao target

## Contexto
Vamos alinhar o projeto à estrutura alvo definida em `docs/00-start-here/estrutura-do-projeto.md`, mantendo o projeto sempre “verde” (lint + build), com passos atômicos para Solo Dev.

## Escopo
- Dentro:
  - Migrar `src/store/` -> `src/stores/`.
  - Criar `src/core/adapters/` e `src/core/state-machines/`.
  - Introduzir pastas `src/components/game/table/` e `src/components/game/hud/` e começar a extrair componentes do `MatchScreen`.
- Fora (por enquanto):
  - Supabase/Realtime/Edge Functions.
  - Rebalance completo, IA, economia.
  - Rework total de UI/arte.

## Riscos
- Imports quebrados por mudança de path.
- Churn grande em arquivos se migrar tudo de uma vez.
- Divergência temporária entre screens (placeholders) e components novos.

## Tasks atômicas (ordem sugerida)

### 1) Migrar `src/store/` -> `src/stores/`
- **1.1 Criar `src/stores/` e mover arquivos**
  - Mover:
    - `src/store/useChatStore.ts` -> `src/stores/chatStore.ts`
    - `src/store/useGameStore.ts` -> `src/stores/gameStore.ts` (ou `matchStore.ts`)
    - `src/store/initChatSystemBridge.ts` -> `src/stores/initChatSystemBridge.ts`
  - Atualizar imports `@/store/...` -> `@/stores/...`
  - **DoD**: `pnpm lint` e `pnpm build` passam.

- **1.2 Remover o diretório antigo**
  - **DoD**: `src/store/` não existe mais; nenhuma referência a `@/store` no repo.

### 2) Criar o esqueleto de `src/core/`
- **2.1 Criar `src/core/adapters/`**
  - **DoD**: pasta existe e está vazia (ou com placeholder), sem alterar runtime.

- **2.2 Criar `src/core/state-machines/`**
  - **DoD**: pasta existe e está vazia (ou com placeholder), sem alterar runtime.

### 3) Iniciar `components/game/*` a partir do `MatchScreen`
- **3.1 Criar pastas**
  - `src/components/game/table/`
  - `src/components/game/hud/`
  - **DoD**: pastas existem.

- **3.2 Extrair componentes inline do `MatchScreen`**
  - Extrair para arquivos dedicados (sem mudar comportamento visual):
    - `OpponentsBar`
    - `GameTable`
    - `PlayerDashboard`
    - `ActionCenter` (ou `ActionPanel`)
  - **DoD**: `MatchScreen` vira orquestrador simples; `pnpm lint` e `pnpm build` passam.

### 4) Preparar fluxo oficial (tirar dependência do DevScreen como “app”)
- **4.1 Criar `Phase` e guard de transição (sem XState)**
  - **DoD**: existe tipo `Phase` e função `canTransition(from,to)` em `src/core/state-machines/`.

- **4.2 Criar `flowStore` em `src/stores/`**
  - **DoD**: `phase`, `setPhaseGuarded`, `resetRun`.

- **4.3 Ajustar `App.tsx` para renderizar screens por fase**
  - Manter `DevScreen` como ferramenta opcional em dev.
  - **DoD**: fluxo jogável básico LOBBY -> DRAFT -> MATCH -> RESULTS sem depender do DevScreen.

### 5) Limpeza de débitos contra rules
- **5.1 Remover emojis do código**
  - **DoD**: nenhuma ocorrência de emoji em `src/`.

## Verificações
- Antes de finalizar cada task/commit:
  - `pnpm lint`
  - `pnpm build`
