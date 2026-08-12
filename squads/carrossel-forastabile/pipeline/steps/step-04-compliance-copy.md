---
execution: inline
agent: squads/carrossel-forastabile/agents/compliance
inputFile: squads/carrossel-forastabile/output/copy.json
outputFile: squads/carrossel-forastabile/output/copy_aprovada.json
---

# Step 04: Compliance Editorial — Comporta 1 (Copy)

## Context Loading

Load these files before executing:
- `squads/carrossel-forastabile/output/copy.json` — copy produzida pelo Copywriter
- `squads/carrossel-forastabile/knowledge/regras_editoriais.md` — bloqueios absolutos, vocabulário seguro, avisos obrigatórios
- `squads/carrossel-forastabile/knowledge/fontes.json` — fontes curadas (validação dos `fontes_usadas`)
- `squads/carrossel-forastabile/knowledge/fatos.md` — números e datas de referência

## Instructions

### Process
1. Operar no modo `copy` (Comporta 1).
2. Varredura de **bloqueios absolutos** em cada slide, legenda e hashtag: acusação criminal/condenação, ataque pessoal, incitação, fabricação, vínculo político-eleitoral. Ocorrência = REPROVADO.
3. **Auditoria de fontes**: cada afirmação factual precisa de `fontes_usadas` válida (existe em fontes.json ou é fonte nova com URL) e `credito_fonte` preenchido. Conferir números/datas contra `fatos.md`.
4. **Auditoria de vocabulário**: aplicar a tabela seguro vs. arriscado. Termo arriscado = REVISAR com sugestão.
5. Verificar `avisos_obrigatorios` (disclaimer; "Investigação não é condenação." quando aplicável) e ausência de travessão (—).
6. Para itens REVISAR: gerar versão corrigida e aplicar, produzindo `copy_aprovada.json`.
7. Para REPROVADO irremediável: registrar e devolver ao Copywriter. Na 3ª iteração, escalar para humano.
8. Salvar auditoria em `squads/carrossel-forastabile/output/compliance_copy.json`.

### Loop Control
- Rastrear `iteracao` no JSON de saída.
- Se `iteracao >= 3` e ainda há REPROVADO: parar o pipeline e apresentar ao usuário.

### Output — compliance_copy.json
```json
{
  "modo": "copy",
  "status": "APROVADO | REVISAR | REPROVADO",
  "iteracao": "number",
  "violacoes": [
    {
      "slide": "number | legenda | hashtags",
      "campo": "texto | legenda | hashtag",
      "trecho": "string",
      "motivo": "string",
      "regra": "string (seção de regras_editoriais.md)",
      "status_item": "REVISAR | REPROVADO",
      "sugestao": "string"
    }
  ],
  "versao_corrigida": {}
}
```

## Quality Criteria

- [ ] Cada violação tem campo `regra` apontando a seção específica de regras_editoriais.md
- [ ] Itens REVISAR têm `sugestao` com vocabulário seguro
- [ ] Status geral reflete o pior caso individual
- [ ] `copy_aprovada.json` gerado quando status é APROVADO ou REVISAR (após correções)

## Veto Conditions

Reject and redo if ANY are true:
1. Status APROVADO com afirmação de culpa/condenação não detectada
2. Status APROVADO com afirmação factual sem fonte válida
3. Copy com REPROVADO passada adiante sem reescrita ou escalonamento
