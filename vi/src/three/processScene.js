/**
 * "Pellet to part" — a scroll-driven walk along an injection moulding
 * machine. Every pose is a pure function of scroll progress, so scrolling
 * back up plays the story in reverse with no state to unwind.
 *
 *   0.0–0.2  material   granules fall into the hopper
 *   0.2–0.4  plasticise  heater bands come up, the screw turns, melt forms
 *   0.4–0.6  inject      screw drives forward, the cavity fills
 *   0.6–0.8  eject       tool opens, pins push the part off the core
 *   0.8–1.0  inspect     part moves to the bench and is scanned
 */
import {
  CatmullRomCurve3,
  Color,
  Curve,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  GridHelper,
  Group,
  LatheGeometry,
  LineBasicMaterial,
  LineSegments,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Plane,
  PointLight,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {
  BRAND,
  PART,
  buildMould,
  buildPart,
  buildPellets,
  buildShadow,
  clamp,
  createStage,
  easeInOut,
  easeOut,
  isSmallScreen,
  lerp,
  loop,
  makeMaterials,
  rng,
  smoother,
  span
} from './kit';

const MOULD_X = 1.25; // parting plane of the tool, in world X
const BENCH = new Vector3(4.75, 0.45, 0.3); // inspection position

/* Camera stations, one per step. The path is a spline through them. */
const STATIONS = [
  { pos: [-1.3, 2.75, 5.6], tgt: [-2.95, 1.15, 0] },
  { pos: [-0.9, 1.45, 4.7], tgt: [-2.0, 0.0, 0] },
  { pos: [-1.2, 2.1, 5.6], tgt: [1.15, -0.05, 0] },
  { pos: [2.9, 2.5, 7.0], tgt: [1.85, -0.05, 0] },
  { pos: [5.6, 1.8, 6.0], tgt: [4.75, 0.3, 0.3] }
];

class Helix extends Curve {
  constructor(x0, x1, radius, pitch) {
    super();
    Object.assign(this, { x0, x1, radius, pitch });
  }
  getPoint(t, out = new Vector3()) {
    const x = lerp(this.x0, this.x1, t);
    const a = ((x - this.x0) / this.pitch) * Math.PI * 2;
    return out.set(x, Math.sin(a) * this.radius, Math.cos(a) * this.radius);
  }
}

export function mountProcess(canvas, { onReady } = {}) {
  const small = isSmallScreen();
  const stage = createStage(canvas, { fov: 34, maxDpr: 1.5 });
  const { renderer, scene, camera } = stage;
  renderer.localClippingEnabled = true;
  const mat = makeMaterials();

  /* Local materials for things that change per step. */
  const barrelMat = mat.steel.clone();
  barrelMat.side = DoubleSide;
  const heaterMat = new MeshStandardMaterial({
    color: 0x3b2e28,
    metalness: 0.4,
    roughness: 0.6,
    emissive: new Color(BRAND.amberHot),
    emissiveIntensity: 0,
    side: DoubleSide
  });
  const meltMat = new MeshStandardMaterial({
    color: BRAND.amberHot,
    emissive: new Color(BRAND.amberHot),
    emissiveIntensity: 1.4,
    roughness: 0.3
  });
  const pelletMat = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.42, metalness: 0 });
  const partMat = mat.plastic.clone();
  const fillPlane = new Plane(new Vector3(0, -1, 0), 10);
  partMat.clippingPlanes = [fillPlane];
  const ghostSteel = mat.steel.clone();
  const ghostPaint = mat.paint.clone();
  const scanMat = new MeshBasicMaterial({ color: BRAND.scan, transparent: true, opacity: 0, depthWrite: false });
  const dimMat = new LineBasicMaterial({ color: BRAND.amber, transparent: true, opacity: 0 });

  const world = new Group();
  scene.add(world);

  /* ---- floor grid for spatial depth */
  const grid = new GridHelper(40, 80, 0x2b4a78, 0x1a3157);
  grid.position.y = -1.62;
  grid.material.transparent = true;
  grid.material.opacity = 0.45;
  world.add(grid);

  /* ---- machine bed */
  const bed = new Mesh(new RoundedBoxGeometry(7.2, 0.5, 2.7, 2, 0.05), mat.paint);
  bed.position.set(-0.75, -1.36, 0);
  world.add(bed);
  const bedShadow = buildShadow(9, 4, 0.45);
  bedShadow.position.set(-0.75, -1.6, 0);
  world.add(bedShadow);

  /* ---- barrel, cut away toward the viewer */
  const BARREL = { x0: -3.75, x1: -0.1, r: 0.34 };
  const blen = BARREL.x1 - BARREL.x0;
  const cut = { start: Math.PI * 0.32, len: Math.PI * 1.36 }; // open sector faces +Z
  const barrel = new Mesh(new CylinderGeometry(BARREL.r, BARREL.r, blen, 48, 1, true, cut.start, cut.len), barrelMat);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.x = (BARREL.x0 + BARREL.x1) / 2;
  world.add(barrel);

  const heaters = [];
  for (let i = 0; i < 6; i++) {
    const h = new Mesh(new CylinderGeometry(0.385, 0.385, 0.26, 40, 1, true, cut.start, cut.len), heaterMat);
    h.rotation.z = Math.PI / 2;
    h.position.x = lerp(-3.2, -0.55, i / 5);
    heaters.push(h);
    world.add(h);
  }
  const heatLight = new PointLight(BRAND.amberHot, 0, 4, 2);
  heatLight.position.set(-1.9, 0.2, 0.9);
  world.add(heatLight);

  const flange = new Mesh(new RoundedBoxGeometry(0.22, 1.0, 1.0, 2, 0.04), mat.paint);
  flange.position.x = BARREL.x0 - 0.1;
  world.add(flange);

  const nozzle = new Mesh(new CylinderGeometry(0.07, 0.3, 0.44, 32), mat.chrome);
  nozzle.rotation.z = -Math.PI / 2; // tip toward +X
  nozzle.position.x = BARREL.x1 + 0.22;
  world.add(nozzle);

  /* ---- reciprocating screw */
  const screw = new Group();
  const shaft = new Mesh(new CylinderGeometry(0.12, 0.12, blen - 0.3, 24), mat.chrome);
  shaft.rotation.z = Math.PI / 2;
  shaft.position.x = (BARREL.x0 + BARREL.x1) / 2 - 0.1;
  screw.add(shaft);
  const flight = new Mesh(
    new TubeGeometry(new Helix(BARREL.x0 + 0.15, BARREL.x1 - 0.5, 0.21, 0.34), 360, 0.05, 8, false),
    mat.chrome
  );
  screw.add(flight);
  world.add(screw);

  /* Melt column: grows from the feed zone toward the nozzle. */
  const meltLen = 1.9;
  const meltGeo = new CylinderGeometry(0.235, 0.235, meltLen, 32);
  meltGeo.rotateZ(Math.PI / 2);
  meltGeo.translate(meltLen / 2, 0, 0);
  const melt = new Mesh(meltGeo, meltMat);
  melt.position.x = BARREL.x1 - 0.15 - meltLen;
  world.add(melt);

  /* ---- hopper, cut away toward the viewer */
  const HOPPER_X = -3.05;
  const profile = [
    new Vector2(0.17, 0.3),
    new Vector2(0.17, 0.85),
    new Vector2(0.86, 1.72),
    new Vector2(0.9, 2.25)
  ];
  const hopper = new Mesh(new LatheGeometry(profile, 48, Math.PI * 0.3, Math.PI * 1.4), barrelMat);
  hopper.position.x = HOPPER_X;
  world.add(hopper);
  const rimGeo = new TorusGeometry(0.9, 0.03, 8, 48, Math.PI * 1.4);
  const rim = new Mesh(rimGeo, mat.paint);
  rim.rotation.set(Math.PI / 2, 0, -Math.PI * 0.2);
  rim.position.set(HOPPER_X, 2.25, 0);
  world.add(rim);

  /* ---- mould, tie bars, moving platen */
  const mould = buildMould(mat);
  mould.root.position.x = MOULD_X;
  mould.cavity.children[0].material = ghostSteel;
  mould.cavity.children[1].material = ghostPaint;
  world.add(mould.root);

  const tieGeo = new CylinderGeometry(0.06, 0.06, 3.0, 16);
  for (const y of [-1.1, 1.1])
    for (const z of [-1.4, 1.4]) {
      const t = new Mesh(tieGeo, mat.chrome);
      t.rotation.z = Math.PI / 2;
      t.position.set(MOULD_X + 0.8, y, z);
      world.add(t);
    }
  const platen = new Mesh(new RoundedBoxGeometry(0.26, 2.6, 3.2, 2, 0.04), mat.paint);
  const PLATEN_X = MOULD_X + 0.92;
  platen.position.x = PLATEN_X;
  world.add(platen);

  /* ---- the part */
  const part = buildPart(partMat);
  world.add(part);

  /* ---- inspection bench */
  const bench = new Mesh(new RoundedBoxGeometry(2.6, 0.32, 1.9, 2, 0.05), new MeshStandardMaterial({ color: 0x2c3440, roughness: 0.35, metalness: 0.1 }));
  bench.position.set(BENCH.x, -0.75, BENCH.z);
  world.add(bench);
  const benchShadow = buildShadow(3.6, 2.6, 0.5);
  benchShadow.position.set(BENCH.x, -0.58, BENCH.z);
  world.add(benchShadow);

  const ring = new Mesh(new TorusGeometry(0.82, 0.014, 8, 96), scanMat);
  ring.rotation.y = Math.PI / 2;
  ring.position.copy(BENCH);
  world.add(ring);

  /* Dimension lines with end ticks: overall width (top) and height (right). */
  const dims = (() => {
    const w = PART.w / 2 + 0.02;
    const h = PART.h / 2 + 0.02;
    const o = 0.2;
    const tk = 0.07;
    const v = [
      -w, h + o, 0, w, h + o, 0,
      -w, h + o - tk, 0, -w, h + o + tk, 0,
      w, h + o - tk, 0, w, h + o + tk, 0,
      w + o, -h, 0, w + o, h, 0,
      w + o - tk, -h, 0, w + o + tk, -h, 0,
      w + o - tk, h, 0, w + o + tk, h, 0
    ];
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(v, 3));
    return new LineSegments(g, dimMat);
  })();
  world.add(dims);

  /* ---- granules */
  const N = small ? 170 : 380;
  const pellets = buildPellets(N, pelletMat);
  world.add(pellets);
  const rand = rng(7);
  const seeds = Array.from({ length: N }, (_, i) => {
    const kind = i % 20 < 8 ? 'stream' : i % 20 < 15 ? 'pile' : 'feed';
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand());
    const y = lerp(0.95, 1.5, rand());
    return { kind, a, r, y, phase: rand(), spin: rand() * 6, shade: 0.82 + rand() * 0.3 };
  });
  const tint = new Color();
  seeds.forEach((s, i) => pellets.setColorAt(i, tint.setHex(BRAND.amber).multiplyScalar(s.shade)));
  const dummy = new Object3D();

  function updatePellets(time, feedSpeed) {
    for (let i = 0; i < N; i++) {
      const s = seeds[i];
      let x, y, z, sc = 1;
      if (s.kind === 'stream') {
        const k = (time * 0.32 + s.phase) % 1;
        const rr = s.r * 0.5;
        x = HOPPER_X + Math.cos(s.a) * rr;
        z = Math.sin(s.a) * rr;
        y = lerp(4.2, 1.35, k * k);
        sc = 1 - span(k, 0.85, 1);
      } else if (s.kind === 'pile') {
        const lim = lerp(0.17, 0.86, (s.y - 0.85) / 0.87) * 0.82;
        x = HOPPER_X + Math.cos(s.a) * s.r * lim;
        z = Math.sin(s.a) * s.r * lim;
        y = s.y + Math.sin(time * 3 + s.spin) * 0.004;
      } else {
        const k = (time * 0.12 * feedSpeed + s.phase) % 1;
        const a = s.a + time * 2.2 * feedSpeed;
        x = lerp(HOPPER_X, -1.65, k);
        y = Math.sin(a) * 0.255;
        z = Math.cos(a) * 0.255;
        sc = 1 - smoother(span(k, 0.55, 1)); // melting
      }
      dummy.position.set(x, y, z);
      dummy.rotation.set(s.spin + time * 0.8, s.spin * 2, 0);
      dummy.scale.setScalar(Math.max(sc, 0.0001));
      dummy.updateMatrix();
      pellets.setMatrixAt(i, dummy.matrix);
    }
    pellets.instanceMatrix.needsUpdate = true;
  }

  /* ---- camera path */
  const posCurve = new CatmullRomCurve3(STATIONS.map((s) => new Vector3(...s.pos)), false, 'centripetal');
  const tgtCurve = new CatmullRomCurve3(STATIONS.map((s) => new Vector3(...s.tgt)), false, 'centripetal');
  const camPos = new Vector3();
  const camTgt = new Vector3();

  /** Holds at each station, moves between them. */
  function pathParam(p) {
    const n = STATIONS.length;
    const c = (k) => (k + 0.5) / n;
    if (p <= c(0)) return 0;
    if (p >= c(n - 1)) return 1;
    const k = Math.floor(p * n - 0.5);
    return (k + smoother(span(p, c(k), c(k + 1)))) / (n - 1);
  }

  let frame = { offset: { x: 0, y: 0 }, zoom: 1 };
  function layout() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const aspect = w / h;
    const narrow = aspect < 1;
    /* Wide: copy panel on the left, subject right of centre.
       Narrow: copy at the bottom, subject in the upper part, pulled back. */
    frame = narrow
      ? { offset: { x: 0, y: 0.17 }, zoom: clamp(1.05 / aspect, 1.2, 2.3) }
      : { offset: { x: w > 1100 ? 0.15 : 0.1, y: 0.02 }, zoom: aspect < 1.4 ? 1.2 : 1 };
    stage.resize(frame.offset);
  }
  layout();

  /* ---- state */
  let target = 0;
  let shown = 0;
  const aim = { x: 0, y: 0 };
  const look = { x: 0, y: 0 };
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onPointer = (e) => {
    aim.x = (e.clientX / window.innerWidth) * 2 - 1;
    aim.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (fine) window.addEventListener('pointermove', onPointer, { passive: true });

  let screwAngle = 0;
  function pose(p, time, dt) {
    /* Step 2: heat and melt. */
    const heat = smoother(span(p, 0.22, 0.34));
    heaterMat.emissiveIntensity = heat * (1.15 + Math.sin(time * 4) * 0.08);
    heatLight.intensity = heat * 6;
    const feed = 0.25 + heat * 0.75;

    /* Step 3: injection — screw drives forward, melt leaves the barrel. */
    const fill = smoother(span(p, 0.43, 0.56));
    melt.scale.x = Math.max(0.001, smoother(span(p, 0.24, 0.38)) * (1 - 0.55 * fill));
    screw.position.x = 0.22 * fill;
    screwAngle += dt * 3 * heat * (1 - span(p, 0.42, 0.45)) + dt * 0.4;
    screw.rotation.x = screwAngle;

    /* The fixed half turns translucent so the filling cavity is visible. */
    const ghost = span(p, 0.38, 0.44) * (1 - span(p, 0.6, 0.66));
    for (const m of [ghostSteel, ghostPaint]) {
      m.opacity = 1 - 0.78 * ghost;
      m.transparent = m.opacity < 0.999;
      m.depthWrite = !m.transparent;
    }
    mat.glow.opacity = Math.sin(fill * Math.PI) * 0.8;
    fillPlane.constant = p < 0.57 ? lerp(-0.62, 0.62, fill) : 10;
    partMat.emissiveIntensity = 1.3 * (1 - span(p, 0.54, 0.64));

    /* Step 4: open and eject. */
    const open = easeInOut(span(p, 0.62, 0.7));
    mould.core.position.x = 1.0 * open;
    mould.cavity.position.x = 0;
    platen.position.x = PLATEN_X + open;
    const eject = easeOut(span(p, 0.7, 0.76));
    mould.pins.position.x = -0.3 * eject;
    const lift = easeOut(span(p, 0.76, 0.8));

    /* Step 5: to the bench, then scanned. */
    const travel = easeInOut(span(p, 0.8, 0.88));
    const inX = MOULD_X + mould.core.position.x - 0.07 - 0.3 * eject;
    part.visible = p > 0.42;
    /* Out toward the viewer first, so the path clears the moving platen
       (it spans z ±1.6), then across to the bench. */
    const outward = easeOut(span(p, 0.8, 0.84)) * (1 - easeInOut(span(p, 0.84, 0.88)));
    part.position.set(
      lerp(inX, BENCH.x, easeInOut(span(p, 0.82, 0.88))),
      lerp(lift * 0.22, BENCH.y, travel) + Math.sin(travel * Math.PI) * 0.35,
      lerp(0, BENCH.z, travel) + outward * 2.1
    );
    const settle = span(p, 0.86, 1);
    part.rotation.set(
      lerp(0, 0.1, travel),
      lerp(-Math.PI / 2, -0.24, travel) + Math.sin(time * 0.5) * 0.12 * settle,
      0
    );

    const scan = smoother(span(p, 0.87, 0.91));
    scanMat.opacity = scan * 0.9;
    ring.visible = scan > 0.001;
    ring.position.set(BENCH.x + Math.sin(time * 1.5) * 0.85, BENCH.y, BENCH.z);
    dimMat.opacity = smoother(span(p, 0.9, 0.95));
    dims.visible = dimMat.opacity > 0.001;
    dims.position.copy(part.position);
    dims.rotation.copy(part.rotation);

    updatePellets(time, feed);

    /* Camera along the spline, with a little pointer parallax. */
    const u = pathParam(p);
    posCurve.getPoint(u, camPos);
    tgtCurve.getPoint(u, camTgt);
    look.x = lerp(look.x, aim.x, 0.05);
    look.y = lerp(look.y, aim.y, 0.05);
    camPos.sub(camTgt).multiplyScalar(frame.zoom).add(camTgt);
    camPos.x += look.x * 0.3;
    camPos.y -= look.y * 0.18;
    camera.position.copy(camPos);
    camera.lookAt(camTgt);
  }

  let ready = false;
  const ticker = loop((dt, time) => {
    /* Ease toward the scroll position so wheel steps read as motion. */
    shown = lerp(shown, target, 1 - Math.exp(-dt * 7));
    if (Math.abs(shown - target) < 1e-4) shown = target;
    pose(shown, time, dt);
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      onReady?.();
    }
  });

  let visible = false;
  const sync = () => (visible && !document.hidden ? ticker.start() : ticker.stop());
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    sync();
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', sync);
  const ro = new ResizeObserver(layout);
  ro.observe(canvas);

  return {
    setProgress(p) {
      target = clamp(p);
    },
    /** Jump without easing (first frame, or returning to the section). */
    snap(p) {
      target = shown = clamp(p);
    },
    dispose() {
      ticker.stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pointermove', onPointer);
      bedShadow.userData.texture?.dispose();
      benchShadow.userData.texture?.dispose();
      stage.dispose();
    }
  };
}
