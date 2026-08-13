#!/usr/bin/env node
// Publicador da fila — roda no GitHub Actions nos dias agendados.
// Le queue/manifest.json, escolhe o proximo post NAO publicado do tipo do dia,
// publica no Instagram (imagens servidas pelo raw.githubusercontent.com), marca como publicado e salva o manifest.
// Sem dependencias externas (usa fetch/FormData/Blob nativos do Node 18+).

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const MANIFEST = 'queue/manifest.json';
// API do Instagram com Login do Instagram (graph.instagram.com), nao a rota via Facebook.
// O INSTAGRAM_USER_ID e o id devolvido por GET /me nesta API, nao o IGID do painel.
const IG_BASE = 'https://graph.instagram.com/v21.0';

// ---- hospedagem de imagem: raw.githubusercontent.com (repositorio PUBLICO) ----
// O Instagram busca cada imagem por URL publica. Como as imagens ja estao
// commitadas no repositorio, servimos direto pelo CDN do GitHub (raw), sem
// upload e sem host de terceiros (catbox/tmpfiles/0x0 quebraram — 2026-07).
// Requisito: o repositorio precisa estar PUBLICO.
const REPO = process.env.GITHUB_REPOSITORY || 'Killuaziin/squad-fs';
const REF = process.env.GITHUB_SHA || process.env.RAW_REF || 'main';
function rawUrl(imagePath) {
  const clean = String(imagePath).replace(/\\/g, '/').replace(/^\.?\/+/, '');
  return `https://raw.githubusercontent.com/${REPO}/${REF}/${clean}`;
}
// Falha cedo, com mensagem clara, se o repo nao estiver publico ou a imagem sumir.
async function checkPublic(url) {
  const r = await fetch(url);
  const ct = r.headers.get('content-type') || '';
  if (r.status !== 200) {
    throw new Error(`imagem nao acessivel no raw (HTTP ${r.status}). O repositorio ${REPO} precisa estar PUBLICO e a imagem commitada no ref "${REF}". URL: ${url}`);
  }
  if (!/^image\//i.test(ct)) {
    throw new Error(`raw retornou content-type "${ct}" (esperado image/*). URL: ${url}`);
  }
}

// ---- Instagram Graph API ----
// Os parametros de POST vao no CORPO, nunca na query string: com legenda longa +
// varios filhos a URL passa de ~1600 caracteres e a API responde 200 com {"id":"0"},
// uma falha silenciosa que nao traz mensagem de erro.
async function postForm(path, params, token) {
  const body = new URLSearchParams({ ...params, access_token: token });
  const r = await fetch(`${IG_BASE}/${path}`, { method: 'POST', body });
  const text = await r.text();
  if (!r.ok) throw new Error(`POST ${path} ${r.status}: ${text}`);
  const id = JSON.parse(text).id;
  if (!id || id === '0') throw new Error(`POST ${path} devolveu id invalido: ${text}`);
  return id;
}

async function createChild(userId, imageUrl, token) {
  return postForm(`${userId}/media`, { image_url: imageUrl, is_carousel_item: 'true' }, token);
}
async function status(id, token) {
  const p = new URLSearchParams({ fields: 'status_code', access_token: token });
  const r = await fetch(`${IG_BASE}/${id}?${p}`);
  if (!r.ok) {
    const body = await r.text();
    // Container recem-criado leva alguns segundos para ficar consultavel e responde
    // 100/33 nesse intervalo. Tratamos como "ainda nao pronto", nao como falha.
    if (/"code":\s*100/.test(body) && /"error_subcode":\s*33/.test(body)) return null;
    throw new Error(`status ${r.status}: ${body}`);
  }
  return (await r.json()).status_code;
}
// metadata=1 e a unica forma de obter o error_message legivel de um container.
async function detalheErro(id, token) {
  try {
    const r = await fetch(`${IG_BASE}/${id}?metadata=1&access_token=${token}`);
    return (await r.json()).error_message || 'sem detalhe';
  } catch { return 'sem detalhe'; }
}

