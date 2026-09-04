/**
 * Verifies every external PDF linked from the built pages actually resolves.
 * Run: node assets/js/check-docs.js
 *
 * Use it after uploading a missing policy document, or after moving the PDFs
 * into assets/docs/ and changing DOC_BASE in content/sustainability.js.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.join(__dirname, '..', '..');

const urls = new Set();
fs.readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .forEach((f) => {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of html.matchAll(/href="(https?:\/\/[^"]+\.pdf)"/g)) {
      urls.add(m[1].replace(/&amp;/g, '&'));
    }
  });

const list = [...urls].sort();
if (!list.length) {
  console.log('No external PDF links found — nothing to check.');
  process.exit(0);
}

const head = (url) =>
  new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, { method: 'HEAD', timeout: 20000 }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        return resolve(head(new URL(res.headers.location, url).href));
      }
      res.resume();
      resolve(res.statusCode);
    });
    req.on('timeout', () => { req.destroy(); resolve('TIMEOUT'); });
    req.on('error', () => resolve('ERROR'));
    req.end();
  });

(async () => {
  let bad = 0;
  for (const url of list) {
    const status = await head(url);
    if (status !== 200) {
      console.log(`  ${status}  ${decodeURI(url)}`);
      bad++;
    }
  }
  console.log(`\n${list.length} document link(s) checked, ${bad} unreachable.`);
  process.exit(bad ? 1 : 0);
})();
