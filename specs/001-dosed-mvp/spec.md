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

1. **Given** o jogador está na tela Home, **When** clica em "ENTER THE VOID" (modo solo), **Then** é levado para Lobby com opção de adicionar bots e selecionar nível de dificuldade
2. **Given** o jogador está no Lobby com 1 bot configurado (nível Normal), **When** clica em "Start", **Then** entra na fase Draft com timer ativo e 100 Pill Coins iniciais
3. **Given** o jogador está no Draft, **When** seleciona itens para o inventário (até 5 slots, com stackables), **Then** vê atualização de Pill Coins restantes e pode comprar múltiplos Scanners (stack até 3x)
4. **Given** o jogador confirma Draft ou timer expira, **When** transiciona para Match, **Then** mantém Pill Coins restantes e inventário configurado (5 slots)
5. **Given** o jogador está na Match no seu turno (Fase de Itens), **When** usa Scanner em uma pílula, **Then** tipo da pílula é revelado (visível para todos) e Scanner é removido do inventário
6. **Given** o jogador usou Scanner e vê que pílula é nociva, **When** usa Inverter nela, **Then** pílula fica com modificador "Inverted" visível e dano vira cura
7. **Given** o jogador finalizou Fase de Itens, **When** entra em Fase de Consumo e escolhe pílula Inverted, **Then** pílula nociva cura ao invés de danificar
8. **Given** o jogador tem Status "Shielded" ativo (comprado na loja), **When** consome pílula nociva, **Then** dano é bloqueado (Resistência não reduz) mas Shield permanece até fim da Rodada
9. **Given** o jogador consumiu uma pílula e Resistência chegou a 0, **When** o efeito é aplicado, **Then** ocorre Colapso (Vidas -1, Resistência resetada para 6) com feedback visual claro
10. **Given** o jogador sofreu Colapso e ficou com 0 Vidas, **When** HUD é atualizado, **Then** mostra "0 Vidas" com indicação visual de "Última Chance" mas jogador continua vivo com Resistência resetada
11. **Given** o jogador está em "Última Chance" (0 Vidas) e Resistência chega a 0 novamente, **When** o Colapso final ocorre, **Then** o jogador é eliminado e marcado visualmente como "ELIMINATED"
12. **Given** pool esgota e jogador sinalizou "quero loja" com Pill Coins > 0, **When** Rodada termina, **Then** Shopping Phase abre com timer de 30s
13. **Given** o jogador está na Shopping Phase, **When** compra Boost "1-Up" (20 coins), **Then** Pill Coins reduzem e boost é aplicado no início da próxima Rodada (+1 Vida)
14. **Given** apenas 1 sobrevivente resta, **When** condição de término é atingida, **Then** Partida termina e vai para Results
15. **Given** o jogador está na tela Results, **When** vê estatísticas, **Then** pode ver pílulas consumidas, itens usados, modificadores aplicados, Colapsos sofridos, Pill Coins ganhos/gastos e opção de jogar novamente

---

### User Story 2 - Economia de Partida (Pill Coins + Loja) (Priority: P2)

Um jogador durante a partida completa Shape Quests (sequências de formas de pílulas) para ganhar Pill Coins e pode abrir a Loja durante seu turno para comprar itens estratégicos que ajudam na sobrevivência e estratégia.

**Why this priority**: Adiciona profundidade estratégica e economia interna à partida. Transforma o jogo de pura sorte em um jogo de escolhas significativas. É essencial para o pilar "Escolhas significativas".

**Independent Test**: Pode ser testado numa partida verificando se: (1) Shape Quests aparecem e concedem Pill Coins ao serem completados, (2) Loja abre corretamente, (3) itens podem ser comprados e usados.

**Acceptance Scenarios**:

