/**
 * Generates SVG placeholder imagery for the GRG Polydynamics site.
 * Run: node assets/js/make-placeholders.js
 * Replace the generated files with real photography of the same aspect ratio.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'img');
fs.mkdirSync(OUT, { recursive: true });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function plate({ file, w = 1200, h = 750, label, kicker = 'GRG POLYDYNAMICS', tone = 'a' }) {
  const tones = {
    a: ['#16212A', '#0A0F13', 'rgba(242,106,27,.22)'],
    b: ['#1B2A33', '#0C141A', 'rgba(47,127,166,.24)'],
    c: ['#111A21', '#080D11', 'rgba(242,106,27,.14)']
  };
  const [c1, c2, glow] = tones[tone] || tones.a;
  const cell = Math.round(Math.min(w, h) / 12);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="18%" r="62%">
      <stop offset="0" stop-color="${glow}"/>
      <stop offset="1" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <pattern id="grid" width="${cell}" height="${cell}" patternUnits="userSpaceOnUse">
      <path d="M ${cell} 0 L 0 0 0 ${cell}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>

  <g stroke="rgba(255,255,255,.10)" stroke-width="1" fill="none">
    <circle cx="${w * 0.74}" cy="${h * 0.44}" r="${h * 0.30}"/>
    <circle cx="${w * 0.74}" cy="${h * 0.44}" r="${h * 0.20}"/>
    <circle cx="${w * 0.74}" cy="${h * 0.44}" r="${h * 0.10}"/>
  </g>
  <g stroke="rgba(242,106,27,.55)" stroke-width="2" fill="none" stroke-linecap="round">
    <path d="M ${w * 0.74 - h * 0.30} ${h * 0.44} h ${h * 0.10}"/>
    <path d="M ${w * 0.74 + h * 0.20} ${h * 0.44} h ${h * 0.10}"/>
    <path d="M ${w * 0.74} ${h * 0.44 - h * 0.30} v ${h * 0.10}"/>
  </g>

  <rect x="${Math.round(w * 0.06)}" y="${Math.round(h * 0.62)}" width="4" height="${Math.round(h * 0.20)}" fill="#F26A1B"/>
  <text x="${Math.round(w * 0.06) + 22}" y="${Math.round(h * 0.68)}"
        font-family="ui-monospace, Menlo, Consolas, monospace" font-size="${Math.round(h * 0.028)}"
        letter-spacing="${(h * 0.006).toFixed(1)}" fill="#8C9EAC">${esc(kicker)}</text>
  <text x="${Math.round(w * 0.06) + 22}" y="${Math.round(h * 0.78)}"
        font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-weight="700"
        font-size="${Math.round(h * 0.062)}" letter-spacing="-1" fill="#FFFFFF">${esc(label)}</text>
</svg>
`;
  fs.writeFileSync(path.join(OUT, file), svg, 'utf8');
  return file;
}

const plates = [
  { file: 'hero-facility.svg', w: 1400, h: 900, label: 'Manufacturing Facility', tone: 'a' },
  { file: 'cap-injection-molding.svg', label: 'Plastic Injection Molding', tone: 'a' },
  { file: 'cap-metal-casting.svg', label: 'Metal Casting', tone: 'b' },
  { file: 'cap-tooling-transfer.svg', label: 'Tooling Transfer Support', tone: 'c' },
  { file: 'npd-team.svg', w: 1200, h: 900, label: 'NPD Engineering', tone: 'b' },
  { file: 'quality-lab.svg', w: 1200, h: 900, label: 'Quality Inspection', tone: 'a' },
  { file: 'tool-room.svg', label: 'Tool Room', tone: 'c' },
  { file: 'factory-floor.svg', label: 'Factory Floor', tone: 'a' },
  { file: 'machine-operation.svg', label: 'Machine Operation', tone: 'b' },
  { file: 'product-closeup.svg', label: 'Component Close-up', tone: 'c' },
  { file: 'team-operations.svg', label: 'Team & Operations', tone: 'a' },
  { file: 'casting-process.svg', label: 'Casting Process', tone: 'b' },
  { file: 'video-walkthrough.svg', label: 'Factory Walkthrough', tone: 'a' },
  { file: 'video-npd.svg', label: 'NPD Activities', tone: 'b' },
  { file: 'video-founder.svg', label: 'Founder Introduction', tone: 'c' },
  { file: 'video-quality.svg', label: 'Quality Control Process', tone: 'a' },
  { file: 'video-tooling.svg', label: 'Tooling Process', tone: 'b' },
  { file: 'video-workflow.svg', label: 'Production Workflow', tone: 'c' },
  { file: 'ind-automotive.svg', label: 'Automotive Components', tone: 'a' },
  { file: 'ind-electrical.svg', label: 'Electrical & Electronics', tone: 'b' },
  { file: 'ind-machine.svg', label: 'Industrial & Machine', tone: 'c' },
  { file: 'ind-consumer.svg', label: 'Consumer Products', tone: 'b' },
  { file: 'about-plant.svg', w: 1200, h: 900, label: 'Plant Infrastructure', tone: 'c' }
];

plates.forEach(plate);
console.log('Generated ' + plates.length + ' placeholders in assets/img/');
