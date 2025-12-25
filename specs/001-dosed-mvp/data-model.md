# Data Model: DOSED MVP

**Feature**: DOSED MVP  
**Date**: 2025-12-25  
**Status**: Design

## Overview

Este documento define o modelo de dados completo do jogo, incluindo todas as entidades, atributos, relacionamentos, validações e transições de estado. Baseado em 29 Key Entities especificadas no spec (spec.md seção "Key Entities").

---

## Core Entities

### Player (Jogador)

Representa um participante na partida (humano ou bot).

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `id` | `string` (UUID) | Obrigatório, único | - | Identificador único |
| `name` | `string` | 1-20 chars | - | Nome de exibição |
| `avatar` | `string` (URL) | - | `default.png` | Avatar visual |
| `isBot` | `boolean` | - | `false` | Se é bot ou humano |
| `botLevel` | `BotLevel?` | Se `isBot=true` | `null` | Nível de dificuldade |
| `lives` | `number` | ≥ 0, ≤ 3 | `3` | Vidas atuais |
| `resistance` | `number` | ≥ -∞, ≤ cap | `6` | Resistência atual |
| `resistanceCap` | `number` | > 0 | `6` | Resistência máxima |
| `extraResistance` | `number` | ≥ 0, ≤ cap | `0` | Resistência extra (overflow) |
| `inventory` | `InventorySlot[]` | length ≤ 5 | `[]` | Inventário (5 slots) |
| `pillCoins` | `number` | ≥ 0 | `100` | Moeda da partida |
| `activeStatuses` | `Status[]` | - | `[]` | Status ativos |
| `isEliminated` | `boolean` | - | `false` | Se foi eliminado |
| `isLastChance` | `boolean` | - | `false` | Se está em última chance (0 vidas) |
| `isActiveTurn` | `boolean` | - | `false` | Se é turno ativo |
| `totalCollapses` | `number` | ≥ 0 | `0` | Total de colapsos sofridos |
| `shapeQuest` | `ShapeQuest?` | - | `null` | Quest ativa da rodada |
| `wantsShop` | `boolean` | - | `false` | Sinalizou interesse na loja |

#### Relationships
- **1:N** com `InventorySlot` (inventário)
- **1:N** com `Status` (status ativos)
- **1:1** com `ShapeQuest` (quest ativa por rodada)
- **N:1** com `Match` (múltiplos jogadores por partida)

#### State Transitions

```
ALIVE → LAST_CHANCE (quando lives === 0)
LAST_CHANCE → ELIMINATED (quando resistance <= 0 estando em LAST_CHANCE)
```

#### Invariantes
- `lives >= 0` (sempre, mesmo em última chance)
- `resistance` pode ser negativo (overflow negativo)
- `extraResistance <= resistanceCap`
- `inventory.length <= 5`
- Se `isEliminated === true` então `isActiveTurn === false`
- Se `lives === 0` então `isLastChance === true`

---

### Pill (Pílula)

Representa uma pílula no pool da rodada.

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `id` | `string` (UUID) | Obrigatório, único | - | Identificador único |
| `type` | `PillType` | Enum obrigatório | - | Tipo do efeito |
| `shape` | `string` (ShapeId) | FK para Shape | - | Forma visual |
| `modifiers` | `PillModifier[]` | - | `[]` | Modificadores ativos |
| `isRevealed` | `boolean` | - | `false` | Se tipo foi revelado |
| `position` | `number` | ≥ 0, < poolSize | - | Posição no grid |
| `state` | `PillState` | Enum | `AVAILABLE` | Estado atual |

#### Enums

**PillType**:
- `SAFE` - Sem efeito
- `DMG_LOW` - Dano baixo (-2 Resistência)
- `DMG_HIGH` - Dano alto (-4 Resistência)
- `HEAL` - Cura (+2 Resistência)
- `FATAL` - Fatal (zera Resistência)
- `LIFE` - Vida extra (+1 Vida)

**PillModifier**:
- `INVERTED` - Inverte efeito (dano vira cura, cura vira dano)
- `DOUBLED` - Multiplica efeito por 2

**PillState**:
- `AVAILABLE` - Disponível no pool
- `CONSUMED` - Já consumida

#### Relationships
- **N:1** com `Shape` (forma visual)
- **N:1** com `Pool` (múltiplas pills por pool)

#### Effect Resolution

```typescript
function resolvePillEffect(pill: Pill, player: Player): Effect {
  let value = PILL_BASE_VALUES[pill.type];
  
  // Aplicar modificadores
  if (pill.modifiers.includes('INVERTED')) {
    if (pill.type === 'DMG_LOW' || pill.type === 'DMG_HIGH') {
      value = -value; // Dano vira cura
    } else if (pill.type === 'HEAL') {
      value = -value; // Cura vira dano
    }
    // SAFE, FATAL, LIFE não são afetados
  }
  
  if (pill.modifiers.includes('DOUBLED')) {
    if (pill.type !== 'FATAL' && pill.type !== 'LIFE') {
      value *= 2;
    }
  }
  
  // Verificar Shield
  if (player.activeStatuses.some(s => s.type === 'SHIELDED') && value < 0) {
    return { type: 'BLOCKED', originalValue: value };
  }
  
  return { type: pill.type, value };
}
```

