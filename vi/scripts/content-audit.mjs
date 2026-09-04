/**
 * Content audit: finds text repeated across the built pages, and reports the
 * word count of each one.
 *
 *   npm run build && node scripts/content-audit.mjs
 *
 * Repetition is measured on the rendered text, not the source, so it catches
 * duplication that comes from shared components as well as copy-paste.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

/** Strip tags, scripts and the shared chrome so pages compare on their own copy. */
function textOf(html, { includeChrome = false } = {}) {
  let s = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ');
  if (!includeChrome) {
    s = s.replace(/<footer[\s\S]*?<\/footer>/g, ' ').replace(/<header[\s\S]*?<\/header>/g, ' ');
  }
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const sentences = (t) =>
  t
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.split(' ').length >= 6);

const pages = [];
for (const entry of await readdir(DIST, { withFileTypes: true })) {
  if (entry.isDirectory() && entry.name !== 'assets' && entry.name !== 'images' && entry.name !== 'fonts') {
    pages.push(['/' + entry.name, join(DIST, entry.name, 'index.html')]);
  }
}
pages.unshift(['/', join(DIST, 'index.html')]);

const bodies = new Map();
for (const [route, file] of pages) {
  bodies.set(route, textOf(await readFile(file, 'utf8')));
}

console.log('=== WORDS PER PAGE (excluding header/footer) ===');
let total = 0;
for (const [route, text] of bodies) {
  const n = text.split(' ').filter(Boolean).length;
  total += n;
  console.log(`  ${route.padEnd(18)} ${String(n).padStart(5)} words`);
}
console.log(`  ${'TOTAL'.padEnd(18)} ${String(total).padStart(5)} words`);

console.log('\n=== SENTENCES APPEARING ON MORE THAN ONE PAGE ===');
const index = new Map();
for (const [route, text] of bodies) {
  for (const s of new Set(sentences(text))) {
    if (!index.has(s)) index.set(s, []);
    index.get(s).push(route);
  }
}
const dupes = [...index.entries()].filter(([, routes]) => routes.length > 1).sort((a, b) => b[1].length - a[1].length);
if (!dupes.length) console.log('  none');
for (const [s, routes] of dupes) {
  console.log(`\n  ${routes.length}x  ${routes.join(', ')}`);
  console.log(`      "${s.slice(0, 150)}${s.length > 150 ? '…' : ''}"`);
}

console.log('\n=== REPEATED PHRASES (6+ words, 3+ occurrences anywhere) ===');
const all = [...bodies.values()].join(' ');
const words = all.split(' ');
const grams = new Map();
for (let i = 0; i + 6 <= words.length; i++) {
  const g = words.slice(i, i + 6).join(' ');
  grams.set(g, (grams.get(g) || 0) + 1);
}
const top = [...grams.entries()]
  .filter(([g, n]) => n >= 3 && /[a-z]/i.test(g))
  .sort((a, b) => b[1] - a[1])
  .slice(0, 14);
for (const [g, n] of top) console.log(`  ${String(n).padStart(2)}x  "${g}"`);
