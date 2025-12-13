# Project Structure - Dosed

## Root Directory Organization

```
dosed/
├── .cursor/           # AI agent steering files, rules, persona and commands
├── docs/              # Project documentation
├── public/            # Static assets served at root
├── src/               # Source code (main application)
├── dist/              # Build output (generated)
├── node_modules/      # Dependencies (generated)
└── package.json       # Project configuration
```

## Source Code Structure (`src/`)

### Component Architecture

```
src/components/
├── ui/           # Base UI components (shadcn/ui)
│   ├──  8bit/         # Retro-styled game components
│   └── [other ui components]
├── layout/                # Layout components
├── game/              # Game components (separeted by game-phase)
│   ├─── lobby/     # Lobby screen components
│   │   ├── index.tsx          # Lobby main screen
│   │   └── components/            # Lobby components
│   │       └─── [lobby components]
│   ├─── draft/     # Draft (Loadout) screen components
│   │   ├── index.tsx          # Draft main screen
│   │   └── components/            # Draft components
│   │       └─── [draft components]
│   ├─── [other screens]/     # Other screens components
│   └── shared/               # Shared components between phases
├── overlays/              # Modal/blocking overlays
│   ├── OverlayManager.tsx     # Overlay orchestration
│   ├── PillReveal.tsx         # Pill consumption animation
│   └── EndGameResults.tsx     # End game stats result modal
├── nofity/           # Non-blocking game notifications
├── multiplayer/      # Multiplayer-specific components
└── dev/              # Development tools and debugging
```

### State Management

#### Clean Architecture

```
src/
├── core/               # game core
│   ├── index.ts            # Barrel exports
│   ├── EventProcessor.ts   # Event-driven system
│   ├── AiDecisionEngine.ts # AI bot management
│   └── GameEngine.ts       # Core game engine
├── stores/             # game stores
│   ├── index.ts            # Barrel exports
│   ├── sessionStore.ts     # LOBBY: players, bots, config
│   ├── draftStore.ts       # DRAFT: item selection, timer
│   ├── matchStore.ts       # MATCH: unified gameplay
│   └── resultsStore.ts     # RESULTS: stats, winner, rematch
└── types/              # types
    ├── index.ts            # Barrel exports
    ├── gameState.ts        # Core game state types
    ├── events.ts           # Event system types
    └── ai.ts               # AI bot types

```

### Type Definitions

```
src/types/
├── index.ts           # Barrel exports
├── game.ts            # Core game types and phases
├── player.ts          # Player types and configurations
├── inventory.ts       # Inventory types and configurations
├── effects.ts         # Effects types, definitions, targeting and configurations
├── pill.ts            # Pill types, definitions and configurations
├── item.ts            # Item types, definitions targeting and configurations
├── ai.ts              # AI types, decision context and analysis
├── quest.ts           # Shape quest system
├── store.ts           # Pill Store types
├── multiplayer.ts     # Multiplayer events and state
└── sync.ts            # State synchronization types
```

### Assets

```
src/assets/
├── items/             # Item icon images (JPG format)
├── shapes/            # Pill shape images (PNG with transparency)
│   ├── 001_[xs/sm/md/lg/xl].[png/svg]    # Individual shape files with size variantes
│   ├── 002_[xs/sm/md/lg/xl].[png/svg]
│   └── [other shapes]
└── pill.svg           # Base pill icon
```

## Configuration Files

### Build & Development

- `vite.config.ts` - Vite build configuration with aliases
- `tsconfig.json` - TypeScript configuration (strict mode)
- `vitest.config.ts` - Test runner configuration
- `eslint.config.js` - Code linting rules
- `.prettierrc` - Code formatting rules

### UI & Styling

- `components.json` - shadcn/ui configuration
- `src/index.css` - Global styles and Tailwind imports
- No separate Tailwind config (using Tailwind v4 with Vite plugin)

### Package Management

- `package.json` - Dependencies and scripts
- `pnpm-lock.yaml` - Lockfile for reproducible installs

## Key Architectural Principles

### Separation of Concerns

- **Core**: Pure functions for game logic (no side effects)
- **Components**: Pure UI rendering, no business logic
- **Hooks**: Bridge between UI and state/logic
- **Stores**: State management with immutable updates
- **Utils**: Utils/helper functions for app

### Clean Architecture (Target)

- **Presentation Layer**: React components and custom hooks
- **Application Layer**: Game engine and event processors
- **Domain Layer**: Game rules, AI logic, and validation
- **Infrastructure Layer**: Zustand stores, Supabase, and external services

### Modular Design

- **Barrel exports**: Centralized exports via `index.ts` files
- **Feature-based organization**: Related functionality grouped together
- **Clear boundaries**: Strict separation between layers
- **Event-driven**: Maximum 8 event types for simplified synchronization

### Scalability Considerations

- **N-Player support**: Architecture supports 2-6 players dynamically
- **UUID-based IDs**: Session-based player identification
- **Modular stores**: Easy to extend with new game mechanics
- **Type safety**: Comprehensive TypeScript coverage
- **AI Bot Management**: Configurable difficulty levels and deterministic behavior

### Testing Structure

```
src/__tests__/{module_name}   # Unit tests for pure functions
├── {functionName}.test.ts
```

## File Naming Conventions

- **Core**: PascalCase (e.g., `GameEngine.ts`)
- **Components**: PascalCase (e.g., `LobbyScreen.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `usePlayerActions.ts`)
- **Stores**: camelCase (e.g., `gameStore.ts`)
- **Utils**: camelCase (e.g., `notifyTools.ts`)
- **Types**: camelCase (e.g., `player.ts`)
- **Constants**: SCREAMING_SNAKE_CASE in files
