# Produto: Dosed (Pill Roulette)

## 1. Visão Geral & Core Concept
**Dosed** é um jogo de estratégia multiplayer por turnos, de alta tensão, com estética *8-bit Sci-Fi* (inspirada em Rick and Morty). Jogadores competem em uma roleta russa farmacêutica, onde o objetivo é sobreviver a um frasco de pílulas mistas ("Live" vs "Placebo") enquanto manipulam as probabilidades usando itens ilegais e habilidades passivas baseadas em formas geométricas.

**Meta:** Ser o último sobrevivente na mesa, gerenciando sua "Tolerância" (HP) e induzindo "Overdose" nos oponentes.

---

## 2. Core Loop (O Fluxo da Partida)
A partida é estruturada em Rounds. O ciclo é: **Intermissão (Quest) -> Draft -> The Bottle (Combate)**.

### Fase 1: Intermissão & The Shape Quest (A "Receita")
Entre as rodadas, o "Sistema" emite uma nova *Shape Quest* para todos os jogadores (ou individualmente).

* **A Mecânica:** É atribuído um objetivo de coleta específico para o próximo round.
    * *Exemplo:* "Consuma 2 Triângulos e 1 Quadrado neste round."
* **Tomada de Decisão:** O jogador analisa o risco. Se ele ignorar a Quest, joga seguro mas fica sem recursos. Se tentar cumprir, pode ter que engolir propositalmente uma *Live Pill* (Dano) só porque ela tem o formato necessário.
* **Recompensa:** Cumprir a Quest é a única forma consistente de obter "Tokens de Draft" de alto valor ou restaurar Tolerância (Cura).

### Fase 2: The Draft (Preparação)
Com os recursos ganhos na Shape Quest anterior, os jogadores compram itens.
* Jogadores que falharam na Quest anterior terão pouco poder de compra aqui, entrando na arena em desvantagem.

### Fase 3: The Bottle (A Roleta)
O gameplay principal de turnos.
* 🔴 **Live Pill (Vermelha):** Aumenta a toxicidade (Dano).
* 🔵 **Placebo (Azul):** Seguro.
* 🔺 **Shapes (Formas):** Cada pílula tem uma forma geométrica (Cubo, Esfera, Pirâmide, Cápsula) visível ou oculta, essencial para a Shape Quest.

> O Round termina quando o frasco esvazia ou por eliminação.

---

## 3. Sistema de Itens (Items & Gadgets)

Os itens são consumíveis descartáveis usados para mitigar o RNG.

| Ícone (Ref) | Nome | Efeito Técnico | Custo (Draft) |
| :--- | :--- | :--- | :--- |
| 🔍 | **Scanner** | Revela a cor da próxima pílula no frasco (Privado). | Baixo |
| 🔪 | **Serrated Edge** | A próxima pílula causa 2x de Dano (Toxicidade). | Médio |
| 🍺 | **Beer/Neutralizer** | Ejeta a pílula atual do frasco sem consumir. | Alto |
| ⛓️ | **Handcuffs** | Pula o turno do oponente na próxima rodada. | Alto |
| 💉 | **Adrenaline** | Rouba um item do oponente e usa imediatamente. | Muito Alto |
| 🚬 | **Inverter** | Inverte a polaridade da pílula atual (Live vira Placebo e vice-versa). | Médio |

---

## 4. Mecânica de "Shapes" (Formas & Passivas)

Além da cor, cada pílula possui um **Shape** (Forma Geométrica) que interage com o metabolismo do jogador. Isso adiciona uma camada de profundidade além do simples "Dano/Não Dano".

- **The Sphere (Esfera):** Padrão. Sem efeitos adicionais.
- **The Cube (Cubo):** Estável. Se for uma *Live Pill*, o dano é reduzido em 1.
- **The Pyramid (Pirâmide):** Instável. Se for *Placebo*, concede +1 Item aleatório.
- **The Capsule (Cápsula):** Ação Rápida. Se consumida, o turno passa instantaneamente (ignora animações lentas/efeitos de stasis).

*Nota: Shapes são distribuídos aleatoriamente no carregamento do Frasco.*

---

## 5. Quests & Progressão

O sistema de retenção baseia-se em tarefas de curto e longo prazo.

### Daily Prescriptions (Quests Diárias)
- "Sobreviva a 3 partidas sem usar o Scanner."
- "Cause 5 Overdoses em oponentes."
- "Consuma 10 Placebos em sequência."
- **Recompensa:** Desbloqueio de cosméticos (Skins de Avatar, Mesas, Frascos).

### Lifetime Stats (Dossier Médico)
- Total de Pílulas Ingeridas.
- Taxa de Sobrevivência.
- Itens Favoritos.

---

## 6. Modos de Jogo

1.  **Quick Dose (Normal Matchmaking):** Matchmaking de oponente baseado em MMR/Ranking. Fase de Draft habilitada. Melhor de 3. Sala com 2 jogadores (1v1).
2.  **Danger Dose (Ranked Matchmaking):** Matchmaking de oponentes baseado em MMR/Ranking. Fase de Draft habilitada. Melhor de 3. Sala com 2 a 6 jogadores.
3.  **Rehab (Online/Hotseat):** Criar ROOM com amigos. Fase de Draft customizável. Possível adicionar Bots (AI). Melhor de {x} (customizável). Sala com 2 a 6 jogadores.

## 7. Infraestrutura (Supabase Key Points)

- **Auth:** Login anônimo ou via Discord.
- **Database:** Tabelas para `matches`, `players`, `items_metadata`, `quests`.
- **Realtime:** Inscrição no canal `match:ID` para sincronizar `current_turn`, `bottle_state` (hash), e `health`.
- **Edge Functions:** Lógica crítica (`resolve_turn`, `deal_bottle`) roda no servidor para evitar cheats.