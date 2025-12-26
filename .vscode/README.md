# Configurações do VS Code - DOSED MVP

Este diretório contém configurações específicas do workspace para o projeto DOSED.

## Arquivos

### `launch.json`
Configurações de debug para:
- Debug no Chrome/Edge (aplicação React)
- Attach to running Chrome
- Debug de testes Vitest

**Quick Start**: Pressione `F5` para iniciar debug no Chrome.

### `tasks.json`
Task `npm: dev` configurada como background task para iniciar o Vite automaticamente durante debug.

### `settings.json`
Configurações do workspace:
- Formatação automática com Prettier
- ESLint habilitado
- TypeScript workspace version
- Tailwind CSS IntelliSense
- Exclusões de arquivos para performance

### `extensions.json`
Extensões recomendadas para desenvolvimento do projeto. 
O VS Code solicitará instalação ao abrir o workspace.

### `DEBUG-GUIDE.md`
**Guia completo** de como debugar o projeto, incluindo:
- Passo a passo para debugar o Bug #3 (bot para de jogar)
- Breakpoints recomendados
- Fluxos esperados vs problemáticos
- Comandos úteis do Debug Console
- Troubleshooting

## Como Usar

1. **Abrir o projeto** no VS Code
2. **Instalar extensões recomendadas** (notificação aparecerá automaticamente)
3. **Pressionar F5** para iniciar debug
4. **Ler DEBUG-GUIDE.md** para instruções detalhadas

## Atalhos Úteis

| Atalho | Ação |
|--------|------|
| `F5` | Iniciar debug |
| `Ctrl+Shift+D` | Abrir panel de debug |
| `F9` | Toggle breakpoint |
| `F10` | Step over |
| `F11` | Step into |
| `Shift+F11` | Step out |
| `Ctrl+Shift+F5` | Restart debug |

---

**Nota**: Todas as configurações seguem as convenções da Constitution (Princípio V) e estão alinhadas com o workflow de desenvolvimento do projeto.

