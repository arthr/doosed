# Tasks — Refactor: estado básico do App + DevTools

## Legenda
- `[ ]` - Pendente
- `[~]` - Aguardando Revisão
- `[x]` - Finalizada
- `[-]` - Cancelada

## Lista

- [ ] 1. Criar store do App (HOME vs GAME) + override DEV
  - DoD: existe `appScreen` (`HOME|GAME`), `setAppScreen`, `devOverride`, `setDevOverride`, `clearDevOverride`; TS strict; sem `any`.
  - Commit: `feat(app): adiciona app state (HOME/GAME) e override DEV`

- [ ] 2. Criar `ScreenRouter` (renderização real por estado do App + Phase)
  - DoD: `App.tsx` renderiza `ScreenRouter` dentro do `ScreenShell`; Home fora das Phases; GAME renderiza por Phase (`flowStore.phase`).
  - Commit: `feat(app): adiciona ScreenRouter baseado em appScreen + phase`

- [ ] 3. Conectar `HomeScreen` ao estado do App (entrar no jogo)
  - DoD: botão “Play/Enter” seta `appScreen='GAME'` e inicializa Phase em `LOBBY` (se necessário); sem quebra de layout.
  - Commit: `feat(home): entrar no jogo via appScreen`

- [ ] 4. Refatorar DevTools para manipular estado real (sem preview overlay obrigatório)
  - DoD: DevTools consegue forçar `HOME/GAME` e `phase` reais em DEV; preview overlay vira opcional/modo separado (se mantido).
  - Commit: `refactor(dev): DevTools controla estado real (appScreen/phase)`

- [ ] 5. Revisão e checks
  - DoD: `pnpm lint` e `pnpm build` passam; revisão de imports/nomeação; sem regressões óbvias.
  - Commit: `chore(app): checks finais do refactor app state`


