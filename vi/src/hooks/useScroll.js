import { useEffect, useRef, useState } from 'react';

/**
 * One scroll listener and one rAF loop for the whole page.
 *
 * Every scroll-driven effect (header state, progress bar, parallax, scroll-spy,
 * back-to-top) subscribes here instead of attaching its own listener, so a
 * scroll costs a single measurement pass no matter how many effects are live.
 */

const subscribers = new Set();
let frame = 0;
let attached = false;

function measure() {
  frame = 0;
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = Math.max(0, document.documentElement.scrollHeight - vh);
  const state = { y, vh, max, progress: max > 0 ? Math.min(y / max, 1) : 0 };
  subscribers.forEach((fn) => fn(state));
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(measure);
}

function attach() {
  if (attached) return;
  attached = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
}

function detach() {
  if (!attached || subscribers.size) return;
  attached = false;
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

/** Runs `fn({ y, vh, max, progress })` on scroll, rAF-throttled. */
export function useScroll(fn) {
  const ref = useRef(fn);
  ref.current = fn;

  useEffect(() => {
    const handler = (state) => ref.current(state);
    subscribers.add(handler);
    attach();
    schedule(); // seed with the current position
    return () => {
      subscribers.delete(handler);
      detach();
    };
  }, []);
}

/** Whole-document scroll progress, 0-1. */
export function useScrollProgress() {
  const [p, setP] = useState(0);
  useScroll(({ progress }) => setP((prev) => (Math.abs(prev - progress) > 0.001 ? progress : prev)));
  return p;
}

/** True once the page has scrolled past `offset`. */
export function useScrolledPast(offset = 24) {
  const [past, setPast] = useState(false);
  useScroll(({ y }) => setPast((prev) => (prev !== y > offset ? y > offset : prev)));
  return past;
}

/**
 * How far a element has travelled through the viewport, 0-1.
 * 0 = its top is at the bottom edge, 1 = its bottom has passed the top edge.
 * Used to drive progress lines and parallax.
 */
export function useElementProgress(ref) {
  const [p, setP] = useState(0);
  useScroll(({ vh }) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const total = r.height + vh;
    const travelled = vh - r.top;
    const next = Math.max(0, Math.min(travelled / total, 1));
    setP((prev) => (Math.abs(prev - next) > 0.002 ? next : prev));
  });
  return p;
}

/**
 * Drifts an element with absolute page scroll — for content at the very top of
 * the page, where a viewport-centre calculation has barely any range to work
 * with. Writes --sy; the element applies it as a transform.
 */
export function useScrollShift(ref, factor = 0.18, max = 120) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  }, []);
  useScroll(({ y }) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.style.setProperty('--sy', Math.min(y * factor, max).toFixed(1) + 'px');
  });
}

/** Which way the reader is currently moving: 'down' | 'up'. */
export function useScrollDirection() {
  const [dir, setDir] = useState('down');
  const last = useRef(0);
  useScroll(({ y }) => {
    if (Math.abs(y - last.current) < 4) return;
    const next = y > last.current ? 'down' : 'up';
    last.current = y;
    setDir((prev) => (prev !== next ? next : prev));
  });
  return dir;
}

/**
 * Id of the section currently under the reading line.
 * `ids` are element ids in document order.
 */
export function useScrollSpy(ids, offset = 140) {
  const [active, setActive] = useState(ids[0] || null);
  useScroll(() => {
    let current = ids[0] || null;
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top - offset <= 0) current = id;
    }
    setActive((prev) => (prev !== current ? current : prev));
  });
  return active;
}

/** Respects the user's motion preference, and reacts if they change it. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}
