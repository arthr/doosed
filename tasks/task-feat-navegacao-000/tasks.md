# Tasks — Navegação entre Telas

## Legenda
- `[ ]` - Pendente
- `[~]` - Aguardando Revisão
- `[x]` - Finalizada
- `[-]` - Cancelada

## Lista

### Fase 1: Preparar App.tsx
- [x] 1.1 Atualizar `App.tsx` para renderização condicional baseada em `phase`
  - DoD: `App.tsx` importa todas as screens; renderiza screen correta baseado em `flowStore.phase`; `pnpm lint` passa.

### Fase 2: Conectar HomeScreen
- [x] 2.1 Adicionar handlers `onClick` nos botões "ENTER THE VOID" e "MULTIPLAYER"
  - DoD: Botões chamam `setPhaseGuarded('LOBBY')`; transição Home -> Lobby funciona; nenhum erro no console.

### Fase 3: Conectar LobbyScreen
- [x] 3.1 Adicionar botão "Start" ou "Ready" no `LobbyScreen`
  - DoD: Botão chama `setPhaseGuarded('DRAFT')`; transição Lobby -> Draft funciona.

### Fase 4: Conectar DraftScreen
- [x] 4.1 Adicionar lógica de transição no evento de "Confirmar" do Draft
  - DoD: Botão "Confirmar" chama `setPhaseGuarded('MATCH')`; transição Draft -> Match funciona.

- [x] 4.2 (Futuro) Adicionar transição automática quando timer expirar
  - DoD: Quando timer chegar a 0, chamar `setPhaseGuarded('MATCH')`.
  - Nota: Timer ainda não existe; deixar como placeholder/comentário.

### Fase 5: Conectar MatchScreen (placeholder)
- [x] 5.1 Adicionar botão temporário "End Match" no `MatchScreen`
  - DoD: Botão chama `setPhaseGuarded('RESULTS')`; transição Match -> Results funciona.
  - Nota: Este botão será removido quando lógica real de match for implementada.

### Fase 6: Conectar ResultScreen
- [x] 6.1 Adicionar botões "Play Again" e "Main Menu" no `ResultScreen`
  - DoD: "Play Again" chama `resetRun()` (volta para LOBBY); "Main Menu" chama `setPhaseGuarded('HOME')`; ambas transições funcionam.

### Fase 7: Polimento e Testes
- [x] 7.1 Adicionar notificação quando transição for rejeitada (opcional)
  - DoD: Se `setPhaseGuarded` rejeitar transição (retorna `false`), exibir notificação via `notificationStore`.

- [x] 7.2 Ajustar `DevScreen` para manter controles de phase funcionais
  - DoD: Controles de phase no `DevScreen` continuam funcionando; não interferem com navegação real.

- [x] 7.3 Teste manual do fluxo completo
  - DoD: Home -> Lobby -> Draft -> Match -> Results -> Home funciona sem erros; `pnpm lint && pnpm build` passam.

- [x] 7.4 Atualizar `docs/` se necessário
  - DoD: Se houver mudanças arquiteturais relevantes, atualizar documentação.

- [x] 7.5 Commit final
  - DoD: Commit com mensagem: `feat(nav): implementa navegacao entre telas do fluxo principal`.

## Verificações
Antes de finalizar cada item:
- `pnpm lint`
- `pnpm build`
- Teste manual da transição implementada
