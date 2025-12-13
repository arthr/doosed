Abaixo, apresento a **Implementação Inicial (Scaffolding)** baseada na sua especificação. Foque na configuração do **Tailwind**, nas **Definições de Tipos**, na **Store (Zustand)** e na estrutura dos **Componentes Principais** para que você possa renderizar a tela corretamente.

### 1. Configuração e Estilos Globais

Primeiro, vamos configurar o tema "Rick and Morty" no Tailwind e importar a fonte pixelada.

**`tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'rick-green': '#00ff41', // Texto terminal / HUD
        'morty-yellow': '#ffff00', // Alertas
        'evil-purple': '#bd00ff', // Bordas principais / Inimigos
        'portal-blue': '#00f0ff', // Detalhes sci-fi
        'space-black': '#0a0a1a', // Fundo
        'ui-panel': '#1a1a2e', // Fundo dos cards
        health: '#a855f7', // Cor dos corações (roxo da img)
        shield: '#3b82f6', // Cor do escudo (azul)
        'shield-gold': '#eab308', // Escudo dourado
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'], // Requer import no CSS
      },
      boxShadow: {
        pixel: '4px 4px 0px 0px rgba(0,0,0,0.5)',
        'neon-green': '0 0 5px #00ff41, 0 0 10px #00ff41',
        'neon-purple': '0 0 5px #bd00ff, 0 0 10px #bd00ff',
      },
      backgroundImage: {
        scanlines:
          'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
      },
    },
  },
  plugins: [],
};
```

**`src/index.css`** (Adicione a fonte e o reset)

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-space-black font-pixel overflow-hidden text-white;
  image-rendering: pixelated; /* Crucial para a estética */
}

/* Scrollbar customizada para o Log */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  @apply bg-ui-panel;
}
::-webkit-scrollbar-thumb {
  @apply bg-rick-green rounded-none;
}
```

---

### 2. Definição de Tipos e State (Zustand)

**`src/types/game.ts`**

```typescript
export interface IPlayer {
  id: string;
  name: string;
  avatarUrl: string; // URL ou identificador de asset
  hp: number;
  maxHp: number;
  shields: number; // Azul
  goldShields: number; // Dourado
  isDead: boolean;
  inventory: IItem[];
}

export interface IItem {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface IPill {
  id: string;
  type: 'SAFE' | 'POISON' | 'TOXIC' | 'ANTIDOTE' | 'LETHAL' | 'UNKNOWN';
  revealed: boolean;
}

export interface IGameState {
  round: number;
  currentTurnPlayerId: string;
  players: IPlayer[];
  pillPool: {
    safe: number;
    poison: number;
    toxic: number;
    antidote: number;
    lethal: number;
  };
  tablePills: IPill[];
  gameLog: string[];
}
```

**`src/store/useGameStore.ts`**

```typescript
import { create } from 'zustand';
import { IGameState } from '../types/game';

// Mock inicial baseado na screenshot
const initialState: IGameState = {
  round: 2,
  currentTurnPlayerId: 'player-1', // Rick
  players: [
    {
      id: 'p2',
      name: 'Birdperson',
      avatarUrl: '/avatars/bird.png',
      hp: 4,
      maxHp: 5,
      shields: 2,
      goldShields: 1,
      isDead: false,
      inventory: [],
    },
    {
      id: 'p3',
      name: 'Cromulon',
      avatarUrl: '/avatars/head.png',
      hp: 5,
      maxHp: 5,
      shields: 2,
      goldShields: 0,
      isDead: false,
      inventory: [],
    },
    {
      id: 'p4',
      name: 'Squanchy',
      avatarUrl: '/avatars/cat.png',
      hp: 2,
      maxHp: 5,
      shields: 1,
      goldShields: 0,
      isDead: false,
      inventory: [],
    },
    {
      id: 'p5',
      name: 'Evil Morty',
      avatarUrl: '/avatars/morty.png',
      hp: 3,
      maxHp: 5,
      shields: 3,
      goldShields: 1,
      isDead: false,
      inventory: [],
    },
    {
      id: 'p6',
      name: 'Mr. PB',
      avatarUrl: '/avatars/pb.png',
      hp: 2,
      maxHp: 5,
      shields: 0,
      goldShields: 0,
      isDead: false,
      inventory: [],
    },
    {
      id: 'player-1',
      name: 'Rick Sanchez',
      avatarUrl: '/avatars/rick.png',
      hp: 4,
      maxHp: 5,
      shields: 3,
      goldShields: 1,
      isDead: false,
      inventory: Array(10).fill({
        id: 'item-1',
        name: 'Beer',
        icon: '🍺',
        description: 'Cura 1 HP',
      }),
    },
  ],
  pillPool: { safe: 7, poison: 4, toxic: 2, antidote: 1, lethal: 0 },
  tablePills: Array(8).fill({ id: 'pill-x', type: 'UNKNOWN', revealed: false }),
  gameLog: [
    '> System initialized...',
    '> Round 2 started.',
    '> Rick Sanchez used Beer.',
    '> Ejected shell.',
  ],
};

interface GameStore extends IGameState {
  addLog: (msg: string) => void;
  // Adicione actions aqui (useItem, consumePill, etc)
}

export const useGameStore = create<GameStore>(set => ({
  ...initialState,
  addLog: msg => set(state => ({ gameLog: [...state.gameLog, msg] })),
}));
```

---

### 3. Componentes da UI

Vou criar os componentes seguindo a árvore que você definiu.

#### 3.1 Primitivos de UI (Wrappers)

**`src/components/ui/PixelCard.tsx`**

```tsx
import { ReactNode } from 'react';

interface PixelCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'active' | 'player';
}

