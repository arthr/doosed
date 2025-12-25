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
5. **Given** o jogador consumiu uma pílula nociva e sua Resistência chegou a 0, **When** o efeito é aplicado, **Then** ocorre Colapso (Vidas -1, Resistência resetada para 6), com feedback visual claro
6. **Given** o jogador sofreu Colapso e ficou com 0 Vidas, **When** HUD é atualizado, **Then** mostra "0 Vidas" com indicação visual de "Última Chance" mas jogador continua vivo com Resistência ativa
7. **Given** o jogador está em "Última Chance" (0 Vidas) e Resistência chega a 0 novamente, **When** o Colapso final ocorre, **Then** o jogador é eliminado e marcado visualmente como "morto"
8. **Given** apenas 1 sobrevivente resta OU limite máximo de rodadas é atingido, **When** condição de término é atingida, **Then** a Partida termina e vai para Results
9. **Given** o jogador está na tela Results, **When** vê estatísticas da partida, **Then** pode ver resumo de pílulas consumidas, dano causado/recebido, Colapsos sofridos e opção de jogar novamente
10. **Given** o jogador está na Match, **When** visualiza o painel de contadores do pool, **Then** vê claramente quantas pílulas nocivas e não-nocivas restam (contadores por tipo)
11. **Given** a Resistência do jogador está no máximo e recebe cura, **When** Overflow positivo está ativo, **Then** ganha Resistência extra (camada adicional acima do máximo) visível na UI

---

### User Story 2 - Economia de Partida (Pill Coins + Loja) (Priority: P2)

Um jogador durante a partida completa Shape Quests (sequências de formas de pílulas) para ganhar Pill Coins e pode abrir a Loja durante seu turno para comprar itens estratégicos que ajudam na sobrevivência e estratégia.

**Why this priority**: Adiciona profundidade estratégica e economia interna à partida. Transforma o jogo de pura sorte em um jogo de escolhas significativas. É essencial para o pilar "Escolhas significativas".

**Independent Test**: Pode ser testado numa partida verificando se: (1) Shape Quests aparecem e concedem Pill Coins ao serem completados, (2) Loja abre corretamente, (3) itens podem ser comprados e usados.

**Acceptance Scenarios**:

1. **Given** o jogador inicia uma Rodada, **When** Rodada começa, **Then** recebe 1 Shape Quest nova exibida na HUD
2. **Given** o jogador tem uma Shape Quest ativa (ex.: Sphere -> Cube), **When** consome pílulas na sequência correta (vendo shapes visíveis), **Then** progresso da quest avança visualmente
3. **Given** o jogador completa uma Shape Quest, **When** a sequência é finalizada, **Then** recebe 10 Pill Coins (base) × multiplicador progressivo com feedback visual/sonoro
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
- Q: Duração do timer de Turno? → A: 30 segundos. IMPORTANTE: Todos os timers e valores de balance/configuração devem ser centralizados em área administrativa para ajustes fáceis sem alteração de código.
- Q: Valores iniciais de Vidas e Resistência? → A: 3 Vidas, 6 Resistência. MECÂNICA DE ÚLTIMA CHANCE: Quando jogador atinge 0 Vidas, ele NÃO é eliminado imediatamente. HUD mostra "0 Vidas" mas jogador continua com barra de Resistência ativa (resetada). Eliminação só ocorre quando Resistência zerar novamente JÁ estando em 0 Vidas. Isso permite 4 Colapsos totais (3 que reduzem Vidas 3→2→1→0, e 1 final que elimina).
- Q: Currency e valor inicial no Draft? → A: Usar Pill Coins (moeda unificada Draft+Match). Jogador começa com 100 Pill Coins iniciais. Escolha estratégica: gastar no Draft (loadout) ou poupar para usar na Loja durante Match. Itens devem ter disponibilidade configurável (DRAFT/MATCH/AMBOS). Loja é a mesma, muda apenas disponibilidade dos itens.
- Q: Ordem de Turnos após eliminação de jogador? → A: Manter ordem original (round-robin), simplesmente pular turnos de jogadores eliminados. Quando chega turno de eliminado, sistema avança automaticamente para próximo jogador vivo. Jogadores eliminados permanecem visíveis na UI mas inativos.
- Q: Shapes das pills - como funcionam? → A: Shapes (Sphere/Cube/Pyramid/Capsule) são SEMPRE VISÍVEIS ao jogador antes de consumir a pill. Shapes NÃO afetam os efeitos das pills (SAFE/DMG/HEAL/etc) - são puramente visuais e servem APENAS para Shape Quests. Tipo da pill (efeito) só é revelado após consumo. Jogador vê o shape mas não sabe se é nociva ou não até consumir.
- Q: Existe limite máximo de rodadas? Pode haver empate? → A: NÃO existe limite máximo de rodadas. Partida continua indefinidamente até restar apenas 1 sobrevivente. Empate é impossível pois em rodadas > 10 a fatalidade é alta devido à progressão de tipos nocivos. Sistema de contadores permite estratégia mesmo em rodadas longas.

