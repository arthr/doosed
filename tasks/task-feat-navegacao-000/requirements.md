# Requirements — Navegação entre Telas (EARS)

## Objetivo
Implementar o fluxo de navegação entre as screens principais do jogo (Home -> Lobby -> Draft -> Match -> Results) utilizando o `flowStore` existente e garantindo transições válidas entre fases.

## Requirements (EARS)

### Navegação e Transições
- **Quando** o usuário clicar em "ENTER THE VOID" na `HomeScreen`, o sistema **deve** transicionar para a fase `LOBBY`.
- **Quando** o usuário clicar em "MULTIPLAYER" na `HomeScreen`, o sistema **deve** transicionar para a fase `LOBBY`.
- **Quando** o usuário clicar em "Start" no `LobbyScreen`, o sistema **deve** transicionar para a fase `DRAFT`.
- **Quando** o timer do Draft expirar ou o usuário confirmar, o sistema **deve** transicionar para a fase `MATCH`.
- **Quando** a partida terminar (vitória ou derrota), o sistema **deve** transicionar para a fase `RESULTS`.
- **Quando** o usuário clicar em "Play Again" no `ResultScreen`, o sistema **deve** reiniciar o fluxo retornando para `LOBBY`.
- **Quando** o usuário clicar em "Main Menu" no `ResultScreen`, o sistema **deve** retornar para a fase `HOME`.

### Validação de Transições
- **Se** uma transição de fase for inválida (não permitida pela função `canTransition`), o sistema **deve** rejeitar a transição e manter a fase atual.
- **Enquanto** o usuário estiver em qualquer fase que não seja `HOME`, o sistema **deve** renderizar apenas a screen correspondente à fase atual.

### UI e Feedback
- **Quando** uma transição de fase ocorrer, o sistema **deve** renderizar a screen correspondente imediatamente.
- **Se** o ambiente for `DEV`, o `DevScreen` **deve** permanecer acessível em todas as fases.
- **Quando** o usuário estiver na `HomeScreen`, o sistema **deve** exibir apenas os botões funcionais conectados ao fluxo.

### Persistência e Reset
- **Quando** o jogo iniciar, o sistema **deve** começar na fase `HOME`.
- **Quando** o usuário completar um ciclo completo (Home -> Results), o sistema **deve** permitir reiniciar o fluxo sem recarregar a aplicação.

## Critérios de Aceitação
1. Todos os botões da `HomeScreen` devem estar conectados ao `flowStore`
2. Transições de fase devem respeitar `canTransition`
3. Cada fase renderiza apenas sua screen correspondente
4. `DevScreen` permanece funcional em todas as fases (ambiente DEV)
5. Nenhum warning/erro no `pnpm lint` e `pnpm build`

## Fora do Escopo (nesta task)
- Lógica de negócio específica de cada fase (Draft, Match, Results)
- Persistência de estado entre recarregamentos
- Animações de transição entre screens
