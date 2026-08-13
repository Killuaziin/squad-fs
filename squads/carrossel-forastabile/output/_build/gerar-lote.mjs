// Gera um lote de posts na fila: renderiza os slides, escreve caption.txt e atualiza o manifest.
// Uso (da raiz do projeto): node squads/carrossel-forastabile/output/_build/gerar-lote.mjs <lote.json>
//
// Formato do lote.json:
// { "posts": [ { "id","type","title","date"(opcional),"slides":[...],"caption":"..." } ] }
//
// Posts SEM "date" sao escolhidos pelo tipo do dia da semana (queue/manifest.json > schedule).
// Posts COM "date" tem prioridade naquele dia (usar so para noticia urgente).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BUILD = dirname(fileURLToPath(import.meta.url));
const MANIFEST = 'queue/manifest.json';
const RENDER = `${BUILD}/render-forastabile.mjs`;

const lote = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const m = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const existentes = new Set(m.posts.map(p => p.id));

let gerados = 0, pulados = 0;
for (const post of lote.posts) {
  if (existentes.has(post.id)) { console.log(`JA EXISTE: ${post.id} (pulado)`); pulados++; continue; }
  if (post.slides.length < 2) { console.error(`ERRO: ${post.id} tem menos de 2 slides (carrossel exige 2+)`); process.exit(1); }

  const outDir = `queue/posts/${post.id}`;
  mkdirSync(outDir, { recursive: true });

  const cfgPath = `${BUILD}/_lote-${post.id}.json`;
  writeFileSync(cfgPath, JSON.stringify({ outDir, slides: post.slides }, null, 2));
  execFileSync('node', [RENDER, cfgPath], { stdio: 'inherit' });

  writeFileSync(`${outDir}/caption.txt`, post.caption.trim() + '\n');

  const entrada = { id: post.id, type: post.type, title: post.title, published: false, url: null };
  if (post.date) entrada.date = post.date;
  m.posts.push(entrada);
  existentes.add(post.id);
  gerados++;
  console.log(`OK: ${post.id} (${post.type}, ${post.slides.length} slides)`);
}

writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + '\n');

const pendentes = m.posts.filter(p => !p.published);
const porTipo = {};
for (const p of pendentes) porTipo[p.type] = (porTipo[p.type] || 0) + 1;
console.log(`\ngerados: ${gerados} | pulados: ${pulados}`);
console.log(`fila pendente: ${pendentes.length} posts`, porTipo);
