/**
 * Prints dimensions and file size for every JPEG/PNG in public/images.
 * Run: node scripts/image-info.js
 * Used to keep width/height attributes in the markup honest.
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'public', 'images');

function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    // SOF0..SOF15, excluding DHT(c4), JPG(c8), DAC(cc)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

function pngSize(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const rows = [];
for (const f of fs.readdirSync(DIR).sort()) {
  const p = path.join(DIR, f);
  const buf = fs.readFileSync(p);
  let size = null;
  if (buf.slice(0, 2).toString('hex') === 'ffd8') size = jpegSize(buf);
  else if (buf.slice(1, 4).toString() === 'PNG') size = pngSize(buf);
  rows.push([f, size ? `${size.w}x${size.h}` : '?', `${Math.round(buf.length / 1024)} KB`]);
}

const pad = (s, n) => String(s).padEnd(n);
rows.forEach((r) => console.log(pad(r[0], 30) + pad(r[1], 12) + r[2]));

const total = rows.reduce((n, r) => n + parseInt(r[2], 10), 0);
console.log(`\n${rows.length} images, ${(total / 1024).toFixed(1)} MB total`);

module.exports = { jpegSize, pngSize };
