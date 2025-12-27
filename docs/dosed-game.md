# DOSED — Pill Roulette

## Convenções
- Linguagem: PT-BR
- Identificadores no código: EN
- Termos:
  - **Partida**: o jogo completo (em código: `Match`)
  - **Rodada**: um “baralho/pool” completo dentro da partida
  - **Turno**: a vez de um jogador dentro de uma rodada
  - **Pool**: baralho de pílulas da rodada (sampling sem reposição)
  - **Phase**: fases do fluxo de jogo (em código: `MatchPhase`)

## Sumário
- [Decisões normativas](#decisões-normativas)
- [Glossário](#glossário)
- [00 — Start here](#00--start-here)
- [01 — Produto](#01--produto)
- [02 — Gameplay](#02--gameplay)
- [03 — UX/UI](#03--uxui)
- [04 — Arquitetura](#04--arquitetura)
- [05 — Backend (Supabase)](#05--backend-supabase)
- [06 — Frontend](#06--frontend)
- [07 — Qualidade](#07--qualidade)
- [08 — Roadmap](#08--roadmap)

## Decisões normativas
- Inventário padrão: **5 slots**
- Economia separada:
  - **Schmeckles**: meta-moeda persistente (progressão)
  - **Pill Coins**: moeda da partida (começa em 100, acumula entre rodadas, reseta a cada nova partida)
- Pool de pílulas: baralho (sem reposição) + contadores visíveis (card counting)
- Fases do jogo (Phase): `LOBBY -> DRAFT -> MATCH -> SHOPPING -> RESULTS`
  - **Home** é uma Screen fora das Phases (antes de entrar no fluxo do jogo)
- Loja: **Shopping Phase entre rodadas**, ativada por **Shop Signal** durante a rodada
- Arquitetura: event-driven e determinística, com **8 tipos de eventos core**
- Multiplayer (futuro): server-authoritative (Edge Functions) + UI otimista com rollback

## Glossário
- **Última Chance**: quando um jogador chega a **0 Vidas**, ele continua vivo até o próximo Colapso.
- **Colapso**: quando a Resistência chega a **≤ 0** após resolver um efeito: **Vidas -= 1** e Resistência reseta para o máximo.
- **Eliminação**: ocorre quando a Resistência zera novamente **já estando em 0 Vidas**.
- **Shop Signal**: sinalização durante a rodada; a loja abre apenas na Phase **SHOPPING** (entre rodadas).
- **Status**: buffs/debuffs ativos (ex.: `Shielded`, `Handcuffed`).

---

## 00 — Start here

### `docs/README.md`
Este diretório contém a **documentação oficial** do projeto (PT-BR).

- **Comece por aqui**: `docs/index.md`
- **Documentação legada (somente referência histórica)**: pastas de arquivo do projeto

### `docs/index.md`
Esta pasta contém a documentação oficial (PT-BR) do DOSED, para consulta e evolução do projeto.

#### Como ler (ordem recomendada)
- `00-start-here/`
- `01-produto/`
- `02-gameplay/`
- `03-ux-ui/`
- `04-arquitetura/`
- `05-backend-supabase/`
- `06-frontend/`
- `07-qualidade/`
- `08-roadmap/`

### `docs/00-start-here/index.md`
#### Objetivo
Permitir que 1 dev (modo solo) consiga:
- rodar o projeto localmente
- entender as regras do jogo e os contratos
- evoluir features sem introduzir dívida técnica

#### Princípios (modo Solo Development)
- Evitar “plataformas” e over-engineering: priorizar vertical slice.
- Documentar decisões (por quê) antes de expandir escopo.
- Fazer features que fecham loop de valor: jogar -> ganhar -> progredir -> retornar.

#### O que é o DOSED (MVP)
- Fluxo jogável (vertical slice): **Home → Lobby (solo) → Draft → Partida vs IA → Results**
- Phases do jogo (dentro de `GAME`): **LOBBY → DRAFT → MATCH → SHOPPING → RESULTS**
  - **Home** é uma Screen fora das Phases (entrada/menu)
- Inventário: **5 slots**
- Economia:
  - **Pill Coins**: moeda da partida (começa em 100, acumula entre rodadas, reseta a cada nova partida)
  - **Schmeckles**: meta-moeda persistente (progressão)
- Multiplayer (futuro): preparado para server-authoritative (Edge Functions)
- UI/UX: React + Tailwind (foco em clareza e feedback rápido, sem over-engineering)

### `docs/00-start-here/setup-local.md`
#### Requisitos
- Node.js (LTS)
- pnpm

#### Comandos
```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
```

#### Variáveis de ambiente (quando ativar Supabase)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

#### Regras de dependências
- Não adicionar libs novas sem necessidade real.
- Tailwind-first (evitar CSS adicional fora do padrão do projeto).

### `docs/00-start-here/dev-workflow.md`
- Trabalhe em branches curtas por feature.
- Commits pequenos, com mensagem focada no porquê.
- Guardrails:
  - Componentes: UI pura
  - Hooks: ponte entre UI e actions/selectors
  - Utils/core: funções puras e determinísticas
- Qualidade:
  - Lint sempre verde
  - Para lógica de jogo: testes unitários + property-based quando fizer sentido

### `docs/00-start-here/estrutura-do-projeto.md`
Este documento descreve a estrutura atual do repositório e o “shape” desejado para manter o core do jogo simples (Solo Dev) e preparado para multiplayer no futuro.

#### Estrutura atual (principal)
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

---

## 01 — Produto

### `docs/01-produto/visao-e-pilares.md`
#### Fantasia
Uma roleta russa farmacêutica sci-fi, por turnos, com tensão crescente e estética 8-bit.

#### Pilares
- Tensão escalonada (early acessível -> late letal)
- Escolhas significativas (itens, quests, risco vs recompensa)
- Estratégia com informação (baralho sem reposição + contadores)
- Saúde dupla e colapso (Vidas + Resistência + leitura de risco)
- Multiplayer justo (validação server-authoritative)

#### Anti-pilares
- RNG puro sem leitura/contrajogo
- Meta-economia confusa
- Regras ocultas sem feedback

### `docs/01-produto/modos-de-jogo.md`
- Solo: humano vs IA (onboarding, treino e progressão básica)
- Multiplayer: Quick/Ranked e salas custom (2–6)
- Conceito unificado: todos são Player; muda a origem das ações

### `docs/01-produto/progressao-meta.md`
- Perfil: nível (XP), Schmeckles (moeda persistente), cosméticos
- Daily challenges: 1 desafio/dia com recompensa (Schmeckles/XP)
- Recompensas pós-partida: XP e loot cosmético (quando existir catálogo)
- Persistência: guest-first; login habilita ranking e persistência plena

---

## 02 — Gameplay

### `docs/02-gameplay/core-loop.md`
(conteúdo integral já padronizado neste documento)

### `docs/02-gameplay/pills.md`
(conteúdo integral já padronizado neste documento)

### `docs/02-gameplay/itens-e-loja.md`
(conteúdo integral já padronizado neste documento)

### `docs/02-gameplay/shapes-e-quests.md`
(conteúdo integral já padronizado neste documento)

### `docs/02-gameplay/balance.md`
- Metas: 8–12 rodadas por partida; 60–80% sucesso em quests; ~70/30 estratégia vs sorte
- Guardrails: SAFE não pode sumir no early; FATAL não entra cedo; pool cap fixo
- Checklist de tuning: ajustar pouco por vez; simulações curtas; 10 partidas por dificuldade antes de mudar mais

### `docs/02-gameplay/mecanicas_e_extras.md`
- Saúde dupla (normativo) + variantes (Piercing/Overflow como extensões)
- Economia estética (Schmeckles/daily) como guideline

### `docs/02-gameplay/ai.md`
- Objetivo: previsível no fácil e estratégica no difícil, mantendo determinismo (mesma entrada -> mesma saída)
- Níveis: easy/normal/hard/insane
- Metas de win rate por dificuldade
- Regras: ajustar parâmetros/heurísticas sem “cheats” ocultos

---

## 03 — UX/UI

### `docs/03-ux-ui/design-system.md`
- Stack: Tailwind v4; componentes retro (8bit/ui)
- Tokens: cores neon + fundo escuro; tipografia pixel
- Componentes base: PixelCard; botões; log estilo terminal
- Responsividade: desktop 16:9 e mobile 9:16

### `docs/03-ux-ui/home.md`
- Objetivo: entrada do jogo, perfil, configs, daily challenge, acesso rápido a Solo/Multiplayer
- Estados: guest/autenticado; daily disponível/concluído
- Componentes: título/logo, botões, resumo de perfil, daily, marquee

### `docs/03-ux-ui/lobby.md`
- Objetivo: preparar partida com até 6 jogadores, ready check e chat
- Regras: não iniciar até todos READY; host controla start
- Componentes: room code, grid de jogadores, chat terminal, toggle ready, configs básicas

### `docs/03-ux-ui/draft.md`
- Objetivo: comprar/selecionar loadout sob pressão de tempo
- Regras: timer global; ao expirar autocompletar; inventário 5 slots
- Componentes: header economia+timer; grids; inventário; confirmar

### `docs/03-ux-ui/match.md`
- Objetivo: gameplay por turnos com leitura de contadores e uso de itens
- Regras: destaque do turno; contadores visíveis; eliminados marcados; saúde dupla; colapso com feedback; última chance; shop signal
- Componentes: linha de oponentes; pool; HUD; action dock; game log/chat

### `docs/03-ux-ui/results.md`
- Objetivo: encerrar partida com feedback, stats, XP e próxima ação
- Componentes: hero do vencedor; stats; barra de XP; recompensa cosmética; ações

---

## 04 — Arquitetura

### `docs/04-arquitetura/visao-geral.md`
- Camadas: UI (components), Bridge (hooks), State (stores), Domain (core/utils), Infra (Supabase)
- Princípios: estado imutável; determinismo; event-driven (<= 8 tipos)

### `docs/04-arquitetura/maquina-de-estados.md`
- Fases: LOBBY → DRAFT → MATCH → SHOPPING → RESULTS
- Home fora das phases; subestados sugeridos para MATCH
- Regras: sem booleans soltas; transições por eventos

### `docs/04-arquitetura/eventos.md`
- Eventos core (8 tipos): `PLAYER_JOINED`, `TURN_STARTED`, `ITEM_USED`, `PILL_CONSUMED`, `EFFECT_APPLIED`, `COLLAPSE_TRIGGERED`, `ROUND_COMPLETED`, `MATCH_ENDED`
- Regras: imutáveis, serializáveis, determinísticos e suficientes para replay/diagnóstico

### `docs/04-arquitetura/replays-e-auditoria.md`
- Por quê: debug determinístico; anticheat/validação; replays/histórico
- Abordagem: persistir event log; reprocessar eventos para reconstruir estado

### `docs/04-arquitetura/detalhes.md`
(conteúdo de estratégia de Supabase/infra, como nota detalhada)

---

## 05 — Backend (Supabase)

### `docs/05-backend-supabase/modelo-de-dados.md`
- Tabelas mínimas: profiles, matches, match_state (snapshot/eventlog)
- RLS: profiles com escrita restrita ao dono
- Solo Dev: começar simples (profiles + matches + match_events)

### `docs/05-backend-supabase/realtime.md`
- Canais: `match:{id}` para broadcast
- Presence: detectar desconexões
- Heartbeat: ping/timeout
- Regras: não usar Postgres Changes para game loop

### `docs/05-backend-supabase/edge-functions.md`
- Objetivo: validar ações e transmitir estado atualizado (server-authoritative)
- Endpoints: match-action; create-match
- Regras: validar payload; persistir evento; broadcast do novo estado

### `docs/05-backend-supabase/anti-cheat.md`
- Ameaças: console injection; eventos forjados; spam de ações
- Mitigações: server-authoritative; rate limit; sequencing por evento; validação no servidor

---

## 06 — Frontend

### `docs/06-frontend/stack-e-convencoes.md`
- Stack: React+TS+Vite; Tailwind v4; Zustand (+ Immer); animações via CSS transitions
- Convenções: kebab-case em `src/components/ui`; PascalCase em domínio; hooks `use*`; exports nomeados (default para entrypoints)
- Router no topo em `src/App.tsx` baseado em `match.phase` + Error Boundary

### `docs/06-frontend/state-management.md`
- Diretriz: separar stores por fase/domínio
- Padrões: selectors granulares; não desestruturar store em loops/callbacks
- Objetivo: aproximar do modelo clean/event-driven

### `docs/06-frontend/performance.md`
- Prioridades: selectors específicos; memoização quando necessário; evitar cascata
- Observação: log pode crescer; virtualizar se necessário

### `docs/06-frontend/animacoes-e-feedback.md`
- Padrões: overlays de reveal/efeitos; game log de feedback; animações curtas
- UI otimista: animar antes da confirmação; rollback se servidor rejeitar

---

## 07 — Qualidade

### `docs/07-qualidade/testing.md`
- Estratégia: unit para lógica pura; property-based para invariantes fortes
- Testar: distribuição do pool; progressão de shapes; invariantes de resistência/vidas; determinismo do processador de eventos

### `docs/07-qualidade/observabilidade.md`
- Objetivo: debug rápido em Solo Dev
- Recomendações: action history; snapshot de estado; métricas básicas

---

## 08 — Roadmap

### `docs/08-roadmap/mvp.md`
- Vertical slice: Home → Lobby (solo) → Draft → Partida vs IA → Shopping (entre rodadas) → Results
- Progressão mínima: XP + Schmeckles
- Economia da partida: Pill Coins (Draft + Partida + Shopping)
- Multiplayer (fase 2): lobby realtime; partida server-authoritative; rollback e reconexão

### `docs/08-roadmap/backlog.md`
- Alta: auth guest-first; multiplayer server-authoritative; daily challenges + economia
- Média: ranking; replays; temporadas
- Baixa: shapes sazonais; referral



