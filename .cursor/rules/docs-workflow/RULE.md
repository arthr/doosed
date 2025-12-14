---
description: "Always apply: workflow de documentação (v2 + steering) e auditoria de recência"
alwaysApply: true
---

## Princípio
- `docs/v2` é a documentação completa.
- `steering/` é um conjunto curto e normativo que referencia `docs/v2`.

## Ao alterar docs
- Se mudar `docs/v2` ou `steering/`, regenere o apêndice de recência:

```bash
python docs/rules/docs-workflow/scripts/update_fontes_recencia.py
```

- Se houver inconsistência entre `steering/` e `docs/v2`, corrija para ficar consistente (priorize `docs/v2`).