async function waitFinished(id, token, timeout = 90000) {
  if (!id) throw new Error('waitFinished chamado sem id de container');
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const s = await status(id, token); // null = container ainda nao consultavel
    if (s === 'FINISHED') return;
    if (s === 'ERROR') throw new Error(`container ${id} em ERROR: ${await detalheErro(id, token)}`);
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error(`container ${id} timeout`);
}
// O carrossel e a etapa fragil da API. Dois modos de falha ja observados:
//   1. responde 200 com {"id":"0"} enquanto os filhos ainda propagam (~15s);
//   2. aceita o container mas ele vai a ERROR com "retry creating a new container later"
//      quando a conta criou muitos containers em pouco tempo.
// Nos dois casos a saida e a mesma: esperar e montar um container novo.
// `children` vai como array JSON: a forma separada por virgula devolve {"id":"0"} de forma intermitente.
async function createCarouselReady(userId, children, caption, token) {
  let ultimoErro;
  for (let tentativa = 1; tentativa <= 5; tentativa++) {
    try {
      const id = await postForm(`${userId}/media`, { media_type: 'CAROUSEL', children: JSON.stringify(children), caption }, token);
      await waitFinished(id, token);
      return id;
    } catch (e) {
      ultimoErro = e;
      console.log(`  carrossel nao aceito (tentativa ${tentativa}/5): ${e.message}`);
      if (tentativa < 5) await new Promise(r => setTimeout(r, 30000));
    }
  }
  throw ultimoErro;
}
async function publishMedia(userId, creationId, token) {
  return postForm(`${userId}/media_publish`, { creation_id: creationId }, token);
}
async function permalink(mediaId, token) {
  const p = new URLSearchParams({ fields: 'permalink', access_token: token });
  const r = await fetch(`${IG_BASE}/${mediaId}?${p}`);
  if (!r.ok) return null;
  return (await r.json()).permalink ?? null;
}

// ---- main ----
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const USER = process.env.INSTAGRAM_USER_ID;
if (!TOKEN || !USER) { console.error('ERRO: faltam secrets INSTAGRAM_ACCESS_TOKEN / INSTAGRAM_USER_ID'); process.exit(1); }

const m = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const DRY = process.env.DRY_RUN === '1';
// FORCE_DATE (YYYY-MM-DD) permite forcar um dia especifico (testes ou repostar atrasados)
const today = process.env.FORCE_DATE || new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
const weekday = (process.env.FORCE_DATE ? new Date(process.env.FORCE_DATE + 'T12:00:00Z') : new Date()).getUTCDay(); // 0=Dom..6=Sab

// 1) Prioridade: post com DATA explicita marcada para hoje (one-off, ex.: sabado)
let post = m.posts.find(p => !p.published && p.date === today);
let type;

if (post) {
  // achou pela data
  type = post.type;
} else {
  // 2) Senao, pelo TIPO do dia da semana (posts sem data fixa)
  type = process.env.FORCE_TYPE || m.schedule[String(weekday)];
  if (!type) { console.log(`Hoje (dia ${weekday}) nao tem post agendado. Nada a fazer.`); process.exit(0); }
  post = m.posts.find(p => !p.published && p.type === type && !p.date);
  if (!post) { console.log(`Fila vazia para tipo "${type}". Reabasteca a fila. Nada publicado.`); process.exit(0); }
}

const dir = `queue/posts/${post.id}`;
const images = readdirSync(dir).filter(f => /^slide-\d+\.jpe?g$/i.test(f)).sort().map(f => `${dir}/${f}`);
if (images.length < 2) { console.error(`ERRO: post ${post.id} tem menos de 2 imagens`); process.exit(1); }
const caption = readFileSync(`${dir}/caption.txt`, 'utf8').trim();

console.log(`Publicando "${post.id}" (${type}) com ${images.length} imagens...`);
const urls = images.map(rawUrl);
await checkPublic(urls[0]); // valida acesso publico antes de chamar o Instagram
console.log(`  imagens servidas via raw.githubusercontent.com (${REPO} @ ${REF})`);
const children = [];
for (const u of urls) children.push(await createChild(USER, u, TOKEN));
for (const c of children) await waitFinished(c, TOKEN);
// Os filhos reportam FINISHED antes de estarem realmente referenciaveis pelo carrossel.
await new Promise(r => setTimeout(r, 15000));
const carousel = await createCarouselReady(USER, children, caption, TOKEN);

if (DRY) { console.log(`DRY RUN OK: tudo pronto, NAO publicado (post "${post.id}" segue na fila).`); process.exit(0); }

const id = await publishMedia(USER, carousel, TOKEN);
const link = await permalink(id, TOKEN);

post.published = true;
post.post_id = id;
post.url = link;
post.publishedAt = new Date().toISOString();
writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + '\n');
console.log(`PUBLICADO: ${link || id}`);
