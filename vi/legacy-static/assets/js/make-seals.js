/**
 * Generates neutral certification badge graphics.
 * Run: node assets/js/make-seals.js
 * NOTE: these are generic placeholder badges. Replace with the official
 * marks supplied by each certification body before going live.
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'img');
fs.mkdirSync(OUT, { recursive: true });

function seal({ file, top, main, bottom, accent = '#F26A1B' }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${main} ${bottom}">
  <circle cx="60" cy="60" r="57" fill="none" stroke="#D9E1E7" stroke-width="2"/>
  <circle cx="60" cy="60" r="50" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4 5"/>
  <circle cx="60" cy="60" r="43" fill="#F6F8FA"/>
  <text x="60" y="47" text-anchor="middle" font-family="ui-monospace, Menlo, Consolas, monospace"
        font-size="9" letter-spacing="1.6" fill="#63788A">${top}</text>
  <text x="60" y="70" text-anchor="middle" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif"
        font-weight="800" font-size="20" letter-spacing="-0.6" fill="#0A0F13">${main}</text>
  <text x="60" y="86" text-anchor="middle" font-family="ui-monospace, Menlo, Consolas, monospace"
        font-size="9" letter-spacing="1.4" fill="${accent}">${bottom}</text>
  <path d="M60 3 v8 M60 109 v8 M3 60 h8 M109 60 h8" stroke="${accent}" stroke-width="2" stroke-linecap="round"/>
</svg>
`;
  fs.writeFileSync(path.join(OUT, file), svg, 'utf8');
}

[
  { file: 'seal-iatf.svg', top: 'CERTIFIED', main: 'IATF', bottom: '16949' },
  { file: 'seal-iso14001.svg', top: 'CERTIFIED', main: 'ISO', bottom: '14001:2015', accent: '#2F7FA6' },
  { file: 'seal-sq.svg', top: 'SUPPLIER QUALITY', main: 'SQ', bottom: 'MARK' },
  { file: 'seal-esg.svg', top: 'SUSTAINABILITY', main: 'ESG', bottom: 'CERTIFIED', accent: '#2F7FA6' }
].forEach(seal);

console.log('Generated 4 certification badges in assets/img/');
