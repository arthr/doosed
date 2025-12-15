# Tasks — Core do Match (Gameplay)

## Legenda
- `[ ]` - Pendente
- `[~]` - Aguardando Revisão
- `[x]` - Finalizada
- `[-]` - Cancelada

## Lista

### Fase 1: Expandir tipos e estado
- [ ] 1.1 Atualizar `src/types/game.ts` com tipos completos
  - DoD: `PillType`, `Pill`, `PlayerState`, `OpponentState`, `AIDifficulty`, `AIConfig` definidos; `pnpm lint` passa.

- [ ] 1.2 Expandir `gameStore` com estado do match
  - DoD: `gameStore` tem `round`, `turn`, `pool`, `counters`, `player`, `opponents`, `currentPlayer`; estado inicial definido.

- [ ] 1.3 Criar ações `initMatch` e `resetMatch` no `gameStore`
  - DoD: `initMatch(difficulty)` inicializa estado; `resetMatch()` limpa estado; ambas funcionam sem erros.

### Fase 2: Sistema de Pool
- [ ] 2.1 Criar função `calculatePoolSize(round)`
  - DoD: Retorna tamanho correto do pool baseado na rodada (baseCount=6, increaseBy=1, frequency=3, maxCap=12).

- [ ] 2.2 Criar função `getPillDistribution(round)`
  - DoD: Retorna distribuição percentual de cada `PillType` baseado na rodada (seguir progressão em `pills.md`).

- [ ] 2.3 Criar função `generatePool(round)`
  - DoD: Retorna array de `Pill[]` com distribuição correta; pool tem tamanho correto; sem pílulas duplicadas (IDs únicos).

- [ ] 2.4 Integrar `generatePool` no `initMatch`
  - DoD: Ao iniciar match, pool é gerado automaticamente; contadores refletem pool corretamente.

### Fase 3: UI do Pool (Contadores)
- [ ] 3.1 Atualizar `GameTable` para exibir contadores de pílulas
  - DoD: `GameTable` renderiza contadores para cada `PillType`; contadores conectados com `gameStore.counters`.

- [ ] 3.2 Testar UI de contadores
  - DoD: Ao gerar pool, contadores refletem quantidade correta de cada tipo.

### Fase 4: Sistema de Turnos (básico)
- [ ] 4.1 Criar ação `startTurn()` no `gameStore`
  - DoD: Define quem joga primeiro (player ou opponent) de forma determinística.

- [ ] 4.2 Criar ação `endTurn()` no `gameStore`
  - DoD: Alterna `currentPlayer` entre 'player' e 'opponent'; incrementa `turn`.

- [ ] 4.3 Atualizar UI para indicar turno atual
  - DoD: `MatchScreen` ou `GameTable` mostra visualmente de quem é o turno.

### Fase 5: Escolha de Pílulas (Player)
- [ ] 5.1 Criar ação `choosePill(pillId)` no `gameStore`
  - DoD: Remove pílula do pool; atualiza contadores; revela tipo da pílula.

- [ ] 5.2 Tornar pílulas clicáveis no `GameTable`
  - DoD: Ao clicar em pílula, chama `choosePill(pillId)`; apenas durante turno do player.

- [ ] 5.3 Testar escolha de pílula
  - DoD: Escolher pílula remove do pool e atualiza contadores; turno avança automaticamente.

### Fase 6: Aplicação de Efeitos
- [ ] 6.1 Criar função `applyPillEffect(pill, target)`
  - DoD: Aplica efeito correto para cada `PillType` (SAFE, DMG_LOW, DMG_HIGH, HEAL, FATAL, LIFE).

- [ ] 6.2 Integrar `applyPillEffect` no `choosePill`
  - DoD: Ao escolher pílula, efeito é aplicado no jogador correto (player ou opponent).

- [ ] 6.3 Testar efeitos de pílulas
  - DoD: Cada tipo de pílula aplica efeito correto; health atualizado; UI reflete mudanças.

### Fase 7: IA Básica
- [ ] 7.1 Criar função `chooseAIPill(pool, counters, aiState, config)`
  - DoD: IA escolhe pílula de forma determinística; heurística simples implementada.

- [ ] 7.2 Integrar IA no sistema de turnos
  - DoD: Quando `currentPlayer === 'opponent'`, IA escolhe pílula automaticamente após delay (ex.: 1s).

- [ ] 7.3 Testar IA
  - DoD: IA faz escolhas válidas; efeitos aplicados corretamente no oponente.

### Fase 8: Detecção de Vitória/Derrota
- [ ] 8.1 Criar função `checkGameOver()` no `gameStore`
  - DoD: Detecta vitória (todos oponentes mortos) ou derrota (player morto); transiciona para `RESULTS`.

- [ ] 8.2 Integrar `checkGameOver` após aplicação de efeitos
  - DoD: Após cada pílula, verifica game over; transição para `RESULTS` funciona.

- [ ] 8.3 Passar resultado para `ResultScreen`
  - DoD: `ResultScreen` recebe status (vitória/derrota) e exibe corretamente.

### Fase 9: Feedback Visual
- [ ] 9.1 Atualizar `PlayerDashboard` para refletir health
  - DoD: Barra de vida atualiza em tempo real; valores corretos.

- [ ] 9.2 Atualizar `OpponentsBar` para refletir health e status
  - DoD: Oponentes mostram health; oponentes mortos exibem estado "morto".

- [ ] 9.3 Adicionar feedback de reveal de pílula (opcional)
  - DoD: Ao revelar pílula, animação simples (cor, ícone) indica tipo.

### Fase 10: Progressão de Rodadas
- [ ] 10.1 Detectar pool vazio e gerar nova rodada
  - DoD: Quando pool esvaziar, `round` incrementado; novo pool gerado automaticamente.

- [ ] 10.2 Testar progressão
  - DoD: Match progride por múltiplas rodadas; pool sempre tem pílulas disponíveis até game over.

### Fase 11: Polimento e Testes
- [ ] 11.1 Adicionar delay entre turnos da IA
  - DoD: IA espera 1-2s antes de escolher pílula (jogabilidade).

- [ ] 11.2 Adicionar logs no `GameLogPanel`
  - DoD: Eventos importantes logados (escolhas, dano, cura, eliminação).

- [ ] 11.3 Teste manual completo
  - DoD: Jogar partida completa (solo vs IA); vitória/derrota funciona; sem erros.

- [ ] 11.4 Verificação final
  - DoD: `pnpm lint && pnpm build` passam; nenhum warning.

- [ ] 11.5 Atualizar docs se necessário
  - DoD: Se houver mudanças arquiteturais, atualizar documentação.

- [ ] 11.6 Commit final
  - DoD: Commit com mensagem: `feat(match): implementa core gameplay (pool, turnos, efeitos, ia basica)`.

## Verificações
Antes de finalizar cada item:
- `pnpm lint`
- `pnpm build`
- Teste manual (quando aplicável)