### Edge Cases

- **Timer de Turno expirado**: Se timer do turno do jogador expira e ele não selecionou pill, sistema DEVE automaticamente consumir uma pill aleatória do pool e passar para próximo jogador
- **Jogador em "Última Chance" (0 Vidas)**: Sistema DEVE exibir feedback visual dramático quando jogador atinge 0 Vidas mas ainda está vivo. HUD deve mostrar claramente "0 Vidas" + barra de Resistência ativa. Eliminação só ocorre no próximo Colapso
- **Todos os jogadores eliminados exceto 1**: Quando resta apenas 1 jogador vivo, sistema deve terminar Partida imediatamente declarando-o vencedor (sem necessidade de esgotar pool)
- **Skip de turnos de eliminados**: Sistema deve automaticamente pular turnos de jogadores eliminados sem delay perceptível. Se todos os jogadores exceto 1 estão eliminados, sistema finaliza partida declarando sobrevivente como vencedor
- **Bot timeout**: Se bot não tomar ação em tempo razoável (configurável, padrão 5s), sistema deve forçar ação automática para não travar o jogo
- **Pool esgotado com múltiplos jogadores vivos**: Sistema gera nova Rodada automaticamente. Partida continua indefinidamente até restar 1 sobrevivente (empate impossível devido à progressão de fatalidade)
- **Overflow negativo com cascata**: Se implementado, dano com overflow negativo pode causar múltiplos colapsos em sequência - deve ter animação clara para cada colapso
- **Desconexão durante Draft/Match**: Para MVP solo, se processo do jogo trava, jogador deve poder reiniciar sem perder progresso de XP/Schmeckles já ganhos
- **Resistência extra excedendo cap**: Sistema deve enforçar cap de Resistência extra (configurável, padrão igual ao máximo de Resistência base = 6) para manter balance
- **Shape Quest impossível de completar**: Se pool não tem mais shapes necessários para completar quest ativa na Rodada atual, quest permanece ativa para próxima Rodada (progresso mantido)
- **Todas as pills do pool são do mesmo tipo**: Situação rara mas possível em rodadas avançadas. Sistema deve gerar pool normalmente seguindo distribuição configurada, mesmo que resulte em concentração extrema de um tipo

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

- **FR-008**: Sistema DEVE exibir timer de Draft de 60 segundos visível e em contagem regressiva
- **FR-009**: Jogador DEVE iniciar Draft com 100 Pill Coins (saldo inicial da Partida)
- **FR-010**: Sistema DEVE exibir grade de itens disponíveis para compra, mostrando apenas itens com disponibilidade DRAFT ou AMBOS
- **FR-011**: Sistema DEVE organizar itens por categoria (Intel/Sustain/Control/Chaos) com nome, descrição, custo em Pill Coins
- **FR-012**: Sistema DEVE exibir inventário do jogador com 8 slots (2x4) mostrando itens selecionados
- **FR-013**: Sistema DEVE exibir saldo atual de Pill Coins do jogador na HUD do Draft
- **FR-014**: Sistema DEVE permitir comprar item se jogador tem Pill Coins suficientes E espaço no inventário
- **FR-015**: Sistema DEVE deduzir Pill Coins do saldo ao comprar item no Draft
- **FR-016**: Sistema DEVE permitir vender/remover itens do inventário durante Draft (devolvendo Pill Coins)
- **FR-017**: Sistema DEVE autoconfirmar Draft (finalizar seleção atual) quando timer expira
- **FR-018**: Sistema DEVE transicionar para Match quando Draft é confirmado ou timer expira, mantendo saldo de Pill Coins restante

