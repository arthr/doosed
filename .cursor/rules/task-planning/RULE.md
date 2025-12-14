---
description: "Always apply: planejamento por tasks atômicas (Solo Dev)"
alwaysApply: true
---

## Objetivo
Garantir que mudanças grandes/complexas (feature/refactor/fix com impacto alto, muitos arquivos, ou decisões arquiteturais) sejam executadas com clareza e rastreabilidade em modo Solo Dev.

## Regra
Quando o usuário solicitar (ou a conversa evoluir para) uma mudança grande/complexa, o agente deve **sempre sugerir** a criação de um arquivo de tasks e, se possível no workspace, **criar** esse arquivo.

- Local: `./tasks/`
- Nome do arquivo: `TASK-[FEAT|FIX|REFAC]-[NOME]-000.md`

## Conteúdo mínimo do arquivo de tasks
- **Contexto**: 2-5 linhas sobre o porquê.
- **Escopo**: o que está dentro e fora.
- **Riscos**: 2-5 bullets.
- **Tasks atômicas**: lista ordenada com Definition of Done (DoD) por item.
- **Planos de verificação**: comandos e checks (ex.: `pnpm lint`, `pnpm build`).

## Diretrizes
- Uma task deve ser pequena o suficiente para caber em 1 commit e manter o projeto “verde”.
- Priorizar ordem que minimize churn: primeiro mover/compatibilizar caminhos, depois refatorar responsabilidades.
- Evitar over-engineering e dependências novas sem pedido explícito.
