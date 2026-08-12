---
execution: subagent
agent: squads/carrossel-forastabile/agents/copywriter
format: instagram-feed
inputFile: squads/carrossel-forastabile/output/briefing.json
outputFile: squads/carrossel-forastabile/output/copy.json
model_tier: powerful
---

# Step 03: Redação da Copy

## Context Loading

Load these files before executing:
- `squads/carrossel-forastabile/output/briefing.json` — briefing completo do Pesquisador (ângulo, fatos com fontes, palavras a evitar)
- `squads/carrossel-forastabile/knowledge/regras_editoriais.md` — bloqueios absolutos e vocabulário seguro
- `squads/carrossel-forastabile/knowledge/fontes.json` — para conferir créditos
- `squads/carrossel-forastabile/pipeline/data/tone-of-voice.md` — registros de tom

## Instructions

### Process
1. Ler o briefing: ângulo central, fatos com fontes, pilar e formato.
2. Definir a estrutura: máximo 5 slides (gancho, fato, contexto, exigência, CTA — ajustável ao pilar).
3. Escrever cada slide no registro faixa + dossiê: headline curta e sentenciosa, corpo factual. Para cada afirmação factual, registrar `fontes_usadas` e o `credito_fonte` que vai impresso na arte.
4. Escrever a legenda (contexto + fontes por extenso + avisos aplicáveis, ≤ 2200 caracteres) e hashtags (#ForaStabile sempre).
5. Incluir `avisos_obrigatorios`: disclaimer de independência; "Investigação não é condenação." quando o tema central for MP/impeachment.
6. Varredura final contra os bloqueios absolutos e contra travessão (—). Salvar em `squads/carrossel-forastabile/output/copy.json`.

### Output Format
```json
{
  "pilar": "string",
  "tema": "string",
  "slides": [
    {
      "n": "number",
      "papel": "gancho | fato | contexto | exigencia | cta",
      "texto": "string",
      "fontes_usadas": ["string"],
      "credito_fonte": "string"
    }
  ],
  "legenda": "string",
  "hashtags": ["string"],
  "avisos_obrigatorios": ["string"]
}
```

## Quality Criteria

- [ ] Máximo 5 slides; todos com campo `fontes_usadas` (pode ser lista vazia)
- [ ] Toda afirmação factual tem fonte e `credito_fonte`
- [ ] Nenhum termo dos bloqueios absolutos; nenhum travessão (—)
- [ ] `avisos_obrigatorios` preenchido; legenda ≤ 2200 caracteres
- [ ] Último slide é CTA de assinatura do manifesto

## Veto Conditions

Reject and redo if ANY are true:
1. Qualquer afirmação factual sem `fontes_usadas` correspondente
2. Qualquer texto afirma ou insinua culpa criminal/condenação (regra de ouro)
3. `avisos_obrigatorios` ausente ou vazio