#### Invariantes
- `shape` DEVE existir no catálogo de Shapes
- `type` é independente de `shape` (shapes não afetam efeitos)
- Se `isRevealed === true`, `type` DEVE ser visível na UI
- `modifiers` pode ter `INVERTED` XOR `DOUBLED` OU ambos

---

### Shape (Forma Visual)

Representa uma forma visual de pílula (catálogo configurável).

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `id` | `string` | Obrigatório, único | - | ID único (ex: `capsule`) |
| `name` | `string` | - | - | Nome de exibição |
| `assetPath` | `string` | - | - | Caminho do asset visual |
| `unlockRound` | `number` | ≥ 1 | `1` | Rodada de unlock |
| `isSeasonal` | `boolean` | - | `false` | Se é shape sazonal |
| `seasonalTheme` | `string?` | Se `isSeasonal` | `null` | Tema (ex: `christmas`) |

#### Base Shapes (16)

| ID | Name | Unlock Round | Seasonal |
|----|------|--------------|----------|
| `capsule` | Capsule | 1 | No |
| `round` | Round | 1 | No |
| `triangle` | Triangle | 1 | No |
| `oval` | Oval | 1 | No |
| `cross` | Cross | 1 | No |
| `heart` | Heart | 1 | No |
| `flower` | Flower | 1 | No |
| `star` | Star | 1 | No |
| `coin` | Coin | 1 | No |
| `gem` | Gem | 1 | No |
| `fruit` | Fruit | 1 | No |
| `pumpkin` | Pumpkin | 3 | No |
| `skull` | Skull | 3 | No |
| `bear` | Bear | 5 | No |
| `domino` | Domino | 7 | No |
| `pineapple` | Pineapple | 8 | No |

#### Relationships
- **1:N** com `Pill` (uma shape, muitas pills)

#### Invariantes
- `unlockRound >= 1`
- Se `isSeasonal === true`, `seasonalTheme` DEVE estar definido
- Shapes desbloqueadas por rodada: `shape.unlockRound <= currentRound`

---

### Item (Item Consumível)

Representa item no inventário ou loja.

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `id` | `string` | Obrigatório, único | - | ID único |
| `name` | `string` | - | - | Nome de exibição |
| `description` | `string` | - | - | Descrição do efeito |
| `category` | `ItemCategory` | Enum | - | Categoria |
| `cost` | `number` | > 0 | - | Custo em Pill Coins |
| `targeting` | `Targeting` | Enum | - | Tipo de alvo |
| `isStackable` | `boolean` | - | `false` | Se pode stackar |
| `stackLimit` | `number?` | Se `isStackable` | `null` | Limite de stack |
| `availability` | `Availability` | Enum | `BOTH` | Onde disponível |

#### Enums

**ItemCategory**:
- `INTEL` - Informação (Scanner, Shape Scanner, Inverter, Double)
- `SUSTAIN` - Sobrevivência (Pocket Pill, Shield)
- `CONTROL` - Controle (Handcuffs, Force Feed)
- `CHAOS` - Caos (Shuffle, Discard)

**Targeting**:
- `SELF` - Alvo próprio
- `OPPONENT` - Alvo oponente específico
- `PILL` - Alvo pill específica
- `SHAPE` - Alvo shape (todas pills dessa forma)
- `NONE` - Sem alvo

**Availability**:
- `DRAFT` - Apenas no Draft
- `MATCH` - Apenas na Pill Store (durante Match)
- `BOTH` - Ambos

#### Catalog (Abbreviated)

| Item | Category | Cost | Targeting | Stackable | Stack Limit | Availability |
|------|----------|------|-----------|-----------|-------------|--------------|
| Scanner | INTEL | 15 | PILL | Yes | 3 | BOTH |
| Shape Scanner | INTEL | 20 | SHAPE | Yes | 2 | BOTH |
| Inverter | INTEL | 25 | PILL | No | - | BOTH |
| Double | INTEL | 25 | PILL | No | - | BOTH |
| Pocket Pill | SUSTAIN | 20 | SELF | Yes | 3 | BOTH |
| Shield | SUSTAIN | 30 | SELF | No | - | BOTH |
| Handcuffs | CONTROL | 30 | OPPONENT | Yes | 2 | BOTH |
| Force Feed | CONTROL | 35 | PILL+OPPONENT | No | - | BOTH |
| Shuffle | CHAOS | 30 | NONE | Yes | 2 | BOTH |
| Discard | CHAOS | 25 | PILL | Yes | 2 | BOTH |

#### Relationships
- **N:M** com `Player` (via InventorySlot)

#### Invariantes
- `cost > 0`
- Se `isStackable === true`, `stackLimit` DEVE estar definido e `> 1`
- `availability` filtra onde item aparece na UI

---

### InventorySlot (Slot de Inventário)

Representa um slot no inventário do jogador (máximo 5).

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `slotIndex` | `number` | 0-4 | - | Índice do slot (0-based) |
| `item` | `Item?` | - | `null` | Item no slot |
| `quantity` | `number` | Se item stackable | `1` | Quantidade stackada |

#### Relationships
- **N:1** com `Player` (5 slots por jogador)
- **N:1** com `Item` (referência ao item)

#### Invariantes
- `slotIndex >= 0 && slotIndex < 5`
- Se `item === null`, `quantity === 0`
- Se `item.isStackable === true`, `quantity <= item.stackLimit`
- Se `item.isStackable === false`, `quantity === 1`

