---
execution: inline
agent: squads/carrossel-forastabile/agents/operador
inputFile: squads/carrossel-forastabile/output/copy_aprovada.json
outputFile: squads/carrossel-forastabile/output/publicacao.json
---

# Step 09: Publicação / Enfileiramento

## Context Loading

Load these files before executing:
- `squads/carrossel-forastabile/output/copy_aprovada.json` — copy final aprovada (textos, legenda, hashtags)
- `squads/carrossel-forastabile/output/design.json` — brief visual com `render_cfg` por slide
- `squads/carrossel-forastabile/output/compliance_copy.json` — status da Comporta 1
- `squads/carrossel-forastabile/output/compliance_arte.json` — status da Comporta 2
- `squads/carrossel-forastabile/_memory/published.md` — histórico de publicações
- `queue/manifest.json` — fila do cron diário

## Instructions

### Pre-conditions Check (OBRIGATÓRIO antes de qualquer ação)
1. Aprovação humana explícita recebida no Step 08 (incluindo o modo: ENFILEIRAR ou PUBLICAR AGORA)
2. `compliance_copy.json` → `status == "APROVADO"`
3. `compliance_arte.json` → `status == "APROVADO"`

Se qualquer pré-condição falhar: parar, registrar em `publicacao.json` com `status: BLOQUEADO` e informar.

### Process — Modo ENFILEIRAR (padrão)
1. Renderizar os slides: montar o cfg a partir dos `render_cfg` do design e rodar `node squads/carrossel-forastabile/output/_build/render-forastabile.mjs <cfg.json>`.
2. Criar `queue/posts/{id}/` com `slide-01.jpg`…`slide-0N.jpg` + `caption.txt` (legenda + hashtags).
3. Adicionar entrada em `queue/manifest.json`: `id`, `type` (pilar), `title`, `published: false`; incluir `date` só se urgente.
4. Registrar em `publicacao.json` com `status: ENFILEIRADO`.

### Process — Modo PUBLICAR AGORA
1. Validar a conta: `GET /{ig-user-id}?fields=username` deve retornar `forastabile`.
2. Publicar via skill `instagram-publisher` (item containers → carousel → publish).
3. Registrar em `publicacao.json` (post_id, url, timestamp) e atualizar `_memory/published.md`.

### Output Format — publicacao.json
```json
{
  "status": "PUBLICADO | ENFILEIRADO | BLOQUEADO | ERRO",
  "queue_id": "string (se ENFILEIRADO)",
  "post_id": "string (se PUBLICADO)",
  "url": "string (se PUBLICADO)",
  "publicado_em": "ISO timestamp",
  "pilar": "string",
  "tema": "string",
  "slides": "number",
  "motivo_bloqueio": "string (se BLOQUEADO)",
  "erro_api": "string (se ERRO)"
}
```

### Memory Update — published.md (apenas quando PUBLICADO)
```markdown
## {data} — {pilar} — {tema}
- **Post ID**: {post_id}
- **URL**: {url}
- **Slides**: {n}
```

## Quality Criteria

- [ ] Pré-condições verificadas e documentadas
- [ ] Validação de conta (@forastabile) feita antes de publicação direta
- [ ] `publicacao.json` gerado (qualquer resultado)
- [ ] `queue/manifest.json` ou `_memory/published.md` atualizado conforme o modo
- [ ] Nenhum token ou credencial nos outputs

## Veto Conditions

Reject and redo if ANY are true:
1. Ação iniciada sem verificar as 3 pré-condições
2. `publicacao.json` não foi gerado
3. Publicação direta sem validação de conta
