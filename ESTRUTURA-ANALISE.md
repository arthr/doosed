# Análise de Estrutura - Estado Atual vs Documentação

## Estrutura Alvo (docs/00-start-here/estrutura-do-projeto.md)

```
src/
├── core/
│   ├── adapters/             # Wrappers/clients (Supabase, etc.)
│   └── state-machines/       # FSM (XState opcional) ou lógica de fases
├── components/
│   ├── game/
│   │   ├── table/            # Mesa de jogo (bottle, conveyor, pills)
│   │   └── hud/              # HUD (barras, stats, inventário)
│   └── ui/                   # UI kit (8bit)
├── hooks/                    # Hooks (bridge)
├── lib/                      # Utils não-domínio (cn, systemMessages, etc.)
├── screens/                  # Screens (Home/Lobby/Draft/Match/Results)
├── stores/                   # Zustand stores (matchStore, uiStore, etc.)
└── types/                    # Contratos/Types (game, lobby, draft, etc.)
```

## Estrutura Atual

```
src/
├── assets/
│   └── svg/
├── components/
│   ├── chat/                 # Sistema de chat (global)
│   ├── dev/                  # Componentes de desenvolvimento
│   ├── draft/                # Componentes específicos do Draft
│   ├── game/
│   │   ├── hud/              ✅ Alinhado com docs
│   │   └── table/            ✅ Alinhado com docs
│   ├── lobby/                # Componentes específicos do Lobby
│   └── ui/                   ✅ Alinhado com docs
│       └── decorations/      # Animações decorativas (CromolumAnimated, etc.)
├── core/
│   ├── adapters/             ✅ Alinhado com docs (placeholder .gitkeep)
│   └── state-machines/       ✅ Alinhado com docs (phase.ts)
├── hooks/                    ✅ Alinhado com docs
├── lib/                      ✅ Alinhado com docs
├── screens/                  ✅ Alinhado com docs
├── stores/                   ✅ Alinhado com docs
└── types/                    ✅ Alinhado com docs
```

## Análise Comparativa

### ✅ Estrutura Base Alinhada
- `core/adapters/` e `core/state-machines/` existem conforme docs
- `components/game/hud/` e `components/game/table/` existem conforme docs
- `hooks/`, `lib/`, `screens/`, `stores/`, `types/` todos presentes

### ⚠️ Pastas Adicionais (não mencionadas nas docs)

1. **`src/assets/svg/`**
   - Status: Razoável
   - Justificativa: Assets locais pequenos (ícones SVG inline)
   - Ação: Manter por enquanto, mas documentar em estrutura

2. **`src/components/chat/`**
   - Status: Razoável
   - Justificativa: Chat é um sistema global/transversal (usado em múltiplas screens)
   - Ação: Manter. Poderia estar em `ui/` mas faz sentido separado por complexidade

3. **`src/components/dev/`**
   - Status: Razoável (desenvolvimento)
   - Justificativa: Componentes auxiliares para DevScreen
   - Ação: Manter por ora, revisar quando DevScreen estiver maduro

4. **`src/components/draft/`**
   - Status: Razoável
   - Justificativa: Componentes específicos da fase Draft (Header, InventorySlot, ShopItem)
   - Ação: Manter. É um domínio específico e não faz sentido misturar com `game/`

5. **`src/components/lobby/`**
   - Status: Razoável
   - Justificativa: Componentes específicos da fase Lobby
   - Ação: Manter. Mesmo raciocínio do Draft

6. **`src/components/ui/decorations/`**
   - Status: Razoável
   - Justificativa: Subpasta organizacional para elementos decorativos animados
   - Ação: Manter. É apenas uma subdivisão lógica de `ui/`

## Conclusão

### Estado Geral: ✅ CONSISTENTE

A estrutura atual está **alinhada com as docs** e as pastas adicionais são justificáveis:

- **`chat/`, `draft/`, `lobby/`**: Domínios específicos que merecem separação
- **`dev/`**: Ferramentas de desenvolvimento temporárias
- **`ui/decorations/`**: Organização interna de `ui/`
- **`assets/svg/`**: Assets inline (não afeta arquitetura)

### Ações Recomendadas

1. **Nenhuma ação obrigatória** - estrutura está saudável
2. **(Opcional)** Documentar pastas adicionais em `estrutura-do-projeto.md` para futuros devs
3. **(Futuro)** Quando `DevScreen` for removido, remover `components/dev/`

### Próximos Passos

Estrutura validada. Podemos prosseguir com a criação dos 4 specs para as features seguintes:
1. Navegação entre telas (flowStore + UI)
2. Core do Match (gameplay)
3. Draft funcional
4. Results funcional