export const PixelCard = ({ children, className = '', variant = 'default' }: PixelCardProps) => {
  const borderColors = {
    default: 'border-evil-purple',
    active: 'border-portal-blue shadow-neon-purple',
    player: 'border-rick-green shadow-neon-green',
  };

  return (
    <div
      className={`bg-ui-panel relative border-4 ${borderColors[variant]} shadow-pixel rounded-sm p-2 ${className} `}
    >
      {children}
    </div>
  );
};
```

#### 3.2 Seção Superior (Oponentes)

**`src/components/game/OpponentCard.tsx`**

```tsx
import { IPlayer } from '../../types/game';
import { PixelCard } from '../ui/PixelCard';
import { Heart, Shield } from 'lucide-react';

export const OpponentCard = ({ player, isActive }: { player: IPlayer; isActive: boolean }) => {
  return (
    <PixelCard
      variant={isActive ? 'active' : 'default'}
      className="flex min-w-[140px] flex-col items-center gap-2"
    >
      <div className="flex w-full items-center justify-between px-1">
        <span className="max-w-[100px] truncate text-[10px]">{player.name}</span>
      </div>

      <div className="flex w-full gap-2">
        {/* Avatar Placeholder */}
        <div className="h-12 w-12 overflow-hidden rounded-sm border-2 border-white bg-gray-700">
          <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" />
        </div>

        {/* Status Bars */}
        <div className="flex flex-col justify-center gap-1">
          <div className="flex">
            {Array.from({ length: player.hp }).map((_, i) => (
              <Heart key={i} size={12} className="text-health fill-health" />
            ))}
          </div>
          <div className="flex">
            {Array.from({ length: player.shields }).map((_, i) => (
              <Shield key={i} size={12} className="text-shield fill-shield" />
            ))}
            {Array.from({ length: player.goldShields }).map((_, i) => (
              <Shield key={`g-${i}`} size={12} className="text-shield-gold fill-shield-gold" />
            ))}
          </div>
        </div>
      </div>
    </PixelCard>
  );
};
```

#### 3.3 Seção Central (Mesa)

**`src/components/game/GameTable.tsx`**

```tsx
import { useGameStore } from '../../store/useGameStore';

