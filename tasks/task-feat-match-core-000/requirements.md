# Requirements — Core do Match (Gameplay) (EARS)

## Objetivo
Implementar a lógica central do gameplay de Match: pool de pílulas (baralho sem reposição), sistema de turnos, escolha/revelação de pílulas, aplicação de efeitos, detecção de vitória/derrota e IA básica para oponente.

## Requirements (EARS)

### Pool de Pílulas
- **Quando** uma partida iniciar (transição para `MATCH`), o sistema **deve** criar um pool de pílulas baseado na rodada atual (round 1).
- **Enquanto** o pool estiver sendo gerado, o sistema **deve** seguir as regras de progressão definidas em `docs/02-gameplay/pills.md` (distribuição percentual, unlock por rodada).
- **Se** o pool atingir o cap máximo (12 pílulas), o sistema **deve** parar de adicionar pílulas.
- **Quando** uma pílula for escolhida, o sistema **deve** removê-la do pool (sampling sem reposição).
- **Quando** o pool esvaziar completamente, o sistema **deve** gerar um novo pool para a próxima rodada.

### Contadores Visíveis (Card Counting)
- **Enquanto** a partida estiver em andamento, o sistema **deve** exibir contadores visíveis de cada tipo de pílula restante no pool.
- **Quando** uma pílula for removida do pool, o sistema **deve** atualizar o contador correspondente imediatamente.

### Sistema de Saúde Duplo (Lives + Resistance)
- **Quando** uma partida iniciar, o sistema **deve** inicializar cada jogador com `lives` e `resistance` (e `extraResistance = 0`).
- **Quando** um efeito causar dano normal, o sistema **deve** aplicar o dano primeiro em `extraResistance` (se > 0), e depois em `resistance`.
- **Quando** um efeito causar cura, o sistema **deve** restaurar `resistance` até o máximo; se houver excedente e **Overflow positivo** estiver ativo, o sistema **deve** converter o excedente em `extraResistance` (respeitando o cap de design).
- **Quando** `resistance` chegar a 0 após a resolução de um efeito, o sistema **deve** aplicar **Colapso**: `lives -= 1` e `resistance = resistanceMax`, sem perder turno.
- **Se** `lives` chegar a 0, o sistema **deve** eliminar o jogador.

### Sistema de Turnos
- **Quando** a partida iniciar, o sistema **deve** definir o primeiro jogador (player ou oponente) de forma determinística.
- **Enquanto** a partida estiver em andamento, o sistema **deve** alternar turnos entre player e oponente(s).
- **Quando** for o turno do player, o sistema **deve** permitir que ele escolha uma pílula do pool.
- **Quando** for o turno do oponente, o sistema **deve** executar a lógica da IA para escolher uma pílula.

### Escolha e Revelação de Pílulas
- **Quando** o player clicar em uma pílula disponível, o sistema **deve** registrar a escolha e revelar o tipo da pílula.
- **Quando** uma pílula for revelada, o sistema **deve** aplicar seus efeitos no jogador correspondente.
- **Se** a pílula for do tipo `SAFE`, o sistema **não deve** aplicar dano.
- **Se** a pílula for do tipo `DMG_LOW`, o sistema **deve** aplicar -2 de Resistência.
- **Se** a pílula for do tipo `DMG_HIGH`, o sistema **deve** aplicar -4 de Resistência.
- **Se** a pílula for do tipo `HEAL`, o sistema **deve** aplicar +2 de Resistência (até o máximo; com Overflow positivo pode gerar `extraResistance`).
- **Se** a pílula for do tipo `FATAL`, o sistema **deve** zerar a Resistência (forçando 1 Colapso; não é morte instantânea).
- **Se** a pílula for do tipo `LIFE`, o sistema **deve** adicionar +1 Vida (respeitando o cap de design, quando houver).

### Eliminação e Vitória/Derrota
- **Quando** as Vidas de um jogador chegarem a 0, o sistema **deve** eliminar o jogador.
- **Quando** o player for eliminado, o sistema **deve** transicionar para a fase `RESULTS` com status "derrota".
- **Quando** todos os oponentes forem eliminados, o sistema **deve** transicionar para a fase `RESULTS` com status "vitória".

### IA do Oponente (Básica)
- **Quando** for o turno do oponente, o sistema **deve** executar a lógica da IA para escolher uma pílula.
- **Se** a dificuldade for `easy`, o sistema **deve** usar parâmetros conservadores (riskTolerance: 0.3).
- **Se** a dificuldade for `normal`, o sistema **deve** usar parâmetros balanceados (riskTolerance: 0.5).
- **Se** a dificuldade for `hard`, o sistema **deve** usar parâmetros agressivos (riskTolerance: 0.7).
- **Enquanto** a IA estiver escolhendo, o sistema **deve** garantir que a escolha seja determinística (mesma entrada -> mesma saída).

### Feedback Visual
- **Quando** uma pílula for revelada, o sistema **deve** exibir animação de feedback (cor, ícone, efeito).
- **Quando** um jogador tomar dano, o sistema **deve** atualizar Resistência/Resistência extra visualmente.
- **Quando** ocorrer Colapso, o sistema **deve** atualizar Vidas e reset de Resistência visualmente.
- **Quando** um jogador for eliminado, o sistema **deve** exibir estado "morto" no HUD.

## Critérios de Aceitação
1. Pool de pílulas segue regras de progressão e cap
2. Contadores visíveis atualizados em tempo real
3. Sistema de turnos alterna corretamente entre player e IA
4. Efeitos de pílulas aplicados corretamente (dano, cura, fatal, life)
5. Vitória/derrota detectada e transição para `RESULTS` funciona
6. IA básica funciona (escolhas determinísticas)
7. Nenhum warning/erro no `pnpm lint` e `pnpm build`

## Fora do Escopo (nesta task)
- Uso de itens do inventário (Draft)
- Loja in-match (overlay)
- Multiplayer (server-authoritative)
- Animações complexas (apenas feedback básico)
- Replays e auditoria
