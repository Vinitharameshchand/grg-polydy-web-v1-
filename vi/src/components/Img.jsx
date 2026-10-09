import manifest from '../data/images.json';

/**
 * Responsive picture element.
 *
 * Emits a WebP source plus a JPEG fallback, with a srcset built from the
 * variants scripts/images.mjs actually produced for that file, and intrinsic
 * width/height so the box is reserved before the bytes arrive.
 *
 * `sizes` must describe the slot's rendered width — get it wrong and the
 * browser picks the wrong candidate. Named presets cover the layouts we use.
 */
const SIZES = {
  /* full-bleed hero */
  hero: '100vw',
  /* six of the twelve columns on desktop, full width once the split stacks.
     Sized for the drawn image, not the box: a 3:2 photo covering a 4:3 box
     is 1.125× its width, and the parallax adds 1.09× — so ×1.23. Sizing
     for the box picked a derivative that was then upscaled (soft). */
  split: '(max-width: 900px) 123vw, (min-width: 1400px) 785px, 57vw',
  /* three-up gallery -> two-up -> one */
  gallery: '(max-width: 560px) 100vw, (max-width: 900px) 50vw, (min-width: 1400px) 416px, 33vw',
  /* four-up tile row */
  tile: '(max-width: 620px) 100vw, (max-width: 980px) 50vw, (min-width: 1240px) 285px, 25vw'
};

export default function Img({ name, alt, sizes = 'split', loading = 'lazy', fetchPriority, className, style }) {
  /* Call sites pass a bare name, but tolerate an extension so a stray
     "foo.jpg" cannot silently become "/images/foo.jpg.jpg". */
  const key = String(name).replace(/\.(jpe?g|png|webp)$/i, '');
  const entry = manifest[key];

  if (!entry) {
    if (import.meta.env?.DEV) {
      console.warn(`[Img] no derivatives for "${key}" — run: npm run images`);
    }
    // Fall back to the original rather than rendering nothing.
    return (
      <img src={`/images/${key}.jpg`} alt={alt} loading={loading} className={className} style={style} />
    );
  }

  const { widths, w, h } = entry;
  const set = (ext) => widths.map((width) => `/images/gen/${name}-${width}.${ext} ${width}w`).join(', ');
  const sizesAttr = SIZES[sizes] || sizes;
  const largest = widths[widths.length - 1];

  return (
    <picture>
      <source type="image/webp" srcSet={set('webp')} sizes={sizesAttr} />
      <img
        src={`/images/gen/${name}-${largest}.jpg`}
        srcSet={set('jpg')}
        sizes={sizesAttr}
        alt={alt}
        width={w}
        height={h}
        loading={loading}
        decoding="async"
        fetchpriority={fetchPriority}
        className={className}
        style={style}
      />
    </picture>
  );
}
