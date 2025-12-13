# Project Structure - Dosed

## Root Directory Organization

```
dosed/
├── .cursor/           # Cursor IDE configuration
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
├── ui/                # Base UI components (shadcn/ui)
│   ├── 8bit/         # Retro-styled game components
│   └── paceui/       # Additional UI components
├── layout/           # Layout components
├── game/             # Core game components
│   ├── GameBoard.tsx          # Main game orchestrator
│   ├── PillPool.tsx           # Pill display and interaction
│   ├── AnimatedPlayerArea.tsx # Player stats and inventory
│   ├── ItemSelectionScreen.tsx # Pre-game item selection
│   └── [other game components]
├── overlays/         # Modal/blocking overlays
│   ├── OverlayManager.tsx     # Overlay orchestration
│   ├── PillReveal.tsx         # Pill consumption animation
│   └── GameOverDialog.tsx     # End game modal
├── toasts/           # Non-blocking notifications
├── multiplayer/      # Multiplayer-specific components
└── dev/              # Development tools and debugging
```

### State Management

#### Current Architecture (Legacy)

```
src/stores/
├── gameStore.ts      # Main game orchestration (2386 lines - TO BE REMOVED)
├── overlayStore.ts   # Modal/overlay state
├── toastStore.ts     # Notification queue
├── multiplayerStore.ts # Multiplayer connection
└── game/             # Modular game stores (transition)
    ├── index.ts              # Barrel exports
    ├── gameFlowStore.ts      # Phases, turns, rounds
    ├── pillPoolStore.ts      # Pill pool management
    ├── playerStore.ts        # Player stats and inventory
    ├── effectsStore.ts       # Active player effects
    ├── itemUsageStore.ts     # Item targeting and usage
    └── shopStore.ts          # Pill Store functionality
```

#### Target Architecture (Clean Architecture)

```
src/stores/
├── overlayStore.ts   # Modal/overlay state (maintained)
├── toastStore.ts     # Notification queue (maintained)
├── multiplayerStore.ts # Multiplayer connection (maintained)
├── devToolStore.ts   # Development tools (maintained)
│
└── clean-architecture/  # New modular architecture
    ├── index.ts         # Barrel exports
    ├── gameEngine.ts    # Core game engine
    ├── eventProcessor.ts # Event-driven system
    ├── aiDecisionEngine.ts # AI bot management
    │
    ├── sessionStore.ts  # LOBBY: players, bots, config
    ├── draftStore.ts    # DRAFT: item selection, timer
    ├── matchStore.ts    # MATCH: unified gameplay
    ├── resultsStore.ts  # RESULTS: stats, winner, rematch
    │
    └── types/           # Clean architecture types
        ├── index.ts     # Barrel exports
        ├── gameState.ts # Core game state types
        ├── events.ts    # Event system types
        └── ai.ts        # AI bot types
```

### Business Logic

```
src/utils/
├── constants.ts       # Game configuration constants
├── gameLogic.ts       # Core game mechanics (damage, healing)
├── aiLogic.ts         # AI decision making algorithms
├── pillGenerator.ts   # Pill pool generation and management
├── itemCatalog.ts     # Item definitions and metadata
├── itemLogic.ts       # Item effect implementations
├── playerManager.ts   # Player creation and UUID management
├── turnManager.ts     # Turn rotation for N-players
├── questGenerator.ts  # Shape quest generation
├── shapeProgression.ts # Shape unlock progression
└── storeConfig.ts     # Pill Store configuration
```

### Custom Hooks

```
src/hooks/
├── index.ts           # Barrel exports
├── useGameActions.ts  # Game action wrappers
├── useGameState.ts    # Optimized state selectors
├── usePillConsumption.ts # Pill consumption flow
├── useItemUsage.ts    # Item usage and targeting
├── useAIPlayer.ts     # AI turn automation
├── useMultiplayer.ts  # Multiplayer connection management
└── [other specialized hooks]
```

### Type Definitions

```
src/types/
├── index.ts           # Barrel exports
├── game.ts            # Core game types and phases
├── player.ts          # Player, effects, and inventory
├── pill.ts            # Pill types and configurations
├── item.ts            # Item definitions and targeting
├── ai.ts              # AI decision context and analysis
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
│   ├── shape_1.png           # Individual shape files
│   ├── shape_1_biggest.png   # Larger variants
│   └── [16 total shapes]
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

## Documentation Structure

```
docs/
├── GAME-IDEA.md       # Complete game mechanics specification
├── FLUXO.md           # Application flow and architecture
├── GAME-BALANCE.md    # Balancing and progression details
├── SUPABASE-REALTIME-SETUP.md # Multiplayer setup guide
└── pills_on_table.json # Game state example
```

## Development Tools

```
.specs/
├── future/            # Future feature unfinished specifications

.cursor/
├── .cursorrules       # Cursor IDE behavior rules
├── commands/          # Custom IDE commands
├── rules/             # Development guidelines
└── mcp.json           # Model Context Protocol configuration
```

## Key Architectural Principles

### Separation of Concerns

- **Components**: Pure UI rendering, no business logic
- **Hooks**: Bridge between UI and state/logic
- **Stores**: State management with immutable updates
- **Utils**: Pure functions for game logic (no side effects)

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

- **N-Player support**: Architecture supports 2-4 players dynamically
- **UUID-based IDs**: Session-based player identification
- **Modular stores**: Easy to extend with new game mechanics
- **Type safety**: Comprehensive TypeScript coverage
- **AI Bot Management**: Configurable difficulty levels and deterministic behavior

### Testing Structure

```
src/utils/__tests__/   # Unit tests for pure functions
├── pillGenerator.test.ts
├── pillProgression.test.ts
├── playerManager.test.ts
├── questGenerator.test.ts
├── shapeProgression.test.ts
└── turnManager.test.ts
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `GameBoard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGameActions.ts`)
- **Stores**: camelCase (e.g., `gameStore.ts`)
- **Utils**: camelCase (e.g., `gameLogic.ts`)
- **Types**: camelCase (e.g., `player.ts`)
- **Constants**: SCREAMING_SNAKE_CASE in files
