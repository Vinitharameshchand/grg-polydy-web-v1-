/**
 * Browser audit: drives the built site in a real Chrome and reports on
 * images, colour contrast, keyboard handling, anchor navigation and headings.
 *
 *   npm run build && node scripts/serve.mjs 8091 &   (or any static server)
 *   npm run audit:a11y
 *
 * The harness is written into dist/ for the run and removed afterwards. It
 * needs a server WITHOUT `frame-ancestors 'none'` because it drives the site
 * in an iframe — use `python -m http.server` or pass --plain to serve.mjs.
 */
import { writeFile, rm, mkdtemp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const ORIGIN = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:8091';

const CHROME =
  process.env.CHROME ||
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ].find((p) => existsSync(p)); // `require` is not available in an ES module

const SCRIPT = String.raw`
const out=[];const log=s=>out.push(s);
const flush=()=>document.getElementById('out').textContent=out.join('\n');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const f=document.getElementById('f');
function nav(url){return new Promise(res=>{const on=()=>{f.removeEventListener('load',on);
  setTimeout(()=>res({doc:f.contentDocument,win:f.contentWindow}),1500);};
  f.addEventListener('load',on);f.contentWindow.location.href=url;});}
function lum(c){const a=c.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});
  return .2126*a[0]+.7152*a[1]+.0722*a[2];}
const parse=s=>{const m=String(s).match(/(\d+),\s*(\d+),\s*(\d+)/);return m?[+m[1],+m[2],+m[3]]:null;};
function ratio(a,b){const l1=lum(a),l2=lum(b);const[h,lo]=l1>l2?[l1,l2]:[l2,l1];return (h+.05)/(lo+.05);}
/* Walk ancestors for a paint source. A gradient reports backgroundColor
   transparent, so read the gradient's first colour stop instead. */
function groundOf(el,win,doc){const own=win.getComputedStyle(el);const clip=(own.webkitBackgroundClip||own.backgroundClip)==='text';
  let n=clip?el.parentElement:el;while(n&&n!==doc.documentElement){const cs=win.getComputedStyle(n);
  const bi=cs.backgroundImage;
  if(bi&&bi!=='none'){const m=bi.match(/rgba?\([^)]+\)/g)||[];
    /* Ignore translucent stops (a glass tint) just as translucent colours are
       ignored below; only an opaque stop is a real ground. */
    const opaque=m.filter(c=>{const a=c.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/);return !a||parseFloat(a[1])>=0.5;});
    if(opaque.length){const c=parse(opaque[opaque.length-1]);if(c)return c;}}
  const bc=cs.backgroundColor;
  /* A translucent tint (e.g. a glass card at 4% white) is not the ground the
     text sits on; keep walking to the opaque surface beneath it. */
  const a=bc&&bc.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/);
  const alpha=a?parseFloat(a[1]):(bc&&bc.startsWith('rgb(')?1:0);
  if(bc&&alpha>=0.5)return parse(bc);
  n=n.parentElement;}return [255,255,255];}
function contrast(doc,win,list){let fails=0;
  for(const[sel,name]of list){const el=doc.querySelector(sel);if(!el){log('  --   (absent) '+name);continue;}
    const cs=win.getComputedStyle(el);let fg=parse(cs.color);
    const bg=groundOf(el,win,doc);let r;
    /* Gradient text is color:transparent with the ramp in background-image.
       Test every stop and report the worst one. */
    const clipText=(cs.webkitBackgroundClip||cs.backgroundClip)==='text';
    if(clipText){const stops=(cs.backgroundImage.match(/rgba?\([^)]+\)/g)||[]).map(parse).filter(Boolean);
      if(!stops.length)continue; r=Math.min(...stops.map(c=>ratio(c,bg))); fg=stops[0];}
    else{ if(!fg)continue; r=ratio(fg,bg);}
    const size=parseFloat(cs.fontSize);
    const bold=(parseInt(cs.fontWeight,10)||400)>=700;
    const need=(size>=24||(size>=18.66&&bold))?3:4.5;const ok=r>=need;if(!ok)fails++;
    log('  '+(ok?'ok  ':'FAIL')+' '+r.toFixed(2)+':1 (need '+need+') '+size.toFixed(1)+'px  '+name+(clipText?'  [gradient text, worst stop]':''));}
  return fails;}

async function main(){
  let {doc,win}=await nav('/');
  log('=== IMAGES (home @390) ===');
  const imgs=[...doc.images];
  const broken=imgs.filter(i=>i.complete&&i.naturalWidth===0);
  log('  images '+imgs.length+', failed '+broken.length);
  broken.forEach(b=>log('    BROKEN '+(b.currentSrc||b.src)));
  const picked=imgs.filter(i=>i.currentSrc).map(i=>i.currentSrc.split('/').pop());
  log('  webp '+picked.filter(s=>s.endsWith('.webp')).length+'/'+picked.length);
  let over=0;imgs.forEach(im=>{if(im.naturalWidth&&im.clientWidth&&im.naturalWidth/(im.clientWidth*2)>1.4)over++;});
  log('  oversized deliveries '+over);

  log('\n=== CONTRAST ===');
  let fails=contrast(doc,win,[['.hero--dark .display','hero headline'],['.hero--dark .lead','hero lead'],
    ['.hero--dark .label','hero eyebrow (amber)'],['.hero__panel strong','hero stat'],['.hero__panel li > span','hero stat label'],
    ['.btn--accent','amber button'],['.card__num','card number (amber ramp on navy)'],['.card p','card copy'],
    ['.label','label'],['.ticker__item','ticker'],
    ['.shot figcaption','caption'],['.row__body p','row body'],['.hero__meta li > span','stat label'],
    ['.footer p','footer body'],['.footer li a','footer link'],['.footer__badges li','footer badge'],
    ['.footer__bottom span','footer legal'],['.footer address','footer address']]);
  log('  TOTAL FAILURES: '+fails);

  log('\n=== DRAWER / KEYBOARD ===');
  const drawer=doc.querySelector('.drawer');
  const links=drawer.querySelectorAll('a[href]');let reach=0;
  links.forEach(el=>{el.focus();if(doc.activeElement===el)reach++;});
  log('  closed: '+links.length+' links, focusable '+reach+(reach===0?'  ok (inert)':'  <-- REACHABLE'));
  const burger=doc.querySelector('.burger');burger.focus();burger.click();await wait(700);
  log('  opened, inert removed: '+!drawer.hasAttribute('inert'));
  log('  focus in drawer: '+drawer.contains(doc.activeElement)+' ('+(doc.activeElement.tagName||'')+')');
  doc.dispatchEvent(new win.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await wait(800);
  log('  Escape closed: '+!drawer.classList.contains('is-open'));
  log('  focus restored to burger: '+(doc.activeElement===burger));

  log('\n=== ANCHOR NAV (same page) ===');
  ({doc,win}=await nav('/capabilities'));
  /* Index rows removed as duplicate navigation; the sticky nav is the in-page nav now. */
  const row=doc.querySelector('.secnav__list a');
  log('  href '+(row?row.getAttribute('href'):'none'));
  if(row){row.click();await wait(2500);
    log('  url '+win.location.pathname+win.location.hash);
    log('  404? '+/does not exist/i.test(doc.body.innerText.slice(0,600)));
    const t=doc.getElementById('product-development');
    const off=t?Math.round(t.getBoundingClientRect().top):null;
    log('  scrollY '+Math.round(win.scrollY)+', target offset '+off+'px'+((off!==null&&off>=-5&&off<=150)?'  ok':'  <-- WRONG'));}

  log('\n=== DEEP LINK (cross page) ===');
  ({doc,win}=await nav('/'));
  const fl=[...doc.querySelectorAll('.footer a')].find(a=>(a.getAttribute('href')||'').includes('metal-casting'));
  if(fl){fl.click();await wait(3000);
    log('  url '+win.location.pathname+win.location.hash);
    const t=doc.getElementById('metal-casting');
    const off=t?Math.round(t.getBoundingClientRect().top):null;
    log('  scrollY '+Math.round(win.scrollY)+', target offset '+off+'px'+((off!==null&&off>=-5&&off<=150)?'  ok':'  <-- WRONG'));}

  log('\n=== HEADINGS ===');
  const hs=[...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h=>+h.tagName[1]);
  log('  h1 count '+hs.filter(n=>n===1).length);
  let jump='none';for(let i=1;i<hs.length;i++)if(hs[i]-hs[i-1]>1){jump=hs[i-1]+' -> '+hs[i];break;}
  log('  skipped level: '+jump);
  flush();
}
window.addEventListener('unhandledrejection',e=>{log('\nREJECTION: '+(e.reason&&e.reason.stack||e.reason));flush();});
window.onerror=(m,s,l)=>{log('\nERROR: '+m+' @'+l);flush();};
main().catch(e=>{log('\nCAUGHT: '+(e&&e.stack||e));flush();});
`;

