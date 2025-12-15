# Requirements — Refactor: padronizar estrutura das Screens (EARS)

## Objetivo
Padronizar a **estrutura do componente pai (wrapper)** dentro de cada arquivo em `src/screens/`, usando `src/screens/DraftScreen.tsx` como referência de organização/estrutura, preparando terreno para um Layout principal futuro.

## Requirements (EARS)

### Estrutura base (wrapper)
- **Quando** uma Screen for renderizada, o wrapper raiz **deve** seguir um padrão consistente de:
  - altura mínima/altura de viewport
  - largura e max-width
  - layout em coluna
  - regras explícitas de scroll (onde rola: página vs área interna)

- **Enquanto** a aplicação estiver em desenvolvimento, a padronização **não deve** alterar a intenção visual de cada Screen (ex.: background especial da Home/Results).

### Organização interna
- **Quando** uma Screen possuir seções (header/content/footer), a Screen **deve** organizar a UI em blocos semânticos consistentes (ex.: comentários de seção e divisões claras), similar ao padrão já existente em `DraftScreen`.

- **Se** uma Screen precisar de scroll, a Screen **deve** concentrar o `overflow-*` no mesmo nível estrutural entre as screens (ex.: área de conteúdo), evitando misturar `h-screen`/`min-h-screen` em múltiplos níveis sem necessidade.

### Compatibilidade com DevScreen
- **Quando** `DevScreen` fizer preview de uma Screen, a Screen **deve** continuar renderizando corretamente dentro do container do preview (`fixed inset-0 overflow-auto`).

### Consistência com regras do projeto
- **Quando** a refatoração for aplicada, o código em `src/screens/` **deve** continuar passando em `pnpm lint` e `pnpm build` sem warnings.
- **Quando** a refatoração for aplicada, o código em `src/screens/` **não deve** introduzir placeholders com emojis (regra do projeto).

## Critérios de Aceitação
1. Todas as screens em `src/screens/` seguem um padrão documentado de wrapper (root + sections + scroll)
2. `DraftScreen` permanece como referência e continua funcional
3. `DevScreen` continua conseguindo pré-visualizar qualquer screen sem quebrar layout/scroll
4. `pnpm lint` e `pnpm build` passam

## Fora do Escopo
- Criar um componente global de Layout
- Criar um componente wrapper compartilhado (ex.: `ScreenRoot`/`ScreenShell`)
- Refatorar design/visual das screens (apenas estrutura e consistência)
