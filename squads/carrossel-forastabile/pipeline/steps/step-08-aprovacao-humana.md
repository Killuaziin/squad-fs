---
type: checkpoint
---

# Step 08: Aprovação Humana — Gate Obrigatório

⚖️ **Compliance Editorial: APROVADO** (Comportas 1 e 2 passadas)
🖼️ **Diretor de Arte: APROVADO**

---

Antes de publicar/enfileirar, você precisa revisar e aprovar o pacote final.

**O que revisar:**

**1. Copy aprovada** (`output/copy_aprovada.json`)
- Textos de cada slide estão corretos? Fatos, valores e datas conferem?
- Créditos de fonte corretos em cada slide factual?
- Legenda, hashtags e avisos obrigatórios adequados?

**2. Brief visual** (`output/design.json`)
- Estética de faixa correta (Anton, preto/branco/vermelho)?
- Slides renderizados (se já gerou as imagens com `render-forastabile.mjs`) estão legíveis no celular?

**3. Relatórios de compliance** (`output/compliance_copy.json` e `output/compliance_arte.json`)
- Violações encontradas e como foram resolvidas (se houver).
- Lembrete da regra de ouro: **investigação não é condenação** — nada no post afirma culpa.

---

**Para aprovar:** Responda confirmando que revisou e aprova (e diga se é para ENFILEIRAR no cron diário ou PUBLICAR AGORA).

**Para ajustar:** Descreva o que precisa mudar e o pipeline voltará ao agente correspondente.

**Para cancelar:** Diga "cancelar" e o pipeline será interrompido sem publicar.

> ⚠️ Esta aprovação é obrigatória. Nenhum conteúdo é publicado sem confirmação humana explícita.
