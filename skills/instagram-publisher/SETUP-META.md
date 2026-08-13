# Setup da Meta — Token de publicação do @forastabile

> Guia completo para gerar as credenciais que o publicador usa (`INSTAGRAM_ACCESS_TOKEN` e `INSTAGRAM_USER_ID`).
> **Refaça este processo a cada ~60 dias**, quando o token expirar.
>
> App em uso: **FORA STABILE** · App ID `2746407875732317`

---

## Antes de começar

1. O **@forastabile** precisa ser conta **Profissional** (Comercial ou Criador de conteúdo).
   Confira no app do Instagram: *Perfil → menu ☰ → Configurações → Tipo de conta e ferramentas*.
2. Faça login no navegador com a conta do Facebook/Instagram que **administra** o @forastabile.
3. O app pode ficar em modo **Desenvolvimento** — para publicar na sua própria conta não é preciso App Review.

---

## Rota recomendada: API do Instagram com Login do Instagram

Essa rota dispensa Página do Facebook e dispensa o Explorador da Graph API (que estava dando "Token indisponível na sessão").

### Passo 1 — Abrir o painel do app

Acesse: **https://developers.facebook.com/apps/**

Clique no app **FORA STABILE**.

### Passo 2 — Abrir o caso de uso do Instagram

No **menu lateral esquerdo**, clique em **"Casos de uso"** (ou "Use cases").

- Se já existir um card de **Instagram**, clique em **"Personalizar"** / **"Customize"**.
- Se **não existir**, clique em **"Adicionar caso de uso"**, escolha o card do **Instagram** e confirme.
  Quando perguntar o tipo de login, escolha **"API do Instagram com login do Instagram"**.

### Passo 3 — Liberar as permissões

Dentro do caso de uso, abra a aba **"Permissões"** e clique em **"Adicionar"** nestas duas:

- `instagram_business_basic`
- `instagram_business_content_publish`

(Nesta rota os nomes têm o prefixo `instagram_business_`. Não é preciso pedir revisão para usar na própria conta.)

### Passo 4 — Vincular a conta e gerar o token

Ainda no caso de uso, abra **"Configuração da API com login do Instagram"** (*API setup with Instagram login*).

1. No item **1. Gerar tokens de acesso**, clique em **"Adicionar conta"**.
2. Abre um popup do Instagram: faça login com o **@forastabile** e **autorize** o app.
3. A conta passa a aparecer numa tabela. Clique em **"Gerar token"** na linha dela.
4. Marque o checkbox de confirmação. Aparece um **texto muito longo** (150+ caracteres, começa com `IGAA...`).
   **Esse é o `INSTAGRAM_ACCESS_TOKEN`.** Copie inteiro.
5. Na mesma tabela existe o **ID da conta** (número comprido, ex.: `17841400000000000`).
   **Esse é o `INSTAGRAM_USER_ID`.**

> O token gerado por aqui já é de **longa duração (60 dias)**. Não precisa trocar por outro.

### Passo 5 — Salvar as credenciais

Cole os dois valores no arquivo `.env` na raiz do projeto, depois do `=`, sem aspas e sem espaços:

```
INSTAGRAM_ACCESS_TOKEN=IGAA...(token longo)
INSTAGRAM_USER_ID=17841400000000000
```

Depois copie os mesmos dois valores para os Secrets do repositório, em
**github.com/Killuaziin/squad-fs → Settings → Secrets and variables → Actions → New repository secret**:

| Nome do secret | Valor |
|---|---|
| `INSTAGRAM_ACCESS_TOKEN` | o token longo |
| `INSTAGRAM_USER_ID` | o ID numérico |

---

## Rota alternativa: Login do Facebook (clássica)

Use apenas se a rota acima não estiver disponível no painel.

1. No app, **menu esquerdo → Produtos → Adicionar produto → "Login do Facebook"** → Configurar.
2. Vá ao **Explorador da Graph API**: https://developers.facebook.com/tools/explorer/
3. À direita: em **App da Meta** escolha **FORA STABILE**; em **Usuário ou Página** deixe **Token de usuário**.
4. Em **Permissões**, adicione: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`, `business_management`.
5. Clique em **"Gerar token de acesso"**, autorize a Página e a conta do Instagram no popup.
6. Copie o token (`EAA...`). Ele dura ~1h — precisa ser trocado por um de 60 dias (o Claude faz isso com o App ID + App Secret).
7. O `INSTAGRAM_USER_ID` sai de: `GET /me/accounts` → pegar o ID da Página → `GET /{page-id}?fields=instagram_business_account`.

> Nesta rota o endpoint é `graph.facebook.com`; na rota recomendada é `graph.instagram.com`.
> O `publish-queue.mjs` precisa apontar para o certo — confira a constante `IG_BASE`.

---

## Como saber se o valor está certo

| Valor | Formato | Serve para publicar? |
|---|---|---|
| Token de acesso | `IGAA...` ou `EAA...`, **150+ caracteres** | ✅ sim |
| App Secret | 32 caracteres hexadecimais (`c457...`) | ❌ não (só renova token) |
| App Token | `2746407875732317\|Smg1...` (com barra vertical) | ❌ não (identifica o app) |
| IG User ID | número de ~17 dígitos | ✅ sim (é o ID, não o token) |

## Validação final

Com o `.env` preenchido, o Claude confirma que o token aponta para a conta certa:

```
GET https://graph.instagram.com/{ig-user-id}?fields=username&access_token={token}
```

Deve responder `"username": "forastabile"`. **Nunca publicar sem essa checagem** — este projeto nasceu de um clone que continha credenciais de outra conta.
