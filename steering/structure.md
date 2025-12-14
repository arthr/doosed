# Estrutura do projeto (Fonte Normativa)

Este arquivo descreve a estrutura do repositório e aponta para a documentação Renovada em `docs/v2`.

## Pastas principais
- `src/`: aplicação React (UI, stores, tipos)
- `public/`: assets públicos
- `docs/`: documentação (inclui `docs/v2`)
- `steering/`: documentos normativos curtos (produto/stack/fluxo/balance)

## Estrutura atual (alto nível)
```
src/
  components/
    ui/
    chat/
    lobby/
    draft/
  hooks/
  lib/
  screens/
  store/
  types/
```

## Convenções
- Components: PascalCase
- Hooks: prefixo use
- Estado global: `src/store/` (Zustand)
- Tipos: `src/types/`

## Documentação Renovada
- Índice: `docs/v2/index.md`
- Arquitetura (eventos, FSM): `docs/v2/04-arquitetura/`
- Gameplay (pílulas, quests, balance): `docs/v2/02-gameplay/`

## Regra importante
`steering/` deve permanecer consistente com `docs/v2`.