const HTML = `<!doctype html><meta charset="utf-8"><title>audit</title>
<body style="font:13px/1.5 monospace;white-space:pre-wrap;padding:12px">
<div id="out">running…</div>
<iframe id="f" src="about:blank" style="width:390px;height:780px;border:0;position:absolute;left:-9999px"></iframe>
<script src="/_audit.js"></script></body>`;

if (!CHROME) {
  console.error('Chrome not found. Set CHROME=/path/to/chrome');
  process.exit(1);
}

await writeFile(join(DIST, '_audit.html'), HTML, 'utf8');
await writeFile(join(DIST, '_audit.js'), SCRIPT, 'utf8');

const profile = await mkdtemp(join(tmpdir(), 'grg-audit-'));
try {
  const { stdout } = await run(
    CHROME,
    [
      '--headless',
      '--disable-gpu',
      '--no-first-run',
      `--user-data-dir=${profile}`,
      '--window-size=1400,1000',
      '--dump-dom',
      '--virtual-time-budget=45000',
      `${ORIGIN}/_audit.html`
    ],
    { maxBuffer: 64 * 1024 * 1024 }
  );
  const m = stdout.match(/<div id="out">([\s\S]*?)<\/div>/);
  const text = m
    ? m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#39;/g, "'")
    : 'no output captured';
  console.log(text);
  const failed = /FAIL|BROKEN|REACHABLE|WRONG|ERROR|CAUGHT/.test(text);
  process.exitCode = failed ? 1 : 0;
} finally {
  await rm(join(DIST, '_audit.html'), { force: true });
  await rm(join(DIST, '_audit.js'), { force: true });
  await rm(profile, { recursive: true, force: true });
}
