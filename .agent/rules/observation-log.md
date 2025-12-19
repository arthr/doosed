---
description: Always apply: anotações de aprendizado e observações rápidas sobre o projeto
---

# Registro de Observações (DOSED)

Use este arquivo para registrar observações rápidas (armadilhas, decisões pequenas, heurísticas) durante o desenvolvimento.

## Como usar
- Adicionar entradas novas no topo.
- Se a observação virar regra permanente, mover/replicar para `docs/` (documentação) ou para as rules em `.cursor/rules`.

## Observações
- [Zustand] Não desestruturar stores dentro de loops/callbacks. Preferir seletores granulares (`useStore(s => s.item)`) para evitar re-renders.
- [Docs] Ao alterar estrutura/nomes de pastas/endpoints, atualizar primeiro `docs/00-start-here/estrutura-do-projeto.md` e depois alinhar `steering/`.
- [Multiplayer] Manter eventos determinísticos; evitar side effects fora do fluxo validado (server-authoritative).
