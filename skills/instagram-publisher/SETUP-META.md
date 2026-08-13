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

### Passo 3 — Liberar a permissão de publicação ⚠️

Abra **"Configuração da API com login do Instagram"** no submenu. O item 1 já vem com as permissões de
**mensagens** marcadas (`instagram_business_basic`, `manage_comments`, `manage_messages`), mas **falta a de publicar**.

Clique em **"Go to permissions and features"**, procure **`instagram_business_content_publish`** e clique em **"+ Adicionar"**.

> **A ordem importa:** o token guarda as permissões existentes **no momento em que foi gerado**.
> Se gerar antes de adicionar essa permissão, é preciso gerar o token de novo.

### Passo 4 — Dar a função de Testador à conta ⚠️

Sem isso o popup de login falha com *"Função de desenvolvedor é insuficiente"*.

1. Abra **https://developers.facebook.com/apps/2746407875732317/roles/roles/**
2. Em **"Testadores do Instagram"** → **"Adicionar pessoas"** → digite `forastabile` → enviar convite.
3. Entre no Instagram **como @forastabile** → *Configurações → Apps e sites → Convites de testador* → **Aceitar**.

### Passo 5 — Vincular a conta e gerar o token

De volta em **"Configuração da API com login do Instagram"**, item **"2. Gerar tokens de acesso"**:

1. Clique em **"Adicionar conta"** e faça login com o **@forastabile** (confira que o navegador não está
   logado em outra conta do Instagram, senão o popup pega a sessão errada).
2. A conta aparece numa tabela. Clique em **"Gerar token"** na linha dela.
3. Marque o checkbox. Aparece um **texto muito longo** (150+ caracteres, começa com `IGAA...`).
   **Esse é o `INSTAGRAM_ACCESS_TOKEN`.** Copie inteiro.

> O token gerado aqui já é de **longa duração (60 dias)**. Não precisa trocar por outro.

### Passo 6 — Descobrir o INSTAGRAM_USER_ID correto ⚠️

**Não use o ID que aparece na tabela do painel** (aquele que começa com `1784...`). Ele é o IGID da rota
do Facebook e retorna erro 100 nesta API. O ID certo vem da própria API:

```
GET https://graph.instagram.com/v21.0/me?fields=id,username&access_token={token}
```

O campo `id` da resposta é o `INSTAGRAM_USER_ID`. O `username` deve ser `forastabile`.

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

Três checagens antes de considerar o setup pronto:

```bash
# 1) O token é da conta certa? (deve responder username: forastabile)
curl "https://graph.instagram.com/v21.0/me?fields=id,username,account_type&access_token=$TOKEN"

# 2) O ID funciona no endpoint de mídia? (deve listar posts, não dar erro 100)
curl "https://graph.instagram.com/v21.0/$INSTAGRAM_USER_ID/media?limit=1&access_token=$TOKEN"

# 3) O token pode publicar? URL de imagem inválida de propósito:
#    se o erro falar da MÍDIA (código 9004), a permissão existe.
#    se falar de PERMISSÃO (código 10/200), falta instagram_business_content_publish.
curl -X POST "https://graph.instagram.com/v21.0/$INSTAGRAM_USER_ID/media?image_url=https://forastabile.com.br/teste.jpg&is_carousel_item=true&access_token=$TOKEN"
```

**Nunca publicar sem a checagem 1** — este projeto nasceu de um clone que continha credenciais de outra conta.

> `debug_token` não funciona nesta API (retorna "Application does not have permission"). Use a checagem 3 para inferir o escopo.

## Renovação (a cada ~60 dias)

Nesta rota dá para renovar sem refazer nada, desde que o token ainda esteja válido:

```
GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={token_atual}
```

Retorna um token novo com mais 60 dias. Atualize o `.env` **e** o secret do GitHub.
Se o token já tiver expirado, refaça os passos 5 e 6.

**Token atual gerado em:** 2026-08-13 → expira por volta de **2026-10-12**.
