import Img from './Img';
import Tilt from './Tilt';
import Lightbox, { useLightbox } from './Lightbox';
import { Reveal } from './ui';

/**
 * Photo grid whose tiles open a full-size viewer.
 *
 * Each tile is a real <button> so it is reachable and operable by keyboard,
 * announced as "View <caption>, opens image viewer".
 *
 * items: [{ name, caption, alt?, tall? }]
 */
export default function Gallery({ items, sizes = 'gallery' }) {
  const { index, open, close, step } = useLightbox(items);

  return (
    <>
      <div className="gallery">
        {items.map((item, i) => (
          <Reveal
            as="figure"
            className={`shot${item.tall ? ' shot--tall' : ''}`}
            key={item.name}
            delay={(i % 3) * 70}
            variant="3d"
          >
            <Tilt max={6} lift={8}>
            <button
              type="button"
              className="shot__btn"
              onClick={(e) => open(i, e.currentTarget)}
              aria-label={`View ${item.caption} — opens image viewer`}
            >
              <Img name={item.name} alt={item.alt || item.caption} sizes={sizes} />
              <span className="shot__zoom" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" />
                </svg>
              </span>
            </button>
            </Tilt>
            <figcaption>{item.caption}</figcaption>
          </Reveal>
        ))}
      </div>

      <Lightbox items={items} index={index} onClose={close} onStep={step} />
    </>
  );
}
