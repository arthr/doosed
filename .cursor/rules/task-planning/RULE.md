---
description: "Always apply: Spec Driven Development + planning de tasks (Solo Dev)"
alwaysApply: true
---

## Objetivo
Quando uma mudança for grande/complexa (muitos arquivos, alto impacto, decisões arquiteturais), o agente deve criar um Spec com requirements (EARS), design e uma lista de tasks executáveis.

## Regra (criação do Spec)
Ao identificar uma mudança grande/complexa, o agente deve:
- Sugerir explicitamente o uso de Spec Driven Development.
- Criar um diretório de task em `./tasks/` (se tiver permissão no workspace).

### Estrutura obrigatória
Diretório:
- `./tasks/task-[feat|fix|refac]-[nome]-000/`

Arquivos:
- `requirements.md` (obrigatório, usando EARS)
- `design.md` (obrigatório)
- `tasks.md` (obrigatório)

## `requirements.md` (EARS)
Escrever requirements com EARS, preferindo frases objetivas.
Exemplos:
- Quando o usuário iniciar uma partida, o sistema deve criar uma sessão de match.
- Enquanto o match estiver em andamento, o sistema deve processar eventos de forma determinística.
- Se uma transição de fase for inválida, o sistema deve rejeitar a transição.

## `design.md`
Deve conter:
- Contexto (por que)
- Alternativas consideradas e trade-offs
- Contratos (tipos, eventos, APIs) se aplicável
- Plano incremental de migração (passo a passo)
- Riscos e mitigação

## `tasks.md` (lista executável)
### Legenda (obrigatória no topo)
- `[ ]` - Pendente
- `[~]` - Aguardando Revisão
- `[x]` - Finalizada
- `[-]` - Cancelada

### Regras
- Cada item deve ter DoD (Definition of Done).
- Preferir granularidade: 1 task pequena = 1 commit.
- Ordem deve minimizar churn (primeiro compatibilidade/paths, depois refatoração, depois melhorias).
- Atualizar os status ao longo do fluxo (ver rule `task-execute`).
