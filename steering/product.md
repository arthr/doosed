# Product Overview - Dosed

## What is Dosed?

**Dosed** is a strategic turn-based game where two or more players compete to be the last survivor in a pill roulette scenario. Players take turns consuming pills from a shared pool, managing risk through a dual health system and tactical item usage.

## Core Mechanics

### Dual Health System

- **Resistance**: Temporary shield (6 points) - acts as HP buffer
- **Lives**: Permanent health (3 lives) - lose all lives = game over
- When resistance hits zero → lose 1 life, resistance resets to maximum

### Pill Types & Effects

- **SAFE** (Green): No effect, safe to consume
- **DMG_LOW** (Yellow): -1 to -2 resistance damage
- **DMG_HIGH** (Orange): -3 to -4 resistance damage
- **HEAL** (Cyan): +2 resistance
- **FATAL** (Purple): -1 life
- **LIFE** (Pink): +1 life restoration

### Strategic Elements

- **Hidden Information**: Pill effects are concealed until consumed
- **Item System**: 9 power-ups across 4 categories (Intel, Sustain, Control, Chaos)
- **Shape Quests**: Complete shape sequences for Pill Coins
- **Pill Store**: Spend coins on boosts and additional items
- **Progressive Difficulty**: New pill types and shapes unlock each round

## Game Modes

### Single Player (Current)

- Human vs AI with 4 difficulty levels:
  - **Easy** (Paciente): Predictable AI, ideal for learning
  - **Normal** (Cobaia): Balanced experience (default)
  - **Hard** (Sobrevivente): Aggressive, strategic AI
  - **Insane** (Hofmann): Calculating AI with no mercy

### Multiplayer

- Real-time human vs human via Supabase Realtime
- 2-6 player support with guest-first authentication

## Target Audience

Players who enjoy strategic games with risk management elements, similar to Russian Roulette but with deeper tactical gameplay and visual appeal.
