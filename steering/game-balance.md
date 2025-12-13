---
inclusion: always
---

# Game Balance - Dosed

This document defines the game's balance system and progression mechanics. When working with balance-related code, follow these principles and constraints to maintain game integrity.

## Core Balance Principles

### Design Philosophy (NEVER VIOLATE)

- **Escalating Tension**: Difficulty increases gradually across rounds
- **Meaningful Choices**: Every decision has strategic weight
- **Limited Information**: Uncertainty maintains suspense
- **Comeback Potential**: Always maintain chance for recovery
- **Skill vs Luck**: 70% strategy, 30% chance

### Target Metrics (Validate Changes Against These)

- **Game Duration**: 8-12 rounds per match
- **Late Game Survival**: 15-25% per round (rounds 9+)
- **Item Usage**: 2-3 items per round average
- **Quest Completion**: 60-80% success rate

## Pill System Configuration

### Pill Types (src/types/pill.ts)

| Type         | Effect              | Unlock Round | Critical Notes                                   |
| ------------ | ------------------- | ------------ | ------------------------------------------------ |
| **SAFE**     | No effect           | 1            | Tutorial safety net - starts at 45%, ends at 15% |
| **DMG_LOW**  | -1 to -2 resistance | 1            | Core risk element - consistent 20-40%            |
| **DMG_HIGH** | -3 to -4 resistance | 3            | Major threat - grows from 15% to 25%             |
| **HEAL**     | +2 resistance       | 2            | Recovery valve - available early, 10-15%         |
| **FATAL**    | Instant elimination | 6            | End-game pressure - delayed until round 6        |
| **LIFE**     | +1 life             | 5            | Rare reward - 6-13% distribution                 |

### Progression Configuration (src/utils/pillProgression.ts)

**CRITICAL**: These values are carefully balanced. Changes require testing.

```typescript
export const PROGRESSION: ProgressionConfig = {
  maxRound: 20, // Hard cap to prevent infinite games
  rules: {
    SAFE: { unlockRound: 1, startPct: 45, endPct: 15 }, // Tutorial → Scarce
    DMG_LOW: { unlockRound: 1, startPct: 40, endPct: 20 }, // Consistent threat
    DMG_HIGH: { unlockRound: 3, startPct: 15, endPct: 25 }, // Escalating danger
    HEAL: { unlockRound: 2, startPct: 10, endPct: 15 }, // Recovery option
    FATAL: { unlockRound: 6, startPct: 5, endPct: 18 }, // Late game pressure
    LIFE: { unlockRound: 5, startPct: 6, endPct: 13 }, // Rare comeback
  },
};
```

**Balance Rules**:

- SAFE must start high (45%) for tutorial
- FATAL unlock must be delayed (round 6+) to prevent early eliminations
- Total percentages are normalized, not absolute

### Game Phase Balance

#### Early Game (Rounds 1-3) - Tutorial Phase

- SAFE dominates (45%) for gentle learning curve
- DMG_LOW introduces risk concept
- NO FATAL pills to prevent premature eliminations
- Pool size: 6 pills (manageable complexity)

#### Mid Game (Rounds 4-8) - Escalation Phase

- HEAL available from round 2 (escape valve)
- FATAL introduced at round 6 (tension buildup)
- LIFE unlocked at round 5 (rare reward)
- Pool grows to 7-8 pills

#### Late Game (Rounds 9+) - High Stakes Phase

- SAFE drops to 15% (scarcity pressure)
- FATAL reaches 18% (elimination threat)
- Every decision becomes critical
- Pool caps at 12 pills maximum

## Pool Scaling System

### Pool Size Formula (src/utils/pillProgression.ts)

```typescript
export function getPillCount(round: number): number {
  const baseCount = 6; // Starting pool size
  const increaseBy = 1; // Pills added per increment
  const frequency = 3; // Rounds between increments
  const maxCap = 12; // Hard maximum

  const increments = Math.floor((round - 1) / frequency);
  return Math.min(baseCount + increments * increaseBy, maxCap);
}
```

**DO NOT modify these constants without extensive testing**

### Pool Size Progression