---

### Status (Buff/Debuff Ativo)

Representa status ativo em jogador (Shield, Handcuffs, etc).

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `id` | `string` (UUID) | Obrigatório, único | - | ID único |
| `type` | `StatusType` | Enum | - | Tipo do status |
| `duration` | `number` | > 0 | - | Duração em Rodadas |
| `appliedAt` | `number` | Timestamp | - | Quando foi aplicado |
| `playerId` | `string` | FK | - | Jogador afetado |

#### Enums

**StatusType**:
- `SHIELDED` - Imune a dano por 1 Rodada
- `HANDCUFFED` - Perde próximo turno

#### Relationships
- **N:1** com `Player` (múltiplos status por jogador)

#### Behavior

**Shielded**:
- Bloqueia TODO dano (DMG_LOW, DMG_HIGH, FATAL)
- NÃO bloqueia cura (HEAL, Pocket Pill)
- Resistência não reduz quando Shielded ativo
- Dura 1 Rodada completa (múltiplos turnos se aplicável)

**Handcuffed**:
- Jogador pula próximo turno automaticamente
- Duração 1 turno (decrementado quando turno pulado)
- Stackable: múltiplos Handcuffs = múltiplos turnos pulados

#### Invariantes
- `duration > 0` enquanto status ativo
- Quando `duration === 0`, status DEVE ser removido de `player.activeStatuses`
- Duração decrementa no INÍCIO de cada Rodada (não por turno)

---

### Pool (Baralho de Pílulas por Rodada)

Representa pool de pílulas de uma Rodada (sem reposição).

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `roundNumber` | `number` | ≥ 1 | - | Número da rodada |
| `pills` | `Pill[]` | - | - | Array de pílulas |
| `size` | `number` | ≥ 6, ≤ 12 | - | Tamanho total |
| `counters` | `Record<PillType, number>` | - | - | Contadores por tipo |
| `revealed` | `number` | ≥ 0, ≤ size | `0` | Quantidade revelada |
| `unlockedShapes` | `string[]` | - | - | Shapes disponíveis |

#### Size Progression

```typescript
function calculatePoolSize(roundNumber: number): number {
  const baseSize = 6;
  const increment = Math.floor((roundNumber - 1) / 3); // +1 a cada 3 rodadas
  const maxSize = 12;
  return Math.min(baseSize + increment, maxSize);
}

// Rodada 1-3: 6 pills
// Rodada 4-6: 7 pills
// Rodada 7-9: 8 pills
// Rodada 10+: 9-12 pills (cap em 12)
```

#### Type Distribution (Progressive)

| Type | Unlock Round | Initial % | Final % (10+) |
|------|--------------|-----------|---------------|
| SAFE | 1 | 45% | 15% |
| DMG_LOW | 1 | 40% | 20% |
| DMG_HIGH | 3 | 15% | 25% |
| HEAL | 2 | 10% | 15% |
| FATAL | 6 | 5% | 18% |
| LIFE | 5 | 6% | 13% |

**Interpolação**: Linear entre rodadas inicial e final (configurável).

#### Shape Distribution

- Shapes desbloqueadas até `roundNumber` (filtradas por `unlockRound`)
- Shapes sazonais ativas (se configuradas) incluídas no pool
- Distribuição uniforme entre shapes disponíveis
- **Diversidade mínima**: Pool DEVE ter pelo menos 3 shapes diferentes

#### Generation Algorithm

```typescript
function generatePool(roundNumber: number, config: GameConfig): Pill[] {
  const size = calculatePoolSize(roundNumber);
  const distribution = calculateDistribution(roundNumber, config);
  const unlockedShapes = getUnlockedShapes(roundNumber, config);
  
  // 1. Gerar tipos baseado em distribuição
  const types: PillType[] = [];
  for (const [type, percentage] of Object.entries(distribution)) {
    const count = Math.round(size * percentage);
    types.push(...Array(count).fill(type));
  }
  
  // 2. Ajustar para size exato (arredondamento pode gerar ±1)
  while (types.length < size) types.push(mostCommonType);
  while (types.length > size) types.pop();
  
  // 3. Atribuir shapes aleatórios
  const pills = types.map((type, i) => ({
    id: uuid(),
    type,
    shape: randomChoice(unlockedShapes),
    modifiers: [],
    isRevealed: false,
    position: i,
    state: 'AVAILABLE',
  }));
  
  // 4. Validar diversidade mínima de shapes
  const uniqueShapes = new Set(pills.map(p => p.shape));
  if (uniqueShapes.size < 3) {
    throw new Error('Pool deve ter pelo menos 3 shapes diferentes');
  }
  
  return shuffle(pills); // Embaralhar posições
}
```

#### Invariantes
- `size >= 6 && size <= 12`
- `pills.length === size`
- `revealed <= size`
- `counters` DEVE corresponder a contagem real de pills por tipo
- Pool DEVE ter pelo menos 3 shapes diferentes
- Shapes no pool DEVEM estar desbloqueadas (`shape.unlockRound <= roundNumber`)

---

### ShapeQuest (Quest de Sequência de Shapes)

