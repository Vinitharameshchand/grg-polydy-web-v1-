/**
 * Shared Three.js building blocks for the hero and the process story.
 *
 * Everything is procedural — no model files to download. The objects are
 * deliberately generic (a two-plate injection mould and a louvred grille
 * moulding) rather than a claim about any specific customer part.
 *
 * Only ever imported dynamically, after hydration, so three.js never touches
 * the prerender step or the first paint.
 */
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  PMREMGenerator,
  PerspectiveCamera,
  Scene,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/* Brand palette, matched to global.css tokens. */
export const BRAND = {
  navy: 0x0b1e3f,
  navyPaint: 0x1b3a66,
  amber: 0xe8a317,
  amberHot: 0xff7a1a,
  steel: 0xa7b0bc,
  steelDark: 0x58626f,
  scan: 0x7cc4ff
};

/* ------------------------------------------------------------------ math */
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
/** 0→1 over [a, b], clamped. */
export const span = (t, a, b) => clamp((t - a) / (b - a));
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

/* ----------------------------------------------------------- capability */
/**
 * Probe for WebGL without letting three.js log a console error when it is
 * missing (old GPUs, locked-down browsers, some headless setups).
 */
export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export const isSmallScreen = () => window.matchMedia('(max-width: 760px)').matches;

/* -------------------------------------------------------------- renderer */
export function createStage(canvas, { fov = 30, maxDpr = 1.75 } = {}) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmallScreen() ? 1.5 : maxDpr));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const camera = new PerspectiveCamera(fov, 1, 0.1, 100);

  /* Studio reflections for the steel and the gloss plastic. */
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  scene.environmentIntensity = 0.85;
  room.dispose?.();
  pmrem.dispose();

  const key = new DirectionalLight(0xfff1dc, 2.2);
  key.position.set(-4, 6, 5);
  const rim = new DirectionalLight(0x8fc2ff, 1.6);
  rim.position.set(5, 2, -4);
  scene.add(key, rim);

  /** Size to the canvas box; `offset` shifts the subject within the frame. */
  function resize(offset = { x: 0, y: 0 }) {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    /* A view offset moves the subject without moving the camera, so the
       perspective stays natural when the object sits off-centre. */
    camera.setViewOffset(w, h, -w * offset.x, h * offset.y, w, h);
    camera.updateProjectionMatrix();
    return { w, h, aspect: w / h };
  }

  function dispose() {
    scene.traverse((o) => {
      o.geometry?.dispose();
      const m = o.material;
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else m?.dispose();
    });
    scene.environment?.dispose();
    renderer.dispose();
  }

  return { renderer, scene, camera, resize, dispose };
}

/* ------------------------------------------------------------- materials */
export function makeMaterials() {
  return {
    steel: new MeshStandardMaterial({ color: BRAND.steel, metalness: 1, roughness: 0.3 }),
    steelDark: new MeshStandardMaterial({ color: BRAND.steelDark, metalness: 0.9, roughness: 0.42 }),
    paint: new MeshStandardMaterial({ color: BRAND.navyPaint, metalness: 0.35, roughness: 0.48 }),
    chrome: new MeshStandardMaterial({ color: 0xe8edf3, metalness: 1, roughness: 0.12 }),
    coolBlue: new MeshStandardMaterial({ color: 0x2f7fc8, metalness: 0.2, roughness: 0.4 }),
    coolRed: new MeshStandardMaterial({ color: 0xc8432f, metalness: 0.2, roughness: 0.4 }),
    /* The moulded part: glossy amber engineering polymer. */
    plastic: new MeshPhysicalMaterial({
      color: BRAND.amber,
      metalness: 0,
      roughness: 0.32,
      clearcoat: 0.7,
      clearcoatRoughness: 0.18,
      emissive: new Color(BRAND.amberHot),
      emissiveIntensity: 0
    }),
    /* Molten-polymer glow on the cavity faces during injection. */
    glow: new MeshBasicMaterial({ color: BRAND.amberHot, transparent: true, opacity: 0, depthWrite: false })
  };
}

/* ------------------------------------------------------------ geometry */
function roundedRect(w, h, r) {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export const PART = { w: 1.6, h: 1.0, depth: 0.1 };

/**
 * A louvred grille moulding: rounded frame, angled slats, a centre rib and
 * two mounting bosses on the back. Face normal is +Z, centred on the origin.
 */
export function buildPart(material) {
  const g = new Group();
  const { w, h, depth } = PART;

  const outer = roundedRect(w, h, 0.14);
  outer.holes.push(roundedRect(w - 0.26, h - 0.26, 0.06));
  const frame = new Mesh(
    new ExtrudeGeometry(outer, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.022,
      bevelSize: 0.022,
      bevelSegments: 3,
      curveSegments: 10
    }),
    material
  );
  frame.position.z = -depth / 2;
  g.add(frame);

  const slatGeo = new BoxGeometry(w - 0.26, 0.045, 0.13);
  const n = 6;
  for (let i = 0; i < n; i++) {
    const s = new Mesh(slatGeo, material);
    s.position.y = lerp(-(h - 0.26) / 2 + 0.07, (h - 0.26) / 2 - 0.07, i / (n - 1));
    s.rotation.x = -0.62;
    g.add(s);
  }
  const rib = new Mesh(new BoxGeometry(0.05, h - 0.26, 0.1), material);
  g.add(rib);

  const bossGeo = new CylinderGeometry(0.06, 0.07, 0.16, 18);
  for (const x of [-w / 2 + 0.2, w / 2 - 0.2]) {
    const b = new Mesh(bossGeo, material);
    b.rotation.x = Math.PI / 2;
    b.position.set(x, 0, -depth / 2 - 0.08);
    g.add(b);
  }
  return g;
}

