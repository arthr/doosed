# Frontend — Stack e convenções

## Stack
- React + TypeScript + Vite
- Tailwind v4
- Zustand
- Framer Motion

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
- A aplicação deve ter um **container único** no topo (o “monitor”) responsável por **overlays globais** e por renderizar a Screen atual dentro do viewport.
- Nome: `ScreenShell`
- Local: `src/components/app/ScreenShell.tsx`

### Responsabilidades do ScreenShell
- Renderizar **background global** (decorativo) quando aplicável.
- Renderizar **Chat dock** e **NotificationBar** (globais).
- Renderizar **dev tools** apenas em DEV (ex.: dock/preview), fora das Screens.
- Renderizar a **Screen atual** via `children`.

### Nota sobre fases vs screens
- As **Phases do jogo** são: `LOBBY -> DRAFT -> MATCH -> RESULTS`.
- A `HomeScreen` é uma **Screen fora das Phases** (antes de entrar no fluxo do jogo).

## Estado básico do App (preparação para FSM)
Para evitar confusão entre **Screen** e **Phase**, o app deve separar:
- **AppScreen** (alto nível): `HOME | GAME`
- **Phase** (jogo): `LOBBY | DRAFT | MATCH | RESULTS`

### Regras
- `HomeScreen` deve ser controlada por `AppScreen=HOME` (não é Phase).
- Enquanto `AppScreen=GAME`, a Screen renderizada deve ser derivada da `Phase`.

### Implementação recomendada (sem libs extras)
- Criar um store do app (ex.: `appShellStore`) com `appScreen` e um `devOverride` (apenas DEV).
- Criar um `ScreenRouter` (componente pequeno) que resolve a Screen real baseada em:
  - `appScreen` (estado real)
  - `phase` (do `flowStore`)
  - `devOverride` (somente DEV)
