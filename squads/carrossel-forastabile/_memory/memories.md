# Squad Memory: Carrossel Instagram — Forastabile

## Persona (referência obrigatória)
- **A Fiel sem voto** — torcedor do Corinthians, Fiel Torcedor sem direito a voto, núcleo 18-45 no Instagram. Perfil completo em `knowledge/persona.md`.

## Estilo de Escrita
- Tom: **faixa de arquibancada + dossiê jornalístico** — frase curta e sentenciosa na headline, fato com fonte + data no corpo.
- **NUNCA usar travessão (—)** nos textos dos slides nem na legenda (preferência do Kevin, herdada do projeto anterior). Usar vírgula, dois-pontos, ponto ou reescrever.
- Regra de ouro: **"investigação não é condenação"** — vocabulário seguro em `knowledge/regras_editoriais.md`.
- CTA padrão: "Assine o manifesto. Leva 1 minuto. Link na bio." (#ForaStabile)

## Estrutura de Conteúdo
- **Máximo de 5 slides por carrossel** (preferência do Kevin, herdada do projeto anterior). Priorizar gancho + 3 desenvolvimentos + CTA.
- Arte **tipográfica própria** (Anton/Raleway, preto-branco-vermelho). Sem fotos de imprensa. Crédito de fonte visível em todo slide que afirma fato.

## Fonte de Conteúdo
- Matéria-prima base: `knowledge/fatos.md` (7 fatos, números da vergonha, timeline 2026, 8 faixas, 4 exigências) + `knowledge/fontes.json` (23 fontes curadas).
- Pilar "notícias": pesquisa web de desdobramentos novos (MP, impeachment, balancetes, transfer bans, jogos), sempre com URL de veículo.
- **Números têm data de referência** (posição 11/08/2026 no fatos.md) — atualizar quando sair balancete/notícia nova.

## Compliance
- 2 comportas (copy e arte) auditando contra `knowledge/regras_editoriais.md`.
- Posts sobre investigação: incluir "Investigação não é condenação." na legenda.
- Disclaimer recorrente: "Movimento independente de torcedores. Sem vínculo com o clube, com organizadas ou com candidatos."

## Design Visual
- Estilo brutalista de faixa: fundo preto, blocos brancos rotacionados (~0.6°), Anton caixa alta, vermelho `#c8102e` de acento, tarjas, numeração de dossiê. Guia completo em `knowledge/brand_guidelines.md`.
- Wordmark tipográfico **#FORASTABILE** como assinatura em todos os slides.

## Temas já usados (não repetir)
- (nenhum ainda — squad novo)

## Técnico (específico do squad)
- Imagens renderizadas via `output/_build/render-forastabile.mjs` (Playwright + Chrome), rodando da raiz do projeto: `node squads/carrossel-forastabile/output/_build/render-forastabile.mjs <cfg.json>`. Tipos de slide: `faixa`, `stat`, `fato`, `noticia`, `cta`. No template `fato`, o campo `numero` aceita data ("05/04") além de índice ("01").
- **Lotes**: `node squads/carrossel-forastabile/output/_build/gerar-lote.mjs <lote.json>` renderiza vários posts, escreve os `caption.txt` e atualiza o manifest de uma vez. Formato do lote em `lote-01.json`.

## API do Instagram — armadilhas já resolvidas (não regredir)
- Rota é **Instagram Login** (`graph.instagram.com`), não Facebook. `INSTAGRAM_USER_ID` vem de `GET /me`, não do painel.
- **Parâmetros de POST vão no corpo**, nunca na query string: com legenda longa a URL passa de 1600 caracteres e a API responde 200 com `{"id":"0"}`, sem mensagem de erro.
- **`children` do carrossel vai como array JSON** (`JSON.stringify`); separado por vírgula falha de forma intermitente com o mesmo `{"id":"0"}`.
- Container recém-criado responde erro 100/subcode 33 por alguns segundos: é "ainda não pronto", não falha. E o carrossel só aceita os filhos ~15s depois de eles reportarem FINISHED.
- Criar vários carrosséis em sequência rápida faz a Meta recusar com "Please retry creating a new container later" (visível só via `?metadata=1`). Em operação normal é 1 por dia, então não acontece; só afeta testes.
- Fila: posts SEM campo `date` no manifest são escolhidos pelo tipo do dia da semana (ver `queue/manifest.json` → `schedule`), na ordem do array. Posts de notícia quente usam `date` (furam a fila). Preferir sem data: fila não trava se um dia falhar.
- Publicação: GitHub Actions `publish.yml` roda 12:00 UTC (09h BRT) diariamente; imagens servidas via raw.githubusercontent.com (repo público).
- Pexels (`fetch-batch.mjs`) é opcional: arte padrão é tipográfica, sem foto.
