# Feature Specification: DOSED MVP - Pill Roulette Game

**Feature Branch**: `001-dosed-mvp`  
**Created**: 2025-12-25  
**Status**: Draft  
**Input**: User description: "Jogo de turnos tipo roleta russa com pílulas desconhecidas inspirado em Rick and Morty - implementar vertical slice MVP (Home -> Lobby solo -> Draft -> Match vs IA -> Results)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Jogar Partida Solo Completa (Priority: P1) 🎯 MVP

Um jogador abre o jogo e consegue jogar uma partida completa do início ao fim contra um bot, experimentando todo o core loop do gameplay: selecionar loadout, consumir pílulas desconhecidas em turnos, usar itens estratégicos e ver o resultado final com estatísticas.

**Why this priority**: Este é o coração do jogo - o vertical slice MVP. Sem isso, não há jogo jogável. Entrega a experiência fundamental de "roleta russa farmacêutica" que define o DOSED.

**Independent Test**: Pode ser completamente testado iniciando o jogo, criando uma sala solo, completando draft e match até ver os resultados. Entrega valor imediato: um jogo funcional e divertido.

**Acceptance Scenarios**:

1. **Given** o jogador está na tela Home, **When** clica em "ENTER THE VOID" (modo solo), **Then** é levado para Lobby com opção de adicionar bots
2. **Given** o jogador está no Lobby com 1 bot configurado, **When** clica em "Start", **Then** entra na fase Draft com timer ativo
3. **Given** o jogador está no Draft, **When** seleciona itens para o inventário (até 8 slots) e confirma ou timer expira, **Then** entra na fase Match
4. **Given** o jogador está na Match no seu turno, **When** escolhe uma pílula do pool, **Then** a pílula é revelada, seus efeitos aplicados (dano/cura/vida), e o turno passa
5. **Given** o jogador consumiu uma pílula nociva e sua Resistência chegou a 0, **When** o efeito é aplicado, **Then** ocorre Colapso (Vidas -1, Resistência resetada ao máximo), com feedback visual claro
6. **Given** o jogador ou bot ficou com 0 Vidas, **When** o Colapso final ocorre, **Then** o jogador/bot é eliminado e marcado visualmente como "morto"
7. **Given** apenas 1 sobrevivente resta ou pool acabou, **When** a condição de vitória é atingida, **Then** a partida termina e vai para Results
8. **Given** o jogador está na tela Results, **When** vê estatísticas da partida, **Then** pode ver resumo de pílulas consumidas, dano causado/recebido, e opção de jogar novamente
9. **Given** o jogador está na Match, **When** visualiza o painel de contadores do pool, **Then** vê claramente quantas pílulas nocivas e não-nocivas restam (contadores por tipo)
10. **Given** a Resistência do jogador está no máximo e recebe cura, **When** Overflow positivo está ativo, **Then** ganha Resistência extra (camada adicional acima do máximo) visível na UI

---

### User Story 2 - Economia de Partida (Pill Coins + Loja) (Priority: P2)

Um jogador durante a partida completa Shape Quests (sequências de formas de pílulas) para ganhar Pill Coins e pode abrir a Loja durante seu turno para comprar itens estratégicos que ajudam na sobrevivência e estratégia.

**Why this priority**: Adiciona profundidade estratégica e economia interna à partida. Transforma o jogo de pura sorte em um jogo de escolhas significativas. É essencial para o pilar "Escolhas significativas".

**Independent Test**: Pode ser testado numa partida verificando se: (1) Shape Quests aparecem e concedem Pill Coins ao serem completados, (2) Loja abre corretamente, (3) itens podem ser comprados e usados.

**Acceptance Scenarios**:

1. **Given** o jogador inicia uma partida, **When** entra na Match, **Then** recebe 1-2 Shape Quests iniciais exibidas na HUD
2. **Given** o jogador tem uma Shape Quest ativa (ex.: Sphere -> Cube), **When** consome pílulas na sequência correta, **Then** progresso da quest avança visualmente
3. **Given** o jogador completa uma Shape Quest, **When** a sequência é finalizada, **Then** recebe 1 Pill Coin com feedback visual/sonoro
4. **Given** o jogador erra a sequência de uma Shape Quest, **When** consome shape incorreto, **Then** progresso da quest é resetado com indicação visual
5. **Given** o jogador tem Pill Coins, **When** clica em "Shop" no seu turno, **Then** a Loja abre como overlay sobre a Match
6. **Given** o jogador está na Loja, **When** seleciona um item e tem Pill Coins suficientes, **Then** pode comprar o item (vai para inventário se houver espaço)
7. **Given** o jogador comprou um item, **When** usa o item no seu turno (antes de escolher pílula), **Then** o efeito do item é aplicado (Intel/Sustain/Control/Chaos) e o item é consumido
8. **Given** o inventário do jogador está cheio (8 slots), **When** tenta comprar novo item, **Then** recebe indicação de que precisa liberar espaço ou não pode comprar

