# Registro de Observacoes

- [Data] **Zustand:** Nao desestruture stores dentro de loops ou callbacks. Use seletores granulares (`useStore(s => s.item)`) para evitar renders desnecessarios.