# Tech Stack - Dosed

## Core Technologies

### Frontend Framework

- **React 19** - Modern React with hooks-only approach
- **TypeScript 5.9.3** - Strict mode enabled for type safety
- **Vite 7** - Fast build tool and dev server

### State Management

- **Zustand 5.0.9** - Lightweight state management
- **Modular stores** - Separate stores for different game aspects:
  - `gameStore.ts` - Main game orchestration (2386 lines)
  - `overlayStore.ts` - Modal/overlay management
  - `toastStore.ts` - Notification system
  - `multiplayerStore.ts` - Multiplayer connection state
  - `game/` folder - 6 modular stores for specific game mechanics

### Styling & UI

- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **shadcn/ui** - Component library with Radix UI primitives
- **8bit/ui** - Custom retro-styled components
- **Framer Motion 12.23.25** - Animation library
- **Lucide React** - Icon library

### Backend & Services

- **Supabase** - Backend-as-a-Service for:
  - Authentication (guest-first approach)
  - Real-time multiplayer (future)
  - Database (future)

### Testing & Quality

- **Vitest 4.0.15** - Fast unit testing framework
- **fast-check** - Property-based testing library (NEW)
- **ESLint 9.39.1** - Code linting with TypeScript support
- **Prettier 3.7.4** - Code formatting

## Build System

### Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Run tests
pnpm test

# Run tests once (CI mode)
pnpm test:run

# Preview production build
pnpm preview
```

### Project Configuration

- **Base path**: `/dosed/` (configured for GitHub Pages)
- **Path aliases**: `@/` maps to `./src/`
- **Server**: Configured to run on `0.0.0.0` for network access

### Key Dependencies

- **@radix-ui/react-\*** - Accessible UI primitives
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional CSS classes
- **uuid** - Unique identifier generation
- **react-router-dom** - Client-side routing

## Architecture Patterns

### Component Structure

- **Functional components only** - No class components
- **TypeScript interfaces** for all props
- **Hooks-based state management**
- **Modular component organization**

### State Architecture

- **Zustand stores** - Immutable state updates
- **Custom hooks** - Business logic abstraction
- **Pure utility functions** - Testable game logic
- **Separation of concerns** - UI, state, and logic layers

### Clean Architecture (Target)

- **Event-driven system** - Maximum 8 event types for simplified multiplayer
- **Pure functions** - All event processing uses pure functions
- **Immutable state** - All state updates return new objects
- **Modular stores** - 4-phase architecture (LOBBY → DRAFT → MATCH → RESULTS)
- **AI bot management** - Configurable difficulty with deterministic behavior

### File Organization

```
src/
├── components/     # React components
├── hooks/         # Custom hooks
├── stores/        # Zustand stores
├── types/         # TypeScript definitions
├── utils/         # Pure utility functions
├── assets/        # Static assets
└── lib/          # Third-party integrations
```

## Development Guidelines

### Code Style

- **Strict TypeScript** - No `any` types allowed
- **Functional programming** - Pure functions in utils
- **Immutable updates** - All state changes return new objects
- **Component composition** - Small, focused components

### Performance Considerations

- **Zustand selectors** - Prevent unnecessary re-renders
- **Framer Motion** - Optimized animations
- **Code splitting** - Dynamic imports where appropriate
- **Asset optimization** - PNG images with transparency

### Testing Strategy (Enhanced)

- **Unit tests** - Specific examples and edge cases
- **Property-based tests** - Universal properties across all inputs (NEW)
- **Dual testing approach** - Both unit and property tests are complementary
- **fast-check integration** - Minimum 100 iterations per property test
- **Correctness properties** - 11 properties for comprehensive validation
