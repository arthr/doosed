---
description: "Always apply: workflow de documentação (v2 + steering) e auditoria de recência"
alwaysApply: true
---

## Princípio
- `docs` é a documentação completa.
- `steering/` é um conjunto curto e normativo que referencia `docs`.

## Ao alterar docs
- Se mudar `docs` ou `steering/`, regenere o apêndice de recência:

```bash
python docs/rules/docs-workflow/scripts/update_fontes_recencia.py
```

- Se houver inconsistência entre `steering/` e `docs`, corrija para ficar consistente (priorize `docs`).