Representa quest ativa de um jogador em uma rodada (NÃO persiste entre rodadas).

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `id` | `string` (UUID) | Obrigatório, único | - | ID único |
| `roundNumber` | `number` | ≥ 1 | - | Rodada da quest |
| `playerId` | `string` | FK | - | Jogador dono |
| `sequence` | `string[]` (ShapeIds) | length 2-5 | - | Sequência de shapes |
| `progress` | `number` | ≥ 0, ≤ length | `0` | Progresso atual |
| `reward` | `number` | > 0 | - | Pill Coins ao completar |
| `status` | `QuestStatus` | Enum | `ACTIVE` | Estado da quest |

#### Enums

**QuestStatus**:
- `ACTIVE` - Quest ativa (em progresso)
- `COMPLETED` - Quest completada (recompensa concedida)
- `FAILED` - Quest falhada (sequência errada)
- `DISCARDED` - Quest descartada (nova rodada iniciou)

#### Quest Generation

```typescript
function generateShapeQuest(roundNumber: number, pool: Pool, config: GameConfig): ShapeQuest {
  // Tamanho da sequência baseado em rodada
  const sequenceLength = roundNumber <= 3 ? 2 : roundNumber <= 7 ? 3 : randomInt(4, 5);
  
  // Shapes disponíveis no pool atual
  const availableShapes = [...new Set(pool.pills.map(p => p.shape))];
  
  // Gerar sequência aleatória (shapes podem repetir)
  const sequence = Array(sequenceLength)
    .fill(null)
    .map(() => randomChoice(availableShapes));
  
  // Recompensa com multiplicador progressivo
  const baseReward = config.economy.shapeQuestBaseReward; // 10
  const multiplier = roundNumber <= 3 ? 1.0 : roundNumber <= 7 ? 1.5 : 2.0;
  const reward = Math.round(baseReward * multiplier * sequenceLength / 2);
  
  return {
    id: uuid(),
    roundNumber,
    playerId: player.id,
    sequence,
    progress: 0,
    reward,
    status: 'ACTIVE',
  };
}
```

#### Progress Tracking

```typescript
function trackQuestProgress(quest: ShapeQuest, consumedPill: Pill): ShapeQuest {
  if (quest.status !== 'ACTIVE') return quest;
  
  const expectedShape = quest.sequence[quest.progress];
  
  if (consumedPill.shape === expectedShape) {
    // Shape correto, avançar progresso
    const newProgress = quest.progress + 1;
    
    if (newProgress === quest.sequence.length) {
      // Quest completada!
      return { ...quest, progress: newProgress, status: 'COMPLETED' };
    } else {
      return { ...quest, progress: newProgress };
    }
  } else {
    // Shape incorreto, resetar progresso
    return { ...quest, progress: 0, status: 'FAILED' };
  }
}
```

#### Lifecycle

1. **GERADA**: No início de cada Rodada, 1 quest nova por jogador
2. **ATIVA**: Progresso rastreado ao consumir pills
3. **COMPLETADA**: Quando `progress === sequence.length` → conceder `reward` Pill Coins
4. **FALHADA**: Quando consumir shape errado → resetar `progress` para 0 (continua ativa)
5. **DESCARTADA**: Ao iniciar nova Rodada, quest anterior descartada (mesmo se incompleta)

#### Invariantes
- `sequence` DEVE conter apenas shapes presentes no pool da rodada
- `progress <= sequence.length`
- Quest DEVE ser gerada APENAS com shapes desbloqueadas na rodada atual
- Quest NÃO persiste entre rodadas (sempre nova quest por rodada)
- Se `status === 'COMPLETED'`, recompensa JÁ foi concedida

---

### Boost (Buff Temporário da Pill Store)

Representa boost comprado na Pill Store (aplicado na próxima rodada).

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `type` | `BoostType` | Enum | - | Tipo do boost |
| `cost` | `number` | > 0 | - | Custo em Pill Coins |
| `effect` | `string` | - | - | Descrição do efeito |
| `requirement` | `Requirement?` | - | `null` | Requisito de disponibilidade |

#### Enums

**BoostType**:
- `ONE_UP` - +1 Vida (aplicado no início da próxima rodada)
- `REBOOT` - Resistência restaurada para máximo
- `SCANNER_2X` - 2 pills reveladas automaticamente

#### Catalog

| Boost | Cost | Effect | Requirement |
|-------|------|--------|-------------|
| 1-Up | 20 | +1 Vida no início da próxima rodada | `player.lives < 3` |
| Reboot | 10 | Resistência restaurada para 6 | `player.resistance < 6` |
| Scanner-2X | 10 | 2 pills aleatórias reveladas no início da rodada | Sempre disponível |

#### Application

Boosts são aplicados no INÍCIO da próxima Rodada (após pool gerado, antes de turnos iniciarem):

```typescript
function applyBoosts(player: Player, boosts: Boost[], pool: Pool): Player {
  let updatedPlayer = { ...player };
  
  for (const boost of boosts) {
    switch (boost.type) {
      case 'ONE_UP':
        updatedPlayer.lives = Math.min(updatedPlayer.lives + 1, 3);
        break;
      case 'REBOOT':
        updatedPlayer.resistance = updatedPlayer.resistanceCap;
        break;
      case 'SCANNER_2X':
        revealRandomPills(pool, 2);
        break;
    }
  }
  
  return updatedPlayer;
}
```

