# Estrutura do projeto

Este documento descreve a estrutura atual do repositório e o “shape” desejado para manter o core do jogo simples (Solo Dev) e preparado para multiplayer no futuro.

## Estrutura atual (principal)

```text
dosed/
├── src/
│   ├── core/                # Lógica pura (determinística, testável)
│   ├── types/               # Contratos TypeScript (game, events, config, etc.)
│   ├── stores/              # Zustand stores (slices por domínio)
│   ├── hooks/               # Bridge: orquestração UI ↔ stores/core
│   ├── components/
│   │   ├── ui/              # Componentes genéricos (primitivos)
│   │   ├── game/            # Componentes de domínio do jogo
│   │   └── dev/             # DevTools (apenas DEV)
│   ├── screens/             # Screens (Home/Lobby/Draft/Match/Shopping/Results)
│   ├── config/              # Configuração central (timers/balance)
│   ├── App.tsx              # Router de screens baseado em phase
│   └── main.tsx             # Bootstrap React
├── public/                  # Assets públicos
└── docs/                    # Documentação (fonte de consulta)
```

## Por que esta estrutura
- **Solo Dev**: reduz dispersão e mantém responsabilidades claras (core ≠ UI ≠ store).
- **Determinismo**: core isolado permite testes e replay/diagnóstico por eventos.
- **Evolução**: fica fácil mover lógica para server-authoritative no futuro sem reescrever UI inteira.

## Caminho de evolução (multiplayer futuro)
- Quando houver multiplayer real, a lógica “authoritative” pode migrar para funções de backend (ex.: Edge Functions).
- O alvo é manter `src/core/` como “motor” portável, e trocar apenas o “transport” (client-only → server-authoritative).
