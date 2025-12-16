# Design — Estado básico do App + DevTools (preparação para FSM)

## Contexto
Hoje a aplicação tem:
- `ScreenShell` como container do “monitor” (globais).
- `HomeScreen` renderizada diretamente em `App.tsx`.
- `DevToolsOverlay` com capacidade de **pré-visualizar** Screens/Phases por meio de um overlay (`DevOverlayPreview`) que cobre a UI real.

As docs normativas definem:
- Phases do jogo: `LOBBY -> DRAFT -> MATCH -> RESULTS` (`docs/04-arquitetura/maquina-de-estados.md`, `steering/game-flow.md`).
- `HomeScreen` como Screen fora das Phases (nota adicionada).

Problema: para debug e para uma futura FSM, o DevTools precisa manipular **o estado real** do app, não um preview “paralelo”.

## Objetivos de Design
- Separar claramente **estado do App (HOME vs GAME)** do **estado do jogo (Phase)**.
- Manter o código simples (Solo Dev), sem dependências novas.
- Preparar contratos para evolução para uma FSM sem reescrever UI.
- Manter DevTools sempre disponível em DEV via `ScreenShell`.

## Alternativas Consideradas

### A) Continuar com preview overlay (status quo)
**Prós**
- Isola a UI, útil para “snapshot”.
**Contras**
- Não testa o app real (globais, stacking, fluxo).
- Cria “dois mundos” de renderização.
- DevTools não altera estado real, o que atrasa a FSM.

### B) Estado real + override (ESCOLHIDA)
DevTools altera stores reais do app/flow para forçar navegação/phase em DEV.
**Prós**
- Debug realista e alinhado com FSM.
- Menos duplicação de renderização.
**Contras**
- Exige um pequeno store novo (estado do App) e um router simples.

### C) React Router
**Contras**: dependência e complexidade desnecessárias para o MVP; fora do mindset Solo Dev.

## Contratos / Tipos

### Novo: AppState
Criar `src/stores/appShellStore.ts` (nome a confirmar) com:

```ts
export type AppScreen = 'HOME' | 'GAME';

export type DevOverride = {
  enabled: boolean;
  appScreen?: AppScreen;
  phase?: Phase;
};
```

Store:
- `appScreen: AppScreen` (estado real)
- `setAppScreen(next: AppScreen)`
- `devOverride: DevOverride | null`
- `setDevOverride(override: DevOverride)`
- `clearDevOverride()`

### Existente: Flow/Phase
`src/stores/flowStore.ts` mantém Phase e guardas (não introduzir `HOME` aqui).

## Renderização (router simples)
Criar um componente pequeno (ex.: `src/components/app/ScreenRouter.tsx`) que decide a Screen real:

- Resolve `effectiveAppScreen`:
  - se `DEV` e `devOverride.enabled` e `devOverride.appScreen` definido -> usar override
  - senão -> usar `appScreen` real
- Se `HOME` -> renderiza `HomeScreen`
- Se `GAME` -> renderiza Screen por Phase (do `flowStore`), possivelmente via `PhaseRouter` puro.

Nota: `HomeScreen` fora das Phases é garantido aqui.

## DevTools
`DevToolsOverlay` deve evoluir:
- Modo padrão: **alterar estado real** (setar appScreen/phase) ao invés de abrir preview overlay.
- Modo opcional: manter `DevOverlayPreview` como “Preview” (snapshot) se desejado, mas não obrigatório.

## Plano Incremental (migração)
1) Introduzir store do App (`appScreen`) + `ScreenRouter` consumindo o estado real.
2) Ajustar `App.tsx` para renderizar `ScreenRouter` dentro do `ScreenShell` (mantendo globais).
3) Ajustar `HomeScreen` para acionar `enterGame()` (e.g., `setAppScreen('GAME')`) ao clicar “Play”.
4) Ajustar `DevToolsOverlay` para manipular `appScreen` e `phase` reais (override DEV).
5) (Opcional) manter um modo “Preview overlay” separado.

## Riscos e Mitigação
- **Risco**: Dev override “vazar” para produção.
  - Mitigação: gatear UI/ações de override por `import.meta.env.DEV` e manter override em store separado.
- **Risco**: churn grande em screens.
  - Mitigação: alterar apenas `App.tsx`/router + DevTools primeiro; screens continuam “finas”.
- **Risco**: confusão de termos (HOME como phase).
  - Mitigação: `HOME` vive apenas no estado do App; Phases continuam as 4 fases.