#### Match (Core Gameplay)

##### Estrutura: Partida → Rodadas → Turnos

- **FR-019**: Partida (Match) DEVE ser composta por múltiplas Rodadas, com número de rodadas não pré-definido (continua até restar 1 sobrevivente)
- **FR-020**: Cada Rodada DEVE corresponder a uma Poll completa de pílulas (baralho sem reposição)
- **FR-021**: Sistema DEVE avançar para nova Rodada automaticamente quando pool atual esgota E ainda há 2+ jogadores vivos
- **FR-022**: Sistema DEVE gerar nova Poll (com tamanho e distribuição progressiva) ao iniciar cada nova Rodada
- **FR-023**: Sistema DEVE exibir número da Rodada atual na HUD (ex.: "Rodada 8")
- **FR-024**: Ordem inicial dos Turnos DEVE ser determinada aleatoriamente no início da Partida para garantir fairness
- **FR-025**: Dentro de cada Rodada, jogadores DEVEM alternar Turnos na ordem fixa determinada aleatoriamente
- **FR-026**: Turno de um jogador DEVE terminar quando: (a) jogador consome uma pílula, OU (b) timer do turno expira
- **FR-027**: Sistema DEVE ter timer por Turno de 30 segundos visível para o jogador ativo com contagem regressiva
- **FR-028**: Se timer de Turno expira sem ação, sistema DEVE automaticamente consumir pílula aleatória do pool para o jogador e passar turno
- **FR-029**: Sistema DEVE indicar claramente qual jogador está no Turno ativo (destaque visual)
- **FR-030**: Quando turno de jogador eliminado chega na ordem, sistema DEVE automaticamente pular para próximo jogador vivo
- **FR-031**: Ordem de Turnos DEVE ser mantida mesmo após eliminações (não reordenar índices)
- **FR-032**: Jogadores eliminados DEVEM permanecer visíveis na UI com indicação clara de "ELIMINATED" mas sem receber turnos

##### Display & Informações

- **FR-033**: Sistema DEVE exibir linha de oponentes mostrando avatar, nome, Vidas e Resistência de cada participante
- **FR-034**: Sistema DEVE implementar sistema de saúde dupla (Vidas + Resistência) para todos os jogadores com valores iniciais: 3 Vidas, 6 Resistência
- **FR-035**: Sistema DEVE implementar Resistência extra (Over-resistance) quando Overflow positivo estiver ativo
- **FR-036**: Sistema DEVE exibir pool de pílulas disponíveis no centro da tela (máquina/garrafa/mesa)
- **FR-037**: Sistema DEVE exibir contadores do pool mostrando quantidade de cada tipo de pílula (SAFE/DMG_LOW/DMG_HIGH/HEAL/FATAL/LIFE)
- **FR-038**: Shapes das pílulas (Sphere/Cube/Pyramid/Capsule/Etc) DEVEM ser sempre visíveis ao jogador no pool antes da escolha
- **FR-039**: Sistema DEVE exibir shape de cada pílula disponível claramente no pool (ícone/visual distintivo do shape)
- **FR-040**: Shapes NÃO DEVEM afetar os efeitos das pílulas (tipo SAFE/DMG/HEAL/etc) - são puramente visuais para Shape Quests

##### Ações do Jogador

- **FR-041**: Sistema DEVE permitir jogador escolher uma pílula do pool durante seu turno (antes do timer expirar)
- **FR-042**: Ao consumir pílula, sistema DEVE revelar apenas o tipo (efeito) da pílula com animação, já que shape já era visível
- **FR-043**: Sistema DEVE aplicar efeitos da pílula imediatamente após revelação:
  - SAFE: sem efeito
  - DMG_LOW: -2 Resistência
  - DMG_HIGH: -4 Resistência
  - HEAL: +2 Resistência (com Overflow positivo, excedente vira Resistência extra)
  - FATAL: zera Resistência (força Colapso)
  - LIFE: +1 Vida (respeitando cap se houver)