#### Invariantes
- Boosts DEVEM ser consumidos (aplicados) ao iniciar próxima rodada
- `ONE_UP` não pode exceder cap de Vidas (3)
- `REBOOT` restaura para `resistanceCap`, não adiciona extra

---

### Turn (Turno de Jogador)

Representa turno de um jogador específico dentro de uma Rodada.

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `playerId` | `string` | FK | - | Jogador do turno |
| `timerRemaining` | `number` | ≥ 0, ≤ 30 | `30` | Timer em segundos |
| `itemsUsed` | `Item[]` | - | `[]` | Itens usados no turno |
| `pillConsumed` | `Pill?` | - | `null` | Pill consumida |
| `statusesApplied` | `Status[]` | - | `[]` | Status aplicados em alvos |
| `startedAt` | `number` | Timestamp | - | Início do turno |
| `endedAt` | `number?` | Timestamp | `null` | Fim do turno |
| `targetingActive` | `boolean` | - | `false` | Se está selecionando alvo |

#### Lifecycle

```
IDLE → ACTIVE (timer inicia)
  ↓
ITEM_PHASE (jogador pode usar itens, opcional, ilimitado)
  ↓
CONSUMPTION_PHASE (jogador DEVE consumir 1 pill)
  ↓
ENDED (pill consumida OU timer expirou)
```

**IMPORTANTE**: Fases de Item e Consumo são conceituais. Na UI, é fluxo contínuo:
- Jogador clica em itens → usa
- Jogador clica em pill → consome e finaliza turno

#### Timer Behavior

- Timer de 30 segundos (configurável)
- Se timer expira SEM pill consumida → sistema consome pill aleatória automaticamente
- Timer continua contando durante uso de itens (não pausa para targeting)

#### Invariantes
- Turno DEVE terminar quando `pillConsumed !== null` OU `timerRemaining === 0`
- Se `targetingActive === true`, pool DEVE estar não-clicável (prevenir consumo acidental)
- `itemsUsed` podem ser múltiplos (sem limite)
- `pillConsumed` é SEMPRE 1 ou 0 (nunca múltiplas pills em um turno)

---

### Round (Rodada da Partida)

Representa uma Rodada completa (equivale a uma Pool completa).

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `number` | `number` | ≥ 1 | - | Número da rodada |
| `pool` | `Pool` | - | - | Pool de pills |
| `turns` | `Turn[]` | - | `[]` | Turnos executados |
| `shapeQuests` | `ShapeQuest[]` | length = num jogadores | `[]` | Quests geradas |
| `boostsToApply` | `Boost[]` | - | `[]` | Boosts a aplicar |
| `state` | `RoundState` | Enum | `ACTIVE` | Estado da rodada |
| `startedAt` | `number` | Timestamp | - | Início da rodada |
| `endedAt` | `number?` | Timestamp | `null` | Fim da rodada |

#### Enums

**RoundState**:
- `ACTIVE` - Rodada ativa (turnos em progresso)
- `COMPLETED` - Rodada completada (pool esgotado)

#### Lifecycle

```
GENERATED (pool gerado, quests criadas) 
  ↓
BOOSTS_APPLIED (boosts da loja aplicados)
  ↓
ACTIVE (turnos iniciam, round-robin)
  ↓
COMPLETED (pool esgotado)
  ↓
SHOPPING_CHECK (verificar se alguém sinalizou loja)
  ↓
  ├─ SE SIM → SHOPPING_PHASE (30s timer)
  └─ SE NÃO → NEXT_ROUND (gerar nova rodada)
```

#### Invariantes
- `pool.size === pool.pills.length`
- `shapeQuests.length === numAlivePlayers`
- Quando `pool` esgota (todas pills consumidas), `state` DEVE ser `COMPLETED`
- Boosts são consumidos (aplicados) no INÍCIO da rodada e depois descartados

---

### Match (Partida Completa)

Representa instância completa de jogo.

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `id` | `string` (UUID) | Obrigatório, único | - | ID único |
| `phase` | `MatchPhase` | Enum | `LOBBY` | Fase atual |
| `players` | `Player[]` | length 2-6 | - | Jogadores |
| `rounds` | `Round[]` | - | `[]` | Rodadas jogadas |
| `currentRound` | `number` | ≥ 0 | `0` | Rodada atual |
| `turnOrder` | `string[]` (PlayerIds) | - | `[]` | Ordem de turnos (fixa) |
| `activeTurnIndex` | `number` | ≥ 0, < turnOrder.length | `0` | Índice do turno ativo |
| `seasonalShapes` | `string[]` (ShapeIds) | - | `[]` | Shapes sazonais ativas |
| `shopSignals` | `string[]` (PlayerIds) | - | `[]` | Jogadores que sinalizaram loja |
| `winnerId` | `string?` | FK | `null` | Vencedor (se partida terminou) |
| `startedAt` | `number` | Timestamp | - | Início da partida |
| `endedAt` | `number?` | Timestamp | `null` | Fim da partida |

#### Enums

**MatchPhase**:
- `LOBBY` - Configurando sala (adicionar bots, dificuldade)
- `DRAFT` - Draft de itens (60s timer)
- `MATCH` - Partida em andamento (rodadas + turnos)
- `SHOPPING` - Shopping Phase (entre rodadas)
- `RESULTS` - Resultados finais

#### Phase Transitions