1. **Given** o jogador inicia uma Rodada, **When** Rodada começa, **Then** recebe 1 Shape Quest nova gerada baseada nas shapes do pool atual, exibida na HUD
2. **Given** o jogador tem uma Shape Quest ativa (ex.: Capsule -> Triangle), **When** consome pílulas na sequência correta (vendo shapes visíveis), **Then** progresso da quest avança visualmente
3. **Given** o jogador completa uma Shape Quest, **When** a sequência é finalizada, **Then** recebe 10 Pill Coins (base) × multiplicador progressivo com feedback visual/sonoro (coins somam ao saldo acumulado)
4. **Given** o jogador erra a sequência de uma Shape Quest, **When** consome shape incorreto, **Then** progresso da quest é resetado com indicação visual (shake)
5. **Given** o jogador não completou Shape Quest na Rodada atual, **When** nova Rodada inicia, **Then** quest anterior é descartada e nova quest é gerada baseada no novo pool
6. **Given** o jogador tem Pill Coins acumulados durante a Partida, **When** clica em "Shop Signal" durante um turno, **Then** toggle "quero loja" é ativado com indicação visual
7. **Given** o jogador sinalizou "quero loja" com Pill Coins > 0, **When** pool da Rodada esgota, **Then** Shopping Phase abre antes da próxima Rodada
8. **Given** o jogador está na Shopping Phase, **When** seleciona Power-up Scanner (15 coins) e confirma, **Then** Scanner é adicionado ao inventário (ou incrementa stack se já tem) e coins são deduzidos
9. **Given** o jogador tem inventário com 5 slots cheios (não stackables), **When** tenta comprar novo item não-stackable, **Then** recebe feedback "Inventário cheio"
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
- Q: Shapes das pills - como funcionam? → A: Shapes são SEMPRE VISÍVEIS ao jogador antes de consumir a pill. Shapes NÃO afetam os efeitos das pills (SAFE/DMG/HEAL/etc) - são puramente visuais e servem APENAS para Shape Quests. Tipo da pill (efeito) só é revelado após consumo. Jogador vê o shape mas não sabe se é nociva ou não até consumir. Sistema NÃO é limitado a 4 shapes - deve ser extensível, suportando catálogo expandido (16 shapes base + shapes sazonais futuras). Shapes têm progressão de unlock por Rodada (algumas shapes básicas desde Rodada 1, outras desbloqueiam em rodadas posteriores).
- Q: Existe limite máximo de rodadas? Pode haver empate? → A: NÃO existe limite máximo de rodadas. Partida continua indefinidamente até restar apenas 1 sobrevivente. Empate é impossível pois em rodadas > 10 a fatalidade é alta devido à progressão de tipos nocivos. Sistema de contadores permite estratégia mesmo em rodadas longas.
- Q: Shape Quests persistem entre rodadas? Como são geradas? → A: Shape Quests NÃO persistem entre rodadas. Cada Rodada gera nova quest para cada jogador BASEADA nas shapes disponíveis no pool daquela Rodada específica. Isso garante que quest é sempre possível de completar. Progresso de quest anterior é descartado ao iniciar nova Rodada. Quest usa apenas shapes que estão presentes no pool atual (respeitando unlock progressivo de shapes).
- Q: Pill Coins persistem entre Rodadas? → A: SIM. Pill Coins acumulam durante toda a Partida (entre Rodadas). Jogador começa com 100 Pill Coins, ganha mais completando Shape Quests, e pode gastar na Pill Store. Apenas ao INICIAR uma nova Partida os Pill Coins resetam para 100. Isso cria economia progressiva: quanto mais sobrevive e completa quests, mais rico fica durante a Partida.
- Q: Quando posso usar a Pill Store? → A: Pill Store NÃO abre durante turnos. Sistema de Sinalização: durante qualquer turno da Rodada, jogador pode SINALIZAR intenção de ir à loja (toggle "quero loja"). Ao FIM da Rodada, se algum jogador sinalizou E tem Pill Coins > 0, abre fase Shopping (30s) ANTES da próxima Rodada. Se ninguém sinalizou, próxima Rodada inicia direto. Isso evita quebrar fluxo de turnos.
- Q: Posso usar múltiplos itens no meu turno? → A: SIM. Durante turno, inventário e pool estão sempre acessíveis (fluxo fluido). Jogador pode: (1) Usar quantos itens quiser, na ordem que quiser (opcional), (2) Consumir 1 pílula (obrigatório, finaliza turno automaticamente). Não há botão "Confirm" entre usar itens e consumir pill - é um fluxo contínuo. Única restrição: enquanto seleciona alvo de item (targeting ativo), pool fica temporariamente não-clicável (evita consumo acidental). Permite combos estratégicos (Scanner → Inverter → consumir).
- Q: Pílulas reveladas por Scanner ficam visíveis? → A: SIM. Sistema de Revelação: quando Scanner (ou Shape Scanner) revela tipo de pílula, essa informação PERSISTE visível para todos até a pílula ser consumida OU Shuffle ser usado (que embaralha e RESETA todas revelações). Isso transforma info em recurso estratégico: "revelar mais vs embaralhar tudo".
- Q: Quantos slots tem o inventário? → A: 5 slots. Alguns itens são stackable (ex.: Scanner pode ter até 3 no mesmo slot). Isso força escolhas difíceis no Draft: "levo Scanner OU Shield?". 5 slots cria trade-offs mais interessantes que 8 slots.
- Q: O que são Status/Efeitos Ativos? → A: Buffs/debuffs que persistem por duração (em Rodadas, não turnos). Exemplos: Shield (imune a dano por 1 Rodada completa), Handcuffed (perde próximo turno). Duração conta em Rodadas para ser clara e estratégica. Shield comprado na loja dura a Rodada inteira, permitindo múltiplos turnos protegidos.
- Q: Como funciona IA/BOT? Tem níveis? → A: SIM. 4 níveis de dificuldade com personalidade: Easy (Paciente - previsível, evita riscos), Normal (Cobaia - balanceado), Hard (Sobrevivente - agressivo, usa itens bem), Insane (Hofmann - calculista, sem piedade). Comportamento adapta por fase do jogo (early conservador, late agressivo).
- Q: A separação "Fase de Itens" e "Fase de Consumo" é visual/UX ou só conceitual? → A: **APENAS CONCEITUAL**. Visualmente/UX é um fluxo fluido sem barreiras. Jogador vê inventário + pool sempre acessíveis. Pode clicar em item (usa), clicar em outro item (usa), clicar em pill (consome e finaliza turno). SEM botão "Confirm" ou "Sair de Fase". A única separação é lógica: "você pode usar itens antes de consumir pill, mas consumir pill finaliza turno". Targeting de item temporariamente bloqueia consumo de pill (evita acidente), mas é natural da UX de seleção de alvo.
- Q: Qual biblioteca de gerenciamento de estado para o core do jogo (Match state machine, inventários, turnos, rodadas)? → A: **Zustand**. Leve (~1KB), mínimo boilerplate, adequado para state machines de jogos, boa integração com DevTools, já tem precedente no projeto (stores em src_bkp/).
- Q: Estratégia de persistência para XP, Schmeckles e nível entre sessões? → A: **localStorage**. API síncrona nativa, simples, limite ~5-10MB suficiente para dados de perfil e progressão do MVP. Fácil de migrar para backend real quando implementar multiplayer. Sem dependências extras, funciona offline.
- Q: Como sistema deve se comportar em erros fatais que impedem partida de continuar (bot timeout, state corruption)? → A: **Dual-mode**: Produção usa retry automático (1-2 tentativas) + fallback graceful para Home salvando XP/Schmeckles parcial acumulado. Ambiente Dev TAMBÉM ativa Pause + Debug Mode (congela jogo, exibe DevTools overlay com estado completo, permite inspeção e reload manual do state) para diagnóstico e correção de erros até eliminá-los.
- Q: Target de performance para animações e rendering do jogo (consumo pills, colapsos, transições de turno)? → A: **30 FPS consistente (33ms/frame) + transições <100ms**. Smooth suficiente para turn-based game, mais fácil manter consistência cross-device, feedback imediato sem parecer rushed. Realista para web sem exigir GPU potente.
- Q: Nível de logging/observabilidade para debugging do MVP (especialmente IA bot, state machines, edge cases)? → A: **Structured logs + Game Log UI**. Logs estruturados (JSON format) por categoria (turn, item, pill, status, bot_decision, state_transition, error) para debugging técnico. Game Log visível in-game (já especificado FR-103) mostra histórico de ações para jogadores e permite replay/diagnóstico. Logs podem ser filtrados por categoria e exportados para análise. Balance ideal entre usabilidade e poder de debugging sem overhead de telemetry completa.

### Edge Cases

- **Timer de Turno expirado**: Se timer do turno do jogador expira e ele não selecionou pill, sistema DEVE automaticamente consumir uma pill aleatória do pool e passar para próximo jogador
- **Jogador em "Última Chance" (0 Vidas)**: Sistema DEVE exibir feedback visual dramático quando jogador atinge 0 Vidas mas ainda está vivo. HUD deve mostrar claramente "0 Vidas" + barra de Resistência ativa. Eliminação só ocorre no próximo Colapso
- **Todos os jogadores eliminados exceto 1**: Quando resta apenas 1 jogador vivo, sistema deve terminar Partida imediatamente declarando-o vencedor (sem necessidade de esgotar pool)
- **Skip de turnos de eliminados**: Sistema deve automaticamente pular turnos de jogadores eliminados sem delay perceptível. Se todos os jogadores exceto 1 estão eliminados, sistema finaliza partida declarando sobrevivente como vencedor
- **Bot timeout**: Se bot não tomar ação em tempo razoável (configurável, padrão 5s), sistema deve forçar ação automática (consumir pill aleatória) para não travar o jogo. Se bot falhar repetidamente (3+ timeouts consecutivos), sistema deve logar erro e tentar recovery ou fallback graceful
- **State corruption detectado**: Se validação de estado detectar inconsistência crítica (ex: jogador com Vidas negativas, pool vazio em meio de rodada, inventário com slots > limite), sistema deve tentar recovery automático (recomputar estado a partir de log de ações) ou fallback graceful para Home salvando progressão parcial
- **Pool esgotado com múltiplos jogadores vivos**: Sistema gera nova Rodada automaticamente. Partida continua indefinidamente até restar 1 sobrevivente (empate impossível devido à progressão de fatalidade)
- **Overflow negativo com cascata**: Se implementado, dano com overflow negativo pode causar múltiplos colapsos em sequência - deve ter animação clara para cada colapso
- **Desconexão durante Draft/Match**: Para MVP solo, se processo do jogo trava, jogador deve poder reiniciar sem perder progresso de XP/Schmeckles já ganhos
- **Resistência extra excedendo cap**: Sistema deve enforçar cap de Resistência extra (configurável, padrão igual ao máximo de Resistência base = 6) para manter balance
- **Shape Quest não completada na Rodada**: Se jogador não completa quest na Rodada atual (por não consumir shapes corretos), quest é descartada e nova quest é gerada na próxima Rodada baseada no novo pool
- **Todas as pills do pool são do mesmo tipo**: Situação rara mas possível em rodadas avançadas. Sistema deve gerar pool normalmente seguindo distribuição configurada, mesmo que resulte em concentração extrema de um tipo
- **Shapes desbloqueadas progressivamente**: Em rodadas iniciais, sistema só gera pills com shapes já desbloqueadas. Pool deve ter diversidade mínima de shapes (pelo menos 3 diferentes) para viabilizar Shape Quests

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
- **FR-011**: Sistema DEVE organizar itens por categoria (Intel/Sustain/Control/Chaos) com nome, descrição, custo em Pill Coins, targeting (self/opponent/pill/none), e limite de stack se aplicável
- **FR-012**: Sistema DEVE exibir inventário do jogador com **5 slots** mostrando itens selecionados e quantidade (se stackable)
- **FR-013**: Sistema DEVE suportar itens stackable com limite configurável por item (ex.: Scanner até 3x no mesmo slot)
- **FR-014**: Sistema DEVE exibir saldo atual de Pill Coins do jogador na HUD do Draft
- **FR-015**: Sistema DEVE permitir comprar item se jogador tem Pill Coins suficientes E (espaço no inventário OU item stackable já presente com stack < limite)
- **FR-016**: Sistema DEVE deduzir Pill Coins do saldo ao comprar item no Draft
- **FR-017**: Sistema DEVE adicionar item ao inventário: novo slot se não tem o item, ou incrementar stack se item stackable já presente
- **FR-018**: Sistema DEVE permitir vender/remover itens do inventário durante Draft (devolvendo Pill Coins, decrementando stack ou removendo slot)
- **FR-019**: Sistema DEVE autoconfirmar Draft (finalizar seleção atual) quando timer expira
- **FR-020**: Sistema DEVE transicionar para Match quando Draft é confirmado ou timer expira, mantendo saldo de Pill Coins restante para usar na Partida

