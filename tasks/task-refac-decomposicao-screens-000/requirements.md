# Requirements — Refactor: decomposição das Screens em subcomponentes

## Objetivo
Evoluir `src/screens/` para um modelo onde cada Screen seja principalmente **orquestração** (layout + estado + wiring) e a UI seja composta por **subcomponentes** pequenos, facilitando manutenção, evolução e a identificação de componentes candidatos ao kit de UI.

## Requirements (EARS)

### Escopo
- Quando o desenvolvedor abrir qualquer Screen em `src/screens/`, o sistema deve oferecer uma estrutura clara e consistente de subcomponentes, equivalente ao padrão já adotado no `DraftScreen` (Screen “fina”, componentes extraídos).
- Enquanto o projeto evoluir, o sistema deve permitir a substituição incremental de componentes por itens do kit UI sem reescrita da Screen.

### Decomposição por Screen
- Quando uma Screen exceder um limiar de complexidade (ex.: múltiplas seções, múltiplos estados locais, muitos elementos repetidos), o sistema deve dividir a Screen em subcomponentes com responsabilidade única.
- Quando uma Screen possuir “blocos de UI” com repetição ou padrão visual claro (cards, botões, painéis, badges, barras), o sistema deve extrair esses blocos para subcomponentes nomeados.

### Candidatos ao UI kit
- Quando um subcomponente for potencialmente reutilizável fora do domínio imediato da Screen (ex.: botão genérico, card genérico, barra de progresso genérica), o sistema deve registrá-lo como **candidato ao kit UI** (no Spec), com justificativa e sinais de reutilização.
- Quando um subcomponente for específico do domínio (ex.: HUD de match, grid de jogadores da lobby), o sistema deve permanecer em pasta de domínio e não deve ser promovido ao kit UI nesta task.

### Restrições e compatibilidade
- Quando subcomponentes forem extraídos, o sistema deve preservar o comportamento visual e de interação (sem regressões perceptíveis) e manter `DevScreen` preview funcional.
- O sistema não deve introduzir novas dependências.
- O sistema deve manter o projeto “verde”: `pnpm lint` (com `--max-warnings 0`) e `pnpm build` devem passar.
- O sistema não deve introduzir emojis em código.
- O sistema não deve introduzir um novo componente “wrapper” compartilhado (ex.: `ScreenRoot`); a padronização deve acontecer dentro de cada Screen e seus subcomponentes.
