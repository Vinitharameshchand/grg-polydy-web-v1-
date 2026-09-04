import { useRef } from 'react';
import { useElementProgress, usePrefersReducedMotion, useScrollSpy, useScrolledPast } from '../hooks/useScroll';
import { Arrow } from './ui';

/**
 * Sticky in-page navigation with a scroll-spy indicator.
 * Used on long single-topic pages (capabilities, industries) where the reader
 * needs to know where they are and jump between sections.
 */
export function SectionNav({ items, label = 'On this page' }) {
  const ids = items.map((i) => i.id);
  const active = useScrollSpy(ids);
  const index = Math.max(0, ids.indexOf(active));

  const go = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector('.header');
    const offset = (header ? header.getBoundingClientRect().height : 0) + 8;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  };

  return (
    <nav className="secnav" aria-label={label}>
      <div className="wrap secnav__inner">
        <span className="secnav__label">{label}</span>
        <ul className="secnav__list">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => go(e, item.id)}
                className={item.id === active ? 'is-active' : undefined}
                aria-current={item.id === active ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="secnav__count" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
      </div>
    </nav>
  );
}

/**
 * Vertical rule beside a numbered list that fills as the list scrolls past,
 * so the reader can see how far through a sequence they are.
 */
export function ProcessTrack({ children }) {
  const ref = useRef(null);
  const raw = useElementProgress(ref);
  const reduced = usePrefersReducedMotion();
  /* The list starts below the fold and ends above it; remap so the line is
     empty when the first item is read and full at the last. */
  const p = reduced ? 1 : Math.max(0, Math.min((raw - 0.15) / 0.62, 1));

  return (
    <div className="track" ref={ref}>
      <div className="track__rail" aria-hidden="true">
        <span className="track__fill" style={{ transform: `scaleY(${p})` }} />
      </div>
      <div className="track__body">{children}</div>
    </div>
  );
}

/** Appears once the reader is well down the page. */
export function BackToTop() {
  const show = useScrolledPast(900);
  return (
    <button
      type="button"
      className={`totop${show ? ' is-in' : ''}`}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        /* Send focus to <main> (tabindex="-1"), not the skip link — the skip
           link is styled to become visible when focused, so focusing it here
           left a dark box parked over the logo. */
        const main = document.getElementById('main');
        if (main) main.focus({ preventScroll: true });
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 20V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}

/** Small link that scrolls to the next section — used at the end of the hero. */
export function ScrollCue({ to }) {
  const go = () => {
    const el = document.getElementById(to);
    if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
  };
  return (
    <button type="button" className="cue" onClick={go}>
      <span>Scroll</span>
      <span className="cue__line" aria-hidden="true" />
      <Arrow />
    </button>
  );
}
