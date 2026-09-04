import { useEffect, useRef } from 'react';

/**
 * Pointer-tracked 3D tilt.
 *
 * Wraps one child. As the pointer moves across it the child rotates toward
 * the cursor in perspective and a specular highlight follows; on leave it
 * settles back. Writes CSS custom properties only, so the browser composites
 * the transform — no layout, no React re-render per move.
 *
 * Does nothing on coarse pointers (touch has no hover) or when the visitor
 * prefers reduced motion; the child then renders exactly as it would without
 * the wrapper.
 *
 *   max    maximum rotation in degrees
 *   lift   translateZ in px while hovered — makes the element come forward
 *   glare  whether to paint the moving highlight
 */
export default function Tilt({ children, max = 8, lift = 12, glare = true, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    let frame = 0;
    let rect = null;
    let px = 0;
    let py = 0;

    const apply = () => {
      frame = 0;
      if (!rect) return;
      const nx = (px - rect.left) / rect.width; // 0..1 across
      const ny = (py - rect.top) / rect.height; // 0..1 down
      const ry = (nx - 0.5) * 2 * max; // pointer right -> rotate right edge away
      const rx = (0.5 - ny) * 2 * max; // pointer up -> top edge tilts back
      el.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      el.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      el.style.setProperty('--gx', (nx * 100).toFixed(1) + '%');
      el.style.setProperty('--gy', (ny * 100).toFixed(1) + '%');
    };

    const onEnter = () => {
      rect = el.getBoundingClientRect();
      el.classList.add('is-tilting');
      el.style.setProperty('--tz', lift + 'px');
    };
    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      rect = null;
      el.classList.remove('is-tilting');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--tz', '0px');
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointercancel', onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointercancel', onLeave);
    };
  }, [max, lift]);

  return (
    <div ref={ref} className={`tilt${glare ? ' tilt--glare' : ''}${className ? ' ' + className : ''}`}>
      {children}
    </div>
  );
}
