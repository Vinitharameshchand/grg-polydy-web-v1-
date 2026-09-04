/**
 * GRG Polydynamics — static site builder.
 *
 *   node build.js
 *
 * Renders every module in content/ into a standalone .html file at the project
 * root, wrapping it in the shared <head>, header, footer and structured data.
 * Edit content/*.js — never the generated .html files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE_URL = 'https://grgpolydynamics.com';

const COMPANY = {
  legalName: 'GRG Polydynamics Private Limited',
  shortName: 'GRG Polydynamics',
  tagline: 'Precision Plastic Injection Moulding',
  street: '2/2A, Vallam A Village, Palnallur Village',
  locality: 'Vallakottai, Sriperumbudur',
  city: 'Chennai',
  postalCode: '631604',
  region: 'Tamil Nadu',
  country: 'India',
  phonePrimary: '+91 87544 53333',
  phonePrimaryHref: '+918754453333',
  phoneSecondary: '+91 93808 82221',
  phoneSecondaryHref: '+919380882221',
  whatsapp: 'https://api.whatsapp.com/send/?phone=919380882221',
  email: 'vkumar@grgpolydynamics.com',
  founded: '2011'
};

/* Order defines the primary navigation. `nav: false` keeps a page out of it. */
const PAGES = [
  'home',
  'about',
  'capabilities',
  'industries',
  'npd',
  'quality',
  'sustainability',
  'media',
  'contact'
];

const pages = PAGES.map((name) => {
  const mod = require(path.join(ROOT, 'content', name + '.js'));
  return Object.assign({ name }, typeof mod === 'function' ? mod(COMPANY) : mod);
});

/* ---------------------------------------------------------------- partials */

function navLinks(current) {
  return pages
    .filter((p) => p.nav !== false)
    .map((p) => {
      const active = p.file === current ? ' class="is-active" aria-current="page"' : '';
      return `      <a href="${p.file}"${active}>${p.nav}</a>`;
    })
    .join('\n');
}

const brand = (extraClass = '') => `<a class="brand${extraClass}" href="index.html">
      <img class="brand__mark" src="assets/img/logo-mark.svg" alt="" width="38" height="38">
      <span class="brand__name">GRG Polydynamics
        <span class="brand__sub">${COMPANY.tagline}</span>
      </span>
    </a>`;

function header(current) {
  return `<div class="topbar">
  <div class="wrap topbar__inner">
    <p class="topbar__note">Plastics division established ${COMPANY.founded} &middot; IATF 16949 &amp; ISO 14001:2015 certified</p>
    <div class="topbar__links">
      <a href="tel:${COMPANY.phonePrimaryHref}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4.5 3.5h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15.5 13.5l5 2v4a1.5 1.5 0 0 1-1.7 1.5A17 17 0 0 1 3 5.2 1.5 1.5 0 0 1 4.5 3.5z"/></svg>
        ${COMPANY.phonePrimary}
      </a>
      <a href="mailto:${COMPANY.email}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 5h18v14H3z"/><path d="m3 6 9 7 9-7"/></svg>
        ${COMPANY.email}
      </a>
    </div>
  </div>
</div>

<header class="site-header">
  <div class="wrap nav">
    ${brand()}
    <nav class="nav__links" id="primary-nav" aria-label="Primary">
${navLinks(current)}
    </nav>
    <div class="nav__cta">
      <a class="btn btn--primary" href="contact.html">Request a Quote</a>
      <button class="nav__toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav"><span></span></button>
    </div>
  </div>
</header>`;
}

