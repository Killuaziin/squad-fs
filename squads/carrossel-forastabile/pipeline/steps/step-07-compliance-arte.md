---
execution: inline
agent: squads/carrossel-forastabile/agents/compliance
inputFile: squads/carrossel-forastabile/output/design.json
outputFile: squads/carrossel-forastabile/output/compliance_arte.json
---

# Step 07: Compliance Editorial — Comporta 2 (Arte)

## Context Loading

Load these files before executing:
- `squads/carrossel-forastabile/output/design.json` — brief visual com campo `texto_na_imagem` por slide
- `squads/carrossel-forastabile/output/aprovacao_arte.json` — aprovação do Diretor de Arte
- `squads/carrossel-forastabile/output/copy_aprovada.json` — copy aprovada na Comporta 1
- `squads/carrossel-forastabile/knowledge/regras_editoriais.md` — bloqueios e vocabulário seguro

## Instructions

### Process
1. Operar no modo `art` (Comporta 2).
2. Verificar que `aprovacao_arte.json` tem `status: APROVADO` — se não, parar e informar.
3. Para cada slide, extrair `texto_na_imagem` e aplicar a mesma lógica da Comporta 1: bloqueios absolutos, auditoria de fontes, vocabulário seguro.
4. Atenção especial a: **tarjas** (uma tarja afirmando culpa é violação; "INVESTIGADO PELO MP" com fonte não é), **números gigantes** (precisam do crédito com data no mesmo slide), texto novo que não estava na `copy_aprovada.json`, uso de escudo/símbolo oficial do clube.
5. Verificar que slides factuais têm crédito de fonte visível.
6. Compilar resultado em `squads/carrossel-forastabile/output/compliance_arte.json`.
7. Se REPROVADO na 3ª iteração: escalar para humano com relatório completo.

### Output Format
```json
{
  "modo": "art",
  "status": "APROVADO | REVISAR | REPROVADO",
  "iteracao": "number",
  "violacoes": [
    {
      "slide": "number",
      "campo": "texto_na_imagem",
      "trecho": "string",
      "motivo": "string",
      "regra": "string (seção de regras_editoriais.md)",
      "status_item": "REVISAR | REPROVADO",
      "sugestao": "string"
    }
  ],
  "texto_novo_nao_revisado": ["string"]
}
```

## Quality Criteria

- [ ] `texto_na_imagem` de todos os slides auditado (incluindo tarjas, números e créditos)
- [ ] `texto_novo_nao_revisado` registra qualquer texto da arte ausente da copy aprovada
- [ ] Slides factuais têm crédito de fonte confirmado

## Veto Conditions

Reject and redo if ANY are true:
1. Algum slide não teve `texto_na_imagem` verificado
2. Status APROVADO com texto na arte que não constava na `copy_aprovada.json`
3. Status APROVADO com slide factual sem crédito de fonte