---

### User Story 3 - Progressão Persistente (XP + Schmeckles) (Priority: P3)

Um jogador ao finalizar partidas acumula XP e ganha Schmeckles (meta-moeda), criando senso de progressão e recompensa ao longo de múltiplas sessões de jogo.

**Why this priority**: Adiciona retenção e motivação para jogar múltiplas partidas. Cria loop de progressão de longo prazo. É importante mas não bloqueia o gameplay core.

**Independent Test**: Pode ser testado jogando múltiplas partidas e verificando se XP e Schmeckles são acumulados e persistidos entre sessões.

**Acceptance Scenarios**:

1. **Given** o jogador completa uma partida (vitória ou derrota), **When** chega em Results, **Then** vê XP ganho baseado em performance (sobrevivência, eliminações, quests completadas)
2. **Given** o jogador ganhou XP suficiente, **When** XP atinge threshold de nível, **Then** sobe de nível com feedback visual
3. **Given** o jogador venceu uma partida, **When** vê Results, **Then** recebe Schmeckles (quantidade baseada em performance)
4. **Given** o jogador acumulou Schmeckles, **When** retorna para Home, **Then** vê seu saldo de Schmeckles no perfil
5. **Given** o jogador fecha e reabre o jogo, **When** volta para Home, **Then** seu nível, XP e Schmeckles estão persistidos corretamente

---

### User Story 4 - Expansões Multiplayer (Priority: P4) 📋 Futuro

Um jogador pode desafiar amigos em partidas amistosas (2-6 jogadores), competir em partidas rankeadas com matchmaking automático baseado em nível, e ter experiência multiplayer em tempo real com validação server-authoritative.

**Why this priority**: Expande o jogo para multiplayer real, aumentando engajamento e competitividade. É feature de expansão pós-MVP.

**Independent Test**: Esta user story representa um conjunto de features futuras e será especificada detalhadamente em specs separadas quando for priorizada para implementação.

**Acceptance Scenarios** (high-level, não detalhados):

1. **Given** multiplayer implementado, **When** jogador cria sala amistosa, **Then** pode convidar amigos via link/código
2. **Given** matchmaking implementado, **When** jogador entra em fila rankeada, **Then** é pareado com jogadores de nível similar
3. **Given** partida multiplayer em andamento, **When** jogador realiza ação, **Then** ação é validada pelo servidor e sincronizada para todos os jogadores
4. **Given** partida multiplayer, **When** jogador perde conexão, **Then** pode reconectar e continuar a partida

---

## Clarifications

### Session 2025-12-25

- Q: Estrutura de Partida/Rodadas/Turnos - como funcionam? → A: Partida é composta por múltiplas Rodadas. Cada Rodada equivale a uma Poll completa. Quando a poll esgota e ainda há jogadores vivos, nova Rodada inicia com nova poll gerada. Dentro de cada Rodada, jogadores alternam Turnos. Cada Turno termina quando jogador consome uma pill OU timer do turno expira (pill aleatória é consumida automaticamente).

### Edge Cases