const footer = `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        ${brand()}
        <p>A process-driven, automotive-grade engineering and manufacturing company specialising in
          precision plastic injection moulding, metal casting, tooling transfer and new product
          development solutions.</p>
        <ul class="footer-badges">
          <li>IATF 16949</li>
          <li>ISO 14001:2015</li>
          <li>SQ Mark</li>
          <li>ESG</li>
        </ul>
      </div>
      <div>
        <h4 class="footer-h">Company</h4>
        <ul class="footer-list">
          <li><a href="about.html">About Us</a></li>
          <li><a href="industries.html">Industries Served</a></li>
          <li><a href="quality.html">Quality &amp; Certifications</a></li>
          <li><a href="sustainability.html">Sustainability &amp; Policies</a></li>
          <li><a href="media.html">Facility &amp; Media</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-h">Capabilities</h4>
        <ul class="footer-list">
          <li><a href="capabilities.html#injection-moulding">Injection Moulding</a></li>
          <li><a href="capabilities.html#mould-making">Mould Making</a></li>
          <li><a href="capabilities.html#finishing">Painting &amp; Printing</a></li>
          <li><a href="capabilities.html#metal-casting">Metal Casting</a></li>
          <li><a href="capabilities.html#tooling-transfer">Tooling Transfer</a></li>
          <li><a href="npd.html">New Product Development</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-h">Contact</h4>
        <address class="footer-address">
          ${COMPANY.legalName}<br>
          ${COMPANY.street},<br>
          ${COMPANY.locality},<br>
          ${COMPANY.city} &ndash; ${COMPANY.postalCode},<br>
          ${COMPANY.region}, ${COMPANY.country}
        </address>
        <ul class="footer-list mt-16">
          <li><a href="tel:${COMPANY.phonePrimaryHref}">${COMPANY.phonePrimary}</a></li>
          <li><a href="tel:${COMPANY.phoneSecondaryHref}">${COMPANY.phoneSecondary}</a></li>
          <li><a href="mailto:${COMPANY.email}">${COMPANY.email}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span data-year>2026</span> ${COMPANY.legalName}. All rights reserved.</span>
      <span class="footer-bottom__note">No child labour is employed at ${COMPANY.legalName}.</span>
    </div>
  </div>
</footer>

<a class="wa-float" href="${COMPANY.whatsapp}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.42 1.31-1.96 1.36-.5.05-.98.23-3.3-.69-2.77-1.09-4.53-3.92-4.67-4.1-.13-.18-1.11-1.48-1.11-2.82s.7-2 .95-2.28c.25-.27.54-.34.72-.34l.52.01c.17.01.39-.06.61.47.24.57.8 1.97.87 2.11.07.14.12.31.02.5-.09.18-.14.29-.28.45l-.42.49c-.14.14-.28.29-.12.57.16.27.72 1.18 1.54 1.92 1.06.94 1.95 1.23 2.22 1.37.27.14.43.12.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.22.61-.13.25.09 1.6.75 1.87.89.27.14.46.2.53.32.07.11.07.65-.17 1.33z"/></svg>
</a>`;

/* ------------------------------------------------------------------ layout */

function structuredData(page) {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.legalName,
    alternateName: COMPANY.shortName,
    url: SITE_URL + '/',
    logo: SITE_URL + '/assets/img/logo-mark.svg',
    foundingDate: COMPANY.founded,
    description:
      'A process-driven, automotive-grade engineering and manufacturing company specialising in precision plastic injection moulding, metal casting, tooling transfer and new product development.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.street + ', ' + COMPANY.locality,
      addressLocality: COMPANY.city,
      postalCode: COMPANY.postalCode,
      addressRegion: COMPANY.region,
      addressCountry: 'IN'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-8754453333',
        email: COMPANY.email,
        contactType: 'sales',
        areaServed: 'IN',
        availableLanguage: ['en', 'ta']
      }
    ],
    hasCredential: ['IATF 16949', 'ISO 14001:2015', 'SQ Mark', 'ESG Certificate']
  };

  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' }]
  };
  if (page.file !== 'index.html') {
    crumbs.itemListElement.push({
      '@type': 'ListItem',
      position: 2,
      name: page.nav,
      item: SITE_URL + '/' + page.file
    });
  }

  return (
    '<script type="application/ld+json">' +
    JSON.stringify(page.file === 'index.html' ? org : crumbs) +
    '</script>'
  );
}

function render(page) {
  const canonical = SITE_URL + '/' + (page.file === 'index.html' ? '' : page.file);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${COMPANY.shortName}">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE_URL}/assets/img/og-cover.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0A0F13">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css">
${structuredData(page)}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>

${header(page.file)}

<main id="main">
${page.body}
</main>

${footer}

<script src="assets/js/main.js"></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------- build */

pages.forEach((page) => {
  fs.writeFileSync(path.join(ROOT, page.file), render(page), 'utf8');
});

/* sitemap + robots */
const today = new Date().toISOString().slice(0, 10);
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages
    .map(
      (p) =>
        '  <url><loc>' +
        SITE_URL +
        '/' +
        (p.file === 'index.html' ? '' : p.file) +
        '</loc><lastmod>' +
        today +
        '</lastmod><priority>' +
        (p.file === 'index.html' ? '1.0' : '0.8') +
        '</priority></url>'
    )
    .join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(
  path.join(ROOT, 'robots.txt'),
  'User-agent: *\nAllow: /\n\nSitemap: ' + SITE_URL + '/sitemap.xml\n',
  'utf8'
);

console.log('Built ' + pages.length + ' pages + sitemap.xml + robots.txt');
