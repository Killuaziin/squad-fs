# Output Examples — Carrossel Instagram Forastabile

## Exemplo 1: Pilar `numeros` — "Vaquinha vs. Transfer Ban"

### copy.json (resumido)
```json
{
  "pilar": "numeros",
  "tema": "vaquinha-vs-transfer-ban",
  "slides": [
    {"n": 1, "papel": "gancho", "texto": "R$ 41,4 MILHÕES.\nFoi isso que a Fiel doou na vaquinha da Arena.", "credito_fonte": "Lance · CNN"},
    {"n": 2, "papel": "fato", "texto": "O clube tomou transfer ban por dívida menor que isso.\n6 punições em 12 meses. 3 ativas.", "credito_fonte": "FIFA/CBF · CNN · jul/2026"},
    {"n": 3, "papel": "contexto", "texto": "Caixa do clube: R$ 14,5 milhões.\nPassivos: R$ 3,36 bilhões.", "credito_fonte": "Balancete oficial · Infotimão · abr/2026"},
    {"n": 4, "papel": "exigencia", "texto": "A torcida faz a parte dela.\nA gestão, não.\nTRANSPARÊNCIA TOTAL JÁ."},
    {"n": 5, "papel": "cta", "texto": "ASSINE O MANIFESTO.\nLeva 1 minuto. Link na bio.\n#FORASTABILE"}
  ],
  "avisos_obrigatorios": ["Movimento independente de torcedores. Sem vínculo com o clube, com organizadas ou com candidatos."]
}
```

### Qualidade esperada
- Gancho com número absurdo (para o scroll sem adjetivo)
- Fatos com crédito de fonte e data em todos os slides factuais
- Exigência conecta o fato a uma das 4 exigências do movimento
- CTA de assinatura fecha o carrossel

## Exemplo 2: Pilar `faixa` — frase compartilhável

```json
{
  "pilar": "faixa",
  "slides": [
    {"n": 1, "papel": "gancho", "texto": "ELEITO POR 199 PESSOAS.\nNENHUMA DELAS FOI VOCÊ.", "credito_fonte": "ESPN · ago/2025"},
    {"n": 2, "papel": "contexto", "texto": "A eleição de novembro pode ser decidida por 4,5 mil sócios.\nEnquanto 30 milhões assistem de fora.", "credito_fonte": ""},
    {"n": 3, "papel": "cta", "texto": "VOTO PARA O FIEL TORCEDOR.\nAssine o manifesto. Link na bio.\n#FORASTABILE"}
  ]
}
```

## O Que NÃO É Exemplo de Qualidade

```
❌ "STABILE LADRÃO"                          → acusação criminal sem sentença (bloqueio absoluto)
❌ "Ele desviou o dinheiro da vaquinha"       → afirmação de crime, sem fonte que diga isso
❌ "O clube deve bilhões" (sem data/fonte)    → fato sem lastro, envelhece errado
❌ "Vamos invadir o Parque São Jorge"         → incitação (bloqueio absoluto)
❌ "Vote no candidato X para presidente"      → vínculo político (bloqueio absoluto)
```