```
LOBBY → DRAFT (quando clicar "Start")
  ↓
DRAFT → MATCH (quando timer expira OU clicar "Confirm")
  ↓
MATCH → SHOPPING (se alguém sinalizou loja E tem coins)
  ↓
SHOPPING → MATCH (próxima rodada)
  ↓
MATCH → RESULTS (quando 1 sobrevivente resta)
```

#### Turn Order

Ordem de turnos é determinada ALEATORIAMENTE no início da partida e mantida:

```typescript
function initializeTurnOrder(players: Player[]): string[] {
  return shuffle(players.map(p => p.id)); // Randomizar uma vez
}

function getNextPlayer(turnOrder: string[], currentIndex: number, players: Player[]): number {
  let nextIndex = (currentIndex + 1) % turnOrder.length;
  
  // Pular jogadores eliminados
  while (players.find(p => p.id === turnOrder[nextIndex])?.isEliminated) {
    nextIndex = (nextIndex + 1) % turnOrder.length;
  }
  
  return nextIndex;
}
```

#### Termination Condition

Partida termina quando:
```typescript
function isMatchEnded(players: Player[]): boolean {
  const alivePlayers = players.filter(p => !p.isEliminated);
  return alivePlayers.length === 1;
}
```

NÃO há limite máximo de rodadas. Partida continua indefinidamente até 1 sobrevivente.

#### Invariantes
- `players.length >= 2 && players.length <= 6`
- `turnOrder.length === players.length`
- `activeTurnIndex < turnOrder.length`
- Se `phase === 'RESULTS'`, `winnerId` DEVE estar definido
- `currentRound` DEVE corresponder a `rounds.length`
- Jogadores eliminados permanecem em `players` mas com `isEliminated === true`

---

### ShoppingPhase (Fase de Compras entre Rodadas)

Representa fase de Shopping (ocorre entre rodadas, se ativada).

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `qualifiedPlayers` | `string[]` (PlayerIds) | - | - | Jogadores que podem comprar |
| `timerRemaining` | `number` | ≥ 0, ≤ 30 | `30` | Timer em segundos |
| `carts` | `Record<PlayerId, CartItem[]>` | - | `{}` | Carrinhos de compra |
| `confirmations` | `string[]` (PlayerIds) | - | `[]` | Jogadores que confirmaram |
| `state` | `ShoppingState` | Enum | `ACTIVE` | Estado da fase |

#### Enums

**ShoppingState**:
- `ACTIVE` - Shopping ativo (timer contando)
- `COMPLETED` - Shopping concluído (todos confirmaram OU timer expirou)

#### Qualification

Jogadores qualificam para Shopping se:
```typescript
function qualifiesForShopping(player: Player): boolean {
  return player.wantsShop && player.pillCoins > 0 && !player.isEliminated;
}
```

#### Timer Acceleration

Quando um jogador confirma compras, timer dos outros reduz pela metade:

```typescript
function onPlayerConfirm(shopping: ShoppingPhase, playerId: string): ShoppingPhase {
  shopping.confirmations.push(playerId);
  
  if (shopping.confirmations.length === 1) {
    // Primeiro a confirmar → acelerar timer
    shopping.timerRemaining = Math.floor(shopping.timerRemaining / 2);
  }
  
  return shopping;
}
```

#### Invariantes
- `qualifiedPlayers` DEVE conter apenas jogadores vivos com `wantsShop === true` E `pillCoins > 0`
- `timerRemaining` reduz pela metade quando PRIMEIRO jogador confirma
- Quando `confirmations.length === qualifiedPlayers.length` OU `timerRemaining === 0`, `state` DEVE ser `COMPLETED`
- Boosts/Power-ups comprados são adicionados a `boostsToApply` da próxima rodada

---

### Profile (Perfil Persistente do Jogador)

Representa perfil persistente do jogador (armazenado em localStorage).

#### Attributes

| Campo | Tipo | Validação | Default | Descrição |
|-------|------|-----------|---------|-----------|
| `id` | `string` (UUID) | Obrigatório, único | - | ID único |
| `name` | `string` | 1-20 chars | `"Player"` | Nome do jogador |
| `avatar` | `string` (URL) | - | `default.png` | Avatar escolhido |
| `level` | `number` | ≥ 1 | `1` | Nível atual |
| `xp` | `number` | ≥ 0 | `0` | XP acumulado |
| `schmeckles` | `number` | ≥ 0 | `0` | Meta-moeda acumulada |
| `gamesPlayed` | `number` | ≥ 0 | `0` | Total de partidas jogadas |
| `wins` | `number` | ≥ 0 | `0` | Total de vitórias |
| `totalRoundsSurvived` | `number` | ≥ 0 | `0` | Total de rodadas sobrevividas |
| `mostUsedItems` | `Record<ItemId, number>` | - | `{}` | Contadores de uso de itens |
| `lastUpdated` | `string` | ISO8601 | - | Timestamp da última atualização |

#### Persistence

Armazenado em localStorage com chave `dosed:profile`:

```typescript
interface PersistedProfile {
  version: string; // "1.0.0"
  data: Profile;
}

function saveProfile(profile: Profile): void {
  const persisted: PersistedProfile = {
    version: "1.0.0",
    data: profile,
  };
  localStorage.setItem('dosed:profile', JSON.stringify(persisted));
}

function loadProfile(): Profile | null {
  const stored = localStorage.getItem('dosed:profile');
  if (!stored) return null;
  
  const persisted: PersistedProfile = JSON.parse(stored);
  
  // Validar schema
  if (!validateProfileSchema(persisted.data)) {
    console.warn('Profile schema invalid, resetting to defaults');
    return createDefaultProfile();
  }
  
  return persisted.data;
}
```

#### XP Progression

```typescript
function calculateLevelFromXP(xp: number): number {
  // Curva de progressão (configurável)
  // Exemplo: Level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function xpRequiredForNextLevel(currentLevel: number): number {
  return (currentLevel ** 2) * 100;
}
```

#### XP & Schmeckles Rewards (Results)

```typescript
function calculateRewards(match: Match, player: Player, isWinner: boolean): Rewards {
  let xp = 0;
  let schmeckles = 0;
  
  // XP baseado em performance
  xp += match.currentRound * 10; // 10 XP por rodada sobrevivida
  if (isWinner) xp += 100; // Bonus de vitória
  
  const questsCompleted = countCompletedQuests(player);
  xp += questsCompleted * 25; // 25 XP por quest
  
  // Schmeckles apenas para vitória
  if (isWinner) {
    schmeckles += 50 + (match.currentRound * 5); // Base + rodadas
  }
  
  return { xp, schmeckles };
}
```

#### Invariantes
- `xp >= 0`
- `schmeckles >= 0`
- `level` DEVE corresponder a `calculateLevelFromXP(xp)`
- `wins <= gamesPlayed`
- `version` DEVE ser validado ao carregar (fallback para defaults se incompatível)

---

## Event System

### GameEvent (8 Core Events)

Todos os eventos seguem estrutura comum:

```typescript
interface BaseEvent {
  type: EventType;
  timestamp: number; // performance.now() para ordenação determinística
  matchId: string;
  roundNumber: number;
  turnIndex: number;
}

type GameEvent = 
  | PlayerJoinedEvent
  | TurnStartedEvent
  | ItemUsedEvent
  | PillConsumedEvent
  | EffectAppliedEvent
  | CollapseTriggeredEvent
  | RoundCompletedEvent
  | MatchEndedEvent;
```

#### 1. PLAYER_JOINED

```typescript
interface PlayerJoinedEvent extends BaseEvent {
  type: 'PLAYER_JOINED';
  playerId: string;
  playerName: string;
  isBot: boolean;
  botLevel?: BotLevel;
}
```

**Trigger**: Jogador entra no lobby  
**State Change**: Adicionar jogador a `match.players`

#### 2. TURN_STARTED

```typescript
interface TurnStartedEvent extends BaseEvent {
  type: 'TURN_STARTED';
  playerId: string;
  timerDuration: number; // 30s
}
```

**Trigger**: Início de turno de jogador  
**State Change**: Atualizar `match.activeTurnIndex`, iniciar timer

#### 3. ITEM_USED

```typescript
interface ItemUsedEvent extends BaseEvent {
  type: 'ITEM_USED';
  playerId: string;
  itemId: string;
  targetPlayerId?: string; // Se targeting OPPONENT/SELF
  targetPillId?: string; // Se targeting PILL/SHAPE
  targetShape?: string; // Se targeting SHAPE
}
```

**Trigger**: Jogador usa item do inventário  
**State Change**: Remover item de inventory (ou decrementar stack), aplicar efeito

#### 4. PILL_CONSUMED

```typescript
interface PillConsumedEvent extends BaseEvent {
  type: 'PILL_CONSUMED';
  playerId: string;
  pillId: string;
  pillType: PillType; // Revelado ao consumir
  pillShape: string;
  modifiers: PillModifier[];
}
```

**Trigger**: Jogador consome pílula (ou timer expira)  
**State Change**: Remover pill do pool, revelar tipo, preparar efeito

#### 5. EFFECT_APPLIED

```typescript
interface EffectAppliedEvent extends BaseEvent {
  type: 'EFFECT_APPLIED';
  targetPlayerId: string;
  effect: {
    type: 'DAMAGE' | 'HEAL' | 'LIFE' | 'STATUS' | 'BLOCKED';
    value?: number;
    statusType?: StatusType;
  };
  source: 'PILL' | 'ITEM';
  sourceId: string;
}
```

**Trigger**: Após PILL_CONSUMED ou ITEM_USED  
**State Change**: Alterar resistance/lives, aplicar status, verificar Colapso

#### 6. COLLAPSE_TRIGGERED

```typescript
interface CollapseTriggeredEvent extends BaseEvent {
  type: 'COLLAPSE_TRIGGERED';
  playerId: string;
  previousLives: number;
  newLives: number;
  newResistance: number; // Resetado para 6
  isLastChance: boolean; // Se lives === 0
  isEliminated: boolean; // Se colapsou em última chance
}
```

**Trigger**: Resistance ≤ 0  
**State Change**: Reduzir lives, resetar resistance, marcar última chance ou eliminado

#### 7. ROUND_COMPLETED

```typescript
interface RoundCompletedEvent extends BaseEvent {
  type: 'ROUND_COMPLETED';
  roundNumber: number;
  alivePlayers: number;
  questsCompleted: { playerId: string; reward: number }[];
  shopActivated: boolean;
}
```

