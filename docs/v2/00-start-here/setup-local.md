# Setup local

## Requisitos
- Node.js (LTS)
- pnpm

## Comandos
```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
```

## Variáveis de ambiente (quando ativar Supabase)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## Regras de dependências
- Não adicionar libs novas sem necessidade real.
- Tailwind-first (evitar CSS adicional fora do padrão do projeto).
