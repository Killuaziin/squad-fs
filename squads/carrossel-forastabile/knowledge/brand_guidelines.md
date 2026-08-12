# Forastabile — Brand Guidelines

> Valores extraídos diretamente do CSS de forastabile.com.br via inspeção em 2026-08-12.

## Identidade da Marca

**Nome:** Forastabile (#ForaStabile)
**Posicionamento:** Movimento independente de torcedores do Corinthians — "O Corinthians é do povo"
**Proposta:** Mobilização informada: estética de faixa de protesto com rigor de dossiê jornalístico

## Paleta de Cores (valores oficiais do CSS)

| Variável CSS | Hex | Uso |
|---|---|---|
| `--preto` | `#000000` | Fundo padrão de tudo |
| `--painel` | `#141414` | Painéis/cards sobre o preto |
| `--costura` | `#2a2a2a` | Bordas, separadores ("costura" da faixa) |
| `--cinza` | `#9d9d9d` | Texto secundário, créditos de fonte |
| `--branco` | `#ffffff` | Texto principal, blocos de faixa |
| **vermelho** | `#c8102e` | Acento (vermelho Corinthians): tarjas, números, destaques |

Apoio: `#333333`, `#555555`, `#666666`, `#191919` (tons de cinza para camadas).

**Proporção:** ~80% preto/branco de alto contraste, ~10% cinza, ~10% vermelho. O vermelho é acento, nunca fundo dominante.

## Tipografia (valores oficiais do CSS — Google Fonts)

| Fonte | Uso |
|---|---|
| **Anton** | Display: headlines, números gigantes, frases de faixa — SEMPRE CAIXA ALTA |
| **Raleway** 400/600/800 (+itálico) | Corpo de texto, créditos, contexto |

| Elemento | Fonte | Uso no carrossel |
|---|---|---|
| Headline/faixa | Anton | Frase de impacto, caixa alta, tracking levemente aberto |
| Número gigante | Anton | Stat cards ("R$ 3,36 BI") em branco ou vermelho |
| Corpo | Raleway 400/600 | Desenvolvimento, contexto do fato |
| Crédito de fonte | Raleway 600 | "Fonte: Balancete oficial · Infotimão · abr/2026" em `#9d9d9d` |
| Palavra de ordem secundária | Raleway 800 itálico | Apoio emocional |

## Grafismos e Elementos Recorrentes

- **Bloco de faixa**: retângulo branco com texto preto Anton, levemente rotacionado (`rotate(-0.6deg)`, alternando sinal entre blocos) — simula cartaz colado/faixa de arquibancada.
- **Tarja**: barra preta ou vermelha sobre elemento, com texto branco (ex.: "INVESTIGADO PELO MP" como tarja).
- **Costura**: borda 1-2px `#2a2a2a` delimitando painéis `#141414`.
- **Numeração de dossiê**: numeral grande (01, 02…) em Anton vermelho para cards de fatos.
- **Hashtag assinatura**: `#FORASTABILE` em Anton, presente em todos os slides (rodapé ou tarja).
- **Indicador de progresso** (dots) + seta "ARRASTE →" nos slides intermediários.

## Tamanhos Mínimos (Mobile)

- Headline/faixa: mínimo 64px (Anton comporta grande)
- Número gigante (stat): 160px+
- Corpo: mínimo 30px
- Crédito de fonte: mínimo 22px (sempre legível — a fonte é parte do argumento)

## Logotipo

- Arquivo: `https://forastabile.com.br/logo.jpg` (fundo escuro).
- Alternativa preferida em arte tipográfica: wordmark textual **#FORASTABILE** em Anton — não depende de imagem.

## Estilo Visual

**Tom geral:** brutalista/manifesto. Alto contraste P&B, tipografia como imagem. Não é "template de agência" — é faixa de protesto digital com dados.

**O que evitar:**
- Fotos de imprensa/terceiros dentro da arte (regra editorial: o movimento não hospeda imagem de terceiros)
- Gradientes suaves, pastel, estética "clean de marca de consumo"
- Escudo/símbolos oficiais do Corinthians como logomarca do movimento (movimento é independente do clube)
- Antes/depois, montagens que pareçam foto real, deepfake

## Instagram — Padrões de Carrossel

- **Formato:** 1080x1350px (retrato 4:5)
- **Slides:** máximo 5 por carrossel (preferência do Kevin, herdada do projeto anterior)
- **Slide 1:** frase de faixa ou número gigante — parar o scroll
- **Slides do meio:** o fato + contexto + fonte
- **Último slide:** CTA "ASSINE O MANIFESTO" + forastabile.com.br (link na bio) + disclaimer curto
- **Crédito de fonte visível** em todo slide que afirma fato