#### Catálogo de Itens (Sistema de Itens)

##### Intel (Informação)

- **FR-021**: Sistema DEVE implementar item **Scanner** (custo: 15 Pill Coins, target: pill, stackable: até 3x, categoria: Intel)
- **FR-022**: Scanner DEVE revelar tipo (SAFE/DMG/HEAL/etc) de 1 pílula escolhida pelo jogador
- **FR-023**: Revelação por Scanner DEVE persistir visível para TODOS os jogadores até pílula ser consumida OU Shuffle ser usado
- **FR-024**: Sistema DEVE implementar item **Shape Scanner** (custo: 20 Pill Coins, target: shape, stackable: até 2x, categoria: Intel)
- **FR-025**: Shape Scanner DEVE revelar tipo de TODAS as pílulas de uma forma escolhida (ex.: todas Capsule)
- **FR-026**: Sistema DEVE implementar item **Inverter** (custo: 25 Pill Coins, target: pill, stackable: não, categoria: Intel)
- **FR-027**: Inverter DEVE aplicar modificador "Inverted" em 1 pílula escolhida: dano vira cura, cura vira dano (SAFE e LIFE não afetados)
- **FR-028**: Sistema DEVE implementar item **Double** (custo: 25 Pill Coins, target: pill, stackable: não, categoria: Intel)
- **FR-029**: Double DEVE aplicar modificador "Doubled" em 1 pílula escolhida: efeito multiplicado por 2 (ex.: HEAL +2 vira +4)

##### Sustain (Sobrevivência)

- **FR-030**: Sistema DEVE implementar item **Pocket Pill** (custo: 20 Pill Coins, target: self, stackable: até 3x, categoria: Sustain)
- **FR-031**: Pocket Pill DEVE restaurar +4 Resistência imediatamente ao jogador
- **FR-032**: Sistema DEVE implementar item **Shield** (custo: 30 Pill Coins, target: self, stackable: não, categoria: Sustain)
- **FR-033**: Shield DEVE aplicar status "Shielded" no jogador por 1 Rodada completa (imunidade a dano, cura funciona normalmente)

##### Control (Controle)

- **FR-034**: Sistema DEVE implementar item **Handcuffs** (custo: 30 Pill Coins, target: opponent, stackable: até 2x, categoria: Control)
- **FR-035**: Handcuffs DEVE aplicar status "Handcuffed" no oponente: perde próximo turno (pula automaticamente)
- **FR-036**: Sistema DEVE implementar item **Force Feed** (custo: 35 Pill Coins, target: pill + opponent, stackable: não, categoria: Control)
- **FR-037**: Force Feed DEVE forçar oponente escolhido a consumir pílula escolhida pelo jogador (substitui consumo obrigatório do oponente no próximo turno)
- **FR-038**: Pílula com modificadores (Inverted/Doubled) pode ser alvo de Force Feed (modificadores aplicam ao oponente)

##### Chaos (Caos)

- **FR-039**: Sistema DEVE implementar item **Shuffle** (custo: 30 Pill Coins, target: none, stackable: até 2x, categoria: Chaos)
- **FR-040**: Shuffle DEVE embaralhar pool (re-randomizar posições das pílulas) E resetar todas as revelações (pílulas voltam a ser ocultas)
- **FR-041**: Sistema DEVE implementar item **Discard** (custo: 25 Pill Coins, target: pill, stackable: até 2x, categoria: Chaos)
- **FR-042**: Discard DEVE remover 1 pílula escolhida do pool sem ativar seu efeito (pílula sai do jogo)

#### Match (Core Gameplay)

##### Estrutura: Partida → Rodadas → Turnos

- **FR-043**: Partida (Match) DEVE ser composta por múltiplas Rodadas, com número de rodadas não pré-definido (continua até restar 1 sobrevivente)
- **FR-044**: Cada Rodada DEVE corresponder a uma Poll completa de pílulas (baralho sem reposição)
- **FR-045**: Sistema DEVE avançar para nova Rodada automaticamente quando pool atual esgota E ainda há 2+ jogadores vivos
- **FR-046**: Sistema DEVE gerar nova Poll (com tamanho e distribuição progressiva) ao iniciar cada nova Rodada
- **FR-047**: Sistema DEVE exibir número da Rodada atual na HUD (ex.: "Rodada 8")
- **FR-048**: Ordem inicial dos Turnos DEVE ser determinada aleatoriamente no início da Partida para garantir fairness
- **FR-049**: Dentro de cada Rodada, jogadores DEVEM alternar Turnos na ordem fixa determinada aleatoriamente

##### Estrutura do Turno: Uso de Itens (opcional) → Consumo de Pill (obrigatório)

- **FR-050**: Durante seu turno, jogador PODE usar itens do inventário (opcional, ilimitado, qualquer ordem) E DEVE consumir 1 pílula do pool (obrigatório)
- **FR-051**: Inventário DEVE estar sempre acessível durante turno (jogador pode clicar em item a qualquer momento)
- **FR-052**: Pool DEVE estar sempre clicável durante turno (exceto quando jogador está no meio de targeting de item)
- **FR-053**: Jogador PODE usar quantos itens quiser, na ordem que preferir, antes de consumir pílula
- **FR-054**: Cada item usado DEVE ser removido do inventário (ou decrementar stack se stackable)
- **FR-055**: Itens com targeting DEVEM permitir jogador selecionar alvo válido (self, opponent específico, pill específica)
- **FR-056**: Enquanto targeting de item está ativo (jogador selecionando alvo), pool DEVE estar temporariamente não-clicável (evita consumo acidental)
- **FR-057**: Sistema DEVE aplicar efeito do item imediatamente após seleção de alvo (revelar pill, aplicar status, modificar pill, etc.)
- **FR-058**: Após usar item, jogador DEVE automaticamente voltar para estado "pode usar outro item OU consumir pill" (fluxo contínuo, sem barreiras)
- **FR-059**: Quando jogador clica em pill para consumir, sistema DEVE finalizar turno automaticamente (sem botão "Confirm" adicional)
- **FR-060**: Consumo de pill DEVE ser bloqueado apenas se: (a) Force Feed ativo no jogador (substitui consumo), OU (b) targeting de item ativo
- **FR-061**: Turno termina quando: (a) jogador consome pílula, OU (b) timer do turno expira (pill aleatória consumida automaticamente)
- **FR-062**: Sistema DEVE ter timer por Turno de 30 segundos visível para o jogador ativo com contagem regressiva (conta durante uso de itens + consumo)
- **FR-063**: Se timer de Turno expira sem ação, sistema DEVE automaticamente consumir pílula aleatória do pool para o jogador e passar turno
- **FR-064**: Sistema DEVE indicar claramente qual jogador está no Turno ativo (destaque visual)
- **FR-065**: Quando turno de jogador eliminado chega na ordem, sistema DEVE automaticamente pular para próximo jogador vivo
- **FR-066**: Ordem de Turnos DEVE ser mantida mesmo após eliminações (não reordenar índices)
- **FR-067**: Jogadores eliminados DEVEM permanecer visíveis na UI com indicação clara de "ELIMINATED" mas sem receber turnos

##### Display & Informações

