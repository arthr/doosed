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
