# Tech Stack (Fonte Normativa) — Dosed

Este arquivo define a stack e guardrails do projeto, e deve permanecer consistente com `docs/06-frontend/stack-e-convencoes.md`.

## Stack atual (conferida no package.json)

### Core
- **React 18**
- **TypeScript 5.2**
- **Vite 5**
- **pnpm**

### Estado
- **Zustand 4.5.x**

### UI/estilização
- **Tailwind CSS 4**
- **Lucide React**
- **tw-animate-css**

> Observação: se componentes tipo shadcn/ui forem usados no futuro, devem ser tratados como decisão explícita e documentada em `docs` (evitar inconsistências).

## Scripts
```bash
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm preview
```

## Guardrails (modo Solo Dev)
- **Evitar novas dependências** sem necessidade real (preferir solução nativa/pequenos utilitários).
- **Tailwind-first**: evitar CSS adicional fora do padrão do projeto.
- **Zustand como estado global** (evitar Redux/Context para state global).
- **Separação de camadas**: components (UI) → hooks (bridge) → store (state) → core/utils (puro/determinístico).
- **TypeScript strict** e evitar `any`.

## Multiplayer (diretriz)
- **Server-authoritative** (Edge Functions) + UI otimista com rollback.
- **Event-driven** com no máximo 8 tipos de evento (ver `docs/04-arquitetura/eventos.md`).
