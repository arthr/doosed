---
trigger: always_on
glob:
description: Always apply: diretrizes globais (Solo Dev) e fonte da verdade
---

- Responder sempre em **Português (Brasil)**.
- Não usar emojis.
- Ser direto e objetivo.

## Fonte da verdade
- Documentação completa e normativa: `docs/`
- `steering/` é normativo e curto: deve refletir e apontar para `docs`.

## Mindset (Solo Dev)
- Preferir soluções simples, testáveis e fáceis de manter por 1 dev.
- Evitar over-engineering e dependências novas sem necessidade real.

## Conflitos entre docs
- Prioridade: `docs` > `steering/` > demais.
- Para rastrear precedência/recência, use: `docs/99-apendice/fontes-e-recencia.md`.
