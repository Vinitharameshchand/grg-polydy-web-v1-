/**
 * Home masthead: an injection mould that injects, opens, ejects a part and
 * presents it to the viewer, on a loop. The assembly turns toward the pointer.
 */
import { Group } from 'three';
import {
  buildMould,
  buildPart,
  buildShadow,
  clamp,
  createStage,
  easeInOut,
  easeOut,
  lerp,
  loop,
  makeMaterials,
  span
} from './kit';

const CYCLE = 9; // seconds per inject → eject → present cycle
const SHOW = { x: 0.05, y: 0.22, z: 1.35, scale: 1.0, yaw: -0.42, pitch: 0.14 };

export function mountHero(canvas, { reduced = false, onReady } = {}) {
  const stage = createStage(canvas, { fov: 30 });
  const { renderer, scene, camera } = stage;
  const mat = makeMaterials();

  const root = new Group();
  scene.add(root);

  const mould = buildMould(mat);
  root.add(mould.root);

  /* Two parts alternate: one comes out of the tool while the previous one
     leaves the stage, so the loop never pops. */
  const parts = [buildPart(mat.plastic), buildPart(mat.plastic)];
  parts.forEach((p) => root.add(p));

  const shadow = buildShadow(4.6, 3.2, 0.5);
  shadow.position.y = -1.22;
  root.add(shadow);

  let stacked = false;
  function layout() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const aspect = w / h;
    /* Wide masthead: subject sits right of the headline. Stacked (tablet and
       phone): the canvas is its own band above the copy, subject centred. */
    stacked = aspect < 1.25 || w < 960;
    const viewH = stacked ? Math.max(4.6, 5.4 / aspect) : Math.max(5.9, 9.2 / aspect);
    const dist = viewH / 2 / Math.tan((camera.fov * Math.PI) / 360);
    camera.position.set(0, dist * 0.2, dist);
    camera.lookAt(0, 0.05, 0);
    stage.resize(stacked ? { x: 0, y: 0 } : { x: 0.24, y: 0.16 });
  }
  layout();

  /* Pointer: the assembly eases toward the cursor (fine pointers only). */
  const aim = { x: 0, y: 0 };
  const look = { x: 0, y: 0 };
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onPointer = (e) => {
    const r = canvas.getBoundingClientRect();
    aim.x = clamp(((e.clientX - (r.left + r.width * (stacked ? 0.5 : 0.7))) / r.width) * 2, -1, 1);
    aim.y = clamp(((e.clientY - (r.top + r.height * 0.45)) / r.height) * 2, -1, 1);
  };
  if (fine && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });

  let clock = 0;
  function pose(t, cycleIndex, time) {
    /* Injection: cavity outline glows as melt fills, then cools. */
    const inject = span(t, 0.15, 0.7) * (1 - span(t, 0.9, 1.5));
    mat.glow.opacity = inject * 0.95;

    const open = easeInOut(span(t, 1.45, 2.35)) * (1 - easeInOut(span(t, 4.15, 5.15)));
    mould.cavity.position.x = -0.32 * open;
    mould.core.position.x = 0.78 * open;

    const eject = easeOut(span(t, 2.35, 2.9)) * (1 - span(t, 4.2, 4.9));
    mould.pins.position.x = -0.3 * eject;

    /* The tool steps back as the part comes forward. */
    const fly = easeInOut(span(t, 2.95, 4.35));
    mould.root.position.z = -0.55 * fly * (1 - span(t, 7.6, 8.9));
    mould.root.position.y = -0.08 * fly * (1 - span(t, 7.6, 8.9));

    const cur = parts[cycleIndex % 2];
    const prev = parts[(cycleIndex + 1) % 2];

    /* Current part: rides the core, is pushed off by the pins, then presented. */
    const inX = mould.core.position.x - 0.07 - 0.3 * eject;
    cur.visible = t > 1.5; // hidden inside the closed tool
    const showBob = Math.sin(time * 1.3) * 0.045;
    cur.position.set(
      lerp(inX, SHOW.x, fly),
      lerp(0, SHOW.y + showBob, fly),
      lerp(0, SHOW.z, fly) + Math.sin(fly * Math.PI) * 0.35
    );
    const spin = fly * Math.sin(time * 0.55) * 0.22;
    cur.rotation.set(lerp(0, SHOW.pitch, fly), lerp(-Math.PI / 2, SHOW.yaw, fly) + spin, 0);
    cur.scale.setScalar(lerp(1, SHOW.scale, fly));
    mat.plastic.emissiveIntensity = 0.6 * (1 - span(t, 1.6, 3.2)) * (t > 1.4 ? 1 : 0);

    /* Previous part: leaves upward and shrinks while the new one is ejected. */
    const leave = easeInOut(span(t, 2.0, 2.95));
    prev.visible = cycleIndex > 0 && leave < 1;
    prev.position.set(SHOW.x + leave * 0.3, SHOW.y + leave * 1.2, SHOW.z - leave * 0.6);
    prev.rotation.set(SHOW.pitch + leave * 0.6, SHOW.yaw + Math.sin(time * 0.55) * 0.22, 0);
    prev.scale.setScalar(SHOW.scale * (1 - leave));
  }

  function render(dt, time) {
    clock += dt;
    const cycleIndex = Math.floor(clock / CYCLE);
    pose(clock % CYCLE, cycleIndex, time);

    look.x = lerp(look.x, aim.x, 0.06);
    look.y = lerp(look.y, aim.y, 0.06);
    root.rotation.y = 0.42 + look.x * 0.32;
    root.rotation.x = 0.04 + look.y * 0.12;

    renderer.render(scene, camera);
  }

  /* Reduced motion: one still frame — part presented, tool closed behind. */
  function still() {
    clock = 6.5;
    render(0, 0);
  }

  let ready = false;
  const ticker = loop((dt, time) => {
    render(dt, time);
    if (!ready) {
      ready = true;
      onReady?.();
    }
  });

  let visible = true;
  const sync = () => {
    if (reduced) return;
    if (visible && !document.hidden) ticker.start();
    else ticker.stop();
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    sync();
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', sync);

  const onResize = () => {
    layout();
    if (reduced) still();
  };
  const ro = new ResizeObserver(onResize);
  ro.observe(canvas);

  if (reduced) {
    still();
    onReady?.();
  } else sync();

  return {
    dispose() {
      ticker.stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pointermove', onPointer);
      shadow.userData.texture?.dispose();
      stage.dispose();
    }
  };
}
