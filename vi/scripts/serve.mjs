/**
 * Static preview server for dist/ that mirrors production behaviour:
 * clean URLs, the real 404 document, and the security headers from _headers.
 *
 *   node scripts/serve.mjs [port]
 *
 * Vite's own preview does not apply the header policy, so use this when you
 * want to check the deployed experience (including CSP) locally.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.argv[2]) || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const SECURITY = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.google.com; form-action 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), payment=(), usb=()'
};

async function resolve(pathname) {
  // Block traversal outside dist.
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const candidates = [join(DIST, clean)];
  if (!extname(clean)) candidates.push(join(DIST, clean, 'index.html'));

  for (const c of candidates) {
    if (!c.startsWith(DIST)) continue;
    try {
      const s = await stat(c);
      if (s.isFile()) return c;
    } catch {
      /* keep looking */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = await resolve(url.pathname);
  let status = 200;

  if (!file) {
    file = join(DIST, '404.html');
    status = 404;
  }

  try {
    const body = await readFile(file);
    const headers = { ...SECURITY, 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' };
    if (/\/(assets|fonts|images\/gen)\//.test(url.pathname)) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else {
      headers['Cache-Control'] = 'public, max-age=0, must-revalidate';
    }
    res.writeHead(status, headers);
    res.end(body);
  } catch {
    res.writeHead(500, SECURITY);
    res.end('500');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`dist/ served with production headers at http://127.0.0.1:${PORT}`);
});