- **Empate ao fim da Partida**: Se a última Rodada termina (pool esgota) e múltiplos jogadores ainda estão vivos, sistema deve declarar vencedor baseado em maior saúde (Vidas > Resistência > Resistência extra) ou empate múltiplo
- **Timer de Turno expirado**: Se timer do turno do jogador expira e ele não selecionou pill, sistema DEVE automaticamente consumir uma pill aleatória do pool e passar para próximo jogador
- **Bot timeout**: Se o bot não tomar ação em tempo razoável (ex.: >5s), sistema deve forçar ação automática para não travar o jogo
- **Pool esgotado antes de eliminações**: Se o pool acaba antes de ter um único vencedor, o jogo deve terminar e declarar vencedor(es) baseado em critério de saúde
- **Overflow negativo com cascata**: Se implementado, dano com overflow negativo pode causar múltiplos colapsos em sequência - deve ter animação clara para cada colapso
- **Inventário cheio no Draft**: Se timer do Draft expira e jogador selecionou mais de 8 itens, sistema deve priorizar primeiros 8 selecionados ou itens de maior valor
- **Desconexão durante Draft/Match**: Para MVP solo, se processo do jogo trava, jogador deve poder reiniciar sem perder progresso de XP/Schmeckles já ganhos
- **Resistência extra excedendo cap**: Sistema deve enforçar cap de Resistência extra (ex.: igual ao máximo de Resistência base) para manter balance
- **Shape Quest impossível**: Se pool não tem mais shapes necessários para completar quest ativa, quest deve ser automaticamente cancelada ou marcada como impossível

## Requirements *(mandatory)*

### Functional Requirements

#### Home & Navigation

- **FR-001**: Sistema DEVE exibir tela Home com opções de "ENTER THE VOID" (solo) e "MULTIPLAYER" (futuro)
- **FR-002**: Sistema DEVE permitir navegação clara entre todas as fases do jogo (Home -> Lobby -> Draft -> Match -> Results -> Home)
- **FR-003**: Sistema DEVE exibir informações de perfil do jogador na Home (nível, XP, Schmeckles)

#### Lobby (Solo)

- **FR-004**: Sistema DEVE permitir criar sala solo com configuração de 1 jogador humano + 1-5 bots
- **FR-005**: Sistema DEVE exibir lista de participantes (humano + bots) com avatares e nomes
- **FR-006**: Sistema DEVE ter botão "Start" que inicia a fase Draft quando clicado
- **FR-007**: Bots DEVEM ter comportamento de IA básica que toma decisões razoáveis (não apenas aleatório) em Draft e Match

#### Draft (Pré-Match)

- **FR-008**: Sistema DEVE exibir timer de Draft (30-60 segundos) visível e em contagem regressiva
- **FR-009**: Sistema DEVE exibir grade de itens disponíveis para compra organizados por categoria (Intel/Sustain/Control/Chaos)
- **FR-010**: Sistema DEVE exibir inventário do jogador com 8 slots (2x4) mostrando itens selecionados
- **FR-011**: Sistema DEVE permitir adicionar/remover itens do inventário durante Draft
- **FR-012**: Sistema DEVE exibir custo de cada item em moeda de Draft (currency inicial fixa ou baseada em nível)
- **FR-013**: Sistema DEVE autocompletar Draft (finalizar seleção atual) quando timer expira
- **FR-014**: Sistema DEVE transicionar para Match quando Draft é confirmado ou timer expira

#### Match (Core Gameplay)

##### Estrutura: Partida → Rodadas → Turnos

- **FR-015**: Partida (Match) DEVE ser composta por múltiplas Rodadas, com número de rodadas não pré-definido (depende de eliminações)
- **FR-016**: Cada Rodada DEVE corresponder a uma Poll completa de pílulas (baralho sem reposição)
- **FR-017**: Sistema DEVE avançar para nova Rodada automaticamente quando pool atual esgota E ainda há 2+ jogadores vivos
- **FR-018**: Sistema DEVE gerar nova Poll (com tamanho e distribuição progressiva) ao iniciar cada nova Rodada
- **FR-019**: Sistema DEVE exibir número da Rodada atual na HUD (ex.: "Rodada 3/12")
- **FR-020**: Dentro de cada Rodada, jogadores DEVEM alternar Turnos em ordem fixa (round-robin)
- **FR-021**: Turno de um jogador DEVE terminar quando: (a) jogador consome uma pílula, OU (b) timer do turno expira
- **FR-022**: Sistema DEVE ter timer por Turno (ex.: 15-30 segundos) visível para o jogador ativo
- **FR-023**: Se timer de Turno expira sem ação, sistema DEVE automaticamente consumir pílula aleatória do pool para o jogador e passar turno
- **FR-024**: Sistema DEVE indicar claramente qual jogador está no Turno ativo (destaque visual)

##### Display & Informações