- **FR-068**: Sistema DEVE exibir linha de oponentes mostrando avatar, nome, Vidas, Resistência e Status Ativos de cada participante
- **FR-069**: Sistema DEVE implementar sistema de saúde dupla (Vidas + Resistência) para todos os jogadores com valores iniciais: 3 Vidas, 6 Resistência
- **FR-070**: Sistema DEVE implementar Resistência extra (Over-resistance) quando Overflow positivo estiver ativo
- **FR-071**: Sistema DEVE exibir pool de pílulas disponíveis no centro da tela (máquina/garrafa/mesa)
- **FR-072**: Sistema DEVE exibir contadores do pool mostrando quantidade de cada tipo de pílula (SAFE/DMG_LOW/DMG_HIGH/HEAL/FATAL/LIFE)
- **FR-073**: Shapes das pílulas (Sphere/Cube/Pyramid/Capsule/Etc) DEVEM ser sempre visíveis ao jogador no pool antes da escolha
- **FR-074**: Sistema DEVE exibir shape de cada pílula disponível claramente no pool (ícone/visual distintivo do shape)
- **FR-075**: Shapes NÃO DEVEM afetar os efeitos das pílulas (tipo SAFE/DMG/HEAL/etc) - são puramente visuais para Shape Quests
- **FR-076**: Pílulas reveladas por Scanner/Shape Scanner DEVEM ter indicação visual clara do tipo (cor, ícone ou label)
- **FR-077**: Sistema DEVE exibir ícones de Status Ativos em cada jogador (ex.: Shield icon, Handcuffs icon) com duração restante (em Rodadas)

##### Sistema de Revelação

- **FR-078**: Sistema DEVE manter registro de quais pílulas foram reveladas durante a Rodada atual
- **FR-079**: Pílulas reveladas DEVEM permanecer visíveis para TODOS os jogadores até serem consumidas OU Shuffle ser usado
- **FR-080**: Quando Shuffle é usado, sistema DEVE resetar todas as revelações (pílulas voltam ao estado oculto)
- **FR-081**: Sistema DEVE exibir contador de "Pílulas Reveladas" na HUD (ex.: "5/12 reveladas")

##### Sistema de Status/Efeitos Ativos

- **FR-082**: Sistema DEVE implementar sistema de Status com duração baseada em Rodadas (não turnos)
- **FR-083**: Status "Shielded" DEVE bloquear TODO dano recebido por 1 Rodada completa (múltiplos turnos se jogador tem múltiplos turnos na mesma Rodada)
- **FR-084**: Status "Shielded" NÃO DEVE bloquear cura (HEAL e Pocket Pill funcionam normalmente)
- **FR-085**: Status "Handcuffed" DEVE fazer jogador pular próximo turno automaticamente (turno é skipado sem ação)
- **FR-086**: Sistema DEVE decrementar duração de Status no INÍCIO de cada Rodada (não por turno)
- **FR-087**: Sistema DEVE remover Status quando duração chega a 0
- **FR-088**: Status DEVEM ser stackáveis: múltiplos Handcuffs aplicados = múltiplos turnos pulados
- **FR-089**: Sistema DEVE exibir feedback visual quando Status é aplicado (animação, som)

##### Ações do Jogador

- **FR-090**: Sistema DEVE permitir jogador escolher uma pílula do pool durante seu turno (antes do timer expirar)
- **FR-091**: Ao consumir pílula, sistema DEVE revelar apenas o tipo (efeito) da pílula com animação, já que shape já era visível
- **FR-092**: Sistema DEVE verificar se pílula tem modificadores ativos (Inverted, Doubled) antes de aplicar efeito
- **FR-093**: Sistema DEVE aplicar efeitos da pílula (com modificadores se houver) imediatamente após revelação:
  - SAFE: sem efeito
  - DMG_LOW: -2 Resistência (ou +2 se Inverted; ou -4 se Doubled)
  - DMG_HIGH: -4 Resistência (ou +4 se Inverted; ou -8 se Doubled)
  - HEAL: +2 Resistência (ou -2 se Inverted; ou +4 se Doubled; com Overflow positivo, excedente vira Resistência extra)
  - FATAL: zera Resistência (força Colapso; não afetado por Inverted/Doubled)
  - LIFE: +1 Vida (não afetado por Inverted/Doubled; respeitando cap se houver)
- **FR-094**: Sistema DEVE verificar Status "Shielded" antes de aplicar dano: se ativo, dano é bloqueado (jogador não perde Resistência)
- **FR-095**: Sistema DEVE implementar mecânica de Colapso: quando Resistência chega a ≤0, jogador sofre Colapso (Vidas -1, Resistência restaurada para 6) com feedback visual claro
- **FR-096**: Sistema DEVE implementar mecânica de "Última Chance": quando Vidas chegam a 0, jogador NÃO é eliminado imediatamente
- **FR-097**: Quando jogador está em "Última Chance" (0 Vidas), HUD DEVE exibir claramente "0 Vidas" ou indicação visual de estado crítico
- **FR-098**: Jogador em "Última Chance" (0 Vidas) DEVE ter Resistência ativa e funcional (resetada para 6 após último Colapso que zerou Vidas)
- **FR-099**: Sistema DEVE eliminar jogador APENAS quando Resistência zera novamente JÁ estando em estado de "Última Chance" (0 Vidas)
- **FR-100**: Sistema DEVE marcar jogadores eliminados visualmente (ex.: avatar cinza/opaco, marcação "ELIMINATED")

##### UI & Controles

- **FR-101**: Sistema DEVE exibir Action Dock com botões "Shop Signal" (toggle) e "Leave"
- **FR-102**: Sistema DEVE exibir inventário do jogador (5 slots) com itens e quantidades (se stackable) sempre visível na HUD
- **FR-103**: Sistema DEVE exibir Game Log mostrando histórico de ações da partida (quem consumiu qual pílula com shape, efeitos revelados, modificadores aplicados, itens usados, Status aplicados, Colapsos, eliminações, rodadas)

##### Sistema de Sinalização da Pill Store

- **FR-104**: Durante qualquer turno da Rodada, jogador PODE clicar em botão "Shop Signal" para toggle flag "quero loja"
- **FR-105**: Sistema DEVE validar se jogador tem Pill Coins > 0 para permitir sinalizar (se 0, exibir aviso "Sem Pill Coins")
- **FR-106**: Jogador PODE mudar de ideia e desligar sinalização a qualquer momento durante a Rodada
- **FR-107**: Sistema DEVE exibir indicação visual de quem sinalizou interesse na loja (ex.: ícone de loja aceso no painel do jogador)
- **FR-108**: Ao FIM da Rodada (pool esgotado), sistema DEVE verificar quais jogadores sinalizaram E têm Pill Coins > 0
- **FR-109**: Se pelo menos 1 jogador qualifica (sinalizou + tem coins), sistema DEVE ativar fase Shopping ANTES da próxima Rodada
- **FR-110**: Se ninguém qualifica, sistema DEVE pular Shopping e iniciar próxima Rodada direto

##### Condições de Término

- **FR-111**: Sistema DEVE terminar Partida imediatamente quando apenas 1 jogador sobrevive
- **FR-112**: Sistema DEVE declarar o último sobrevivente como vencedor
- **FR-113**: Partida NÃO tem limite máximo de rodadas - continua indefinidamente até restar 1 sobrevivente (empate impossível)

#### BOT/IA (Oponentes Artificiais)

##### Níveis de Dificuldade

- **FR-114**: Sistema DEVE implementar 4 níveis de dificuldade para BOT: Easy, Normal, Hard, Insane
- **FR-115**: BOT nível **Easy (Paciente)** DEVE ter comportamento previsível: evita riscos, prefere pílulas reveladas seguras, usa itens defensivos (Pocket Pill, Shield)
- **FR-116**: BOT nível **Normal (Cobaia)** DEVE ter comportamento balanceado: toma alguns riscos calculados, usa Scanner antes de consumir, mix de itens defensivos e ofensivos
- **FR-117**: BOT nível **Hard (Sobrevivente)** DEVE ter comportamento agressivo: usa itens estrategicamente (Force Feed em pills nocivas, Handcuffs em momentos críticos), faz plays de alto risco/alto retorno
- **FR-118**: BOT nível **Insane (Hofmann)** DEVE ter comportamento calculista: memoriza pool revelado, otimiza Shape Quests, usa combos avançados (Scanner + Inverter + Force Feed), sem piedade

