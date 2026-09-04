/**
 * Generates assets/img/og-cover.png (1200x630) — the social share preview.
 * Run: node assets/js/make-og.js
 *
 * Pure Node (zlib only), so it needs no image libraries. It draws the brand
 * ground, blueprint grid, accent bar and the hexagon mark geometrically — it
 * carries no text, because there is no font rasteriser here. Replace it with a
 * designed 1200x630 image including the wordmark when brand artwork exists.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const W = 1200;
const H = 630;
const px = Buffer.alloc(W * H * 3);

const set = (x, y, r, g, b) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = r;
  px[i + 1] = g;
  px[i + 2] = b;
};
const mix = (a, b, t) => Math.round(a + (b - a) * Math.max(0, Math.min(1, t)));

/* --- ground: diagonal gradient from steel-900 to ink --- */
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const t = (x / W) * 0.6 + (y / H) * 0.4;
    set(x, y, mix(0x16, 0x0a, t), mix(0x21, 0x0f, t), mix(0x2a, 0x13, t));
  }
}

/* --- blueprint grid --- */
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (x % 60 === 0 || y % 60 === 0) {
      const i = (y * W + x) * 3;
      const fade = 1 - Math.min(1, Math.hypot(x - 840, y - 150) / 900);
      const a = 0.16 * fade;
      px[i] = mix(px[i], 255, a);
      px[i + 1] = mix(px[i + 1], 255, a);
      px[i + 2] = mix(px[i + 2], 255, a);
    }
  }
}

/* --- warm glow, top right --- */
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const d = Math.hypot(x - 950, y - 120) / 620;
    if (d >= 1) continue;
    const a = (1 - d) * (1 - d) * 0.42;
    const i = (y * W + x) * 3;
    px[i] = mix(px[i], 0xf2, a);
    px[i + 1] = mix(px[i + 1], 0x6a, a);
    px[i + 2] = mix(px[i + 2], 0x1b, a);
  }
}

/* --- hexagon mark, centre-right --- */
const hex = (cx, cy, r) =>
  [0, 1, 2, 3, 4, 5].map((k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

const inPoly = (pts, x, y) => {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};

const CX = 930;
const CY = 315;
const outer = hex(CX, CY, 170);
const inner = hex(CX, CY, 132);
for (let y = CY - 180; y < CY + 180; y++) {
  for (let x = CX - 180; x < CX + 180; x++) {
    if (!inPoly(outer, x, y)) continue;
    if (inPoly(inner, x, y)) set(x, y, 0x0a, 0x0f, 0x13);
    else set(x, y, 0xf2, 0x6a, 0x1b);
  }
}

/* --- accent bar, left --- */
for (let y = 250; y < 400; y++) for (let x = 90; x < 98; x++) set(x, y, 0xf2, 0x6a, 0x1b);

/* --- encode PNG --- */
const raw = Buffer.alloc(H * (W * 3 + 1));
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0; // filter: none
  px.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3);
}

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0);
  return Buffer.concat([len, body, crc]);
};

let TABLE = null;
function crc32(buf) {
  if (!TABLE) {
    TABLE = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      TABLE[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ -1;
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // colour type: truecolour
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]);

const out = path.join(__dirname, '..', 'img', 'og-cover.png');
fs.writeFileSync(out, png);
console.log('Wrote ' + out + ' (' + W + 'x' + H + ', ' + Math.round(png.length / 1024) + ' KB)');
