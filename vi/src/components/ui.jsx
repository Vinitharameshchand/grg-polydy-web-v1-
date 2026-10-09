import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Img from './Img';
import { SplitText } from './AnimText';
import { useScroll, usePrefersReducedMotion } from '../hooks/useScroll';

export { SplitText, SplitText as Words } from './AnimText';

/* ------------------------------------------------------------------ icons */
export const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Download = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M12 4v12M7 12l5 5 5-5M5 20h14" />
  </svg>
);

/* ------------------------------------------------------------- in-view */
/** True once the element has entered the viewport (never flips back). */
export function useInView(ref, { rootMargin = '0px 0px -6% 0px', threshold = 0.06 } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    /* Geometry check: the ground truth. Runs on mount, scroll and resize, so
       content can never stay hidden if the observer misses an entry. */
    const visible = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.bottom > 0 && r.top < vh * 0.96;
    };
    if (visible()) {
      setInView(true);
      return;
    }

    let raf = 0;
    const check = () => {
      raf = 0;
      if (visible()) setInView(true);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    /* Observer: cheaper than polling scroll for the common case. */
    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) setInView(true);
        },
        { rootMargin, threshold }
      );
      io.observe(el);
    }

    /* Last resort: anything in the first two screens is shown after a beat. */
    const t = setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 2) setInView(true);
    }, 1800);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (io) io.disconnect();
      clearTimeout(t);
    };
  }, [ref, inView, rootMargin, threshold]);
  return inView;
}

/* ---------------------------------------------------------------- reveal */
/**
 * Animates content in once as it enters the viewport.
 * variant: 'up' (rise + fade, default) | 'fade' | 'wipe' (clip from bottom, for imagery) | 'line'
 */
export function Reveal({ children, delay = 0, variant = 'up', as: Tag = 'div', className = '', style, ...rest }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (!delay) {
      setShown(true);
      return;
    }
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [inView, delay]);

  const cls = ['reveal', variant !== 'up' ? `reveal--${variant}` : '', shown ? 'in' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref} className={cls} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------- countup */
/**
 * Counts a figure up when it scrolls into view. Accepts strings such as
 * "₹300 Cr+", "3 decades", "4". Four-digit values (years) are left static.
 */
export function CountUp({ value, duration = 1400 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.5 });
  const m = String(value).match(/^([^\d]*)(\d[\d,]*)(.*)$/);
  const target = m ? parseInt(m[2].replace(/,/g, ''), 10) : NaN;
  const animate = m && !Number.isNaN(target) && target < 1000;
  const [n, setN] = useState(animate ? 0 : target);

  useEffect(() => {
    if (!animate || !inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target);
      return;
    }
    let raf;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animate, inView, target, duration]);

  if (!m) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {m[1]}
      {animate ? n : m[2]}
      {m[3]}
    </span>
  );
}

/* --------------------------------------------------------------- ticker */
/** Slow continuous strip; content is duplicated so the loop is seamless. */
export function Ticker({ items }) {
  return (
    <div className="ticker" aria-label={items.join(', ')}>
      <div className="ticker__track" aria-hidden="true">
        {items.map((t, i) => (
          <span className="ticker__item" key={i}>
            {t}
          </span>
        ))}
        {/* second copy makes the loop seamless; hidden when motion is off */}
        {items.map((t, i) => (
          <span className="ticker__item ticker__item--dup" key={`d${i}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- parallax */
/**
 * Drifts an element against the scroll while it is on screen.
 * Shares the global scroll loop and writes a CSS custom property, so the
 * browser only composites — no layout is triggered.
 */
export function useParallax(ref, distance = 40) {
  const reduced = usePrefersReducedMotion();
  useScroll(({ vh }) => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    /* -1 above centre .. +1 below centre */
    const centre = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
    el.style.setProperty('--py', (centre * distance).toFixed(2) + 'px');
  });
}

/* -------------------------------------------------------------- sections */
export function Section({ children, tint, dark, sm, id, className = '' }) {
  const cls = ['section', sm ? 'section--sm' : '', tint ? 'section--tint' : '', dark ? 'section--dark' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <section className={cls} id={id}>
      <div className="wrap">{children}</div>
    </section>
  );
}

/** Editorial header: small label on the left, heading and copy on the right. */
export function SectionHead({ label, title, children }) {
  /* The heading animates itself word by word, so the wrapper only fades —
     stacking a block transform on top of that reads as two separate moves. */
  return (
    <div className="cols cols--head">
      <Reveal as="span" className="label label--bar label--sec" variant="fade">
        {label}
      </Reveal>
      <div className="stack">
        <SplitText as="h2" className="h2" text={title} />
        {children && (
          <Reveal variant="fade" delay={200}>
            {children}
          </Reveal>
        )}
      </div>
    </div>
  );
}

/** Banner at the top of interior pages: the same label / content columns
    as every section head, with the breadcrumb in the label position. */
export function PageHead({ crumb, title, lead, children }) {
  return (
    <header className="pagehead">
      <div className="wrap cols">
        <Reveal as="nav" className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{crumb}</span>
        </Reveal>
        <div>
          <Reveal>
            <SplitText as="h1" className="h1" text={title} stagger={0.04} />
          </Reveal>
          {lead && (
            <Reveal delay={260} as="p" className="lead">
              {lead}
            </Reveal>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------- cta */
export function CTA({ title, text, primary, secondary }) {
  return (
    <Section dark>
      <Reveal className="cols">
        <span className="label label--bar label--sec">Get in touch</span>
        <div className="stack">
          <h2 className="h2">{title}</h2>
          <p className="lead">{text}</p>
          <div className="btn-row">
            <Link className="btn btn--accent" to={primary.to}>
              {primary.label}
              <Arrow />
            </Link>
            {secondary && (
              <Link className="btn btn--line" to={secondary.to}>
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* --------------------------------------------------------- column guide */
/** The 12 columns drawn as hairlines, like an engineering sheet. Decorative;
    sits behind dark mastheads and shares the page grid exactly. */
export function ColumnGuide() {
  return (
    <span className="colguide" aria-hidden="true">
      <span className="wrap colguide__grid">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} />
        ))}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------ compliance */
export function Compliance({ note, cta }) {
  return (
    <Reveal className="compliance">
      <div className="compliance__text">
        <strong>No child labour is employed at GRG Polydynamics Private Limited.</strong>
        <p>{note}</p>
      </div>
      {cta && (
        <Link className="btn btn--line" to={cta.to}>
          {cta.label}
        </Link>
      )}
    </Reveal>
  );
}

/* ---------------------------------------------------------------- media */
/** Image + text side by side. `reverse` puts the image first. */
export function Split({ image, alt, caption, reverse, eager, children }) {
  const media = useRef(null);
  useParallax(media, 26);
  return (
    <div className={`split${reverse ? ' split--rev' : ''}`}>
      <Reveal className="stack">{children}</Reveal>
      <Reveal as="figure" className="split__media" variant="wipe" delay={80}>
        <span className="split__shift" ref={media}>
          <Img name={image} alt={alt} sizes="split" loading={eager ? 'eager' : 'lazy'} />
        </span>
        {caption && <figcaption>{caption}</figcaption>}
      </Reveal>
    </div>
  );
}
