---
execution: subagent
agent: squads/carrossel-forastabile/agents/designer
inputFile: squads/carrossel-forastabile/output/copy_aprovada.json
outputFile: squads/carrossel-forastabile/output/design.json
model_tier: powerful
---

# Step 05: Design — Brief Visual Tipográfico

## Context Loading

Load these files before executing:
- `squads/carrossel-forastabile/output/copy_aprovada.json` — copy revisada e aprovada pelo Compliance (Comporta 1)
- `squads/carrossel-forastabile/output/briefing.json` — pilar, ângulo e formato
- `squads/carrossel-forastabile/knowledge/brand_guidelines.md` — identidade visual (paleta, Anton/Raleway, grafismos de faixa)

## Instructions

### Process
1. Ler a copy aprovada, incluindo os `credito_fonte` de cada slide.
2. Definir o conceito do set conforme o pilar: `numeros` → stat cards; `dossie` → cards numerados; `faixa` → tipografia pura em bloco rotacionado; `noticias` → manchete + data + veículo. Último slide sempre template `cta`.
3. Para cada slide, especificar: `template`, fundo, tipografia (fonte/tamanho/cor), elementos (tarja, numeração, bloco de faixa, wordmark #FORASTABILE, dots, seta) e o campo `texto_na_imagem` com TODO o texto visível (headline, corpo, crédito, wordmark).
4. Gerar o `render_cfg` de cada slide, executável por `output/_build/render-forastabile.mjs` (campos: `tipo`, `headline`, `body`, `stat`, `tarja`, `numero`, `credito`, conforme o template).
5. O `texto_na_imagem` só pode conter texto presente na `copy_aprovada.json` (incluindo créditos). Nunca criar texto novo.
6. Verificar consistência do set e salvar em `squads/carrossel-forastabile/output/design.json`.

### Important: texto_na_imagem
O campo `texto_na_imagem` de cada slide é o insumo obrigatório da Comporta 2. Deve conter TODO o texto que aparece dentro da imagem: headlines, tarjas, números, créditos de fonte, wordmark, CTAs.

### Output Format
```json
{
  "pilar": "string",
  "tema": "string",
  "conceito_visual": "string",
  "slides": [
    {
      "slide": "number",
      "papel": "string",
      "template": "faixa | stat | fato | noticia | cta",
      "especificacoes": {
        "fundo": "hex",
        "texto_principal": {"conteudo": "string", "fonte": "string", "tamanho": "string", "cor": "hex"},
        "texto_apoio": {"conteudo": "string", "fonte": "string", "tamanho": "string", "cor": "hex"},
        "credito_fonte": {"conteudo": "string", "tamanho": "string", "cor": "hex"},
        "elementos": ["tarja | numeracao | bloco-faixa | wordmark | dots | seta"]
      },
      "texto_na_imagem": "string",
      "render_cfg": {}
    }
  ]
}
```

## Quality Criteria

- [ ] Todos os slides têm `template` válido e `texto_na_imagem` completo
- [ ] Todo texto em `texto_na_imagem` existe na `copy_aprovada.json`
- [ ] Slides factuais têm crédito de fonte ≥ 22px em `#9d9d9d`
- [ ] Paleta restrita aos tokens do brand_guidelines; tipografia Anton + Raleway
- [ ] `render_cfg` presente e executável em todos os slides

## Veto Conditions

Reject and redo if ANY are true:
1. Qualquer slide sem o campo `texto_na_imagem`
2. `texto_na_imagem` contém texto que não existe na `copy_aprovada.json`
3. Slide factual sem crédito de fonte visível
