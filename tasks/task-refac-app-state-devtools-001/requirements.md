# Requirements — Estado básico do App + DevTools (EARS)

## Objetivo
Preparar a aplicação para a futura máquina de estados, criando um **estado básico de navegação** que separa:
- **Screen fora das Phases**: `HomeScreen`
- **Phases do jogo**: `LOBBY -> DRAFT -> MATCH -> RESULTS`

E evoluir o DevTools de **preview overlay** para **manipulação do estado real** do app (para debug).

## Requirements (EARS)

### Estado do App (alto nível)
- **Quando** a aplicação iniciar, o sistema **deve** renderizar a `HomeScreen` (Screen fora das Phases).
- **Quando** o usuário iniciar o fluxo do jogo (ex.: “Play/Enter”), o sistema **deve** transicionar do estado `HOME` para o estado `GAME`.
- **Enquanto** o estado do App for `HOME`, o sistema **deve** renderizar apenas a `HomeScreen`.
- **Enquanto** o estado do App for `GAME`, o sistema **deve** renderizar uma Screen derivada da Phase atual do jogo (`LOBBY/DRAFT/MATCH/RESULTS`).

### Phases do jogo (contrato)
- **Quando** o estado do App for `GAME`, o sistema **deve** manter a Phase atual em um store dedicado (ex.: `flowStore`) e permitir transições guardadas.
- **Se** uma transição de Phase for inválida, o sistema **deve** rejeitar a transição e manter a Phase atual.

### ScreenShell (globais)
- **Enquanto** qualquer Screen estiver sendo renderizada, o sistema **deve** manter os elementos globais no `ScreenShell` (background/chat dock/notifications) conforme configuração.
- **Se** o ambiente for `DEV`, o sistema **deve** manter DevTools disponível em qualquer estado do App.

### DevTools (debug do estado real)
- **Se** o ambiente for `DEV`, o sistema **deve** permitir que o DevTools force (override) o estado do App e/ou a Phase para fins de debug.
- **Quando** o usuário ativar override no DevTools, o sistema **deve** refletir esse override na Screen renderizada (sem renderizar preview “paralelo”).
- **Quando** o usuário desativar override no DevTools, o sistema **deve** retornar a renderização ao estado real (sem override).
- **Quando** o usuário selecionar “Preview” no DevTools, o sistema **pode** renderizar um overlay de preview (opcional), desde que não substitua o modo padrão (estado real).

## Critérios de Aceitação
1. A `HomeScreen` deixa de depender de “Phase HOME” e passa a ser controlada por estado do App (`HOME`).
2. `LOBBY/DRAFT/MATCH/RESULTS` continuam como Phases do jogo (contrato).
3. `App.tsx` (ou `ScreenRouter`) renderiza Screen real baseada em estado do App + Phase (sem overlay).
4. DevTools consegue forçar `HOME`/`GAME` e `phase` em DEV, sem preview overlay obrigatório.
5. `pnpm lint` passa.

## Fora do escopo (nesta task)
- Implementar uma FSM completa (XState ou equivalente).
- Persistência de navegação/URL (deep links).
- Histórico de navegação.