##### Adaptação por Fase do Jogo

- **FR-119**: BOT DEVE adaptar agressividade baseado na fase do jogo: early game (rodadas 1-4) conservador, mid game (5-8) balanceado, late game (9+) máxima pressão
- **FR-120**: BOT DEVE priorizar sobrevivência quando Vidas ≤ 1 (compra Pocket Pill/Shield, usa Scanner mais)
- **FR-121**: BOT DEVE ser mais agressivo quando oponente está em "Última Chance" (0 Vidas) - usa Force Feed e Handcuffs

##### Comportamento no Draft e Shopping

- **FR-122**: BOT DEVE selecionar itens no Draft baseado em nível de dificuldade: Easy prefere Sustain, Hard/Insane balanceia todas categorias
- **FR-123**: BOT DEVE sinalizar interesse na Pill Store se tem ≥2 Pill Coins E (Vidas < 3 OU precisa de itens estratégicos)
- **FR-124**: BOT DEVE tomar decisões de compra na Pill Store em tempo razoável (configurável, padrão 3-5 segundos)

#### Shape Quests & Pill Coins

- **FR-125**: Jogador DEVE iniciar cada Partida com 100 Pill Coins (antes do Draft)
- **FR-126**: Pill Coins DEVEM persistir e acumular durante toda a Partida (entre Rodadas): ganhos em Shape Quests somam ao saldo, gastos em Draft/Shopping reduzem
- **FR-127**: Pill Coins NÃO são persistidos entre Partidas - cada nova Partida inicia com 100 Pill Coins frescos (reset completo)
- **FR-128**: Sistema DEVE gerar 1 Shape Quest nova para cada jogador no início de cada Rodada, baseada APENAS nas shapes presentes no pool da Rodada atual
- **FR-129**: Shape Quest DEVE ser gerada considerando apenas shapes desbloqueadas (progressão por Rodada) E presentes no pool atual
- **FR-130**: Shape Quest gerada DEVE ser sempre possível de completar com as pills disponíveis no pool da Rodada (validação de viabilidade)
- **FR-131**: Sistema DEVE descartar progresso de Shape Quest anterior ao iniciar nova Rodada (progresso NÃO persiste entre Rodadas)
- **FR-132**: Sistema DEVE exibir Shape Quest ativa na HUD do jogador mostrando sequência de shapes necessária e progresso atual
- **FR-133**: Sistema DEVE rastrear progresso de Shape Quest baseado em shapes (visíveis) de pílulas consumidas durante a Rodada
- **FR-134**: Sistema DEVE conceder 10 Pill Coins (base configurável) × multiplicador progressivo quando Shape Quest é completada
- **FR-135**: Sistema DEVE resetar progresso de Shape Quest quando jogador consome shape incorreto dentro da mesma Rodada
- **FR-136**: Shape Quests DEVEM ter dificuldade/recompensa progressiva baseada na Rodada:
  - Rodadas 1-3: 2 shapes, multiplicador 1.0x (10 Pill Coins)
  - Rodadas 4-7: 3 shapes, multiplicador 1.5x (15 Pill Coins)
  - Rodadas 8+: 4-5 shapes, multiplicador 2.0x (20-25 Pill Coins)
- **FR-137**: Sistema DEVE exibir saldo de Pill Coins do jogador na HUD sempre visível (acumulado durante a Partida)

#### Pill Store (Shopping Phase) - Fase Separada entre Rodadas

##### Ativação da Shopping Phase

- **FR-138**: Shopping Phase DEVE ser ativada APENAS ao fim de Rodada (pool esgotado) se pelo menos 1 jogador qualificar (sinalizou + Pill Coins > 0)
- **FR-139**: Shopping Phase DEVE ocorrer ANTES da geração da próxima Rodada (entre rodadas)
- **FR-140**: Sistema DEVE exibir tela de Shopping Phase para jogadores que qualificaram (podem comprar)
- **FR-141**: Sistema DEVE exibir tela "Aguardando outros jogadores..." para jogadores que NÃO qualificaram

##### Mecânicas de Timer

- **FR-142**: Shopping Phase DEVE ter timer de 30 segundos por jogador
- **FR-143**: Sistema DEVE implementar aceleração de timer: se um jogador confirma compras, timer dos outros reduz pela metade
- **FR-144**: Timeout DEVE auto-confirmar compras atuais do carrinho do jogador
- **FR-145**: Shopping Phase termina quando todos jogadores confirmaram OU timer expirou para todos

##### Catálogo da Pill Store

**Boosts (Efeitos Imediatos aplicados na próxima Rodada)**:

- **FR-146**: Sistema DEVE implementar Boost **1-Up** (custo: 20 Pill Coins): +1 Vida aplicada no início da próxima Rodada
- **FR-147**: 1-Up DEVE estar disponível APENAS se jogador tem Vidas < máximo (3)
- **FR-148**: Sistema DEVE implementar Boost **Reboot** (custo: 10 Pill Coins): Resistência restaurada para máximo no início da próxima Rodada
- **FR-149**: Reboot DEVE estar disponível APENAS se jogador tem Resistência < máximo (6)
- **FR-150**: Sistema DEVE implementar Boost **Scanner-2X** (custo: 10 Pill Coins): 2 pílulas reveladas automaticamente no início da próxima Rodada (escolhidas aleatoriamente)

**Power-ups (Adicionados ao Inventário)**:

- **FR-151**: Sistema DEVE permitir comprar Power-ups (Scanner, Shield, Pocket Pill, Shape Scanner, etc.) que são adicionados ao inventário
- **FR-152**: Power-ups DEVEM respeitar limite de inventário (5 slots) e stackability
- **FR-153**: Sistema DEVE impedir compra de Power-up se inventário cheio E item não é stackable OU stack já está no limite

##### Regras de Compra

- **FR-154**: Sistema DEVE permitir adicionar múltiplos itens ao carrinho antes de confirmar
- **FR-155**: Sistema DEVE exibir preview do carrinho com custo total
- **FR-156**: Sistema DEVE deduzir Pill Coins do saldo ao confirmar compras
- **FR-157**: Boosts DEVEM ser aplicados automaticamente no início da próxima Rodada
- **FR-158**: Power-ups DEVEM ser adicionados ao inventário imediatamente após confirmação

#### Results

- **FR-159**: Sistema DEVE exibir tela Results ao fim da Partida mostrando vencedor
- **FR-160**: Sistema DEVE exibir estatísticas da partida: pílulas consumidas por tipo (com shapes), pílulas reveladas, modificadores aplicados, itens usados, dano causado, dano recebido, Colapsos sofridos, Shape Quests completadas, Pill Coins ganhos, Pill Coins gastos, Pill Coins restantes, total de Rodadas jogadas
- **FR-161**: Sistema DEVE calcular e exibir XP ganho baseado em: sobrevivência (vitória/derrota), eliminações, Shape Quests completadas, Rodadas sobrevividas, uso estratégico de itens
- **FR-162**: Sistema DEVE calcular e exibir Schmeckles ganhos baseado em performance geral (fórmula configurável)
- **FR-163**: Sistema DEVE ter botão "Jogar Novamente" que retorna para Lobby
- **FR-164**: Sistema DEVE ter botão "Menu Principal" que retorna para Home

#### Progressão & Persistência

- **FR-165**: Sistema DEVE persistir XP acumulado do jogador entre sessões
- **FR-166**: Sistema DEVE persistir Schmeckles acumulados do jogador entre sessões
- **FR-167**: Sistema DEVE persistir nível do jogador entre sessões
- **FR-168**: Sistema DEVE calcular nível baseado em XP acumulado com curve de progressão definida (configurável)
- **FR-169**: Sistema DEVE exibir feedback visual quando jogador sobe de nível

