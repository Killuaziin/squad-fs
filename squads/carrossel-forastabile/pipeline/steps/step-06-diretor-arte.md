---
execution: inline
agent: squads/carrossel-forastabile/agents/diretor-arte
inputFile: squads/carrossel-forastabile/output/design.json
outputFile: squads/carrossel-forastabile/output/aprovacao_arte.json
---

# Step 06: Diretor de Arte — Revisão Visual

## Context Loading

Load these files before executing:
- `squads/carrossel-forastabile/output/design.json` — brief visual do Designer
- `squads/carrossel-forastabile/knowledge/brand_guidelines.md` — identidade visual do movimento
- `squads/carrossel-forastabile/output/briefing.json` — pilar e ângulo definidos

## Instructions

### Process
1. Ler o brief visual slide a slide.
2. Avaliar o slide 1: para o scroll? Elemento dominante (stat/faixa) com o peso visual certo? Paleta correta (preto dominante, vermelho de acento)?
3. Avaliar consistência do set: templates coerentes, wordmark #FORASTABILE em todos, dots e seta nos intermediários.
4. Verificar legibilidade mobile: headline ≥ 64px, corpo ≥ 30px, crédito de fonte ≥ 22px.
5. Verificar identidade: estética de faixa (sem gradiente suave, sem foto de banco, sem ícone genérico, sem escudo oficial do clube).
6. Verificar créditos de fonte visíveis nos slides factuais.
7. Aprovado → `aprovacao_arte.json` com `status: APROVADO`. Caso contrário → `status: REVISAR` com feedback por slide (problema + solução).
8. Máximo de 2 rodadas. Na 2ª sem resolução, incluir a solução direta no feedback.

### Output Format
```json
{
  "status": "APROVADO | REVISAR",
  "iteracao": "number",
  "observacoes": "string",
  "sugestoes_nao_bloqueantes": ["string"],
  "feedback": [
    {"slide": "number", "problema": "string", "solucao": "string"}
  ]
}
```

## Quality Criteria

- [ ] `status` preenchido (APROVADO ou REVISAR)
- [ ] Slide 1 avaliado explicitamente (parada de scroll)
- [ ] Créditos de fonte verificados nos slides factuais
- [ ] Feedback para REVISAR tem slide + problema + solução

## Veto Conditions

Reject and redo if ANY are true:
1. Status APROVADO sem avaliação explícita do slide 1
2. Status REVISAR sem feedback acionável (problema + solução por slide)
