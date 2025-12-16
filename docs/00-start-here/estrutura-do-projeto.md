# Estrutura do projeto (Renovada)

Este documento define a **estrutura alvo** do projeto para a versão Renovada.

## Estrutura alvo (recomendada)

```text
dosed/
├── supabase/
│   ├── functions/
│   │   ├── _shared/              # Lógica core compartilhada (game-engine)
│   │   ├── match-action/         # Endpoint: processa ações/turnos (server-authoritative)
│   │   └── create-match/         # Endpoint: inicializa sala/partida
│   └── migrations/               # SQL schemas
├── src/
│   ├── core/
│   │   ├── adapters/             # Wrappers/clients (Supabase, etc.)
│   │   └── state-machines/       # FSM (XState opcional) ou lógica de fases
│   ├── components/
│   │   ├── app/                   # Shell da aplicação (ex.: ScreenShell)
│   │   ├── game/
│   │   │   ├── table/            # Mesa de jogo (bottle, conveyor, pills)
│   │   │   └── hud/              # HUD (barras, stats, inventário)
│   │   └── ui/                   # UI kit (8bit)
│   ├── hooks/                    # Hooks (bridge)
│   ├── lib/                      # Utils não-domínio (cn, systemMessages, etc.)
│   ├── screens/                  # Screens (Home/Lobby/Draft/Match/Results)
│   ├── stores/                   # Zustand stores (matchStore, uiStore, etc.)
│   └── types/                    # Contratos/Types (game, lobby, draft, etc.)
├── public/
│   └── assets/
│       └── sprites/              # Spritesheets otimizados (assets grandes)
├── docs/                         # Documentação (fonte da verdade)
└── steering/                     # Normativo curto (deve refletir docs)
```

## Por que esta estrutura
- **Solo Dev**: reduz dispersão, deixa claro onde colocar o quê.
- **Multiplayer**: separa claramente core/pure logic do que é infra (Supabase).
- **Manutenção**: components/hud/table organizam a UI do jogo por domínio.

## Nota sobre o estado atual do repo
O repositório hoje ainda pode ter variações (ex.: `src/store/` em vez de `src/stores/`). A decisão acima é o **target**; migrações devem ser feitas de forma incremental.
