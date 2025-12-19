---
trigger: always_on
glob:
description: Always apply: padrões de Code Style
---


# Code Style (DOSED)

Este documento consolida o padrão de código do projeto para manter consistência e velocidade em modo Solo Dev.

## Fonte da verdade
- Documentação de produto/arquitetura: `docs/`
- Estrutura alvo do projeto: `docs/00-start-here/estrutura-do-projeto.md`
- Stack atual: conferir `package.json` e `steering/tech.md`

## Regras gerais
- Não usar emojis.
- Evitar over-engineering: preferir soluções simples e testáveis.
- Evitar adicionar dependências novas sem necessidade real.

## React
- Componentes sempre funcionais.
- Exports nomeados (evitar default export).
- Props tipadas com `interface`.
- Componentes pequenos e focados (ideal: < 200 linhas).
- Preferir composição a herança.

Exemplo:

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

## TypeScript
- Manter `strict` ligado.
- Evitar `any`; usar `unknown` quando necessário.
- Interfaces para objetos; types para unions/primitivos.
- Tipar explicitamente boundaries (ex.: payloads de eventos, dados externos).

## Hooks
- Prefixo `use` obrigatório.
- Retornar objeto nomeado (evitar array).
- Se o hook ficar complexo, documentar com JSDoc.

```tsx
export function useGameActions() {
  const startGame = useGameStore(s => s.startGame);
  const resetGame = useGameStore(s => s.resetGame);

  return { startGame, resetGame };
}
```

## Zustand (stores)
- Preferir seletores granulares (`useStore(s => s.x)`) para evitar re-render.
- Evitar desestruturar store dentro de loops/callbacks.
- Estado deve ser imutável e serializável (especialmente o estado de MATCH).

## Tailwind
- Tailwind-first.
- Evitar CSS extra fora do padrão do projeto.
- Agrupar classes logicamente (layout, spacing, colors, states).

## Arquitetura (referência rápida)
- Camadas: components (UI) -> hooks (bridge) -> stores (state) -> core/utils (puro/determinístico) -> adapters/infra.
- Fases: LOBBY -> DRAFT -> MATCH -> RESULTS.
- Eventos: no máximo 8 tipos (preferir macro tipos e granularidade via `action`/`subtype`).