- **FR-025**: Sistema DEVE exibir linha de oponentes mostrando avatar, nome, Vidas e Resistência de cada participante
- **FR-026**: Sistema DEVE implementar sistema de saúde dupla (Vidas + Resistência) para todos os jogadores
- **FR-027**: Sistema DEVE implementar Resistência extra (Over-resistance) quando Overflow positivo estiver ativo
- **FR-028**: Sistema DEVE exibir pool de pílulas disponíveis no centro da tela (máquina/garrafa)
- **FR-029**: Sistema DEVE exibir contadores do pool mostrando quantidade de cada tipo de pílula (SAFE/DMG_LOW/DMG_HIGH/HEAL/FATAL/LIFE)

##### Ações do Jogador

- **FR-030**: Sistema DEVE permitir jogador escolher uma pílula do pool durante seu turno (antes do timer expirar)
- **FR-031**: Sistema DEVE revelar tipo e shape da pílula escolhida com animação
- **FR-032**: Sistema DEVE aplicar efeitos da pílula imediatamente após revelação:
  - SAFE: sem efeito
  - DMG_LOW: -2 Resistência
  - DMG_HIGH: -4 Resistência
  - HEAL: +2 Resistência (com Overflow positivo, excedente vira Resistência extra)
  - FATAL: zera Resistência (força Colapso)
  - LIFE: +1 Vida (respeitando cap se houver)
- **FR-033**: Sistema DEVE implementar mecânica de Colapso: quando Resistência chega a 0, jogador perde 1 Vida e Resistência é restaurada ao máximo automaticamente
- **FR-034**: Sistema DEVE eliminar jogador quando Vidas chegam a 0
- **FR-035**: Sistema DEVE marcar jogadores eliminados visualmente (ex.: avatar cinza/opaco)
- **FR-036**: Sistema DEVE permitir jogador usar item do inventário durante seu turno (antes de escolher pílula)
- **FR-037**: Sistema DEVE consumir item após uso (remover do inventário)

##### UI & Controles

- **FR-038**: Sistema DEVE exibir Action Dock com botões "Shop" e "Leave"
- **FR-039**: Sistema DEVE abrir Loja como overlay quando "Shop" é clicado durante turno do jogador
- **FR-040**: Sistema DEVE exibir Game Log mostrando histórico de ações da partida (quem consumiu qual pílula, efeitos, eliminações, rodadas)

##### Condições de Término

- **FR-041**: Sistema DEVE terminar Partida quando apenas 1 jogador sobrevive (independente da rodada)
- **FR-042**: Sistema DEVE terminar Partida quando número máximo de rodadas é atingido (ex.: 12 rodadas) E ainda há jogadores vivos
- **FR-043**: Sistema DEVE declarar vencedor baseado em sobrevivência (se 1 sobrevivente) ou maior saúde (se múltiplos ao fim)

#### Shape Quests & Pill Coins

- **FR-044**: Sistema DEVE atribuir 1-2 Shape Quests aleatórias para cada jogador no início da Partida (Rodada 1)
- **FR-045**: Sistema DEVE exibir Shape Quests ativas na HUD do jogador mostrando sequência necessária e progresso
- **FR-046**: Sistema DEVE rastrear progresso de Shape Quest baseado em shapes de pílulas consumidas (persistente entre Rodadas)
- **FR-047**: Sistema DEVE conceder 1 Pill Coin quando Shape Quest é completada
- **FR-048**: Sistema DEVE resetar progresso de Shape Quest quando jogador consome shape incorreto
- **FR-049**: Shape Quests DEVEM ter dificuldade progressiva: rodadas iniciais (2 shapes), mid-game (3 shapes), late-game (4-5 shapes)
- **FR-050**: Sistema DEVE exibir saldo de Pill Coins do jogador na HUD

#### Loja (Match)

- **FR-051**: Sistema DEVE exibir Loja como overlay sobre Match quando acionada (apenas durante turno do jogador)
- **FR-052**: Sistema DEVE exibir itens disponíveis para compra com nome, descrição, custo em Pill Coins e categoria
- **FR-053**: Sistema DEVE permitir compra de item se jogador tem Pill Coins suficientes E espaço no inventário
- **FR-054**: Sistema DEVE deduzir Pill Coins e adicionar item ao inventário após compra
- **FR-055**: Sistema DEVE impedir compra se Pill Coins insuficientes OU inventário cheio (com feedback apropriado)
- **FR-056**: Sistema DEVE fechar Loja quando jogador clica em "Fechar" ou confirma compras (sem consumir turno)

