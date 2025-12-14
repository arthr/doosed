# Produto — Dosed (Pill Roulette)

Este arquivo é a visão de produto **normativa e curta**. Detalhes completos estão em `docs/v2/01-produto` e `docs/v2/02-gameplay`.

## Visão
Dosed é um jogo por turnos de alta tensão (single e multiplayer), com estética 8-bit sci-fi. O jogador tenta sobreviver ao baralho de pílulas, manipulando risco e informação via itens, quests e leitura do pool.

## Pilares
- Tensão escalonada (early acessível -> late letal)
- Estratégia com informação (pool como baralho + contadores visíveis)
- Escolhas significativas (itens, quests, economia da partida)
- Multiplayer justo (validação server-authoritative)

## Core loop (4 fases)
- LOBBY: setup (humanos/bots), ready, configuração
- DRAFT: compra/seleção de loadout sob timer
- MATCH: turnos + uso de itens + consumo de pílulas + loja como overlay
- RESULTS: stats, XP, rematch

## Economia (decisão Renovada)
- Schmeckles: meta-moeda persistente (perfil, daily challenges, cosméticos)
- Pill Coins/Tokens: moeda da partida (Shape Quests -> loja)

## Pílulas (resumo)
- Tipos base: SAFE, DMG_LOW, DMG_HIGH, HEAL, FATAL, LIFE
- Pool é baralho sem reposição.

## Shapes e quests
- Cada pílula possui um shape.
- Shape Quests geram Pill Coins/Tokens.

### Conteúdo valioso (não normativo, a validar)
- Passivas por shape (Sphere/Cube/Pyramid/Capsule) são uma boa ideia de expansão, mas só devem entrar como feature quando houver contrato claro e balance (ver `docs/v2/02-gameplay/shapes-e-quests.md`).

## Modos
- Solo (Humano vs IA)
- Multiplayer (salas e matchmaking)

## Referências
- Produto: `docs/v2/01-produto/`
- Gameplay: `docs/v2/02-gameplay/`
- UX por telas: `docs/v2/03-ux-ui/`
