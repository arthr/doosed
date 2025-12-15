# Requirements — Draft Funcional (EARS)

## Objetivo
Implementar a lógica funcional da fase de Draft: timer de seleção, sistema de economia (Pill Coins), compra/seleção de itens para o loadout, validação de inventário (8 slots), e confirmação que transiciona para Match.

## Requirements (EARS)

### Timer de Draft
- **Quando** a fase `DRAFT` iniciar, o sistema **deve** iniciar um timer de 60 segundos.
- **Enquanto** o timer estiver ativo, o sistema **deve** decrementar o tempo restante a cada segundo.
- **Quando** o timer chegar a 0, o sistema **deve** autocompletar o loadout com itens padrão (se houver slots vazios) e transicionar para `MATCH`.
- **Se** o usuário confirmar o loadout antes do timer expirar, o sistema **deve** parar o timer e transicionar para `MATCH`.

### Sistema de Economia (Pill Coins)
- **Quando** o Draft iniciar, o sistema **deve** atribuir ao jogador um saldo inicial de Pill Coins (ex.: 100).
- **Enquanto** o Draft estiver ativo, o sistema **deve** exibir o saldo atual de Pill Coins no Header.
- **Quando** o jogador comprar um item, o sistema **deve** deduzir o custo do item do saldo.
- **Se** o jogador não tiver Pill Coins suficientes, o sistema **deve** desabilitar o botão de compra do item.

### Compra de Itens
- **Quando** o jogador clicar em um item disponível na loja, o sistema **deve** adicionar o item ao inventário (se houver espaço e Pill Coins).
- **Se** o inventário estiver cheio (8 slots), o sistema **deve** impedir a compra e exibir feedback visual.
- **Quando** um item for adicionado ao inventário, o sistema **deve** atualizar a UI do inventário imediatamente.

### Inventário (8 slots)
- **Quando** o Draft iniciar, o sistema **deve** exibir um inventário vazio com 8 slots.
- **Enquanto** o jogador estiver adicionando itens, o sistema **deve** preencher os slots na ordem.
- **Quando** o jogador clicar em um item do inventário, o sistema **deve** remover o item e reembolsar o valor (50% do custo original).
- **Se** o jogador tentar confirmar o loadout com slots vazios, o sistema **deve** permitir (slots vazios = sem item).

### Confirmação de Loadout
- **Quando** o jogador clicar em "Confirmar", o sistema **deve** parar o timer e salvar o loadout.
- **Quando** o loadout for confirmado, o sistema **deve** transicionar para a fase `MATCH`.
- **Se** o timer expirar antes da confirmação, o sistema **deve** autocompletar o loadout com itens padrão (ex.: "Placebo Pills") e transicionar para `MATCH`.

### Itens Disponíveis (MVP)
- **Quando** o Draft iniciar, o sistema **deve** exibir uma lista de itens disponíveis para compra.
- **Enquanto** o Draft estiver ativo, o sistema **deve** exibir nome, descrição, custo e ícone de cada item.
- **Se** um item for "consumível", o sistema **deve** permitir comprar múltiplas unidades (respeitando limite de 8 slots).

## Critérios de Aceitação
1. Timer de 60s inicia ao entrar no Draft e decrementa visualmente
2. Sistema de economia (Pill Coins) funciona: compra deduz saldo, reembolso funciona
3. Inventário tem 8 slots e aceita/remove itens corretamente
4. Botão "Confirmar" transiciona para Match e salva loadout
5. Timer expirando autocompleta e transiciona para Match
6. UI reflete estado atual (saldo, timer, inventário)
7. Nenhum warning/erro no `pnpm lint` e `pnpm build`

## Fora do Escopo (nesta task)
- Itens complexos (efeitos in-match)
- Loja dinâmica (preços variáveis, ofertas especiais)
- Persistência de loadouts favoritos
- Animações complexas (apenas feedback básico)