- **FR-044**: Sistema DEVE implementar mecânica de Colapso: quando Resistência chega a 0, jogador sofre Colapso (Vidas -1, Resistência restaurada para 6) com feedback visual claro
- **FR-045**: Sistema DEVE implementar mecânica de "Última Chance": quando Vidas chegam a 0, jogador NÃO é eliminado imediatamente
- **FR-046**: Quando jogador está em "Última Chance" (0 Vidas), HUD DEVE exibir claramente "0 Vidas" ou indicação visual de estado crítico
- **FR-047**: Jogador em "Última Chance" (0 Vidas) DEVE ter Resistência ativa e funcional (resetada para 6 após último Colapso que zerou Vidas)
- **FR-048**: Sistema DEVE eliminar jogador APENAS quando Resistência zera novamente JÁ estando em estado de "Última Chance" (0 Vidas)
- **FR-049**: Sistema DEVE marcar jogadores eliminados visualmente (ex.: avatar cinza/opaco, marcação "ELIMINATED")
- **FR-050**: Sistema DEVE permitir jogador usar item do inventário durante seu turno (antes de escolher pílula)
- **FR-051**: Sistema DEVE consumir item após uso (remover do inventário)

##### UI & Controles

- **FR-052**: Sistema DEVE exibir Action Dock com botões "Shop" e "Leave"
- **FR-053**: Sistema DEVE abrir Loja como overlay quando "Shop" é clicado durante turno do jogador
- **FR-054**: Sistema DEVE exibir Game Log mostrando histórico de ações da partida (quem consumiu qual pílula com shape, efeitos revelados, Colapsos, eliminações, rodadas)

##### Condições de Término

- **FR-055**: Sistema DEVE terminar Partida imediatamente quando apenas 1 jogador sobrevive
- **FR-056**: Sistema DEVE declarar o último sobrevivente como vencedor
- **FR-057**: Partida NÃO tem limite máximo de rodadas - continua indefinidamente até restar 1 sobrevivente (empate impossível)

#### Shape Quests & Pill Coins

- **FR-058**: Jogador DEVE iniciar cada Partida com 100 Pill Coins (antes do Draft)
- **FR-059**: Sistema DEVE atribuir 1 Shape Quest aleatória para cada jogador no início de cada Rodada
- **FR-060**: Sistema DEVE exibir Shape Quest ativa na HUD do jogador mostrando sequência de shapes necessária e progresso
- **FR-061**: Sistema DEVE rastrear progresso de Shape Quest baseado em shapes (visíveis) de pílulas consumidas
- **FR-062**: Sistema DEVE conceder 10 Pill Coins (base configurável) × multiplicador progressivo quando Shape Quest é completada
- **FR-063**: Sistema DEVE resetar progresso de Shape Quest quando jogador consome shape incorreto
- **FR-064**: Shape Quests DEVEM ter dificuldade/recompensa progressiva baseada na Rodada:
  - Rodadas 1-3: 2 shapes, multiplicador 1.0x (10 Pill Coins)
  - Rodadas 4-7: 3 shapes, multiplicador 1.5x (15 Pill Coins)
  - Rodadas 8+: 4-5 shapes, multiplicador 2.0x (20-25 Pill Coins)
- **FR-065**: Sistema DEVE exibir saldo de Pill Coins do jogador na HUD (unificado entre Draft e Match)
- **FR-066**: Pill Coins NÃO gastos no Draft DEVEM permanecer disponíveis para uso na Loja durante Match
- **FR-067**: Pill Coins NÃO são persistidos entre Partidas - cada Partida inicia com 100 Pill Coins frescos

#### Loja (Draft e Match) - Sistema Unificado

- **FR-068**: Cada item DEVE ter configuração de disponibilidade: DRAFT (apenas pré-Match), MATCH (apenas durante Match), ou AMBOS
- **FR-069**: Sistema DEVE filtrar itens exibidos baseado no contexto: Draft mostra itens DRAFT ou AMBOS; Loja Match mostra itens MATCH ou AMBOS
- **FR-070**: Sistema DEVE exibir Loja como overlay durante Draft (sempre visível) e durante Match (acionada por botão "Shop" no turno do jogador)
- **FR-071**: Sistema DEVE exibir itens disponíveis com nome, descrição, custo em Pill Coins, categoria e indicação de disponibilidade
- **FR-072**: Sistema DEVE permitir compra de item se jogador tem Pill Coins suficientes E espaço no inventário
- **FR-073**: Sistema DEVE deduzir Pill Coins do saldo unificado e adicionar item ao inventário após compra (tanto no Draft quanto na Match)
- **FR-074**: Sistema DEVE impedir compra se Pill Coins insuficientes OU inventário cheio (com feedback apropriado)
- **FR-075**: Sistema DEVE fechar Loja da Match quando jogador clica em "Fechar" ou confirma compras (sem consumir turno)
- **FR-076**: Inventário sempre inicia vazio a cada Partida - itens NÃO são persistidos entre Partidas

