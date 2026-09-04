/**
 * Renders every route to static HTML after the Vite client + SSR builds.
 *
 *   node scripts/prerender.mjs
 *
 * Each route becomes a real file (dist/about/index.html), so crawlers and
 * link previews get complete markup and correct per-page metadata without
 * executing JavaScript. The client then hydrates that markup in place.
 *
 * Also emits sitemap.xml, robots.txt and a 404.html.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

/** Canonical origin. Change here if the site moves. */
const SITE = process.env.SITE_URL || 'https://grgpolydynamics.com';

/* pathToFileURL: on Windows a bare absolute path is rejected by the ESM loader. */
const { render, routes } = await import(pathToFileURL(join(DIST, 'server', 'entry-server.js')).href);

const template = await readFile(join(DIST, 'index.html'), 'utf8');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Organisation data, emitted once on the home page. */
const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GRG Polydynamics Private Limited',
  alternateName: 'GRG Polydynamics',
  url: SITE + '/',
  logo: SITE + '/favicon.svg',
  image: SITE + '/images/gen/og-cover.jpg',
  foundingDate: '2011',
  description:
    'A process-driven, automotive-grade engineering and manufacturing company specialising in precision plastic injection moulding, metal casting, tooling transfer and new product development.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2/2A, Vallam A Village, Palnallur Village, Vallakottai, Sriperumbudur',
    addressLocality: 'Chennai',
    postalCode: '631604',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN'
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-8754453333',
      email: 'vkumar@grgpolydynamics.com',
      contactType: 'sales',
      areaServed: 'IN',
      availableLanguage: ['en', 'ta']
    }
  ],
  hasCredential: ['IATF 16949', 'ISO 14001:2015', 'SQ Mark', 'ESG Certificate']
};

function head({ path, title, description }) {
  const url = SITE + (path === '/' ? '/' : path);
  const tags = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="GRG Polydynamics" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}/images/gen/og-cover.jpg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="The GRG Polydynamics production floor at Sriperumbudur, Chennai" />`,
    `<meta name="twitter:card" content="summary_large_image" />`
  ];

  const ld =
    path === '/'
      ? orgLd
      : {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
            { '@type': 'ListItem', position: 2, name: title.split(/[—|]/)[0].trim(), item: url }
          ]
        };

  tags.push(
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`
  );
  return tags.join('\n    ');
}

function page(route, html) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(route.meta.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${esc(route.meta.description)}" />`
    )
    .replace('<!--app-head-->', head({ path: route.path, ...route.meta }))
    .replace('<div id="root">', '<div id="root" data-prerendered="true">')
    .replace('<!--app-html-->', html);
}

let count = 0;
for (const route of routes) {
  const html = render(route.path);
  const out = route.path === '/' ? join(DIST, 'index.html') : join(DIST, route.path.slice(1), 'index.html');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, page(route, html), 'utf8');
  console.log(`  ${route.path.padEnd(18)} -> ${out.replace(DIST, 'dist')}`);
  count++;
}

/* Unknown URLs: a real 404 document rather than the home page. */
const notFound = page(
  {
    path: '/404',
    meta: {
      title: 'Page not found — GRG Polydynamics',
      description: 'The page you requested does not exist.'
    }
  },
  render('/__not_found__')
);
await writeFile(join(DIST, '404.html'), notFound.replace('<link rel="canonical"', '<meta name="robots" content="noindex" />\n    <link rel="canonical"'), 'utf8');

/* sitemap.xml */
const today = new Date().toISOString().slice(0, 10);
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  routes
    .map(
      (r) =>
        `  <url><loc>${SITE}${r.path === '/' ? '/' : r.path}</loc>` +
        `<lastmod>${today}</lastmod>` +
        `<changefreq>monthly</changefreq>` +
        `<priority>${r.path === '/' ? '1.0' : '0.8'}</priority></url>`
    )
    .join('\n') +
  '\n</urlset>\n';
await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

await writeFile(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
  'utf8'
);

/* The SSR bundle is a build artefact, not something to deploy. */
await rm(join(DIST, 'server'), { recursive: true, force: true });

console.log(`\n${count} routes prerendered + 404.html, sitemap.xml, robots.txt`);
console.log(`canonical origin: ${SITE}`);
