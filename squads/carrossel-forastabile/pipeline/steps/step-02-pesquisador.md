---
execution: subagent
agent: squads/carrossel-forastabile/agents/pesquisador
format: instagram-feed
inputFile: squads/carrossel-forastabile/output/input.md
outputFile: squads/carrossel-forastabile/output/briefing.json
model_tier: powerful
---

# Step 02: Apuração e Briefing

## Context Loading

Load these files before executing:
- `squads/carrossel-forastabile/output/input.md` — pilar, tema e urgência definidos no checkpoint
- `squads/carrossel-forastabile/knowledge/fatos.md` — matéria-prima curada do manifesto (fatos, números, timeline, faixas)
- `squads/carrossel-forastabile/knowledge/fontes.json` — fontes jornalísticas/oficiais curadas
- `squads/carrossel-forastabile/knowledge/regras_editoriais.md` — bloqueios e vocabulário seguro
- `_opensquad/_memory/company.md` — perfil do movimento, tom de voz, identidade
- `squads/carrossel-forastabile/_memory/memories.md` — aprendizados e temas já usados

## Instructions

### Process
1. Ler o input para identificar pilar, tema e urgência.
2. Verificar em `_memory/memories.md` e `_memory/published.md` se o tema já foi usado. Se sim, propor ângulo novo ou atualização com fato mais recente.
3. Carregar de `fatos.md` os fatos e fontes relevantes ao tema.
4. Pesquisar na web (web_search) desdobramentos e confirmação de atualidade dos números. Para o pilar `noticias`, a pesquisa web é a fonte primária — registrar URL + veículo + data de cada fato novo.
5. Definir o `angulo_central` e os fatos de apoio, cada um com `fonte_id` (de fontes.json) ou `fonte_nova` (URL + veículo + data) e `data_referencia`.
6. Compilar o briefing e salvar em `squads/carrossel-forastabile/output/briefing.json`.

### Output Format
```json
{
  "pilar": "numeros | dossie | faixa | noticias",
  "tema": "string",
  "urgencia": "normal | urgente",
  "angulo_central": "string",
  "fatos": [
    {
      "texto": "string",
      "fonte_id": "string (de fontes.json) OU null",
      "fonte_nova": {"url": "string", "veiculo": "string", "data": "string"},
      "fonte_credito": "string (crédito curto para a arte)",
      "data_referencia": "string",
      "status_juridico": "string (quando aplicável)"
    }
  ],
  "persona_gatilho": "string",
  "tendencias_formato": {"slides_ideais": "number (máx 5)", "estrutura": "string"},
  "tom_de_voz": "string",
  "palavras_a_evitar": ["string"],
  "cta": "string"
}
```

## Quality Criteria

- [ ] Todos os campos do JSON presentes
- [ ] Todo item de `fatos` tem fonte (`fonte_id` ou `fonte_nova` completa) e `fonte_credito`
- [ ] Todo valor financeiro tem `data_referencia`
- [ ] `palavras_a_evitar` presente (pode ser lista vazia)
- [ ] Tema verificado contra memórias (sem repetição não intencional)

## Veto Conditions

Reject and redo if ANY are true:
1. Algum fato do briefing não tem fonte verificável (URL de veículo ou documento oficial)
2. Algum fato está redigido como acusação criminal/condenação (violação da regra de ouro)
