# Arquitetura — Visão geral

## Camadas
- UI (components)
- Bridge (hooks)
- State (stores)
- Domain (core/utils puras)
- Infra (Supabase realtime/edge)

## Princípios
- Estado imutável
- Processamento determinístico
- Event-driven com <= 8 tipos

## Objetivo de Solo Dev
Manter limites claros para evitar refatorações grandes.