#### Results

- **FR-057**: Sistema DEVE exibir tela Results ao fim da Partida mostrando vencedor(es)
- **FR-058**: Sistema DEVE exibir estatísticas da partida: pílulas consumidas por tipo, dano causado, dano recebido, Shape Quests completadas, Pill Coins gastos, total de Rodadas jogadas
- **FR-059**: Sistema DEVE calcular e exibir XP ganho baseado em: sobrevivência, eliminações, Shape Quests completadas, Rodadas sobrevividas
- **FR-060**: Sistema DEVE calcular e exibir Schmeckles ganhos baseado em performance geral
- **FR-061**: Sistema DEVE ter botão "Jogar Novamente" que retorna para Lobby
- **FR-062**: Sistema DEVE ter botão "Menu Principal" que retorna para Home

#### Progressão & Persistência

- **FR-063**: Sistema DEVE persistir XP acumulado do jogador entre sessões
- **FR-064**: Sistema DEVE persistir Schmeckles acumulados do jogador entre sessões
- **FR-065**: Sistema DEVE persistir nível do jogador entre sessões
- **FR-066**: Sistema DEVE calcular nível baseado em XP acumulado com curve de progressão definida
- **FR-067**: Sistema DEVE exibir feedback visual quando jogador sobe de nível

#### Pool de Pílulas (Baralho por Rodada)

- **FR-068**: Sistema DEVE implementar cada pool (1 por Rodada) como baralho (sampling sem reposição) - pílulas não voltam ao pool após consumidas dentro da mesma Rodada
- **FR-069**: Sistema DEVE distribuir tipos de pílulas no pool baseado em progressão por Rodada:
  - SAFE: unlock Rodada 1, começa 45% e termina 15%
  - DMG_LOW: unlock Rodada 1, começa 40% e termina 20%
  - DMG_HIGH: unlock Rodada 3, começa 15% e termina 25%
  - HEAL: unlock Rodada 2, começa 10% e termina 15%
  - FATAL: unlock Rodada 6, começa 5% e termina 18%
  - LIFE: unlock Rodada 5, começa 6% e termina 13%
- **FR-070**: Sistema DEVE escalar tamanho do pool por Rodada: base 6 pílulas, +1 a cada 3 Rodadas, cap máximo 12
- **FR-071**: Sistema DEVE atribuir shapes aleatórios (Sphere/Cube/Pyramid/Capsule) para cada pílula independente do tipo
- **FR-072**: Sistema DEVE gerar novo pool ao iniciar cada nova Rodada (com distribuição e tamanho progressivos)
- **FR-073**: Sistema DEVE ter limite máximo de Rodadas (ex.: 12) para evitar partidas infinitas

#### Dev Tools

- **FR-074**: Sistema DEVE incluir DevTools overlay (apenas em DEV mode) com controles para:
  - Alternar entre Home/Game screens
  - Pular entre phases (Lobby/Draft/Match/Results)
  - Avançar/voltar Rodadas manualmente
  - Forçar fim de Turno
  - Disparar notificações de teste
  - Override de estado para debugging

### Key Entities