**Trigger**: Pool esgotado  
**State Change**: Conceder rewards de quests, ativar Shopping Phase se necessário

#### 8. MATCH_ENDED

```typescript
interface MatchEndedEvent extends BaseEvent {
  type: 'MATCH_ENDED';
  winnerId: string;
  totalRounds: number;
  duration: number; // ms
}
```

**Trigger**: Apenas 1 jogador sobrevive  
**State Change**: Transicionar para Results, calcular rewards (XP/Schmeckles)

---

## Validation Rules

### General

- Todos os IDs DEVEM ser UUIDs válidos
- Todos os timestamps DEVEM ser Unix epoch em milliseconds
- Enums DEVEM validar valores (throw se inválido)

### Player

- `lives >= 0` (sempre)
- `resistance` pode ser negativo (overflow negativo permitido)
- `extraResistance >= 0 && extraResistance <= resistanceCap`
- `inventory.length <= 5`
- Se `isEliminated === true`, `isActiveTurn === false`

### Pool

- `size >= 6 && size <= 12`
- `pills.length === size`
- Pool DEVE ter pelo menos 3 shapes diferentes
- Distribuição de tipos DEVE estar dentro de ±5% da configurada

### Match

- `players.length >= 2 && players.length <= 6`
- `currentRound === rounds.length`
- Se `phase === 'RESULTS'`, `winnerId` DEVE estar definido
- `turnOrder` DEVE conter todos os player IDs exatamente uma vez

---

## Configuration Schema

Todas as configurações de balance DEVEM estar em estrutura configurável (JSON/YAML):

```typescript
interface GameConfig {
  timers: {
    turn: number; // 30s
    draft: number; // 60s
    shopping: number; // 30s
    botTimeout: number; // 5s
  };
  
  health: {
    initialLives: number; // 3
    initialResistance: number; // 6
    resistanceCap: number; // 6
    extraResistanceCap: number; // 6
  };
  
  economy: {
    initialPillCoins: number; // 100
    shapeQuestBaseReward: number; // 10
    questMultipliers: { // Por rodada
      early: number; // 1.0x (rodadas 1-3)
      mid: number; // 1.5x (rodadas 4-7)
      late: number; // 2.0x (rodadas 8+)
    };
  };
  
  pool: {
    baseSize: number; // 6
    incrementEveryNRounds: number; // 3
    maxSize: number; // 12
    minShapeDiversity: number; // 3
    distribution: {
      [key in PillType]: {
        unlockRound: number;
        initialPercentage: number;
        finalPercentage: number;
      };
    };
  };
  
  shapes: {
    base: { id: string; unlockRound: number }[];
    seasonal: { id: string; theme: string; enabled: boolean }[];
  };
  
  items: {
    [key: string]: {
      cost: number;
      targeting: Targeting;
      stackable: boolean;
      stackLimit?: number;
      availability: Availability;
    };
  };
  
  boosts: {
    oneUp: { cost: number };
    reboot: { cost: number };
    scanner2X: { cost: number };
  };
  
  inventory: {
    maxSlots: number; // 5
  };
}
```

---

## State Machine Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      MATCH LIFECYCLE                         │
└─────────────────────────────────────────────────────────────┘

HOME
 │
 ├─ [Click "ENTER THE VOID"] → LOBBY
 │
LOBBY
 │
 ├─ [Add bots, select difficulty]
 ├─ [Click "Start"] → DRAFT
 │
DRAFT (60s timer)
 │
 ├─ [Select items, manage inventory]
 ├─ [Timer expires OR Click "Confirm"] → MATCH (Round 1)
 │
MATCH (Rounds loop)
 │
 ├─ Round N:
 │   ├─ Generate Pool
 │   ├─ Generate Shape Quests
 │   ├─ Apply Boosts (se houver)
 │   ├─ Turns (Round-robin):
 │   │   ├─ Player Turn:
 │   │   │   ├─ Use Items (opcional, ilimitado)
 │   │   │   └─ Consume Pill (obrigatório, finaliza turno)
 │   │   ├─ Bot Turn (mesmo fluxo, decisões automáticas)
 │   │   └─ Check Elimination
 │   ├─ Pool Esgotado:
 │   │   ├─ IF apenas 1 sobrevive → RESULTS
 │   │   ├─ ELSE IF alguém sinalizou loja E tem coins → SHOPPING
 │   │   └─ ELSE → Round N+1
 │   │
 │   SHOPPING (30s timer, entre rodadas)
 │   │
 │   ├─ Qualified players compram boosts/power-ups
 │   ├─ [Todos confirmaram OU timer expirou] → Round N+1
 │   │
 │   └─ Round N+1 (loop até 1 sobrevivente)
 │
RESULTS
 │
 ├─ Display stats, XP, Schmeckles
 ├─ [Click "Jogar Novamente"] → LOBBY
 └─ [Click "Menu Principal"] → HOME
```

---

## Summary

Este modelo de dados cobre todas as 29 Key Entities especificadas no spec, com atributos detalhados, validações, relacionamentos, transições de estado e invariantes. 

**Total de Entities**: 15 principais (Player, Pill, Shape, Item, InventorySlot, Status, Pool, ShapeQuest, Boost, Turn, Round, Match, ShoppingPhase, Profile, GameEvent)

**Next Step**: Implementar types TypeScript (`src/types/`) baseado neste modelo.