#### Results

- **FR-077**: Sistema DEVE exibir tela Results ao fim da Partida mostrando vencedor
- **FR-078**: Sistema DEVE exibir estatísticas da partida: pílulas consumidas por tipo (com shapes), dano causado, dano recebido, Colapsos sofridos, Shape Quests completadas, Pill Coins ganhos, Pill Coins gastos, Pill Coins restantes, total de Rodadas jogadas
- **FR-079**: Sistema DEVE calcular e exibir XP ganho baseado em: sobrevivência (vitória/derrota), eliminações, Shape Quests completadas, Rodadas sobrevividas
- **FR-080**: Sistema DEVE calcular e exibir Schmeckles ganhos baseado em performance geral (fórmula configurável)
- **FR-081**: Sistema DEVE ter botão "Jogar Novamente" que retorna para Lobby
- **FR-082**: Sistema DEVE ter botão "Menu Principal" que retorna para Home

#### Progressão & Persistência

- **FR-083**: Sistema DEVE persistir XP acumulado do jogador entre sessões
- **FR-084**: Sistema DEVE persistir Schmeckles acumulados do jogador entre sessões
- **FR-085**: Sistema DEVE persistir nível do jogador entre sessões
- **FR-086**: Sistema DEVE calcular nível baseado em XP acumulado com curve de progressão definida (configurável)
- **FR-087**: Sistema DEVE exibir feedback visual quando jogador sobe de nível

#### Pool de Pílulas (Baralho por Rodada)

- **FR-088**: Sistema DEVE implementar cada pool (1 por Rodada) como baralho (sampling sem reposição) - pílulas não voltam ao pool após consumidas dentro da mesma Rodada
- **FR-089**: Sistema DEVE distribuir tipos de pílulas no pool baseado em progressão por Rodada (percentuais configuráveis):
  - SAFE: unlock Rodada 1, começa 45% e termina 15%
  - DMG_LOW: unlock Rodada 1, começa 40% e termina 20%
  - DMG_HIGH: unlock Rodada 3, começa 15% e termina 25%
  - HEAL: unlock Rodada 2, começa 10% e termina 15%
  - FATAL: unlock Rodada 6, começa 5% e termina 18%
  - LIFE: unlock Rodada 5, começa 6% e termina 13%
- **FR-090**: Sistema DEVE escalar tamanho do pool por Rodada: base 6 pílulas, +1 a cada 3 Rodadas, cap máximo 12 (valores configuráveis)
- **FR-091**: Sistema DEVE atribuir shapes aleatórios (Sphere/Cube/Pyramid/Capsule/Etc) para cada pílula independente do tipo (distribuição uniforme)
- **FR-092**: Sistema DEVE gerar novo pool ao iniciar cada nova Rodada (com distribuição e tamanho progressivos)

#### Configurações & Balance