| Rounds | Pills | Complexity Level | Design Intent        |
| ------ | ----- | ---------------- | -------------------- |
| 1-3    | 6     | Low              | Tutorial simplicity  |
| 4-6    | 7     | Medium           | HEAL introduction    |
| 7-9    | 8     | Medium-High      | Rising tension       |
| 10-12  | 9     | High             | FATAL active         |
| 13-15  | 10    | Very High        | Critical decisions   |
| 16-18  | 11    | Maximum          | Peak complexity      |
| 19+    | 12    | Capped           | Sustainability limit |

## AI Difficulty System

### AI Configuration Levels (src/utils/aiConfig.ts)

**CRITICAL**: These values create distinct difficulty experiences

```typescript
// Easy (Paciente) - Learning-friendly
const EASY_CONFIG = {
  riskTolerance: 0.3, // Very conservative
  itemUsageProbability: 0.4, // Limited item use
  scannerPriority: 0.8, // Information-focused
  aggressiveness: 0.2, // Rarely pressures opponent
};

// Normal (Cobaia) - Balanced experience
const NORMAL_CONFIG = {
  riskTolerance: 0.5, // Calculated risks
  itemUsageProbability: 0.6, // Strategic item use
  scannerPriority: 0.6, // Balanced approach
  aggressiveness: 0.4, // Occasional pressure
};

// Hard (Sobrevivente) - Challenging opponent
const HARD_CONFIG = {
  riskTolerance: 0.7, // High risk acceptance
  itemUsageProbability: 0.8, // Frequent item use
  scannerPriority: 0.4, // Action over information
  aggressiveness: 0.7, // Active pressure
};

// Insane (Hofmann) - Maximum difficulty
const INSANE_CONFIG = {
  riskTolerance: 0.9, // Nearly fearless
  itemUsageProbability: 0.9, // Uses all resources
  scannerPriority: 0.2, // Pure action focus
  aggressiveness: 0.9, // Relentless pressure
};
```

### AI Win Rate Targets (Validate Changes)

| Difficulty | Target Win Rate | Acceptable Range |
| ---------- | --------------- | ---------------- |
| Easy       | 30%             | 25-35%           |
| Normal     | 50%             | 45-55%           |
| Hard       | 70%             | 65-75%           |
| Insane     | 85%             | 80-90%           |

**If win rates fall outside these ranges, AI tuning is required**

## Item Balance System

### Item Categories and Strategic Value

#### Intel (Information Advantage)

- **Scanner**: Low cost, high value - reveals single pill
- **Shape Scanner**: Medium cost, high value - reveals all pills of shape
- **Inverter**: Medium cost, extreme value - flips pill effect
- **Double**: High cost, extreme value - doubles pill effect

#### Sustain (Survival Tools)

- **Pocket Pill**: Low cost, immediate +4 resistance
- **Shield**: High cost, immunity to damage for 1 round

#### Control (Opponent Manipulation)

- **Handcuffs**: Medium cost, opponent loses next turn
- **Force Feed**: High cost, force opponent to consume chosen pill

#### Chaos (Information Reset)

- **Shuffle**: Low cost, resets all revealed information
- **Discard**: Medium cost, removes pill from pool

### AI Item Priority System (src/utils/aiLogic.ts)

```typescript
const ITEM_PRIORITY: Record<ItemType, number> = {
  shield: 10, // Maximum defensive priority
  pocket_pill: 9, // Immediate healing
  scanner: 7, // Information value
  shape_scanner: 7, // Mass information
  handcuffs: 6, // Turn control
  force_feed: 5, // Direct attack
  inverter: 4, // Tactical modifier
  double: 3, // Risk amplifier
  discard: 2, // Threat removal
  shuffle: 1, // Information reset
};
```

**DO NOT reorder priorities without testing all difficulty levels**

## Pill Store Economy (src/utils/storeConfig.ts)

### Store Item Pricing

| Item              | Cost    | Strategic Value | When to Buy               |
| ----------------- | ------- | --------------- | ------------------------- |
| **1-Up**          | 3 coins | Critical        | Late game priority        |
| **Reboot**        | 2 coins | High            | Low resistance situations |
| **Scanner-2X**    | 2 coins | Medium          | Information advantage     |
| **Scanner**       | 2 coins | High            | Early-mid game            |
| **Shield**        | 2 coins | Critical        | Before dangerous rounds   |
| **Pocket Pill**   | 2 coins | Medium          | Consistent healing        |
| **Shape Scanner** | 3 coins | High            | Complex pools             |

