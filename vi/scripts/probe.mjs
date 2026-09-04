/**
 * Drives the built site in a real-time Chrome over the DevTools Protocol.
 *
 *   node scripts/probe.mjs [origin]
 *
 * Why not the iframe harness in audit.mjs: that runs under
 * `--virtual-time-budget`, which suppresses requestAnimationFrame entirely, so
 * anything rAF-driven (scroll progress, parallax, the process track) reads as
 * frozen. This connects to a normally-running browser instead, so scroll
 * animation can actually be observed.
 */
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ORIGIN = process.argv[2] || 'http://127.0.0.1:8091';
const PORT = 9333;

const CHROME =
  process.env.CHROME ||
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ].find((p) => existsSync(p));

if (!CHROME) {
  console.error('Chrome not found. Set CHROME=/path/to/chrome');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = await mkdtemp(join(tmpdir(), 'grg-probe-'));
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${PORT}`,
    '--window-size=1280,900',
    'about:blank'
  ],
  { stdio: 'ignore' }
);

/** Wait for the debugging endpoint to come up. */
async function endpoint() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (r.ok) return (await r.json()).webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error('Chrome debugging endpoint never became available');
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.sessionId = null;
    ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data);
      const p = this.pending.get(msg.id);
      if (p) {
        this.pending.delete(msg.id);
        msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
      }
    });
  }
  send(method, params = {}, useSession = true) {
    const id = ++this.id;
    const payload = { id, method, params };
    if (useSession && this.sessionId) payload.sessionId = this.sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  /** Evaluate an async expression in the page and return its value. */
  async eval(expression) {
    const r = await this.send('Runtime.evaluate', {
      expression: `(async () => { ${expression} })()`,
      awaitPromise: true,
      returnByValue: true
    });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || ''));
    return r.result.value;
  }
}

let cdp;
try {
  const wsUrl = await endpoint();
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', rej, { once: true });
  });
  cdp = new CDP(ws);

  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' }, false);
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true }, false);
  cdp.sessionId = sessionId;
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  const go = async (path) => {
    await cdp.send('Page.navigate', { url: ORIGIN + path });
    await sleep(2600);
  };

  console.log('=== rAF sanity ===');
  await go('/npd');
  console.log(
    '  rAF fires in this browser: ' +
      (await cdp.eval(
        `return await new Promise(r => { let d=false; requestAnimationFrame(()=>{d=true;r(true)}); setTimeout(()=>r(d),400); });`
      ))
  );

  console.log('\n=== PROCESS TRACK (scroll-linked fill) ===');
  const track = await cdp.eval(`
    const t = document.querySelector('.track');
    const f = document.querySelector('.track__fill');
    if (!t || !f) return { error: 'not found' };
    const top = t.getBoundingClientRect().top + scrollY;
    const out = [];
    for (const frac of [0, 0.35, 0.7, 1]) {
      scrollTo({ top: Math.round(top - 300 + t.offsetHeight * frac), behavior: 'instant' });
      await new Promise(r => setTimeout(r, 350));
      const m = getComputedStyle(f).transform.match(/matrix\\(([^)]+)\\)/);
      out.push({ y: Math.round(scrollY), scaleY: m ? +parseFloat(m[1].split(',')[3]).toFixed(3) : null });
    }
    return out;
  `);
  if (track.error) console.log('  ' + track.error);
  else {
    track.forEach((s) => console.log(`  scrollY ${String(s.y).padStart(5)} -> scaleY ${s.scaleY}`));
    const vals = track.map((s) => s.scaleY);
    const grows = vals[vals.length - 1] > vals[0] + 0.05;
    const monotonic = vals.every((v, i) => i === 0 || v >= vals[i - 1] - 0.02);
    console.log(`  fills as you scroll: ${grows}${grows ? '  ok' : '  <-- NOT ANIMATING'}`);
    console.log(`  never goes backwards: ${monotonic}`);
  }

  console.log('\n=== SCROLL PROGRESS BAR ===');
  const prog = await cdp.eval(`
    const el = document.querySelector('.progress span');
    const out = [];
    for (const f of [0, 0.5, 1]) {
      scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * f, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 350));
      out.push(getComputedStyle(el).getPropertyValue('--p').trim());
    }
    return out;
  `);
  console.log('  --p at 0% / 50% / 100% of page: ' + prog.join(' , '));

  console.log('\n=== SPLIT IMAGE PARALLAX ===');
  const par = await cdp.eval(`
    const el = document.querySelector('.split__shift');
    if (!el) return { error: 'no .split__shift' };
    const top = el.getBoundingClientRect().top + scrollY;
    const out = [];
    for (const d of [-200, 200, 600]) {
      scrollTo({ top: Math.max(0, Math.round(top + d)), behavior: 'instant' });
      await new Promise(r => setTimeout(r, 350));
      out.push(getComputedStyle(el).getPropertyValue('--py').trim() || '(unset)');
    }
    return out;
  `);
  console.log(par.error ? '  ' + par.error : '  --py as it passes: ' + par.join(' , '));

  console.log('\n=== BACK TO TOP ===');
  const tt = await cdp.eval(`
    const b = document.querySelector('.totop');
    scrollTo({ top: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 400));
    const atTop = b.className;
    scrollTo({ top: 2000, behavior: 'instant' }); await new Promise(r => setTimeout(r, 400));
    const scrolled = b.className;
    return { atTop, scrolled, tabTop: b.tabIndex };
  `);
  console.log('  class at top: "' + tt.atTop + '"  (should not contain is-in)');
  console.log('  class scrolled: "' + tt.scrolled + '"  (should contain is-in)');

  console.log('\n=== SECTION NAV SCROLL-SPY ===');
  await go('/capabilities');
  const spy = await cdp.eval(`
    const active = () => { const a = document.querySelector('.secnav__list a.is-active'); return a ? a.textContent.trim() : 'none'; };
    const out = [];
    for (const id of ['product-development','mould-making','metal-casting']) {
      const el = document.getElementById(id);
      scrollTo({ top: el.getBoundingClientRect().top + scrollY - 100, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 400));
      out.push(id + ' -> ' + active());
    }
    return out;
  `);
  spy.forEach((s) => console.log('  ' + s));

  console.log('\n=== SECTION NAV CLICK (smooth scroll to section) ===');
  const click = await cdp.eval(`
    const link = [...document.querySelectorAll('.secnav__list a')].find(a => a.textContent.trim() === 'Metal Casting');
    if (!link) return { error: 'link not found' };
    scrollTo({ top: 0, behavior: 'instant' });
    await new Promise(r => setTimeout(r, 300));
    link.click();
    await new Promise(r => setTimeout(r, 2200));
    const t = document.getElementById('metal-casting');
    return { offset: Math.round(t.getBoundingClientRect().top), y: Math.round(scrollY) };
  `);
  console.log(click.error ? '  ' + click.error :
    `  after click: scrollY ${click.y}, section ${click.offset}px from top` +
    (click.offset >= -5 && click.offset <= 150 ? '  ok' : '  <-- WRONG'));

  console.log('\n=== LIGHTBOX (keyboard + focus return) ===');
  await go('/facility');
  const lb = await cdp.eval(`
    const btn = document.querySelector('.shot__btn');
    btn.focus(); btn.click();
    await new Promise(r => setTimeout(r, 500));
    const dlg = document.querySelector('.lb');
    const opened = !!dlg;
    const focusIn = dlg ? dlg.contains(document.activeElement) : false;
    const locked = document.body.style.overflow === 'hidden';
    const c1 = document.querySelector('.lb__count')?.textContent.trim();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await new Promise(r => setTimeout(r, 350));
    const c2 = document.querySelector('.lb__count')?.textContent.trim();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise(r => setTimeout(r, 700));
    return {
      opened, focusIn, locked, c1, c2,
      closed: !document.querySelector('.lb'),
      released: document.body.style.overflow !== 'hidden',
      focusBack: document.activeElement === btn
    };
  `);
  console.log('  opens: ' + lb.opened + ', focus moves in: ' + lb.focusIn + ', scroll locked: ' + lb.locked);
  console.log('  counter ' + lb.c1 + ' -> ArrowRight -> ' + lb.c2);
  console.log('  Escape closes: ' + lb.closed + ', scroll released: ' + lb.released);
  console.log('  focus returned to tile: ' + lb.focusBack + (lb.focusBack ? '  ok' : '  <-- FOCUS LOST'));

  console.log('\n=== HERO SCROLL LAYERS ===');
  await go('/');
  const hero = await cdp.eval(`
    const copy = document.querySelector('.hero__copy');
    const grid = document.querySelector('.hero__rule');
    if (!copy || !grid) return { error: 'hero layers missing' };
    const out = [];
    for (const y of [0, 250, 600]) {
      scrollTo({ top: y, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 350));
      out.push({
        y,
        copy: getComputedStyle(copy).getPropertyValue('--sy').trim() || '0px',
        grid: getComputedStyle(grid).getPropertyValue('--sy').trim() || '0px'
      });
    }
    return out;
  `);
  if (hero.error) console.log('  ' + hero.error);
  else {
    hero.forEach(h => console.log(`  scrollY ${String(h.y).padStart(4)} -> copy ${h.copy.padStart(8)}  backdrop ${h.grid.padStart(8)}`));
    const moved = parseFloat(hero[2].copy) > 5 && parseFloat(hero[2].grid) > parseFloat(hero[2].copy);
    console.log('  layers drift at different rates: ' + moved + (moved ? '  ok' : '  <-- NOT WORKING'));
  }

  console.log('\n=== BACK TO TOP DOES NOT REVEAL THE SKIP LINK ===');
  const skip = await cdp.eval(`
    scrollTo({ top: 2500, behavior: 'instant' });
    await new Promise(r => setTimeout(r, 400));
    document.querySelector('.totop').click();
    await new Promise(r => setTimeout(r, 1200));
    const s = document.querySelector('.skip');
    const left = getComputedStyle(s).left;
    return { left, focused: document.activeElement === s, active: document.activeElement.id || document.activeElement.tagName };
  `);
  console.log('  skip link left: ' + skip.left + (parseInt(skip.left) < -1000 ? '  ok (off-screen)' : '  <-- VISIBLE'));
  console.log('  focus went to: ' + skip.active);

  console.log('\n=== TEXT ANIMATION ===');
  await go('/');
  const txt = await cdp.eval(`
    const h1 = document.querySelector('h1.at');
    if (!h1) return { error: 'no split heading found' };
    const words = h1.querySelectorAll('.at__w').length;
    const inner = h1.querySelector('.at__i');
    const anim = getComputedStyle(inner).animationName;
    const delayed = [...h1.querySelectorAll('.at__i')].map(e => getComputedStyle(e).animationDelay);
    return {
      words,
      label: h1.getAttribute('aria-label'),
            textContent: h1.textContent.split(String.fromCharCode(32)).filter(Boolean).join(String.fromCharCode(32)).trim(),
      piecesHidden: [...h1.querySelectorAll('.at__w')].every(e => e.getAttribute('aria-hidden') === 'true'),
      animation: anim,
      hasClassIn: h1.classList.contains('in'),
      staggered: delayed.slice(0, 4)
    };
  `);
  if (txt.error) console.log('  ' + txt.error);
  else {
    console.log('  heading split into ' + txt.words + ' words, animation: ' + txt.animation);
    console.log('  triggered (.in): ' + txt.hasClassIn + '   delays: ' + txt.staggered.join(', '));
    console.log('  aria-label: "' + txt.label + '"');
    console.log('  visible text: "' + txt.textContent + '"');
    console.log('  visible text matches label: ' + (txt.textContent === txt.label));
    console.log('  split pieces aria-hidden: ' + txt.piecesHidden);
  }

  console.log('\n=== SCROLL-LINKED PASSAGE ===');
  const sc = await cdp.eval(`
    const el = document.querySelector('.sc');
    if (!el) return { error: 'no .sc passage' };
    const top = el.getBoundingClientRect().top + scrollY;
    const readLit = () => {
      const ws = [...el.querySelectorAll('.sc__w')];
      const val = w => parseFloat(getComputedStyle(w).getPropertyValue('--lit')) || 0;
      return { first: val(ws[0]), mid: val(ws[Math.floor(ws.length/2)]), last: val(ws[ws.length-1]), n: ws.length };
    };
    const out = [];
    for (const d of [-400, 0, 400]) {
      scrollTo({ top: Math.max(0, Math.round(top - 300 + d)), behavior: 'instant' });
      await new Promise(r => setTimeout(r, 350));
      out.push({ y: Math.round(scrollY), ...readLit() });
    }
    return out;
  `);
  if (sc.error) console.log('  ' + sc.error);
  else {
    sc.forEach(s => console.log('  y=' + String(s.y).padStart(5) + '  first ' + s.first.toFixed(2) + '  mid ' + s.mid.toFixed(2) + '  last ' + s.last.toFixed(2)));
    const lights = sc[sc.length - 1].last > sc[0].last + 0.2;
    console.log('  words light up as you scroll: ' + lights + (lights ? '  ok' : '  <-- NOT WORKING'));
  }

  console.log('\n=== 3D TILT (synthetic pointer) ===');
  await go('/');
  const tilt = await cdp.eval(`
    const wrap = document.querySelector('.grid .tilt');
    if (!wrap) return { error: 'no .tilt wrapper on the service cards' };
    const card = wrap.firstElementChild;
    const r = wrap.getBoundingClientRect();
    scrollTo({ top: r.top + scrollY - 200, behavior: 'instant' });
    await new Promise(res => setTimeout(res, 300));
    const b = wrap.getBoundingClientRect();
    const fire = (type, x, y) => wrap.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, bubbles: true, pointerType: 'mouse' }));
    const read = () => ({
      rx: getComputedStyle(wrap).getPropertyValue('--rx').trim(),
      ry: getComputedStyle(wrap).getPropertyValue('--ry').trim(),
      gx: getComputedStyle(wrap).getPropertyValue('--gx').trim(),
      tilting: wrap.classList.contains('is-tilting'),
      matrix: getComputedStyle(card).transform
    });
    fire('pointerenter', b.left + b.width * 0.9, b.top + b.height * 0.2);
    fire('pointermove',  b.left + b.width * 0.9, b.top + b.height * 0.2);
    await new Promise(res => setTimeout(res, 250));
    const topRight = read();
    fire('pointermove',  b.left + b.width * 0.1, b.top + b.height * 0.85);
    await new Promise(res => setTimeout(res, 250));
    const bottomLeft = read();
    fire('pointerleave', 0, 0);
    await new Promise(res => setTimeout(res, 700));
    const after = read();
    const is3d = m => /matrix3d/.test(m);
    return { topRight, bottomLeft, after, is3d: is3d(topRight.matrix) };
  `);
  if (tilt.error) console.log('  ' + tilt.error);
  else {
    const t = tilt.topRight, b = tilt.bottomLeft, a = tilt.after;
    console.log(`  pointer top-right : rx ${t.rx}  ry ${t.ry}  glare-x ${t.gx}  tilting ${t.tilting}`);
    console.log(`  pointer bottom-left: rx ${b.rx}  ry ${b.ry}  glare-x ${b.gx}`);
    console.log('  card transform is a 3D matrix: ' + tilt.is3d);
    const flips = parseFloat(t.ry) > 0 && parseFloat(b.ry) < 0 && parseFloat(t.rx) > 0 && parseFloat(b.rx) < 0;
    console.log('  rotation follows the pointer across both axes: ' + flips + (flips ? '  ok' : '  <-- NOT TRACKING'));
    const reset = parseFloat(a.rx) === 0 && parseFloat(a.ry) === 0 && !a.tilting;
    console.log('  settles to 0deg on leave, class removed: ' + reset + (reset ? '  ok' : '  <-- STUCK'));
  }

  console.log('\n=== TOUCH DEVICE (emulated: hover none, pointer coarse) ===');
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await cdp.send('Emulation.setEmulatedMedia', { features: [
    { name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }
  ] });
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 485, height: 900, deviceScaleFactor: 2, mobile: true });
  await go('/');
  const touch = await cdp.eval(`
    const mq = matchMedia('(hover: none)').matches && matchMedia('(pointer: coarse)').matches;
    const panel = document.querySelector('.hero__panel');
    const wrap = panel && panel.parentElement;
    const cs = getComputedStyle(panel);
    const m = cs.transform;
    const is3d = /matrix3d/.test(m);
    const cells = [...panel.querySelectorAll('li')].map(li => li.getBoundingClientRect().height);
    const panelH = panel.getBoundingClientRect().height;
    const heroH = document.querySelector('.hero').getBoundingClientRect().height;
    // does a 3D-entrance card carry the tilted starting state before it is in view?
    const card = document.querySelector('.reveal--3d');
    const cardIn = card ? card.classList.contains('in') : null;
    // a Tilt wrapper must have attached no pointer tracking here
    wrap.dispatchEvent(new PointerEvent('pointerenter', { clientX: 10, clientY: 10, bubbles: true, pointerType: 'touch' }));
    await new Promise(r => setTimeout(r, 200));
    return {
      mq, is3d, matrix: m.slice(0, 60),
      panelH: Math.round(panelH), heroH: Math.round(heroH),
      cellH: cells.map(Math.round),
      tilting: wrap.classList.contains('is-tilting'),
      cardFound: !!card, cardIn
    };
  `);
  console.log('  media queries report touch: ' + touch.mq);
  console.log('  stat panel transform is 3D at rest: ' + touch.is3d + (touch.is3d ? '  ok (static 7° tilt)' : '  <-- FLAT'));
  console.log('  panel height ' + touch.panelH + 'px inside hero ' + touch.heroH + 'px; cells ' + touch.cellH.join('/') + 'px'
    + (touch.panelH < touch.heroH * 0.6 ? '  ok (sized to content)' : '  <-- STILL STRETCHED'));
  console.log('  pointer tracking attached on touch: ' + touch.tilting + (touch.tilting ? '  <-- SHOULD BE INERT' : '  ok (inert)'));
  console.log('  3D entrance variant present on cards: ' + touch.cardFound);
  await cdp.send('Emulation.clearDeviceMetricsOverride');
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await cdp.send('Emulation.setEmulatedMedia', { features: [] });
} finally {
  try {
    await cdp?.send('Browser.close', {}, false);
  } catch {
    /* already gone */
  }
  chrome.kill();
  await sleep(400);
  await rm(profile, { recursive: true, force: true });
}