- **FR-093**: Sistema DEVE centralizar todas as configurações de balance e timers em estrutura de dados configurável (não hardcoded):
  - **Timers:**
    - Timer de Turno (padrão: 30s)
    - Timer de Draft (padrão: 60s)
    - Timeout de bot (padrão: 5s)
  - **Efeitos de Pílulas:**
    - DMG_LOW (padrão: -2 Resistência)
    - DMG_HIGH (padrão: -4 Resistência)
    - HEAL (padrão: +2 Resistência)
    - FATAL (padrão: zera Resistência)
    - LIFE (padrão: +1 Vida)
  - **Pool (Progressão por Rodada):**
    - Tamanho base (padrão: 6)
    - Incremento (padrão: +1 a cada 3 Rodadas)
    - Cap máximo (padrão: 12)
    - Distribuição de tipos por Rodada (percentuais início/fim + unlock por Rodada)
  - **Saúde:**
    - Vidas iniciais (padrão: 3)
    - Resistência inicial/máxima (padrão: 6)
    - Cap de Resistência extra (padrão: 6)
    - Resistência restaurada em Colapso (padrão: 6)
  - **Economia:**
    - Pill Coins iniciais por Partida (padrão: 100)
    - Recompensa base Shape Quest (padrão: 10 Pill Coins)
    - Multiplicadores progressivos Shape Quest (rodadas 1-3: 1.0x, 4-7: 1.5x, 8+: 2.0x)
    - Custos de itens por categoria (ex.: Intel 15-25, Sustain 20-30, Control 25-35, Chaos 30-40)
    - Disponibilidade de itens (DRAFT/MATCH/AMBOS)
  - **Shape Quests:**
    - Quantidade por Rodada (padrão: 1 por jogador)
    - Tamanho sequência por Rodada (rodadas 1-3: 2, 4-7: 3, 8+: 4-5)
  - **XP & Progression:**
    - Fórmula XP por sobrevivência/vitória
    - Fórmula Schmeckles por performance
    - Curva de progressão de nível
- **FR-094**: Configurações DEVEM ser facilmente editáveis por desenvolvedores/admin sem necessidade de recompilar código (arquivo JSON/YAML ou interface admin)
- **FR-095**: Cada item DEVE ter configuração individual de custo (Pill Coins) e disponibilidade (DRAFT/MATCH/AMBOS)

#### Dev Tools

- **FR-096**: Sistema DEVE incluir DevTools overlay (apenas em DEV mode) com controles para:
  - Alternar entre Home/Game screens
  - Pular entre phases (Lobby/Draft/Match/Results)
  - Avançar/voltar Rodadas manualmente
  - Forçar fim de Turno
  - Adicionar/remover Pill Coins
  - Adicionar/remover Vidas e Resistência
  - Simular Colapso e estado de "Última Chance"
  - Editar configurações de balance em tempo real
  - Alternar disponibilidade de itens (DRAFT/MATCH/AMBOS)
  - Disparar notificações de teste
  - Override de estado para debugging
  - Visualizar/editar estado da Partida (Rodada atual, turno, pool, inventários)

### Key Entities

