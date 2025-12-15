# Design — Refactor: decomposição das Screens em subcomponentes

## Contexto (por quê)
As Screens são o ponto de entrada de UX e tendem a crescer rápido. Sem decomposição, ficam difíceis de:
- evoluir sem churn
- testar/validar mentalmente
- reaproveitar peças de UI
- mapear o que deve virar “kit UI” (substituível) vs o que é “domínio do jogo”

Já temos um bom precedente: `DraftScreen` usa componentes extraídos em `src/components/draft/*` e deixa a Screen como orquestração.

## Objetivo técnico
Padronizar o estilo de decomposição em todas as Screens (`Home`, `Lobby`, `Draft`, `Match`, `Results`, `Dev`) criando subcomponentes por domínio e registrando candidatos ao kit UI.

## Princípios
- **Screen fina**: Screen faz wiring de estado/stores e monta seções. Render “pesado” e repetição ficam em componentes.
- **Domínio primeiro**: por padrão, componentes vão para `src/components/<dominio>/...`.
- **Kit UI por evidência**: promover para `src/components/ui/` apenas quando houver forte sinal de reuso. Nesta task, a regra é **mapear** candidatos com justificativa; promoção/migração pode ser incremental.
- **Sem wrapper global novo**: nada de `ScreenRoot` (pedido explícito).

## Contratos (estrutura e local)

## Critérios de extração (quando dividir)
O objetivo é manter a Screen como **orquestração** (composição + estado) e mover UI repetitiva/complexa para subcomponentes.

Extrair subcomponentes quando:
- houver **repetição de bloco** (ex.: lista de cards/linhas/botões com variações de props)
- houver **seções** bem definidas (Header / Content / Footer) que possam virar blocos nomeados
- o JSX estiver **profundo** (muitos níveis) ou difícil de “escaneiar”
- o componente estiver misturando **responsabilidades** (layout + formatação de dados + interação + efeitos visuais)
- existirem elementos claramente **presentational** (ex.: `XpBar`, `StatRow`) que podem ser isolados

Não extrair (ainda) quando:
- for apenas um “inline” pequeno e autocontido (evitar over-engineering)
- for um bloco altamente volátil enquanto ainda está “explorando” a UI (sem padrão estável)

## Regra de destino (onde o componente vive)
Alinhado à estrutura alvo Renovada (`docs/00-start-here/estrutura-do-projeto.md`) e ao `steering/structure.md`:
- **Padrão**: `src/components/<dominio>/...` (ex.: `home`, `lobby`, `results`, `dev`, `match`)
- **UI kit** (`src/components/ui/...`): somente quando o componente for realmente genérico
- **Reuso antes de criar novo**: se já existir um componente de domínio equivalente em `src/components/<dominio>`, preferir reutilizar e remover duplicações inline na Screen.

## Rubrica: candidato ao kit UI vs domínio
Nesta task, a regra é **mapear** candidatos (com justificativa). Promoção para `ui/` pode acontecer em passos incrementais.

Um subcomponente é **candidato ao kit UI** quando:
- é majoritariamente **presentational** (pouca/nenhuma regra de domínio)
- não depende de `types` de domínio (ex.: `types/lobby`, `types/match`) ou stores específicas
- tem props **genéricas** (ex.: `title`, `subtitle`, `variant`, `onClick`) e não nomes “do jogo”
- tem potencial de uso em **2+ screens** (ou já tem reuso comprovado)
- é testável/avaliável isoladamente (visual/estados simples)

Um subcomponente é **domínio** quando:
- representa uma entidade/fluxo do jogo (ex.: HUD do match, grid de jogadores, mesa/pool)
- depende de stores/contratos do domínio ou de regras de UX específicas do modo
- tem nomenclatura e comportamento “acoplados” (ex.: `OpponentsBar`, `PlayerDashboard`)

### Localização
- `src/screens/<X>Screen.tsx`: orquestração + composição de seções.
- `src/components/<dominio>/...`: subcomponentes do domínio.
- `src/components/ui/...`: somente itens realmente genéricos.

### Convenções
- Components em PascalCase e exports nomeados.
- Props com `interface`.
- Tailwind-first.

## Inventário atual e proposta de decomposição