export const GameTable = () => {
  const { round, pillPool, tablePills, currentTurnPlayerId } = useGameStore();

  // Stats Display Helper
  const Stat = ({ label, val, color }: { label: string; val: number; color: string }) => (
    <div className="mx-2 flex flex-col items-center">
      <span className={`text-lg font-bold ${color}`}>[{val}]</span>
      <span className={`text-[10px] ${color}`}>{label}</span>
    </div>
  );

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {/* Central Panel */}
      <div className="bg-ui-panel relative w-2/3 max-w-3xl rounded-lg border-4 border-gray-600 p-4">
        {/* Tubos/Fios Decorativos (CSS puro ou SVG) */}
        <div className="absolute -left-4 top-1/2 h-10 w-4 rounded-l-md bg-green-500" />
        <div className="absolute -right-4 top-1/2 h-10 w-4 rounded-r-md bg-purple-500" />

        {/* Header */}
        <div className="border-rick-green text-rick-green mb-4 border bg-green-900/30 py-1 text-center">
          RODADA {round} | TURNO: {currentTurnPlayerId}
        </div>

        {/* Pill Stats */}
        <div className="mb-6 flex justify-center rounded border border-gray-700 bg-black/40 p-2">
          <Stat label="SAFE" val={pillPool.safe} color="text-green-500" />
          <Stat label="POISON" val={pillPool.poison} color="text-purple-500" />
          <Stat label="TOXIC" val={pillPool.toxic} color="text-yellow-400" />
          <Stat label="ANTIDOTE" val={pillPool.antidote} color="text-blue-400" />
          <Stat label="LETHAL" val={pillPool.lethal} color="text-red-600" />
        </div>

        {/* Pill Dispenser Area */}
        <div className="flex flex-wrap justify-center gap-3">
          {tablePills.map((pill, idx) => (
            <button
              key={idx}
              className="relative flex h-6 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-gray-500 bg-gray-300 shadow-lg transition-transform hover:scale-110"
            >
              <div className="absolute left-0 h-full w-1/2 bg-gray-400" />
              <span className="relative z-10 text-xs font-bold text-black">?</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
```

#### 3.4 Seção Inferior (Player e Ações)

**`src/components/game/PlayerDashboard.tsx`**

```tsx
import { useGameStore } from '../../store/useGameStore';
import { PixelCard } from '../ui/PixelCard';
import { Heart, Shield } from 'lucide-react';

export const PlayerDashboard = () => {
  const me = useGameStore(state => state.players.find(p => p.id === 'player-1'));

  if (!me) return null;

  return (
    <PixelCard variant="player" className="flex h-full w-full flex-col gap-2 bg-black/80">
      <div className="text-rick-green mb-1 text-sm">{me.name} (YOU)</div>

      <div className="flex items-start gap-4">
        {/* Big Avatar */}
        <div className="border-rick-green h-32 w-24 shrink-0 border-2 bg-gray-800">
          <img src={me.avatarUrl} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {/* Stats */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400">Health Bar</span>
            <div className="flex gap-1">
              {Array.from({ length: me.hp }).map((_, i) => (
                <Heart key={i} className="text-health fill-health" />
              ))}
            </div>
            <span className="mt-1 text-[10px] text-gray-400">Resistance Bar</span>
            <div className="flex gap-1">
              {Array.from({ length: me.shields }).map((_, i) => (
                <Shield key={i} className="text-shield fill-shield" />
              ))}
              {Array.from({ length: me.goldShields }).map((_, i) => (
                <Shield key={`g-${i}`} className="text-shield-gold fill-shield-gold" />
              ))}
            </div>
          </div>

          {/* Inventory Grid */}
          <div className="mt-2 text-[10px] text-gray-400">Inventory Grid</div>
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 10 }).map((_, i) => {
              const item = me.inventory[i];
              return (
                <div
                  key={i}
                  className="hover:border-rick-green group relative flex h-10 w-10 cursor-pointer items-center justify-center border border-gray-600 bg-gray-800"
                >
                  {item ? (
                    <>
                      <span className="text-xl">{item.icon}</span>
                      {/* Tooltip simples */}
                      <div className="absolute bottom-full z-50 mb-1 hidden whitespace-nowrap border border-white bg-black p-1 text-[8px] group-hover:block">
                        {item.name}
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PixelCard>
  );
};
```

**`src/components/game/ActionCenter.tsx`**

```tsx
import { useGameStore } from '../../store/useGameStore';
import { ShoppingCart, MessageSquare } from 'lucide-react';
import { useEffect, useRef } from 'react';

export const ActionCenter = () => {
  const logs = useGameStore(state => state.gameLog);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Buttons Row */}
      <div className="flex h-12 gap-2">
        <button className="font-pixel flex flex-1 items-center justify-center gap-2 border-b-4 border-green-900 bg-green-700 text-xs text-white hover:bg-green-600 active:translate-y-1 active:border-b-0">
          <ShoppingCart size={16} /> SHOP
        </button>
        <button className="font-pixel flex flex-1 items-center justify-center gap-2 border-b-4 border-purple-900 bg-purple-700 text-xs text-white hover:bg-purple-600 active:translate-y-1 active:border-b-0">
          <MessageSquare size={16} /> CHAT
        </button>
      </div>

      {/* Terminal Log */}
      <div className="border-evil-purple shadow-pixel relative flex-1 overflow-y-auto border-2 bg-black p-2 font-mono text-xs">
        <div className="bg-scanlines pointer-events-none absolute left-0 top-0 h-full w-full opacity-20" />
        <div className="flex flex-col gap-1">
          {logs.map((log, i) => (
            <div key={i} className={log.startsWith('>') ? 'text-rick-green' : 'text-gray-400'}>
              {log}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};
```

#### 3.5 Tela Principal (Layout Composition)

**`src/screens/GameScreen.tsx`**

```tsx
import { useGameStore } from '../store/useGameStore';
import { OpponentCard } from '../components/game/OpponentCard';
import { GameTable } from '../components/game/GameTable';
import { PlayerDashboard } from '../components/game/PlayerDashboard';
import { ActionCenter } from '../components/game/ActionCenter';

export const GameScreen = () => {
  const players = useGameStore(state => state.players);
  // Remove o player local da lista de oponentes
  const opponents = players.filter(p => p.id !== 'player-1');

  return (
    <div className="bg-space-black relative flex h-screen w-screen flex-col overflow-hidden p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 bg-[url('/space-bg.png')] bg-cover opacity-50" />
      <div className="bg-scanlines pointer-events-none absolute inset-0 z-50 opacity-10" />

      {/* Top: Opponents */}
      <div className="relative z-10 flex h-1/4 items-center justify-center gap-4 px-8">
        {opponents.map(p => (
          <OpponentCard key={p.id} player={p} isActive={p.id === 'p3'} />
        ))}
      </div>

      {/* Center: Table */}
      <div className="relative z-10 flex h-2/4 items-center justify-center">
        <GameTable />
      </div>

      {/* Bottom: Dashboard & Actions */}
      <div className="relative z-10 grid h-1/4 grid-cols-3 gap-4">
        {/* Player Dash ocupa 2/3 */}
        <div className="col-span-2">
          <PlayerDashboard />
        </div>
        {/* Actions ocupa 1/3 */}
        <div className="col-span-1">
          <ActionCenter />
        </div>
      </div>
    </div>
  );
};
```

---

### Próximos Passos Sugeridos

1.  **Imagens:** Você precisará de assets (pngs) para os avatares e um fundo espacial (`/space-bg.png`). Coloque-os na pasta `public/`.
2.  **Ícones:** Instale o Lucide: `npm install lucide-react`.
3.  **Animações:** Para fazer as pílulas "entrarem" ou o dano piscar, instale `framer-motion` e envolva o `OpponentCard` e os itens do `GameTable` em `<motion.div>`.
4.  **Bordas Complexas:** A borda "metal alien" ao redor da tela principal da screenshot é difícil de fazer apenas com CSS. Recomendo exportar essa moldura como um SVG ou PNG com transparência no meio e colocá-la como um `absolute inset-0 pointer-events-none` no topo de tudo no `GameScreen`.
