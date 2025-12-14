# Supabase — Modelo de dados

## Tabelas (mínimo)
- profiles: perfil, moedas, XP, cosméticos
- matches: metadados da partida
- match_state: snapshot/eventlog (dependendo da estratégia)

## RLS
- profiles: leitura pública opcional, escrita restrita ao dono.

## Observação (Solo Dev)
Começar simples: profiles + matches + match_events.
