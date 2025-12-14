# Project Architecture & File Map

## 1. Directory Structure
The project adheres to a strict feature-based architecture optimized for Supabase/React. Implement the following structure exactly:

```
dosed/
├── supabase/
│   ├── functions/
│   │   ├── _shared/           # Lógica Core do Jogo (GameEngine) compartilhada
│   │   ├── match-action/      # Endpoint: Processa turno
│   │   ├── create-lobby/      # Endpoint: Matchmaking
│   │   └── draft-buy/         # Endpoint: Transação de itens
│   ├── migrations/            # SQL Schemas
│   └── seed.sql               # Dados iniciais (Itens, Tipos de Pílulas)
├── src/
│   ├── components/
│   │   ├── game/
│   │   │   ├── hud/           # PlayerStats, InventoryGrid
│   │   │   ├── board/         # PillDispenser, OpponentList
│   │   │   └── effects/       # Confetti, BloodSplatter (Canvas)
│   │   └── retro-ui/          # Botões, Paineis 8-bit (Reutilizáveis)
│   ├── stores/
│   │   ├── match.store.ts     # Zustand: Estado local da partida
│   │   └── socket.store.ts    # Supabase Realtime wrapper
│   ├── lib/
│   │   ├── game-math.ts       # Probabilidades e Dano
│   │   └── constants.ts       # IDs de itens e config visual
│   └── hooks/
│       └── useGameSound.ts    # SFX Manager
└── public/
    └── assets/
        └── sprites/           # Spritesheets (Rick, Morty, Pills)
```

## 2. Architectural Principles
- **Supabase First**: All complex logic resides in Edge Functions or Database Triggers. The client is for presentation and state reflection only.
- **Type Safety**: Strict TypeScript mode enabled. No `any` types allowed. Zod schemas required for all external data.
- **Component Modularity**: Use the Smart/Dumb component pattern. Logic resides in hooks; UI resides in pure components.

## 3. Naming Conventions
- **Components**: PascalCase (e.g., `GameCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useGameState.ts`)
- **Database Tables**: snake_case, plural (e.g., `users_profiles`, `game_matches`)
- **Edge Functions**: kebab-case (e.g., `process-turn`)
