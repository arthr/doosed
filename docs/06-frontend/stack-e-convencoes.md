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
- Components PascalCase
- Hooks com prefixo use
- Interfaces para props

## Screens (composição)
- Screen deve ser “fina”: orquestração + composição de seções.
- Componentes de UI específicos devem viver em `src/components/<dominio>/...` (ex.: `home/`, `lobby/`, `match/`, `results/`, `dev/`).
- `src/components/ui/` deve conter apenas componentes realmente genéricos (promover por evidência de reuso).
