# Design — Refactor: padronizar estrutura das Screens

## Contexto

### Problema
As screens em `src/screens/` evoluíram em momentos diferentes e hoje têm wrappers inconsistentes (ex.: `min-h-screen` vs `h-screen`, `overflow-hidden` no root vs scroll interno, `max-w-*` variando, presença/ausência de container interno). Isso dificulta:
- manutenção
- previsibilidade de scroll
- introdução futura de um Layout principal (header/footer globais, backgrounds e overlays)

### Referência adotada
- `src/screens/DraftScreen.tsx` já possui:
  - divisão clara em seções (Top UI / conteúdo / Bottom)
  - wrapper com `mx-auto`, `max-w-*`, layout em coluna
  - scroll explícito no bloco correto

A proposta é **replicar esse padrão de organização** em todas as screens **sem criar um componente compartilhado** agora.

## Objetivo técnico
Definir um contrato de wrapper por Screen e aplicar em:
- `HomeScreen`
- `LobbyScreen`
- `DraftScreen` (manter referência; apenas pequenos alinhamentos se necessário)
- `MatchScreen`
- `ResultScreen`
- `DevScreen` (caso precise alinhar wrapper/preview)

## Padrão alvo (contrato de wrapper)

### Root wrapper (padrão)
- Um root por screen com:
  - `mx-auto` (quando fizer sentido)
  - `w-full`
  - `max-w-*` definido (padrão sugerido: `max-w-7xl`)
  - `flex flex-col`
  - uma decisão única sobre altura: preferir **um** entre `min-h-screen` ou `h-screen` (evitar duplicidade)

### Seções
- Estruturar seções com comentários e blocos consistentes:
  - Header (se houver)
  - Content (principal)
  - Footer/Actions (se houver)

### Scroll
- Decidir explicitamente onde ocorre o scroll:
  - **Scroll de página**: root com `min-h-screen` e sem `overflow-*` agressivo
  - **Scroll interno**: root com `h-screen` e apenas **um** container interno com `overflow-y-auto`

A recomendação é manter o padrão atual da `DraftScreen`: **scroll interno quando há grandes áreas com listas**.

## Mapeamento por screen (proposta)

### `HomeScreen`
- Mantém background absoluto próprio.
- Ajuste: padronizar o container interno (max-width, padding, seções) conforme o contrato.

### `LobbyScreen`
- Hoje usa container centralizado e `h-[90vh]`.
- Ajuste: alinhar root wrapper e mover scroll para área principal de conteúdo (já existe `main overflow-y-auto`).

### `DraftScreen`
- Manter como referência.
- Ajuste mínimo apenas se houver duplicidade de `h-screen` em dois níveis (avaliar e simplificar mantendo comportamento).

### `MatchScreen`
- Hoje: `min-h-screen` + `overflow-hidden`.
- Ajuste: alinhar max-width/padding e explicitar se o scroll é interno ou inexistente (match tende a ser sem scroll no desktop; no mobile pode precisar).

### `ResultScreen`
- Hoje tem `min-h-screen` + background theme e centralização.
- Ajuste: padronizar root e container interno; remover placeholders com emojis (regra do projeto).

### `DevScreen`
- É overlay e preview de screens.
- Ajuste: garantir que o preview não duplique scroll e que as screens continuem renderizando corretamente dentro do container `fixed inset-0 overflow-auto`.

## Alternativas consideradas

### Alternativa A: Criar um componente compartilhado (ScreenShell)
- Prós: máxima consistência imediata
- Contras: usuário explicitou que **não quer** componente novo agora

### Alternativa B (escolhida): Padronizar dentro de cada screen
- Prós: baixo acoplamento, atende pedido, prepara para Layout futuro
- Contras: repetição de classes; mitigado por convenção e migração futura

## Plano incremental (migração)
- Padronizar 1 screen por commit
- Validar `pnpm lint` / `pnpm build` por etapa
- Validar preview via `DevScreen` ao final

## Riscos e mitigação
- **Risco**: mudanças de `h-screen`/scroll quebrarem mobile.
  - Mitigação: manter o mesmo comportamento de scroll atual; apenas reduzir duplicidades.
- **Risco**: ResultScreen contém emojis (quebra regra do projeto).
  - Mitigação: remover/ substituir por placeholders textuais ou ícones existentes (lucide) no mesmo commit do Result.

## DoD global
- Todas as screens seguem o contrato
- Nenhuma regressão de scroll/layout evidente
- `pnpm lint` e `pnpm build` passam
