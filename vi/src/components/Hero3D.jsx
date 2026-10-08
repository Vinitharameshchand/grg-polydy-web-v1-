import { useEffect, useRef, useState } from 'react';

/**
 * WebGL mould for the home masthead. The canvas is decorative: the prerendered
 * markup is an empty canvas over the hero photograph, three.js is fetched only
 * after hydration, and if WebGL is unavailable nothing changes — the photo
 * hero simply stays as it was.
 */
export default function Hero3D() {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let scene = null;
    let cancelled = false;

    const start = async () => {
      const kit = await import('../three/kit');
      if (cancelled || !kit.hasWebGL()) return;
      const { mountHero } = await import('../three/heroScene');
      if (cancelled) return;
      try {
        scene = mountHero(canvas, {
          reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          onReady: () => !cancelled && setReady(true)
        });
      } catch {
        /* Context creation can still fail on blocklisted GPUs; keep the photo. */
      }
    };

    /* Let the headline and photo paint first. */
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;
    const handle = idle(start, { timeout: 1200 });

    return () => {
      cancelled = true;
      cancelIdle(handle);
      scene?.dispose();
    };
  }, []);

  return <canvas ref={ref} className={`hero__3d${ready ? ' is-ready' : ''}`} aria-hidden="true" />;
}
