import { useCallback, useEffect, useRef, useState } from 'react';
import manifest from '../data/images.json';

/**
 * Accessible image viewer for the galleries.
 *
 * Photography is the substance of this site, so thumbnails need a way to be
 * seen properly. Opens on click or Enter, traps focus, supports arrow keys and
 * Escape, and returns focus to the thumbnail that opened it.
 */
export function useLightbox(items) {
  const [index, setIndex] = useState(-1);
  const openerRef = useRef(null);

  const open = useCallback((i, el) => {
    openerRef.current = el || document.activeElement;
    setIndex(i);
  }, []);

  const close = useCallback(() => {
    setIndex(-1);
    const opener = openerRef.current;
    if (opener && document.contains(opener)) requestAnimationFrame(() => opener.focus());
  }, []);

  const step = useCallback(
    (delta) => setIndex((i) => (i < 0 ? i : (i + delta + items.length) % items.length)),
    [items.length]
  );

  return { index, open, close, step, isOpen: index >= 0 };
}

export default function Lightbox({ items, index, onClose, onStep }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const isOpen = index >= 0;

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onStep(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onStep(-1);
      } else if (e.key === 'Tab') {
        // keep focus inside the dialog
        const nodes = panelRef.current?.querySelectorAll('button');
        if (!nodes || !nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [isOpen, onClose, onStep]);

  if (!isOpen) return null;

  const item = items[index];
  const entry = manifest[item.name] || {};
  const widths = entry.widths || [];
  const largest = widths[widths.length - 1];
  const srcSet = (ext) => widths.map((w) => `/images/gen/${item.name}-${w}.${ext} ${w}w`).join(', ');

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={item.caption || 'Image viewer'}>
      <button className="lb__scrim" type="button" aria-label="Close image viewer" onClick={onClose} />
      <div className="lb__panel" ref={panelRef}>
        <figure className="lb__figure">
          <picture>
            <source type="image/webp" srcSet={srcSet('webp')} sizes="(max-width: 900px) 94vw, 84vw" />
            <img
              src={`/images/gen/${item.name}-${largest}.jpg`}
              srcSet={srcSet('jpg')}
              sizes="(max-width: 900px) 94vw, 84vw"
              alt={item.alt || item.caption || ''}
              width={entry.w}
              height={entry.h}
            />
          </picture>
          <figcaption>
            <span>{item.caption}</span>
            <span className="lb__count">
              {index + 1} / {items.length}
            </span>
          </figcaption>
        </figure>

        <div className="lb__controls">
          <button type="button" onClick={() => onStep(-1)} aria-label="Previous image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" onClick={() => onStep(1)} aria-label="Next image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button type="button" ref={closeRef} onClick={onClose} aria-label="Close image viewer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