### Coin Economy Balance

- **Source**: +1 coin per completed Shape Quest
- **Rate**: ~1-2 coins per 3-4 rounds
- **Accumulation**: Coins persist between rounds
- **Spending Pattern**: Most players save for 1-Up or Shield

## Shape System (src/utils/shapeProgression.ts)

### Shape Unlock Progression

- **Early Game (1-3)**: 4-6 basic shapes for simplicity
- **Mid Game (4-8)**: 8-12 shapes for variety
- **Late Game (9+)**: 14-16 shapes for maximum complexity

### Shape Quest Balance

- **Difficulty**: Scales with available shapes
- **Length**: 2-3 shapes per quest (max 3 after round 5)
- **Success Rate Target**: 60-80%
- **Reward**: +1 Pill Coin (primary economy driver)

## Balance Modification Guidelines

### Safe Changes (Low Risk)

- Adjust AI decision timing (thinking delays)
- Modify store item descriptions or UI
- Change visual effects or animations
- Adjust toast/notification text

### Moderate Changes (Requires Testing)

- Modify AI item usage probabilities by ±0.1
- Adjust store item costs by ±1 coin
- Change shape unlock rounds by ±1 round
- Modify quest length by ±1 shape

### High Risk Changes (Extensive Testing Required)

- Modify pill type percentages by >5%
- Change pill unlock rounds
- Alter pool scaling formula
- Modify AI risk tolerance by >0.2
- Add new pill types or items

### Forbidden Changes (Will Break Balance)

- Remove SAFE pills entirely
- Make FATAL available before round 4
- Set any AI difficulty win rate >95% or <15%
- Allow unlimited item usage per turn
- Remove the pill pool cap config

## Testing and Validation

### Required Tests for Balance Changes

#### Automated Tests (src/utils/**tests**/)

- `pillProgression.test.ts` - Validates distribution algorithms
- `shapeProgression.test.ts` - Confirms shape unlock timing
- `aiLogic.test.ts` - Tests AI decision consistency
- Property-based tests with fast-check (100+ iterations)

#### Manual Validation Checklist

- [ ] Play 10+ games at each AI difficulty
- [ ] Verify target win rates are maintained
- [ ] Confirm game duration stays 8-12 rounds
- [ ] Test edge cases (all FATAL pills, no SAFE pills)
- [ ] Validate multiplayer synchronization

#### Balance Metrics to Monitor

- Average game duration
- AI win rates by difficulty
- Item usage distribution
- Quest completion rates
- Player elimination timing

### DevTools for Balance Testing

Use the FloatingDevTool (CTRL+SHIFT+D) for:

- **Distribution Simulator**: Test pill progressions
- **AI Performance Tracker**: Monitor decision patterns
- **Game State Inspector**: Validate balance in real-time
- **Action History**: Review balance-affecting decisions

## Key Files and Functions

### Core Balance Files

- `src/utils/pillProgression.ts` - Pill type distribution and pool scaling
- `src/utils/shapeProgression.ts` - Shape unlock and distribution
- `src/utils/aiConfig.ts` - AI difficulty configurations
- `src/utils/aiLogic.ts` - AI decision algorithms
- `src/utils/storeConfig.ts` - Pill Store pricing and items
- `src/utils/constants.ts` - Game balance constants

### Critical Functions

- `getPillChances(round)` - Returns normalized percentages per round
- `getPillCount(round)` - Returns pool size for round (step function)
- `distributePillTypes(round, count)` - Calculates proportional distribution
- `makeAIDecision(context)` - Core AI decision logic
- `analyzePoolRisk(context)` - Risk assessment for AI

### Balance Constants (src/utils/constants.ts)

```typescript
export const GAME_BALANCE = {
  MAX_RESISTANCE: 6, // Starting resistance
  MAX_LIVES: 3, // Starting lives
  PILL_POOL_CAP: 12, // Maximum pool size
  QUEST_MAX_LENGTH: 3, // Maximum shapes per quest
  STORE_TIMER_SECONDS: 30, // Store shopping time
  AI_THINKING_DELAY: 1000, // Base AI delay (ms)
} as const;
```

**These constants are balance-critical - changes require extensive testing**