#### Pool de Pílulas (Baralho por Rodada)

- **FR-170**: Sistema DEVE implementar cada pool (1 por Rodada) como baralho (sampling sem reposição) - pílulas não voltam ao pool após consumidas dentro da mesma Rodada
- **FR-171**: Sistema DEVE distribuir tipos de pílulas no pool baseado em progressão por Rodada (percentuais configuráveis):
  - SAFE: unlock Rodada 1, começa 45% e termina 15%
  - DMG_LOW: unlock Rodada 1, começa 40% e termina 20%
  - DMG_HIGH: unlock Rodada 3, começa 15% e termina 25%
  - HEAL: unlock Rodada 2, começa 10% e termina 15%
  - FATAL: unlock Rodada 6, começa 5% e termina 18%
  - LIFE: unlock Rodada 5, começa 6% e termina 13%
- **FR-172**: Sistema DEVE escalar tamanho do pool por Rodada: base 6 pílulas, +1 a cada 3 Rodadas, cap máximo 12 (valores configuráveis)
- **FR-173**: Sistema DEVE implementar catálogo extensível de Shapes com progressão de unlock por Rodada (configurável)
- **FR-174**: Sistema DEVE suportar pelo menos 16 shapes base (ex.: capsule, round, triangle, oval, cross, heart, flower, star, pumpkin, coin, bear, gem, skull, domino, pineapple, fruit) com unlock progressivo
- **FR-175**: Sistema DEVE desbloquear shapes progressivamente baseado na Rodada (ex.: shapes básicas na Rodada 1, shapes raras em rodadas posteriores)
- **FR-176**: Sistema DEVE atribuir shapes aleatórios para cada pílula do pool, independente do tipo (SAFE/DMG/HEAL/etc), usando apenas shapes desbloqueadas até a Rodada atual
- **FR-177**: Sistema DEVE garantir diversidade mínima de shapes no pool (pelo menos 3 shapes diferentes) para viabilizar Shape Quests
- **FR-178**: Sistema DEVE suportar Shapes Sazonais (ex.: natal, halloween, páscoa) que podem ser ativadas/desativadas via configuração sem alterar lógica do jogo
- **FR-179**: Shapes Sazonais ativas DEVEM ser incluídas no pool de shapes disponíveis respeitando mesma lógica de distribuição aleatória
- **FR-180**: Sistema DEVE gerar novo pool ao iniciar cada nova Rodada (com distribuição de tipos, tamanho, e shapes progressivos)
- **FR-181**: Cada pílula no pool DEVE ter registro de modificadores ativos (Inverted, Doubled, nenhum) e estado de revelação (oculta ou revelada com tipo)

#### Configurações & Balance

- **FR-182**: Sistema DEVE centralizar todas as configurações de balance e timers em estrutura de dados configurável (não hardcoded):
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
    - Diversidade mínima de shapes (padrão: 3 shapes diferentes)
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
    - Geração baseada em pool atual (sempre enabled)
  - **Shapes (Catálogo Extensível):**
    - Lista de shapes base (16 shapes: capsule, round, triangle, oval, cross, heart, flower, star, pumpkin, coin, bear, gem, skull, domino, pineapple, fruit)
    - Progressão de unlock por shape (ex.: capsule/round/triangle/oval/cross/heart/flower/star/coin/gem/fruit: Rodada 1; pumpkin/skull: Rodada 3; bear: Rodada 5; domino: Rodada 7; pineapple: Rodada 8)
    - Shapes Sazonais ativas (array de IDs de shapes sazonais habilitadas, ex.: ["xmas_tree", "pumpkin_halloween", "easter_egg"])
    - Distribuição de shapes (uniforme entre shapes desbloqueadas + sazonais ativas)
  - **Itens (Catálogo Completo):**
    - Intel: Scanner (15 coins, stackable 3x), Shape Scanner (20 coins, stackable 2x), Inverter (25 coins), Double (25 coins)
    - Sustain: Pocket Pill (20 coins, stackable 3x), Shield (30 coins)
    - Control: Handcuffs (30 coins, stackable 2x), Force Feed (35 coins)
    - Chaos: Shuffle (30 coins, stackable 2x), Discard (25 coins, stackable 2x)
    - Cada item: custo, targeting (self/opponent/pill/none), stackable (sim/não + limite), categoria, disponibilidade (DRAFT/MATCH/AMBOS)
  - **Boosts (Pill Store):**
    - 1-Up (20 coins, req: Vidas < 3)
    - Reboot (10 coins, req: Resistência < 6)
    - Scanner-2X (10 coins, sempre disponível)
  - **Status:**
    - Shielded: duração 1 Rodada, bloqueia dano, permite cura
    - Handcuffed: duração 1 turno, pula turno automaticamente
    - Stackable: sim (múltiplos Handcuffs = múltiplos turnos pulados)
  - **Shopping Phase:**
    - Timer base (padrão: 30s)
    - Aceleração quando jogador confirma (timer reduz pela metade para outros)
  - **BOT/IA:**
    - 4 níveis: Easy (Paciente), Normal (Cobaia), Hard (Sobrevivente), Insane (Hofmann)
    - Comportamento por nível (risk tolerance, item usage, strategy complexity)
    - Adaptação por fase do jogo (early conservador, late agressivo)
    - Timeout de decisão (padrão: 3-5s)
  - **Inventário:**
    - Slots totais (padrão: 5)
    - Reset entre Partidas (sempre vazio ao iniciar)
  - **XP & Progression:**
    - Fórmula XP por sobrevivência/vitória
    - Fórmula Schmeckles por performance
    - Curva de progressão de nível
- **FR-183**: Configurações DEVEM ser facilmente editáveis por desenvolvedores/admin sem necessidade de recompilar código (arquivo JSON/YAML ou interface admin)
- **FR-184**: Cada item DEVE ter configuração individual de custo (Pill Coins), targeting, stackability, e disponibilidade (DRAFT/MATCH/AMBOS)
- **FR-185**: Cada shape DEVE ter configuração individual de ID, nome, arquivo de asset, unlock por Rodada, e flag de sazonal
- **FR-186**: Cada boost DEVE ter configuração individual de custo (Pill Coins), efeito, e requisitos de disponibilidade

#### Tech Stack & Architecture

- **FR-186.1**: Frontend DEVE ser implementado com React + TypeScript + Vite (stack atual confirmada)
- **FR-186.2**: State management DEVE usar Zustand para gerenciar estado do jogo (Match state machine, inventários, turnos, rodadas, pools, jogadores)
- **FR-186.3**: Zustand stores DEVEM ser organizados por domínio: matchStore (partida/rodadas/turnos), playerStore (jogadores/inventários/status), poolStore (pills/revelações/modificadores), economyStore (Pill Coins/Shape Quests/Shopping), progressionStore (XP/Schmeckles/nível)
- **FR-186.4**: State machines de fase (Home/Lobby/Draft/Match/Shopping/Results) DEVEM ser implementados com Zustand com transições explícitas e validadas
- **FR-186.5**: Persistência de progressão (XP, Schmeckles, nível) DEVE usar localStorage com chave namespace "dosed:profile"
- **FR-186.6**: Dados em localStorage DEVEM ser serializados como JSON com validação de schema ao carregar (fallback para valores default se corrompido)
- **FR-186.7**: Sistema DEVE implementar Error Boundary (React) para capturar erros fatais e prevenir crash completo da aplicação
- **FR-186.8**: Em PRODUÇÃO, erros fatais durante partida DEVEM tentar recovery automático (1-2 tentativas), salvar XP/Schmeckles parcial acumulado, e oferecer fallback graceful para Home com mensagem explicativa
- **FR-186.9**: Em DEV MODE, erros fatais DEVEM ativar Pause + Debug Mode: congelar jogo, exibir DevTools overlay com estado completo serializado (JSON), stack trace, e controles para reload manual do state ou reset
- **FR-186.10**: Sistema DEVE logar todos os erros (produção e dev) com timestamp, fase do jogo, estado relevante e stack trace para análise posterior
- **FR-186.11**: Animações e rendering DEVEM manter 30 FPS consistente (33ms/frame) em 90% do tempo de jogo
- **FR-186.12**: Transições críticas (consumo de pill, aplicação de efeito, colapso, mudança de turno) DEVEM completar em <100ms
- **FR-186.13**: Sistema DEVE usar CSS transitions/animations ou biblioteca leve (ex: react-spring, framer-motion) para animações, evitando JavaScript animation loops que bloqueiam thread principal
- **FR-186.14**: Sistema DEVE implementar logging estruturado (JSON format) com categorias: turn, item, pill, status, bot_decision, state_transition, error, performance
- **FR-186.15**: Cada log entry DEVE conter: timestamp ISO8601, categoria, severity (debug/info/warn/error), mensagem, contexto relevante (playerId, roundNumber, turnIndex, etc)
- **FR-186.16**: Sistema DEVE popular Game Log UI (FR-103) automaticamente a partir dos logs de categorias turn, item, pill, status (formato user-friendly)
- **FR-186.17**: Em DEV MODE, sistema DEVE permitir filtrar logs por categoria, exportar logs como JSON, e limpar logs
- **FR-186.18**: Sistema DEVE logar decisões de BOT (nível de dificuldade, reasoning simplificado, ação escolhida) para análise de comportamento de IA

