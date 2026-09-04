/**
 * Builds responsive derivatives of every source photograph.
 *
 *   node scripts/images.mjs
 *
 * Reads  public/images/*.jpg           (originals, untouched)
 * Writes public/images/gen/<name>-<w>.webp and -<w>.jpg
 *        public/images/gen/og-cover.jpg   (1200x630 social card)
 *
 * Widths are chosen from how each slot is actually laid out (see WIDTHS), not a
 * generic ladder — the largest any image is displayed at is the full-bleed hero.
 */
import sharp from 'sharp';
import { readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'public', 'images');
const OUT = join(SRC, 'gen');

/* The rendered width bands across our breakpoints. A browser picks the smallest
   candidate that satisfies its viewport x DPR. */
const WIDTHS = [400, 640, 900, 1280, 1800, 2400];

/* Slots never rendered wider than this, so we do not ship bigger variants. */
const MAX_FOR = {
  'shopfloor-wide': 2400, // full-bleed hero
  'facility-exterior': 1280,
  default: 1280
};

const Q_WEBP = 74;
const Q_JPEG = 78;

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
let srcBytes = 0;
let outBytes = 0;
const manifest = {};

for (const file of files) {
  const name = basename(file, extname(file));
  const input = join(SRC, file);
  srcBytes += (await stat(input)).size;

  const img = sharp(input);
  const meta = await img.metadata();
  const cap = Math.min(MAX_FOR[name] ?? MAX_FOR.default, meta.width);
  const widths = WIDTHS.filter((w) => w <= cap);
  if (!widths.includes(cap)) widths.push(cap);

  const made = [];
  for (const w of widths) {
    for (const [ext, opts] of [
      ['webp', { quality: Q_WEBP, effort: 5 }],
      ['jpg', { quality: Q_JPEG, mozjpeg: true, progressive: true }]
    ]) {
      const dest = join(OUT, `${name}-${w}.${ext}`);
      const buf = await sharp(input)
        .resize({ width: w, withoutEnlargement: true })
        [ext === 'webp' ? 'webp' : 'jpeg'](opts)
        .toBuffer();
      await writeFile(dest, buf);
      outBytes += buf.length;
      if (ext === 'webp') made.push(w);
    }
  }

  manifest[name] = { widths: made, w: meta.width, h: meta.height };
  console.log(`${name.padEnd(30)} ${String(meta.width).padStart(5)}px -> ${made.join(', ')}`);
}

/* Social card: a real photograph, cropped to the 1.91:1 slot. */
await sharp(join(SRC, 'shopfloor-wide.jpg'))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(OUT, 'og-cover.jpg'));
console.log('\nog-cover.jpg  1200x630');

/* The app imports the manifest to build srcset attributes, so it lives in src/
   as well as beside the derivatives. */
const json = JSON.stringify(manifest, null, 1);
await writeFile(join(OUT, 'manifest.json'), json, 'utf8');
await writeFile(join(ROOT, 'src', 'data', 'images.json'), json, 'utf8');

console.log(
  `\n${files.length} sources ${(srcBytes / 1048576).toFixed(1)} MB -> ` +
    `${(outBytes / 1048576).toFixed(1)} MB across all variants`
);
console.log('Originals are left in place; only public/images/gen/ is referenced by the app.');
