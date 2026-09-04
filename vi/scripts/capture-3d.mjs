/**
 * Shows the 3D effects rather than asserting them: drives a real mouse over
 * each tilting element, screenshots it at rest and mid-tilt, records a video
 * of the pointer sweeping a card, and composes an annotated before/after sheet.
 *
 *   node scripts/capture-3d.mjs
 *
 * Output: artifacts/3d/*.png, artifacts/3d/sweep.webm, artifacts/3d/sheet.png
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'artifacts', '3d');
const ORIGIN = process.env.E2E_ORIGIN || 'http://127.0.0.1:8091';
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  recordVideo: { dir: OUT, size: { width: 1440, height: 900 } }
});
const page = await ctx.newPage();
await page.goto(ORIGIN + '/');
await page.waitForTimeout(2200);

/** Screenshot one element at rest and with the pointer at a corner. */
async function pair(name, selector, targetSel, corner = [0.88, 0.18], pad = 40) {
  const wrap = page.locator(selector).first();
  await wrap.scrollIntoViewIfNeeded();
  await page.evaluate(() => scrollBy(0, -120));
  await page.waitForTimeout(900);
  const box = await wrap.boundingBox();
  const clip = { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.width + pad * 2, height: box.height + pad * 2 };

  await page.mouse.move(5, 5);
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(OUT, `${name}-rest.png`), clip });

  await page.mouse.move(box.x + box.width * corner[0], box.y + box.height * corner[1], { steps: 12 });
  await page.waitForTimeout(350);
  const state = await page.locator(targetSel).first().evaluate((el, w) => {
    const wrapEl = el.closest('.tilt') || el.parentElement;
    return {
      rx: getComputedStyle(wrapEl).getPropertyValue('--rx').trim(),
      ry: getComputedStyle(wrapEl).getPropertyValue('--ry').trim(),
      matrix3d: /matrix3d/.test(getComputedStyle(el).transform)
    };
  });
  await page.screenshot({ path: join(OUT, `${name}-hover.png`), clip });
  await page.mouse.move(5, 5);
  console.log(`  ${name.padEnd(14)} hover: rx ${state.rx}  ry ${state.ry}  3D matrix ${state.matrix3d}`);
  return { name, state };
}

console.log('capturing rest / hover pairs');
const results = [];
results.push(await pair('service-card', '.grid .tilt', '.card', [0.9, 0.15]));
results.push(await pair('industry-tile', '.g4 .tilt', '.tile', [0.12, 0.85]));
results.push(await pair('hero-panel', '.hero__inner .tilt', '.hero__panel', [0.85, 0.2], 24));
await page.goto(ORIGIN + '/facility');
await page.waitForTimeout(2000);
results.push(await pair('gallery-tile', '.gallery .tilt', '.shot__btn', [0.85, 0.8]));

/* Video: sweep the pointer across a service card so the tilt and the glare are seen moving. */
console.log('recording pointer sweep');
await page.goto(ORIGIN + '/');
await page.waitForTimeout(2000);
const wrap = page.locator('.grid .tilt').first();
await wrap.scrollIntoViewIfNeeded();
await page.evaluate(() => scrollBy(0, -160));
await page.waitForTimeout(800);
const b = await wrap.boundingBox();
const path = [
  [0.05, 0.1], [0.5, 0.1], [0.95, 0.1], [0.95, 0.5], [0.95, 0.9], [0.5, 0.9], [0.05, 0.9], [0.05, 0.5], [0.5, 0.5]
];
await page.mouse.move(b.x - 60, b.y + b.height / 2, { steps: 8 });
for (const [fx, fy] of path) {
  await page.mouse.move(b.x + b.width * fx, b.y + b.height * fy, { steps: 22 });
  await page.waitForTimeout(140);
}
await page.mouse.move(b.x - 80, b.y + b.height / 2, { steps: 14 });
await page.waitForTimeout(900);

await ctx.close(); // flushes the video
await browser.close();

const vids = (await readdir(OUT)).filter((f) => f.endsWith('.webm'));
if (vids[0]) await rename(join(OUT, vids[0]), join(OUT, 'sweep.webm'));

/* Composite sheet: each row = element name | at rest | pointer hovering. */
console.log('composing sheet');
const label = (text, w, h = 40) =>
  Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="100%" height="100%" fill="#0b1e3f"/>` +
      `<text x="14" y="${h / 2 + 5}" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="600" fill="#fff">${text}</text></svg>`
  );
const rows = [];
let sheetW = 0;
for (const r of results) {
  const rest = sharp(join(OUT, `${r.name}-rest.png`));
  const hover = sharp(join(OUT, `${r.name}-hover.png`));
  const [mr, mh] = await Promise.all([rest.metadata(), hover.metadata()]);
  const h = Math.max(mr.height, mh.height);
  const w = mr.width + mh.width + 24;
  sheetW = Math.max(sheetW, w);
  const caption = `${r.name}   —   at rest (left)  /  pointer at corner (right):  rotateX ${r.state.rx}  rotateY ${r.state.ry}`;
  const row = await sharp({ create: { width: w, height: h + 40, channels: 4, background: '#dfe3e8' } })
    .composite([
      { input: label(caption, w), top: 0, left: 0 },
      { input: await rest.toBuffer(), top: 40, left: 0 },
      { input: await hover.toBuffer(), top: 40, left: mr.width + 24 }
    ])
    .png()
    .toBuffer();
  rows.push({ buf: row, w, h: h + 40 });
}
let y = 0;
const comps = [];
for (const r of rows) {
  comps.push({ input: r.buf, top: y, left: 0 });
  y += r.h + 16;
}
await sharp({ create: { width: sheetW, height: y, channels: 4, background: '#dfe3e8' } })
  .composite(comps)
  .png()
  .toFile(join(OUT, 'sheet.png'));

console.log(`\nwrote ${OUT}`);
for (const f of (await readdir(OUT)).sort()) console.log('  ' + f);
