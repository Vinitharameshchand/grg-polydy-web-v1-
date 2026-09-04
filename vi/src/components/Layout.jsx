import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { company, nav } from '../data/site';
import { Arrow } from './ui';
import { useScrollProgress, useScrolledPast } from '../hooks/useScroll';
import { BackToTop } from './scroll';

function Mark() {
  return (
    <svg className="brand__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect x="0.75" y="0.75" width="38.5" height="38.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M26.4 15.2a7.6 7.6 0 1 0 0 9.6" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M20.2 20H27.6V25.2" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

function Brand({ tabIndex }) {
  return (
    <Link className="brand" to="/" tabIndex={tabIndex} aria-label="GRG Polydynamics — home">
      <Mark />
      <span className="brand__name">
        GRG Polydynamics
        <span className="brand__sub">{company.tagline}</span>
      </span>
    </Link>
  );
}

/* The brand links home, so the desktop bar omits "Home". The drawer keeps it. */
const desktopNav = nav.filter((i) => i.to !== '/');

/** Hairline bar showing how far down the page the reader is. */
function Progress() {
  const p = useScrollProgress();
  return (
    <div className="progress" aria-hidden="true">
      <span style={{ '--p': p }} />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const stuck = useScrolledPast(24);
  const { pathname } = useLocation();
  const drawerRef = useRef(null);
  const burgerRef = useRef(null);
  const openerRef = useRef(null);

  /**
   * Closing must also hand focus back to the control that opened the menu.
   * Doing it here rather than in the effect cleanup because the cleanup races
   * with React applying `inert`, which can leave focus stranded on a link
   * inside the hidden panel.
   */
  const close = useCallback(() => {
    const opener = openerRef.current;
    /* Move focus out synchronously, before the state update applies `inert`.
       Restoring afterwards races that commit and can leave focus stranded on
       a link inside the hidden panel. */
    if (opener && document.contains(opener)) opener.focus();
    setOpen(false);
    /* Safety net if the synchronous attempt was refused (e.g. mid-transition). */
    if (opener) {
      let tries = 0;
      const retry = () => {
        if (!document.contains(opener) || document.activeElement === opener) return;
        opener.focus();
        if (++tries < 8) requestAnimationFrame(retry);
      };
      requestAnimationFrame(retry);
    }
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);


  /* Open: lock scroll, move focus in, trap Tab inside, close on Escape.
     Close: restore focus to whatever opened it. */
  useEffect(() => {
    const panel = drawerRef.current;
    if (!open || !panel) return;

    openerRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    /* Exclude tabindex="-1" (the backdrop) so focus lands on the first real link. */
    const focusables = () =>
      [...panel.querySelectorAll('a[href], button:not([disabled])')].filter(
        (el) => el.offsetParent !== null && el.getAttribute('tabindex') !== '-1'
      );

    /* The panel is `visibility: hidden` until `is-open` is applied, and
       focus() is a no-op on a hidden element. Style recalculation has not
       necessarily happened when this effect runs, so retry for a few frames
       until the focus actually takes rather than guessing at a delay. */
    let focusTimer = 0;
    const deadline = Date.now() + 600;
    const grabFocus = () => {
      focusTimer = 0;
      const first = focusables()[0];
      if (first) {
        first.focus();
        if (document.activeElement === first) return;
      }
      /* Retry on a clock rather than a frame count: a fixed number of frames
         can be spent before the panel is painted and focusable. */
      if (Date.now() < deadline) focusTimer = setTimeout(grabFocus, 16);
    };
    focusTimer = setTimeout(grabFocus, 0);

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      // include the burger so the close control stays reachable
      const ring = [burgerRef.current, ...items].filter(Boolean);
      const active = document.activeElement;
      if (e.shiftKey && (active === ring[0] || !panel.contains(active))) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        (burgerRef.current || firstEl).focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      /* Focus restoration lives in close(); see the comment there. Navigating
         away deliberately does not restore, so the new page keeps focus. */
    };
  }, [open, close]);

  /* Growing past the drawer breakpoint closes it. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1201px)');
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <header className={`header${stuck ? ' is-stuck' : ''}`}>
        <div className="wrap header__inner">
          <Brand />

          <nav className="nav" aria-label="Primary">
            {desktopNav.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__cta">
            <Link className="btn btn--accent" to="/contact">
              Request a quote
            </Link>
            <button
              ref={burgerRef}
              className={`burger${open ? ' is-open' : ''}`}
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="drawer"
              onClick={() => (open ? close() : setOpen(true))}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      {/*
        `inert` removes the closed drawer from the tab order and the
        accessibility tree entirely — aria-hidden alone left its links
        focusable. React 18 does not know the attribute, so it is set as a
        string and mirrored imperatively for browsers that need it.
      */}
      <div
        ref={drawerRef}
        className={`drawer${open ? ' is-open' : ''}`}
        id="drawer"
        {...(open ? {} : { inert: '', 'aria-hidden': 'true' })}
      >
        <button className="drawer__backdrop" type="button" aria-label="Close menu" tabIndex={-1} onClick={close} />
        <nav className="drawer__panel" aria-label="Menu">
          <ul className="drawer__links">
            {nav.map((item, i) => (
              <li key={item.to} style={{ '--i': i }}>
                <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                  {item.label}
                  <Arrow />
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="drawer__foot">
            <Link className="btn btn--accent" to="/contact">
              Request a quote
              <Arrow />
            </Link>
            <ul className="drawer__contact">
              <li>
                <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
              </li>
              <li>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
function Footer() {
  return (
    <footer className="footer">
      {/* Colour-grading layers: a warm bleed at the top edge and a cool lift
          behind the brand, so the panel reads as lit rather than flat fill. */}
      <span className="footer__grade" aria-hidden="true" />
      <span className="footer__seam" aria-hidden="true" />

      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <Brand />
            <p>
              A process-driven, automotive-grade engineering and manufacturing company specialising
              in precision plastic injection moulding, metal casting, tooling transfer and new
              product development.
            </p>
            <ul className="footer__badges" aria-label="Certifications held">
              <li>IATF 16949</li>
              <li>ISO 14001:2015</li>
              <li>SQ Mark</li>
              <li>ESG</li>
            </ul>
          </div>

          <div className="footer__cols">
            <nav className="footer__col" aria-labelledby="f-company">
              <h2 className="footer__h" id="f-company">
                Company
              </h2>
              <ul className="footer__list">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/industries">Industries</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/facility">Facility</Link></li>
                <li><Link to="/quality">Quality</Link></li>
                <li><Link to="/sustainability">Sustainability</Link></li>
              </ul>
            </nav>

            <nav className="footer__col" aria-labelledby="f-caps">
              <h2 className="footer__h" id="f-caps">
                Capabilities
              </h2>
              <ul className="footer__list">
                <li><Link to="/capabilities#injection-moulding">Injection moulding</Link></li>
                <li><Link to="/capabilities#mould-making">Mould making</Link></li>
                <li><Link to="/capabilities#finishing">Painting &amp; plating</Link></li>
                <li><Link to="/capabilities#metal-casting">Metal casting</Link></li>
                <li><Link to="/capabilities#tooling-transfer">Tooling transfer</Link></li>
                <li><Link to="/npd">Product development</Link></li>
              </ul>
            </nav>

            <div className="footer__col footer__contact">
              <h2 className="footer__h" id="f-contact">
                Contact
              </h2>

              {/* The two things a visitor actually wants are the phone number
                  and the address; give them weight rather than list styling. */}
              <a className="footer__phone" href={`tel:${company.phoneHref}`}>
                {company.phone}
              </a>
              <a className="footer__mail" href={`mailto:${company.email}`}>
                {company.email}
              </a>

              <address className="footer__address">
                {company.legalName}
                <br />
                {company.street}
                <br />
                {company.locality}
                <br />
                {company.city} &ndash; {company.postalCode}, {company.region}, {company.country}
              </address>

              <Link className="footer__cta" to="/contact">
                Request a quote
                <Arrow />
              </Link>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            &copy; {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </span>
          <span className="footer__pledge">
            No child labour is employed at {company.legalName}.
          </span>
        </div>
      </div>
    </footer>
  );
}

function WhatsApp() {
  return (
    <a
      className="wa"
      href={company.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.42 1.31-1.96 1.36-.5.05-.98.23-3.3-.69-2.77-1.09-4.53-3.92-4.67-4.1-.13-.18-1.11-1.48-1.11-2.82s.7-2 .95-2.28c.25-.27.54-.34.72-.34l.52.01c.17.01.39-.06.61.47.24.57.8 1.97.87 2.11.07.14.12.31.02.5-.09.18-.14.29-.28.45l-.42.49c-.14.14-.28.29-.12.57.16.27.72 1.18 1.54 1.92 1.06.94 1.95 1.23 2.22 1.37.27.14.43.12.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.22.61-.13.25.09 1.6.75 1.87.89.27.14.46.2.53.32.07.11.07.65-.17 1.33z" />
      </svg>
    </a>
  );
}

/**
 * Scroll handling on navigation.
 *
 * A plain scrollIntoView fires before lazy images and reveal animations have
 * settled the layout, so the target moves out from under it. Re-aim on each
 * frame until the element's position stops changing (or we run out of tries),
 * and stop immediately if the visitor scrolls themselves.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let timer = 0;
    let lastTop = NaN;
    let settled = 0;
    let cancelled = false;
    /* Time-based rather than frame-counted: on a cross-page deep link the
       target does not exist until the new route mounts, and a fixed number of
       frames can elapse before that happens. */
    const deadline = Date.now() + 3000;

    const stop = () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', stop);
    };

    const headerOffset = () => {
      const h = document.querySelector('.header');
      return h ? h.getBoundingClientRect().height + 8 : 0;
    };

    const step = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - headerOffset();
        /* `behavior: instant` overrides the stylesheet's `scroll-behavior:
           smooth`. Without it each tick restarts a smooth animation that the
           next tick interrupts, and the page never actually moves. */
        window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'instant' });
        /* Lazy images and reveal animations keep changing the target's
           position; only stop once it has held still. */
        if (Math.abs(top - lastTop) < 1) settled++;
        else settled = 0;
        lastTop = top;
        if (settled >= 3) return stop();
      }
      if (Date.now() > deadline) return stop();
      timer = setTimeout(step, 16);
    };

    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    window.addEventListener('keydown', stop);
    timer = setTimeout(step, 0);

    return stop;
  }, [pathname, hash]);

  return null;
}

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Progress />
      <ScrollManager />
      <Header />
      {/* keyed on the route so the entrance animation replays per page */}
      <main id="main" className="page" key={pathname} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <WhatsApp />
      <BackToTop />
    </>
  );
}
