// Renderizador de carrossel Forastabile (estética de faixa: Anton + Raleway, preto/branco/vermelho).
// Uso (da raiz do projeto): node squads/carrossel-forastabile/output/_build/render-forastabile.mjs <config.json>
//
// config.json:
// {
//   "outDir": "queue/posts/meu-post",
//   "slides": [
//     { "tipo": "stat",    "stat": "R$ 41,4 MI", "statCor": "vermelho", "body": "Foi isso que a Fiel doou na vaquinha da Arena.", "credito": "Fonte: Lance · CNN" },
//     { "tipo": "faixa",   "headline": "BASTA DE\nAMADORISMO", "body": "opcional", "credito": "" },
//     { "tipo": "fato",    "numero": "03", "headline": "O PRESIDENTE É INVESTIGADO PELO MP", "body": "Empresas de segurança contratadas sem concorrência.", "credito": "Fonte: Terra · jun/2026" },
//     { "tipo": "noticia", "tarja": "11/08/2026 · DGABC", "headline": "MP INVESTIGA SEGURANÇA PESSOAL PAGA PELO CLUBE", "body": "resumo", "credito": "Fonte: DGABC · 11/08/2026" },
//     { "tipo": "cta",     "headline": "ASSINE O MANIFESTO", "body": "Leva 1 minuto. Link na bio." }
//   ]
// }
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const BUILD = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const OUT = cfg.outDir;
mkdirSync(OUT, { recursive: true });

const PRETO = '#000000', PAINEL = '#141414', COSTURA = '#2a2a2a', CINZA = '#9d9d9d', BRANCO = '#ffffff', VERMELHO = '#c8102e';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const nl = s => esc(s).replace(/\n/g, '<br>');
const TOTAL = cfg.slides.length;

const dots = a => `<div class="dots">${Array.from({ length: TOTAL }, (_, i) => `<span class="dot${i + 1 === a ? ' on' : ''}"></span>`).join('')}</div>`;
const seta = () => `<span class="sw">ARRASTE <svg width="46" height="20" viewBox="0 0 46 20"><path d="M2 10 H38 M30 3 L40 10 L30 17" stroke="${VERMELHO}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1350px}
.stage{width:1080px;height:1350px;background:${PRETO};position:relative;overflow:hidden;color:${BRANCO};display:flex;flex-direction:column;padding:70px 72px 60px}
.anton{font-family:'Anton';text-transform:uppercase;letter-spacing:1px;line-height:1.06}
.ral{font-family:'Raleway'}
.head{display:flex;align-items:center;justify-content:space-between}
.rule{height:6px;width:130px;background:${VERMELHO}}
.dots{display:flex;gap:9px}.dot{width:9px;height:9px;border-radius:50%;background:#3a3a3a}.dot.on{background:${VERMELHO};width:28px;border-radius:6px}
.mid{flex:1;display:flex;flex-direction:column;justify-content:center;gap:44px}
.bloco{background:${BRANCO};color:${PRETO};padding:38px 44px;align-self:flex-start;transform:rotate(-0.6deg)}
.bloco.alt{transform:rotate(0.6deg)}
.bloco .anton{font-size:96px;line-height:1.04}
.tarja{background:${VERMELHO};color:${BRANCO};padding:16px 30px;align-self:flex-start;font-family:'Raleway';font-weight:800;font-size:28px;letter-spacing:3px;text-transform:uppercase;transform:rotate(-0.6deg)}
.stat{font-family:'Anton';font-size:200px;line-height:1;letter-spacing:2px}
.stat.vermelho{color:${VERMELHO}}
.stat.branco{color:${BRANCO}}
.body{font-family:'Raleway';font-weight:600;font-size:38px;line-height:1.45;color:${BRANCO};max-width:900px}
.body em{font-style:italic}
.painel{background:${PAINEL};border:2px solid ${COSTURA};padding:56px 60px;display:flex;flex-direction:column;gap:30px}
.numero{font-family:'Anton';font-size:120px;color:${VERMELHO};line-height:1}
.h-fato{font-family:'Anton';font-size:76px;line-height:1.08;text-transform:uppercase}
.h-noticia{font-family:'Anton';font-size:84px;line-height:1.08;text-transform:uppercase}
.h-cta{font-family:'Anton';font-size:120px;line-height:1.05;text-transform:uppercase}
.credito{font-family:'Raleway';font-weight:600;font-size:24px;color:${CINZA};margin-top:36px}
.foot{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:40px}
.wordmark{font-family:'Anton';font-size:30px;letter-spacing:2px;color:${BRANCO}}
.wordmark b{color:${VERMELHO};font-weight:normal}
.sw{font-family:'Raleway';font-weight:800;font-size:22px;color:${CINZA};display:inline-flex;align-items:center;gap:12px;letter-spacing:2px}
.site{font-family:'Raleway';font-weight:800;font-size:34px;color:${BRANCO};letter-spacing:1px}
.disclaimer{font-family:'Raleway';font-weight:400;font-size:20px;color:${CINZA};line-height:1.5}
`;