#### Dev Tools

- **FR-187**: Sistema DEVE incluir DevTools overlay (apenas em DEV mode) com controles para:
  - Alternar entre Home/Game screens
  - Pular entre phases (Lobby/Draft/Match/Results/Shopping)
  - Avançar/voltar Rodadas manualmente
  - Forçar fim de Turno
  - Adicionar/remover Pill Coins
  - Adicionar/remover Vidas e Resistência
  - Simular Colapso e estado de "Última Chance"
  - Aplicar/remover Status (Shielded, Handcuffed) em jogadores
  - Revelar/ocultar pílulas específicas
  - Aplicar modificadores (Inverted, Doubled) em pílulas
  - Forçar ativação de Shopping Phase
  - Editar nível de dificuldade do BOT em tempo real
  - Editar configurações de balance em tempo real
  - Alternar disponibilidade de itens (DRAFT/MATCH/AMBOS)
  - Ativar/desativar Shapes Sazonais
  - Forçar regeneração de pool com shapes específicas
  - Visualizar shapes desbloqueadas na Rodada atual
  - Visualizar pílulas reveladas e modificadores ativos
  - Disparar notificações de teste
  - Override de estado para debugging
  - Visualizar/editar estado da Partida (Rodada atual, turno, pool com shapes e modificadores, inventários, Shape Quests ativas, Status ativos, saldo de Pill Coins, sinalização de Shopping)

### Key Entities

- **Jogador**: Representa participante (humano ou bot). Atributos: ID, nome, avatar, é bot (bool), nível de dificuldade (se bot), Vidas (inicial: 3), Resistência (inicial/máxima: 6), Resistência extra, inventário (5 slots com itens e quantidades), Pill Coins (acumulado durante Partida), Shape Quest ativa (1 por Rodada), Status ativos (array de Status), sinalizou Shopping (bool), status de eliminação (vivo/última-chance/eliminado), é turno ativo (bool), total de Colapsos sofridos
- **Pílula**: Representa uma pílula no pool. Atributos: ID, tipo (SAFE/DMG_LOW/DMG_HIGH/HEAL/FATAL/LIFE), shape (ID da shape do catálogo), modificadores ativos (array: Inverted, Doubled), revelada (bool), posição no grid, estado (disponível/consumida)
- **Shape (Catálogo)**: Representa uma forma visual de pílula. Atributos: ID, nome, arquivo de asset, unlock por Rodada (número), é sazonal (bool), tema sazonal (string opcional, ex.: "christmas", "halloween")
- **Item**: Representa item consumível no inventário. Atributos: ID, nome, descrição, categoria (Intel/Sustain/Control/Chaos), custo em Pill Coins, targeting (self/opponent/pill/none), é stackable (bool), limite de stack (se stackable), efeito, disponibilidade (DRAFT/MATCH/AMBOS)
- **Status**: Representa buff/debuff ativo em jogador. Atributos: tipo (Shielded/Handcuffed), duração restante (em Rodadas), timestamp aplicação, jogador (ID)
- **Boost**: Representa buff temporário comprado na Pill Store. Atributos: tipo (1-Up/Reboot/Scanner-2X), custo em Pill Coins, efeito aplicado, requisito de disponibilidade
- **Pool (Rodada)**: Representa baralho de pílulas de uma Rodada específica. Atributos: número da Rodada, pílulas (array de Pílula), contadores por tipo, contadores de reveladas, tamanho total, shapes disponíveis (array de IDs de shapes desbloqueadas + sazonais ativas)
- **Rodada**: Representa uma Rodada da Partida (equivale a uma Poll completa). Atributos: número, pool (referência), Turnos (array de ações), Shape Quests geradas (array, 1 por jogador), Boosts a aplicar (array), estado (ativa/completada)
- **Turno**: Representa turno de um jogador específico. Atributos: jogador (ID), timer restante, itens usados (array), pill consumida (referência), modificadores aplicados na pill (array), Status aplicados em alvos (array), timestamp início, timestamp fim, estado targeting (ativo/inativo com alvo sendo selecionado)
- **Ordem de Turnos**: Sequência fixa (array de IDs de jogadores) determinada aleatoriamente no início da Partida, mantida durante toda a Partida (eliminados são pulados mas índices preservados)
- **Shape Quest**: Representa objetivo de sequência de shapes **por Rodada** (NÃO persiste entre Rodadas). Atributos: ID, número da Rodada, jogador (ID), sequência de shapes necessária (IDs), progresso atual (contador), recompensa (Pill Coins base × multiplicador), status (ativa/completada/falhada/descartada)
- **Shopping Phase**: Representa fase de compras entre Rodadas. Atributos: jogadores qualificados (array de IDs), timer restante, carrinhos (map de jogador -> itens), confirmações (array de IDs de jogadores que confirmaram), estado (ativa/completada)
- **Partida (Match)**: Representa instância completa de jogo. Atributos: ID, fase (Lobby/Draft/Match/Shopping/Results), jogadores (array), Rodadas (array), Rodada atual (número), jogador do Turno atual (índice), shapes sazonais ativas (array de IDs), sinalizações Shopping (array de IDs de jogadores), vencedor(es), timestamp início, timestamp fim
- **Perfil (Profile)**: Representa perfil persistente do jogador. Atributos: ID, nome, avatar, nível, XP total, Schmeckles total, partidas jogadas, vitórias, Rodadas totais sobrevividas, itens mais usados, timestamp

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
- **SC-021**: Shape Quests geradas são sempre possíveis de completar com as shapes disponíveis no pool da Rodada em 100% dos casos
- **SC-022**: Progresso de Shape Quest é corretamente resetado ao iniciar nova Rodada em 100% dos casos
- **SC-023**: Pool contém pelo menos 3 shapes diferentes em 100% das Rodadas (diversidade mínima para quests)
- **SC-024**: Shapes são corretamente desbloqueadas de acordo com progressão configurada (testado até Rodada 10+)
- **SC-025**: Shapes Sazonais ativadas aparecem no pool juntamente com shapes base em 100% dos casos quando habilitadas
- **SC-026**: Sistema de Revelação funciona corretamente: pílulas reveladas permanecem visíveis até consumidas OU Shuffle usado em 100% dos casos
- **SC-027**: Modificadores (Inverted, Doubled) aplicam efeitos corretamente em 100% dos consumos
- **SC-028**: Status "Shielded" bloqueia 100% do dano mas permite 100% da cura
- **SC-029**: Status "Handcuffed" faz jogador pular turno automaticamente em 100% dos casos
- **SC-030**: Fase de Itens permite uso de múltiplos itens sequencialmente em 100% dos turnos
- **SC-031**: Shopping Phase é ativada corretamente quando pelo menos 1 jogador sinaliza + tem coins em 100% dos fins de Rodada
- **SC-032**: Timer de Shopping Phase acelera pela metade quando um jogador confirma em 100% dos casos
- **SC-033**: Pill Coins acumulam corretamente durante Partida (entre Rodadas) e resetam ao iniciar nova Partida em 100% dos casos
- **SC-034**: Inventário de 5 slots com stackability funciona: itens stackable até limite, não-stackables únicos, em 100% das compras
- **SC-035**: BOT nível Hard/Insane usa itens estrategicamente (combos, timing) em pelo menos 70% das situações ótimas identificadas
- **SC-036**: BOT adapta agressividade baseado em fase do jogo (early/mid/late) de forma observável em 80% das partidas
- **SC-037**: Sistema de targeting permite selecionar alvos válidos (self/opponent/pill) em 100% dos usos de itens
- **SC-038**: Sistema mantém 30 FPS consistente em 90%+ do tempo de jogo em hardware médio (testes em devices representativos)
- **SC-039**: Transições críticas (consumo pill, colapso, mudança turno) completam em <100ms em 95% dos casos
- **SC-040**: Em caso de erro fatal, sistema salva XP/Schmeckles parcial e oferece fallback graceful em 100% dos casos (produção)
- **SC-041**: Game Log UI exibe todas as ações relevantes (turns, items, pills, status) com formatação clara em 100% dos casos
- **SC-042**: Logs estruturados permitem replay/diagnóstico de bugs em 90%+ dos casos reportados
- **SC-015**: Proporção estratégia vs sorte atinge 70/30 ou melhor (estimado via análise de winrate de bots vs jogadores experientes, considerando revelação + modificadores + combos)
- **SC-016**: Nenhum tipo de pílula (SAFE/DMG/HEAL/FATAL/LIFE) tem taxa de spawn fora da range configurada (+/- 5% de margem) em 95% das Rodadas
- **SC-017**: Jogadores retornam para jogar segunda partida em 70% dos casos após primeira partida completa
- **SC-018**: Transições entre Turnos (jogador ativo muda) acontecem em menos de 1 segundo em 95% dos casos