/**
 * Two-plate injection mould, opening along X. The parting plane is x = 0:
 * the fixed (cavity) half sits at -X, the moving (core) half at +X.
 * Returns the halves separately so callers can open them.
 */
export function buildMould(mat) {
  const block = { x: 0.62, y: 1.7, z: 2.3 };
  const half = (side) => {
    const g = new Group();
    const s = side; // -1 cavity, +1 core

    const insert = new Mesh(new RoundedBoxGeometry(block.x, block.y, block.z, 3, 0.035), mat.steel);
    insert.position.x = (s * block.x) / 2;
    g.add(insert);

    /* Clamp plate: wider, painted navy — the machine side of the tool. */
    const clamp = new Mesh(new RoundedBoxGeometry(0.16, block.y + 0.34, block.z + 0.34, 2, 0.03), mat.paint);
    clamp.position.x = s * (block.x + 0.08);
    g.add(clamp);

    /* Cavity outline glow on the parting face (lit during injection). */
    /* Shape lies in XY facing +Z; turned to face the parting plane, its
       width runs along Z and its height along Y, matching the part. */
    const face = new Mesh(new ShapeGeometry(roundedRect(PART.w + 0.08, PART.h + 0.08, 0.16), 8), mat.glow);
    face.rotation.y = s < 0 ? Math.PI / 2 : -Math.PI / 2;
    face.position.x = -s * 0.004;
    g.add(face);

    /* Cooling-water connectors on top: blue in, red out. */
    const nip = new CylinderGeometry(0.045, 0.045, 0.16, 14);
    [[-0.7, mat.coolBlue], [0.7, mat.coolRed]].forEach(([z, m]) => {
      const c = new Mesh(nip, m);
      c.position.set((s * block.x) / 2, block.y / 2 + 0.08, z);
      g.add(c);
    });

    if (s > 0) {
      /* Guide pillars on the core half... */
      const pillar = new CylinderGeometry(0.065, 0.065, 0.5, 20);
      for (const y of [-0.62, 0.62])
        for (const z of [-0.92, 0.92]) {
          const p = new Mesh(pillar, mat.chrome);
          p.rotation.z = Math.PI / 2;
          p.position.set(-0.2, y, z);
          g.add(p);
        }
    } else {
      /* ...and the sprue bushing where the nozzle seats, on the cavity half. */
      const sprue = new Mesh(new CylinderGeometry(0.16, 0.2, 0.22, 24), mat.chrome);
      sprue.rotation.z = Math.PI / 2;
      sprue.position.x = -(block.x + 0.2);
      g.add(sprue);
    }
    /* Socket-head cap screws on the clamp plate's outer face. */
    const bolt = new CylinderGeometry(0.055, 0.055, 0.05, 16);
    for (const y of [-0.82, 0.82])
      for (const z of [-1.0, 1.0]) {
        const b = new Mesh(bolt, mat.steelDark);
        b.rotation.z = Math.PI / 2;
        b.position.set(s * (block.x + 0.185), y, z);
        g.add(b);
      }

    /* Lifting eye on top of the insert. */
    const eye = new Mesh(new TorusGeometry(0.075, 0.022, 8, 20), mat.chrome);
    eye.position.set((s * block.x) / 2, block.y / 2 + 0.1, 0);
    g.add(eye);

    g.userData.face = face;
    return g;
  };

  const cavity = half(-1);
  const core = half(1);

  /* Ejector pins live in the core half and push the part off the core. */
  const pins = new Group();
  const pinGeo = new CylinderGeometry(0.022, 0.022, 0.5, 10);
  for (const [y, z] of [[-0.3, -0.55], [0.3, -0.55], [-0.3, 0.55], [0.3, 0.55]]) {
    const p = new Mesh(pinGeo, mat.chrome);
    p.rotation.z = Math.PI / 2;
    p.position.set(0.25, y, z);
    pins.add(p);
  }
  core.add(pins);

  const root = new Group();
  root.add(cavity, core);
  return { root, cavity, core, pins, block };
}

/** Soft contact shadow — a radial gradient on a plane, no shadow maps needed. */
export function buildShadow(w = 4, d = 3, strength = 0.55) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const grd = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  grd.addColorStop(0, `rgba(0,0,0,${strength})`);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new CanvasTexture(c);
  const m = new Mesh(
    new PlaneGeometry(w, d),
    new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  m.rotation.x = -Math.PI / 2;
  m.userData.texture = tex;
  return m;
}

/** Polymer granules — one draw call for all of them. */
export function buildPellets(count, material) {
  const geo = new SphereGeometry(0.045, 8, 6);
  geo.scale(1.25, 0.8, 0.9);
  const mesh = new InstancedMesh(geo, material, count);
  mesh.frustumCulled = false;
  return mesh;
}

/* Deterministic pseudo-random, so layouts are stable between frames. */
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Runs `frame(dt, t)` on rAF only while `isActive()` — callers gate on visibility. */
export function loop(frame) {
  let raf = 0;
  let last = 0;
  let running = false;
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
    last = now;
    frame(dt, now / 1000);
  };
  return {
    start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    get running() {
      return running;
    }
  };
}
