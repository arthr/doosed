---
trigger: always_on
glob:
description: Always apply: frontend (React/TS/Tailwind/Zustand)
---

## Stack
- Antes de afirmar versões, conferir `package.json`.
- Stack esperada: React 18, Vite 5, TypeScript 5.2, Tailwind 4, Zustand 4.5.x.

## Convenções
- Components: PascalCase, exports nomeados.
- Props: `interface`.
- Hooks: prefixo `use`, retornar objeto nomeado.

## Tailwind
- Tailwind-first.
- Evitar CSS adicional fora do padrão do projeto.

## Estado
- Zustand para estado global.
- Preferir seletores granulares; evitar desestruturação em loops/callbacks.

## Dependências
- Não adicionar libs novas sem pedido explícito.