### Assumptions

- Jogadores têm familiaridade básica com jogos de turno e conceitos de inventário
- Estética 8-bit Rick and Morty é apelativa para o público-alvo e não requer tutorial extenso
- Progressão de dificuldade por rodada (escalação de FATAL/DMG_HIGH) cria tensão sem frustração excessiva
- Sistema de saúde dupla (Vidas + Resistência) será compreensível com feedback visual adequado
- Shape Quests com recompensa de 10 Pill Coins (base) e multiplicador progressivo (1.0x→1.5x→2.0x) são incentivo suficiente para engajamento
- Shapes visíveis antes do consumo facilitam estratégia de Shape Quests sem revelar tipo da pill
- Shapes NÃO afetam efeitos - relação visual pura para quests, sem correlação com nocividade
- Sistema extensível de shapes (16 base + sazonais) adiciona variedade visual sem complexidade mecânica
- Shape Quests geradas por Rodada (baseadas no pool atual) garantem sempre quests viáveis e eliminam edge cases de impossibilidade
- Progresso de Shape Quest não persistindo entre Rodadas mantém ritmo dinâmico e evita frustração com quests longas impossíveis de completar
- Progressão de unlock de shapes adiciona senso de descoberta sem afetar balance do jogo
- Shapes sazonais (ativáveis via config) permitem eventos temáticos sem alterar mecânicas core
- **Sistema de Revelação persistente** (Scanner revela até consumo/Shuffle) transforma sorte pura em gestão de informação estratégica
- **Modificadores de Pills** (Inverted, Doubled) criam depth através de interações, não apenas quantidade de itens
- **5 slots de inventário** (vs 8) força escolhas mais difíceis no Draft, aumentando trade-offs estratégicos
- **Stackability de itens** (Scanner 3x, Handcuffs 2x, etc.) permite builds especializados (ex.: "Scanner spammer" vs "Controller")
- **Status com duração por Rodada** (não turno) cria janelas de oportunidade claras e estratégicas (Shield dura rodada inteira = múltiplos turnos seguros)
- **Fase de Itens ilimitada** permite combos avançados (Scanner → Inverter → Double → Force Feed) sem artificialidade de "1 item por turno"
- **Targeting explícito** (self/opponent/pill) é intuitivo e evita ambiguidade ("Force Feed em qual pill? Para qual oponente?")
- **Pill Store como fase separada** (não por turno) mantém fluxo de turnos ágil e cria momentos de decisão concentrados
- **Sistema de Sinalização** ("quero loja" durante rodada) adiciona layer de telegraph/bluffing ("ele sinalizou, deve estar desesperado")
- **Timer com aceleração** (30s → 15s quando alguém confirma) cria pressão temporal sem ser frustrante
- **Pill Coins persistindo entre Rodadas** (mas não entre Partidas) cria economia progressiva interessante: "economizo agora para boost late-game"
- Economia unificada com Pill Coins (Draft + Match + Shopping) cria escolhas estratégicas multi-fase
- 100 Pill Coins iniciais + 10-25 por Shape Quest + gastos em Draft/Shopping permitem aproximadamente 3-5 ciclos de compra por Partida
- Custos de itens (Intel 15-25, Sustain 20-30, Control 30-35, Chaos 25-30, Boosts 10-20) balanceiam economia sem inflar demais
- **BOT com 4 níveis nomeados** (Paciente/Cobaia/Sobrevivente/Hofmann) adiciona personalidade e progressão de dificuldade clara
- BOT nível Hard/Insane usando itens estrategicamente (combos, timing) é suficiente para desafiar jogadores experientes sem ML complexo
- Adaptação de BOT por fase do jogo (early conservador, late agressivo) cria sensação de opponent inteligente sem IA avançada
- Inventário sempre vazio ao iniciar Partida garante fairness (sem vantagem de "save scumming")
- Pill Coins sempre resetam entre Partidas (mas acumulam entre Rodadas) mantém balanceamento
- Persistência local (localStorage ou similar) é suficiente para MVP (XP/Schmeckles), sem necessidade de backend completo
- Sistema de contadores visíveis do pool (card counting) é pilar fundamental e deve estar sempre visível
- Overflow positivo (Resistência extra) adiciona profundidade estratégica sem complicar demais o sistema de saúde
- Partidas sem limite de rodadas + progressão de fatalidade garantem que empate é impossível (mesmo em rodadas 15+)
- Ordem inicial randomizada de turnos garante fairness entre partidas
- **Proporção estratégia 70/30** (vs sorte) é atingível com Revelação + Modificadores + Status + Combos de itens + BOT inteligente
- Multiplayer real e matchmaking são expansões futuras e não bloqueiam validação do MVP
- Meta-moeda Schmeckles em "mock" (sem funcionalidade de gasto) é aceitável para MVP
- **Zustand** é adequado para gerenciar state complexo de jogo (Match state machine, turnos, inventários) com boa DevTools integration
- **localStorage** com ~5-10MB é suficiente para persistir progressão do MVP (perfil, XP, Schmeckles, nível) sem necessidade de backend
- **30 FPS target** é realista e suficiente para turn-based game web, mantendo smooth UX em hardware médio sem otimizações agressivas
- **Structured logging + Game Log UI** permite debugging eficiente de edge cases (bot decisions, state transitions) sem overhead de analytics completo
- **Error recovery dual-mode** (retry + fallback produção / pause + debug dev) permite UX graceful e debugging eficiente simultaneamente
- Animações via CSS/bibliotecas leves (react-spring/framer-motion) evitam jank sem bloquear thread principal
- Logs estruturados em JSON com categorias permitem filtrar, exportar e replay para diagnóstico de bugs complexos
