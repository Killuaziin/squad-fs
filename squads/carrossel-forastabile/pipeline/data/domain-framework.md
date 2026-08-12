# Domain Framework — Carrossel de Mobilização com Compliance Editorial

## Fluxo Obrigatório

```
Input (pilar + tema + urgência)
  ↓
Apuração → briefing.json (todo fato com fonte + data)
  ↓
Copy → copy.json (faixa + dossiê)
  ↓
COMPLIANCE COPY (Comporta 1) → copy_aprovada.json
  ↓
Design → design.json (tipografia de faixa + render_cfg)
  ↓
Diretor de Arte → aprovacao_arte.json
  ↓
COMPLIANCE ARTE (Comporta 2) → compliance_arte.json
  ↓
APROVAÇÃO HUMANA (gate obrigatório: enfileirar ou publicar agora)
  ↓
Publicação/Fila → publicacao.json
```

## Regra de Ouro

**Investigação não é condenação.** O movimento nunca afirma culpa criminal. Toda afirmação factual precisa de (a) fonte em `fontes.json` ou fonte nova com URL de veículo/documento oficial e (b) data de referência. Opinião e palavra de ordem são livres, desde que claramente opinião e sem os bloqueios absolutos.

## Hierarquia de Decisão

1. **Bloqueio absoluto** (acusação criminal, ataque pessoal, incitação, fabricação, vínculo político): REPROVADO, sem reformulação
2. **Fato sem fonte**: REPROVADO (ou REVISAR se a fonte existe e faltou creditar)
3. **Redação arriscada** (tem substituição na tabela de vocabulário seguro): REVISAR com sugestão
4. **Aprovado**: fato com fonte, vocabulário seguro, avisos presentes

## Os 4 Pilares de Conteúdo

| Pilar | O que é | Template visual dominante |
|---|---|---|
| `numeros` | Stat card dos "números da vergonha" | `stat` (número gigante + crédito) |
| `dossie` | Os 7 fatos, timeline, ficha, exigências | `fato` (card numerado) |
| `faixa` | Frase de faixa tipográfica compartilhável | `faixa` (bloco branco rotacionado) |
| `noticias` | Desdobramento novo com fonte | `noticia` (manchete + veículo + data) |

## Estrutura de Carrossel que Funciona (máx. 5 slides)

1. **Slide gancho**: número absurdo ou frase de faixa. Para o scroll.
2. **Slides fato/contexto (2-3)**: o dado, a fonte, o enquadramento (assimetria, dinheiro da Fiel).
3. **Slide exigência** (opcional): qual das 4 exigências o post sustenta.
4. **Slide CTA**: "ASSINE O MANIFESTO" + link na bio + #FORASTABILE.

## Limites de Iteração

- Compliance Copy: máximo 3 iterações antes de escalar para humano
- Compliance Arte: máximo 3 iterações antes de escalar para humano
- Diretor de Arte: máximo 2 iterações antes de apresentar solução direta