function corpo(s) {
  switch (s.tipo) {
    case 'faixa': {
      const blocos = String(s.headline ?? '').split('\n').map((l, i) =>
        `<div class="bloco${i % 2 ? ' alt' : ''}"><div class="anton">${esc(l)}</div></div>`).join('');
      return `<div class="mid"><div style="display:flex;flex-direction:column;gap:18px">${blocos}</div>
        ${s.body ? `<p class="body">${nl(s.body)}</p>` : ''}
        ${s.credito ? `<div class="credito">${esc(s.credito)}</div>` : ''}</div>`;
    }
    case 'stat':
      return `<div class="mid">${s.tarja ? `<div class="tarja">${esc(s.tarja)}</div>` : ''}
        <div class="stat ${s.statCor === 'vermelho' ? 'vermelho' : 'branco'}">${nl(s.stat)}</div>
        ${s.body ? `<p class="body">${nl(s.body)}</p>` : ''}
        ${s.credito ? `<div class="credito">${esc(s.credito)}</div>` : ''}</div>`;
    case 'fato':
      return `<div class="mid"><div class="painel">
        ${s.numero ? `<div class="numero">${esc(s.numero)}</div>` : ''}
        <div class="h-fato">${nl(s.headline)}</div>
        ${s.body ? `<p class="body">${nl(s.body)}</p>` : ''}
        ${s.credito ? `<div class="credito" style="margin-top:6px">${esc(s.credito)}</div>` : ''}
        </div></div>`;
    case 'noticia':
      return `<div class="mid">${s.tarja ? `<div class="tarja">${esc(s.tarja)}</div>` : ''}
        <div class="h-noticia">${nl(s.headline)}</div>
        ${s.body ? `<p class="body">${nl(s.body)}</p>` : ''}
        ${s.credito ? `<div class="credito">${esc(s.credito)}</div>` : ''}</div>`;
    case 'cta':
      return `<div class="mid"><div class="rule" style="width:180px"></div>
        <div class="h-cta">${nl(s.headline ?? 'ASSINE O MANIFESTO')}</div>
        ${s.body ? `<p class="body">${nl(s.body)}</p>` : ''}
        <div class="site">forastabile.com.br</div>
        <p class="disclaimer">${esc(s.disclaimer ?? 'Movimento independente de torcedores. Sem vínculo com o clube, com organizadas ou com candidatos.')}</p></div>`;
    default:
      throw new Error(`tipo de slide desconhecido: ${s.tipo}`);
  }
}

function render(s, n) {
  const isLast = n === TOTAL;
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Raleway:ital,wght@0,400;0,600;0,800;1,400;1,600&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body><div class="stage">
  <div class="head"><div class="rule"></div>${dots(n)}</div>
  ${corpo(s)}
  <div class="foot"><span class="wordmark"><b>#</b>FORASTABILE</span>${isLast ? '' : seta()}</div>
</div></body></html>`;
}

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
let n = 0;
for (const s of cfg.slides) {
  n++;
  const tmp = `${BUILD}/_s${n}.html`;
  writeFileSync(tmp, render(s, n));
  await page.goto('file:///' + tmp.replace(/\\/g, '/'));
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/slide-0${n}.jpg`, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  console.log('ok', n);
}
await browser.close(); console.log('DONE', OUT);
