import { useRef } from 'react';
import { useElementProgress } from '../hooks/useScroll';
import { useInView } from './ui';

/**
 * Text animation primitives.
 *
 * All of them split a string into spans. That is invisible to a screen reader
 * only if the split is hidden from it, so every wrapper carries the full string
 * as `aria-label` and marks the pieces `aria-hidden` — otherwise some readers
 * announce the text word by word.
 *
 * The split is deterministic from the input, so server and client markup match
 * and hydration stays clean.
 */

const SPLIT = /(\s+)/;

/**
 * Words animate in when the element scrolls into view.
 *
 * variant:
 *   'rise' — each word clips up from its own baseline (headlines)
 *   'fade' — each word fades and unblurs in place (body copy, subtler)
 */
export function SplitText({
  text,
  as: Tag = 'span',
  className = '',
  variant = 'rise',
  stagger = 0.045,
  start = 0.05,
  once = true
}) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const parts = String(text).split(SPLIT);

  let wordIndex = -1;
  const cls = ['at', `at--${variant}`, inView ? 'in' : '', className].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} className={cls} aria-label={text}>
      {parts.map((part, i) => {
        if (!part.trim()) return <span key={i}> </span>;
        wordIndex += 1;
        return (
          <span className="at__w" key={i} aria-hidden="true">
            <span className="at__i" style={{ '--d': `${(start + wordIndex * stagger).toFixed(3)}s` }}>
              {part}
            </span>
          </span>
        );
      })}
      {/* `once` is the default; when false the animation can replay on re-entry */}
      {!once && null}
    </Tag>
  );
}

/**
 * Copy that lights up as the reader scrolls through it — the words ahead of
 * the reading position sit dimmed, and brighten as they are reached.
 *
 * Reserved for a single showpiece passage; used everywhere it would be noise.
 */
export function ScrollCopy({ text, as: Tag = 'p', className = '' }) {
  const ref = useRef(null);
  const progress = useElementProgress(ref);
  const parts = String(text).split(SPLIT);
  const total = parts.filter((p) => p.trim()).length;

  /* Map the element's travel through the viewport onto the word count, with a
     soft edge so several words are mid-transition at once rather than a hard
     wipe. Clamped so the passage is fully lit well before it leaves. */
  const WINDOW_START = 0.12;
  const WINDOW_END = 0.62;
  const front = ((progress - WINDOW_START) / (WINDOW_END - WINDOW_START)) * total;
  const FEATHER = 5;

  let wordIndex = -1;
  return (
    <Tag ref={ref} className={`sc ${className}`.trim()} aria-label={text}>
      {parts.map((part, i) => {
        if (!part.trim()) return <span key={i}> </span>;
        wordIndex += 1;
        const lit = Math.max(0, Math.min((front - wordIndex) / FEATHER + 0.5, 1));
        return (
          <span className="sc__w" key={i} aria-hidden="true" style={{ '--lit': lit.toFixed(3) }}>
            {part}
          </span>
        );
      })}
    </Tag>
  );
}

/**
 * A number or short string that counts/settles in when seen, with the same
 * clip treatment as SplitText so figures and headings feel related.
 */
export function SplitChars({ text, className = '', stagger = 0.03 }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const chars = [...String(text)];

  return (
    <span ref={ref} className={`at at--rise ${inView ? 'in' : ''} ${className}`.trim()} aria-label={text}>
      {chars.map((c, i) => (
        <span className="at__w" key={i} aria-hidden="true">
          <span className="at__i" style={{ '--d': `${(i * stagger).toFixed(3)}s` }}>
            {c === ' ' ? ' ' : c}
          </span>
        </span>
      ))}
    </span>
  );
}
