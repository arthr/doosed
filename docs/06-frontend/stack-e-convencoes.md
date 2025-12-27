# Frontend — Stack e convenções

## Stack
- React + TypeScript + Vite
- Tailwind v4
- Zustand (+ Immer para imutabilidade)
- Animações: CSS transitions (e utilitários de animação leves quando necessário)

## Restrições
- Evitar novas libs sem justificativa.
- Tailwind-first.

## Convenções

### Nomenclatura de arquivos
- **Componentes em `src/components/ui/`**: kebab-case (ex.: `glow-button.tsx`, `scroll-area.tsx`)
  - Segue o padrão shadcn/ui para componentes de biblioteca/design system
  - Facilita identificar componentes "primitivos" reutilizáveis
- **Componentes em outras pastas**: PascalCase (ex.: `LobbyScreen.tsx`, `ChatPanel.tsx`)
  - Componentes de domínio/aplicação seguem convenção React tradicional

### Outras convenções
- Hooks com prefixo `use`
- Interfaces para props
- Exports nomeados (evitar default export)

## Screens (composição)
- Screen deve ser “fina”: orquestração + composição de seções.
- Componentes de UI específicos devem viver em `src/components/<dominio>/...` (ex.: `home/`, `lobby/`, `match/`, `results/`, `dev/`).
- `src/components/ui/` deve conter apenas componentes realmente genéricos (promover por evidência de reuso).

## ScreenShell (container do “monitor”)
O app deve ter um **router simples** no topo que escolhe a Screen atual a partir do estado global do jogo.
Na prática, isso vive em `src/App.tsx` e é baseado em `match.phase`, com Error Boundary para fallback.

### Nota sobre fases vs screens
- As **Phases do jogo** são: `LOBBY -> DRAFT -> MATCH -> SHOPPING -> RESULTS`.
- A `HomeScreen` é uma **Screen fora das Phases** (antes de entrar no fluxo do jogo).

## Estado básico do App (preparação para FSM)
Para evitar confusão entre **Screen** e **Phase**, o app deve separar:
- **AppScreen** (alto nível): `HOME | GAME`
- **Phase** (jogo): `LOBBY | DRAFT | MATCH | SHOPPING | RESULTS`

### Regras
- `HomeScreen` deve ser controlada por `AppScreen=HOME` (não é Phase).
- Enquanto `AppScreen=GAME`, a Screen renderizada deve ser derivada da `Phase`.

### Implementação recomendada (sem libs extras)
- Implementação atual: `src/App.tsx` resolve a Screen via `match.phase` e renderiza `HomeScreen` quando ainda não existe uma partida.

## Convenções de export
- Preferir **exports nomeados** no código do domínio e componentes.
- `default export` é aceitável para **entrypoints** (ex.: `App.tsx`) quando simplifica integração com tooling.