- **Jogador**: Representa participante (humano ou bot). Atributos: ID, nome, avatar, Vidas, Resistência, Resistência extra, inventário (8 slots), Pill Coins, Shape Quests ativas, status (vivo/eliminado), é turno ativo (bool)
- **Pílula**: Representa uma pílula no pool. Atributos: tipo (SAFE/DMG_LOW/DMG_HIGH/HEAL/FATAL/LIFE), shape (Sphere/Cube/Pyramid/Capsule), estado (disponível/consumida)
- **Pool (Rodada)**: Representa baralho de pílulas de uma Rodada específica. Atributos: número da Rodada, pílulas (array), contadores por tipo, tamanho total
- **Rodada**: Representa uma Rodada da Partida (equivale a uma Poll completa). Atributos: número, pool (referência), Turnos (array de ações), estado (ativa/completada)
- **Turno**: Representa turno de um jogador específico. Atributos: jogador (ID), timer restante, ação realizada (pill consumida/item usado/timeout), timestamp início, timestamp fim
- **Item**: Representa item consumível. Atributos: ID, nome, descrição, categoria (Intel/Sustain/Control/Chaos), custo em Pill Coins, efeito
- **Shape Quest**: Representa objetivo de sequência de shapes. Atributos: ID, sequência de shapes necessária, progresso atual, recompensa (Pill Coins), status (ativa/completada/falhada)
- **Partida (Match)**: Representa instância completa de jogo. Atributos: ID, fase (Lobby/Draft/Match/Results), jogadores (array), Rodadas (array), Rodada atual (número), jogador do Turno atual (índice), vencedor(es), timestamp início, timestamp fim
- **Perfil (Profile)**: Representa perfil persistente do jogador. Atributos: ID, nome, avatar, nível, XP total, Schmeckles total, partidas jogadas, vitórias, Rodadas totais sobrevividas, timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Jogadores conseguem completar uma partida solo do início ao fim em 8-15 minutos em média
- **SC-002**: 90% das ações de gameplay (escolher pílula, usar item, comprar na loja) respondem em menos de 500ms
- **SC-003**: Sistema de contadores do pool exibe informação correta 100% do tempo (sem dessincronização)
- **SC-004**: Mecânica de Colapso é compreendida por 80% dos jogadores após 2-3 partidas (baseado em não morrer por confusão)
- **SC-005**: Jogadores completam 60-80% das Shape Quests tentadas (alinhado com meta de balance)
- **SC-006**: Partidas duram 8-12 Rodadas em média (alinhado com meta de duração)
- **SC-007**: Bots tomam decisões válidas (sem travamentos ou ações inválidas) em 100% dos Turnos
- **SC-008**: Timer de Turno funciona corretamente e força ação automática (pill aleatória) em 100% dos timeouts
- **SC-009**: Progressão de XP e Schmeckles é persistida com 100% de confiabilidade entre sessões
- **SC-010**: Interface exibe todas as informações críticas (Vidas, Resistência, contadores do pool, Turno atual, Rodada atual) de forma clara e sem sobreposição
- **SC-011**: Jogadores identificam quando é seu Turno em menos de 2 segundos em média
- **SC-012**: Draft é completado (manual ou auto) em 100% dos casos sem travar ou gerar inventário inválido
- **SC-013**: Sistema escala pool de pílulas corretamente seguindo fórmula (base 6, +1 a cada 3 Rodadas, cap 12) em 100% das Rodadas
- **SC-014**: Nova Rodada é gerada automaticamente quando pool esgota E ainda há 2+ jogadores vivos em 100% dos casos
- **SC-015**: Proporção estratégia vs sorte atinge 70/30 (estimado via análise de winrate de bots vs jogadores experientes)
- **SC-016**: Nenhum tipo de pílula (SAFE/DMG/HEAL/FATAL/LIFE) tem taxa de spawn fora da range configurada (+/- 5% de margem) em 95% das Rodadas
- **SC-017**: Jogadores retornam para jogar segunda partida em 70% dos casos após primeira partida completa
- **SC-018**: Transições entre Turnos (jogador ativo muda) acontecem em menos de 1 segundo em 95% dos casos

### Assumptions

- Jogadores têm familiaridade básica com jogos de turno e conceitos de inventário
- Estética 8-bit Rick and Morty é apelativa para o público-alvo e não requer tutorial extenso
- Progressão de dificuldade por rodada (escalação de FATAL/DMG_HIGH) cria tensão sem frustração excessiva
- Bots com IA básica (decisões razoáveis, não apenas aleatórias) são suficientes para MVP sem precisar ML/comportamento complexo
- Sistema de saúde dupla (Vidas + Resistência) será compreensível com feedback visual adequado
- Shape Quests com recompensa de 1 Pill Coin são incentivo suficiente para engajamento
- Loja com 4 categorias de itens (Intel/Sustain/Control/Chaos) oferece profundidade estratégica suficiente para MVP
- Timer de Draft de 30-60 segundos cria pressão sem frustração
- Persistência local (localStorage ou similar) é suficiente para MVP (XP/Schmeckles), sem necessidade de backend completo
- Sistema de contadores visíveis do pool (card counting) é pilar fundamental e deve estar sempre visível
- Overflow positivo (Resistência extra) adiciona profundidade estratégica sem complicar demais o sistema de saúde
- Multiplayer real e matchmaking são expansões futuras e não bloqueiam validação do MVP
- Meta-moeda Schmeckles em "mock" (sem funcionalidade de gasto) é aceitável para MVP
