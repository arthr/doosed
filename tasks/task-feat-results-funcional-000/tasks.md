# Tasks — Results Funcional

## Legenda
- `[ ]` - Pendente
- `[~]` - Aguardando Revisão
- `[x]` - Finalizada
- `[-]` - Cancelada

## Lista

### Fase 1: Criar progressionStore
- [ ] 1.1 Criar `src/stores/progressionStore.ts`
  - DoD: Store criado com estado inicial (level, xp, xpToNextLevel, schmeckles); `pnpm lint` passa.

- [ ] 1.2 Criar ações `addXP`, `addSchmeckles`, `reset`
  - DoD: `addXP(amount)` incrementa XP e detecta level up; `addSchmeckles(amount)` incrementa saldo; `reset()` limpa estado.

### Fase 2: Estatísticas do Match
- [ ] 2.1 Adicionar `MatchStats` ao `src/types/game.ts`
  - DoD: Interface `MatchStats` definida (roundsPlayed, pillsChosen, damageTaken, healingReceived, opponentsKilled, won).

- [ ] 2.2 Integrar `MatchStats` no `gameStore`
  - DoD: `gameStore` tem `stats: MatchStats`; stats inicializadas corretamente.

- [ ] 2.3 Incrementar stats durante o match
  - DoD: Ao escolher pílula, `pillsChosen++`; ao tomar dano, `damageTaken += dano`; ao curar, `healingReceived += cura`; ao eliminar oponente, `opponentsKilled++`.

- [ ] 2.4 Setar `won` ao terminar match
  - DoD: `checkGameOver()` seta `won = true` se vitória, `won = false` se derrota.

### Fase 3: Cálculo de XP
- [ ] 3.1 Criar `src/lib/xpCalculation.ts`
  - DoD: Arquivo criado com funções `calculateXP(stats)` e `getXPForLevel(level)`.

- [ ] 3.2 Implementar `calculateXP(stats)`
  - DoD: Retorna XP correto baseado em vitória/derrota, rodadas, eliminações.

- [ ] 3.3 Implementar `getXPForLevel(level)`
  - DoD: Retorna XP necessário para próximo nível (progressão quadrática: 100 * level^1.5).

- [ ] 3.4 Testar cálculo de XP
  - DoD: XP calculado corretamente para diferentes cenários (vitória/derrota, múltiplas rodadas, múltiplas eliminações).

### Fase 4: Conectar ResultScreen
- [ ] 4.1 Atualizar `ResultScreen` para ler `matchStats` do `gameStore`
  - DoD: `ResultScreen` exibe stats (rodadas, pílulas, dano, curas, eliminações).

- [ ] 4.2 Exibir resultado (vitória/derrota)
  - DoD: Texto "VICTORY" ou "DEFEAT" exibido baseado em `stats.won`.

- [ ] 4.3 Testar exibição de stats
  - DoD: Stats corretas exibidas após match.

### Fase 5: Progressão de XP
- [ ] 5.1 Calcular XP ao entrar no ResultScreen
  - DoD: Ao montar `ResultScreen`, calcular XP ganho com `calculateXP(matchStats)`.

- [ ] 5.2 Chamar `progressionStore.addXP(xpGanho)`
  - DoD: XP incrementado no `progressionStore`.

- [ ] 5.3 Animar barra de XP
  - DoD: Barra de XP anima incremento gradual (ex.: setInterval incrementando valor visual até atingir XP final).

- [ ] 5.4 Detectar e exibir level up
  - DoD: Se `addXP` retornar true (level up), exibir feedback visual (ex.: "LEVEL UP!").

- [ ] 5.5 Testar progressão de XP
  - DoD: XP incrementa corretamente; level up detectado; animação funciona.

### Fase 6: Recompensas (Schmeckles)
- [ ] 6.1 Calcular Schmeckles ganhos
  - DoD: Fórmula simples (ex.: vitória = 50, derrota = 10, + bônus por stats).

- [ ] 6.2 Chamar `progressionStore.addSchmeckles(schmecklesGanhos)`
  - DoD: Schmeckles incrementados no store.

- [ ] 6.3 Exibir recompensa no ResultScreen
  - DoD: `ResultScreen` exibe Schmeckles ganhos.

- [ ] 6.4 Testar recompensas
  - DoD: Schmeckles calculados e incrementados corretamente.

### Fase 7: Ações Pós-Partida
- [ ] 7.1 Conectar botão "Play Again"
  - DoD: Botão chama `flowStore.resetRun()` e `gameStore.reset()`; transiciona para LOBBY.

- [ ] 7.2 Conectar botão "Main Menu"
  - DoD: Botão chama `flowStore.setPhaseGuarded('HOME')` e `gameStore.reset()`; transiciona para HOME.

- [ ] 7.3 Testar ações pós-partida
  - DoD: Ambos botões funcionam; estado resetado corretamente.

### Fase 8: Polimento e Testes
- [ ] 8.1 Adicionar animação de entrada do ResultScreen (opcional)
  - DoD: Screen aparece com animação suave (ex.: fade-in).

- [ ] 8.2 Melhorar animação da barra de XP
  - DoD: Animação fluida; speed ajustável.

- [ ] 8.3 Adicionar placeholder para "Report" (multiplayer futuro)
  - DoD: Botão "Report" presente mas desabilitado (ou oculto em solo).

- [ ] 8.4 Teste manual completo
  - DoD: Fluxo Results funciona: stats corretas, XP incrementa, level up detectado, botões funcionam; sem erros.

- [ ] 8.5 Verificação final
  - DoD: `pnpm lint && pnpm build` passam; nenhum warning.

- [ ] 8.6 Atualizar docs se necessário
  - DoD: Se houver mudanças arquiteturais, atualizar documentação.

- [ ] 8.7 Commit final
  - DoD: Commit com mensagem: `feat(results): implementa results funcional (stats, xp, recompensas, acoes pos-partida)`.

## Verificações
Antes de finalizar cada item:
- `pnpm lint`
- `pnpm build`
- Teste manual (quando aplicável)