### `DraftScreen` (referência)
- **Estado**: `useDraftShopMock`.
- **Componentes já extraídos**: `draft/Header`, `draft/ShopItem`, `draft/InventorySlot`, `ui/ActionDock`, `chat/Chat`.
- **Ajuste sugerido**: manter; só reduzir o que ficar “mock/constante” grande na Screen quando começar a atrapalhar.

### `HomeScreen`
- **Blocos atuais**: `GameButton`, `InfoCard`, `FloatingDecoration`, background/hero.
- **Proposta**:
  - `src/components/home/HomeTitle.tsx` (logo/títulos)
  - `src/components/home/HomeMenuButton.tsx` (hoje `GameButton`)
  - `src/components/home/HomeInfoCard.tsx` (hoje `InfoCard`)
  - `src/components/home/HomeDecorations.tsx` (portal gun + cromolum)
  - `src/components/home/HomeBackground.tsx` (fundo/estrelas)
- **Candidatos ao kit UI**:
  - `HomeMenuButton` (pode virar `ui/NeonMenuButton` quando reutilizado)
  - `HomeInfoCard` (pode virar `ui/InfoCard` quando reutilizado)

### `LobbyScreen`
- **Situação atual**: já existe um domínio `src/components/lobby/*` (ex.: `RoomHeader`, `PlayerGrid`, `LobbyPanel`, `LobbyButton`, etc.), mas a Screen pode conter UI inline que replica esses padrões.
- **Proposta**: fazer `LobbyScreen` compor **preferencialmente** com `src/components/lobby/*` e remover duplicações inline (reuso antes de criar novo).
- **Candidatos ao kit UI**:
  - `lobby/LobbyPanel` e `lobby/LobbyButton` são bons candidatos (podem evoluir para variantes genéricas em `ui/` no futuro).

### `MatchScreen`
- **Situação atual**: Screen já é fina e compõe `components/match/hud/*` + `components/match/table/*`.
- **Proposta**:
  - manter `MatchScreen` como orquestração
  - revisar se os componentes importados precisam de decomposição interna (ex.: HUD do jogador), mas tratar isso como refactor dentro do domínio `components/match/*`.
- **Candidatos ao kit UI**:
  - itens genéricos que surgirem dentro do HUD (ex.: barras, badges, cards) devem ser mapeados; o HUD em si é domínio.

### `ResultScreen`
- **Blocos atuais**: `StatRow`, `XpBar`, `LootDisplay`, área hero e ações.
- **Proposta**:
  - `src/components/results/ResultsHero.tsx`
  - `src/components/results/ResultsStats.tsx` (+ `StatRow`)
  - `src/components/results/ResultsXpBar.tsx`
  - `src/components/results/ResultsRewards.tsx` (+ `LootDisplay`)
  - `src/components/results/ResultsActions.tsx`
- **Candidatos ao kit UI**:
  - `StatRow` (pode virar `ui/KeyValueRow`)
  - `ResultsXpBar` (pode virar `ui/ProgressBar`)

### `DevScreen`
- **Blocos atuais**: overlay preview, dock draggable (FAB), popup/menu, seção de notification.
- **Proposta**:
  - `src/components/dev/DevOverlayPreview.tsx`
  - `src/components/dev/DevDock.tsx` (drag + estado de posição)
  - `src/components/dev/DevMenu.tsx` (conteúdo do menu)
  - `src/components/dev/NotificationPlayground.tsx` (sample/controls)
- **Candidatos ao kit UI**:
  - `DevDock` (pode virar `ui/DraggableDock` quando houver outro caso de uso)

## Alternativas consideradas
- **A) Criar um wrapper/ScreenShell compartilhado**
  - Prós: padronização imediata.
  - Contras: rejeitado (pedido explícito).
- **B) Decompor por domínio (escolhida)**
  - Prós: baixo acoplamento, permite migração incremental, prepara kit UI.
  - Contras: risco de proliferação de pastas; mitigado por convenção e critérios de extração.

## Plano incremental (migração)
- Uma Screen por commit.
- Manter compatibilidade de imports/export quando necessário.
- Validar via `DevScreen` ao final de cada etapa relevante.

## Riscos e mitigação
- **Risco**: regressões sutis de layout/scroll.
  - Mitigação: commits pequenos, revisão visual rápida no `pnpm dev` e checks `lint/build`.
- **Risco**: duplicação de componentes (Screen inline vs `src/components/<dominio>` já existente).
  - Mitigação: preferir reutilizar o que já está em `src/components/*` e remover duplicações.
