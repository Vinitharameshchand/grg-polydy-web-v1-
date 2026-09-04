/** Dev check: verify every local href/src in the HTML pages resolves. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
let bad = 0;
let checked = 0;

for (const page of pages) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));

  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(ref)) {
      if (ref.startsWith('#') && ref.length > 1 && !ids.has(ref.slice(1))) {
        console.log(`MISSING ANCHOR  ${page} -> ${ref}`);
        bad++;
      }
      continue;
    }
    checked++;
    const [file, hash] = ref.split('#');
    const target = path.join(ROOT, file);
    if (!fs.existsSync(target)) {
      console.log(`MISSING FILE    ${page} -> ${ref}`);
      bad++;
      continue;
    }
    if (hash && file.endsWith('.html')) {
      const targetHtml = fs.readFileSync(target, 'utf8');
      if (!new RegExp(`id="${hash}"`).test(targetHtml)) {
        console.log(`MISSING ANCHOR  ${page} -> ${ref}`);
        bad++;
      }
    }
  }
}

console.log(`\n${pages.length} pages, ${checked} local refs checked, ${bad} problem(s).`);
process.exit(bad ? 1 : 0);
