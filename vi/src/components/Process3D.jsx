import { useEffect, useRef, useState } from 'react';
import { useScroll } from '../hooks/useScroll';

/* Process copy. Generic to injection moulding and consistent with the
   capability statements in data/site.js — GRG to confirm before launch. */
const STEPS = [
  {
    title: 'Material',
    text: 'Engineering-grade polymer granules, selected and validated for the application, are fed to the machine.'
  },
  {
    title: 'Plasticising',
    text: 'Heater bands bring the barrel to temperature while the screw turns, melting the granules into a uniform shot.'
  },
  {
    title: 'Injection',
    text: 'The screw drives forward and fills the closed mould under controlled, continuously monitored process parameters.'
  },
  {
    title: 'Ejection',
    text: 'Once the part has cooled, the tool opens and ejector pins release it — the same way, cycle after cycle.'
  },
  {
    title: 'Inspection',
    text: 'Parts are dimensionally verified against drawing and the control plan before they move on.'
  }
];

/**
 * Scroll-driven 3D walk along the moulding machine. The section is several
 * screens tall; the canvas is pinned while the reader scrolls through it.
 * Reduced motion or no WebGL → `static`: a plain five-step list, no canvas.
 */
export default function Process3D() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const railRef = useRef(null);
  const sceneRef = useRef(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState('pending'); // pending | live | static

  useScroll(({ vh }) => {
    const el = sectionRef.current;
    if (!el || mode === 'static') return;
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
    progress.current = p;
    sceneRef.current?.setProgress(p);
    railRef.current?.style.setProperty('--p', p.toFixed(4));
    const step = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
    setActive((prev) => (prev !== step ? step : prev));
  });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMode('static');
      return;
    }
    let cancelled = false;
    let io = null;

    const load = async () => {
      io?.disconnect();
      const kit = await import('../three/kit');
      if (cancelled) return;
      if (!kit.hasWebGL()) {
        setMode('static');
        return;
      }
      const { mountProcess } = await import('../three/processScene');
      if (cancelled) return;
      try {
        sceneRef.current = mountProcess(canvasRef.current, {
          onReady: () => !cancelled && setMode('live')
        });
        sceneRef.current.snap(progress.current);
      } catch {
        setMode('static');
      }
    };

    /* Fetch three.js when the section is about a screen away. */
    io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && load(), {
      rootMargin: '120% 0px'
    });
    io.observe(sectionRef.current);

    return () => {
      cancelled = true;
      io?.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <section ref={sectionRef} className={`p3d p3d--${mode}`} aria-labelledby="p3d-title">
      <div className="p3d__sticky">
        <canvas ref={canvasRef} className="p3d__canvas" aria-hidden="true" />
        <div className="wrap p3d__overlay">
          <div className="p3d__panel">
            <span className="label label--bar">How a part is made</span>
            <h2 id="p3d-title" className="h2">
              From pellet to part.
            </h2>
            <ol className="p3d__steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className={i === active ? 'is-active' : i < active ? 'is-done' : ''}>
                  <span className="p3d__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="p3d__title">{s.title}</h3>
                    <div className="p3d__body">
                      <p>{s.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="p3d__rail" ref={railRef} aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
        <span className="p3d__hint" aria-hidden="true">
          Scroll
        </span>
      </div>
    </section>
  );
}