- **Jogador**: Representa participante (humano ou bot). Atributos: ID, nome, avatar, Vidas (inicial: 3), Resistência (inicial/máxima: 6), Resistência extra, inventário (8 slots), Pill Coins, Shape Quests ativas, status (vivo/última-chance/eliminado), é turno ativo (bool), total de Colapsos sofridos
- **Pílula**: Representa uma pílula no pool. Atributos: tipo (SAFE/DMG_LOW/DMG_HIGH/HEAL/FATAL/LIFE), shape (Sphere/Cube/Pyramid/Capsule), estado (disponível/consumida)
- **Pool (Rodada)**: Representa baralho de pílulas de uma Rodada específica. Atributos: número da Rodada, pílulas (array), contadores por tipo, tamanho total
- **Rodada**: Representa uma Rodada da Partida (equivale a uma Poll completa). Atributos: número, pool (referência), Turnos (array de ações), estado (ativa/completada)
- **Turno**: Representa turno de um jogador específico. Atributos: jogador (ID), timer restante, ação realizada (pill consumida/item usado/timeout), timestamp início, timestamp fim
- **Ordem de Turnos**: Sequência fixa (array de IDs de jogadores) determinada aleatoriamente no início da Partida, mantida durante toda a Partida (eliminados são pulados mas índices preservados)
- **Item**: Representa item consumível. Atributos: ID, nome, descrição, categoria (Intel/Sustain/Control/Chaos), custo em Pill Coins, efeito, disponibilidade (DRAFT/MATCH/AMBOS)
- **Shape Quest**: Representa objetivo de sequência de shapes. Atributos: ID, sequência de shapes necessária, progresso atual, recompensa (Pill Coins), status (ativa/completada/falhada)
- **Partida (Match)**: Representa instância completa de jogo. Atributos: ID, fase (Lobby/Draft/Match/Results), jogadores (array), Rodadas (array), Rodada atual (número), jogador do Turno atual (índice), vencedor(es), timestamp início, timestamp fim
- **Perfil (Profile)**: Representa perfil persistente do jogador. Atributos: ID, nome, avatar, nível, XP total, Schmeckles total, partidas jogadas, vitórias, Rodadas totais sobrevividas, timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Jogadores conseguem completar uma partida solo do início ao fim em 8-15 minutos em média
- **SC-002**: 90% das ações de gameplay (escolher pílula, usar item, comprar na loja) respondem em menos de 500ms
- **SC-003**: Sistema de contadores do pool exibe informação correta 100% do tempo (sem dessincronização)
- **SC-004**: Mecânica de Colapso e "Última Chance" (0 Vidas) é compreendida por 80% dos jogadores após 2-3 partidas (baseado em feedback visual claro e não eliminar prematuramente)
- **SC-005**: Jogadores completam 60-80% das Shape Quests tentadas (alinhado com meta de balance e shapes visíveis)
- **SC-006**: Partidas duram 8-12 Rodadas em média com 2-4 jogadores (alinhado com meta de duração e progressão de fatalidade)
- **SC-007**: Bots tomam decisões válidas (sem travamentos ou ações inválidas) em 100% dos Turnos
- **SC-008**: Timer de Turno funciona corretamente e força ação automática (pill aleatória) em 100% dos timeouts
- **SC-009**: Progressão de XP e Schmeckles é persistida com 100% de confiabilidade entre sessões
- **SC-010**: Interface exibe todas as informações críticas (Vidas, Resistência, contadores do pool, Turno atual, Rodada atual) de forma clara e sem sobreposição
- **SC-011**: Jogadores identificam quando é seu Turno em menos de 2 segundos em média
- **SC-012**: Draft é completado (manual ou auto) em 100% dos casos sem travar ou gerar inventário inválido (inventário sempre inicia vazio)
- **SC-013**: Sistema escala pool de pílulas corretamente seguindo fórmula configurável (base 6, +1 a cada 3 Rodadas, cap 12) em 100% das Rodadas
- **SC-014**: Nova Rodada é gerada automaticamente quando pool esgota E ainda há 2+ jogadores vivos em 100% dos casos
- **SC-019**: Shapes de pílulas são claramente visíveis no pool antes da escolha em 100% dos casos
- **SC-020**: Sistema continua gerando novas Rodadas indefinidamente até restar 1 sobrevivente (testado até Rodada 20+)
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
- Shape Quests com recompensa de 10 Pill Coins (base) e multiplicador progressivo (1.0x→1.5x→2.0x) são incentivo suficiente para engajamento
- Shapes visíveis antes do consumo facilitam estratégia de Shape Quests sem revelar tipo da pill
- Loja com 4 categorias de itens (Intel/Sustain/Control/Chaos) oferece profundidade estratégica suficiente para MVP
- Timer de Draft de 60 segundos cria pressão sem frustração
- Economia unificada com Pill Coins (Draft + Match) cria escolhas estratégicas interessantes entre gastar cedo (Draft) ou poupar para Match
- 100 Pill Coins iniciais + 10 (base) × multiplicador por Shape Quest completada cria economia viável para compras no Draft e Match
- Custos sugeridos de itens (15-40 Pill Coins) permitem 2-6 compras por partida dependendo de economia e Shape Quests
- Inventário e Pill Coins sempre resetam a cada Partida (sem persistência entre Partidas) - garante fairness e balance
- Persistência local (localStorage ou similar) é suficiente para MVP (XP/Schmeckles), sem necessidade de backend completo
- Sistema de contadores visíveis do pool (card counting) é pilar fundamental e deve estar sempre visível
- Shapes visíveis (Sphere/Cube/Pyramid/Capsule) antes do consumo facilitam estratégia de Shape Quests sem revelar tipo da pill
- Shapes NÃO afetam efeitos - relação visual pura para quests, sem correlação com nocividade
- Overflow positivo (Resistência extra) adiciona profundidade estratégica sem complicar demais o sistema de saúde
- Partidas sem limite de rodadas + progressão de fatalidade garantem que empate é impossível (mesmo em rodadas 15+)
- Ordem inicial randomizada de turnos garante fairness entre partidas
- Multiplayer real e matchmaking são expansões futuras e não bloqueiam validação do MVP
- Meta-moeda Schmeckles em "mock" (sem funcionalidade de gasto) é aceitável para MVP
