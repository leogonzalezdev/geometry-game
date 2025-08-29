// Random helpers and shape generation with basic non-overlap via retries.

// Simple mulberry32 PRNG for optional seeding (deterministic)
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickRandom(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function choiceWeighted(rng, weights) {
  // weights: [{key, w}]
  const total = weights.reduce((a, b) => a + b.w, 0);
  const r = rng() * total;
  let acc = 0;
  for (const item of weights) {
    acc += item.w;
    if (r <= acc) return item.key;
  }
  return weights[weights.length - 1].key;
}

export const defaultConfig = {
  totalMin: 14,
  totalMax: 24,
  proportions: { circle: 0.4, square: 0.35, triangle: 0.25 },
  sizeMin: 64,
  sizeMax: 96,
  // virtual canvas used as viewBox
  width: 1000,
  height: 700,
  minGap: 10, // minimal gap between shape bounding boxes to avoid big overlaps
  maxPlacementAttempts: 150,
  seed: null, // set a number for reproducible distributions
};

function boundingBox(shape) {
  const { x, y, size } = shape;
  return { x, y, w: size, h: size };
}

function overlaps(boxA, boxB, minGap) {
  // Return true if boxes overlap more than allowed gap
  const ax2 = boxA.x + boxA.w;
  const ay2 = boxA.y + boxA.h;
  const bx2 = boxB.x + boxB.w;
  const by2 = boxB.y + boxB.h;

  const noOverlap = ax2 + minGap <= boxB.x || bx2 + minGap <= boxA.x || ay2 + minGap <= boxB.y || by2 + minGap <= boxA.y;
  return !noOverlap;
}

export function generateShapes(config) {
  const cfg = { ...defaultConfig, ...(config || {}) };
  const rng = cfg.seed != null ? mulberry32(cfg.seed) : Math.random;
  const total = pickRandom(rng, cfg.totalMin, cfg.totalMax);

  // compute counts by proportions ensuring total sum equals total
  const p = cfg.proportions;
  const approx = {
    circle: Math.round(total * p.circle),
    square: Math.round(total * p.square),
    triangle: Math.round(total * p.triangle),
  };
  // fix rounding drift
  let drift = total - (approx.circle + approx.square + approx.triangle);
  const order = ['circle', 'square', 'triangle'];
  let idx = 0;
  while (drift !== 0) {
    const key = order[idx % order.length];
    approx[key] += drift > 0 ? 1 : -1;
    drift += drift > 0 ? -1 : 1;
    idx++;
  }

  const items = [];
  const boxes = [];
  let idCounter = 1;
  const types = ['circle', 'square', 'triangle'];

  const remainingByType = { ...approx };
  const weights = types.map((t) => ({ key: t, w: Math.max(remainingByType[t], 0) || 0.0001 }));

  for (let i = 0; i < total; i++) {
    // choose next type based on remaining counts
    const available = types.filter((t) => remainingByType[t] > 0);
    let type;
    if (available.length === 0) {
      type = choiceWeighted(rng, weights);
    } else {
      type = available[pickRandom(rng, 0, available.length - 1)];
    }
    remainingByType[type]--;

    const size = pickRandom(rng, cfg.sizeMin, cfg.sizeMax);
    // clamp to canvas
    const maxX = Math.max(0, cfg.width - size);
    const maxY = Math.max(0, cfg.height - size);

    let placed = false;
    let x = 0, y = 0;
    for (let attempt = 0; attempt < cfg.maxPlacementAttempts && !placed; attempt++) {
      x = Math.floor(rng() * (maxX + 1));
      y = Math.floor(rng() * (maxY + 1));
      const candidate = { x, y, w: size, h: size };
      let ok = true;
      for (const b of boxes) {
        if (overlaps(candidate, b, cfg.minGap)) { ok = false; break; }
      }
      if (ok) {
        boxes.push(candidate);
        placed = true;
      }
    }
    if (!placed) {
      // fallback: place anyway, best effort
      const candidate = { x: Math.floor(rng() * (maxX + 1)), y: Math.floor(rng() * (maxY + 1)), w: size, h: size };
      boxes.push(candidate);
      x = candidate.x; y = candidate.y;
    }

    items.push({ id: String(idCounter++), type, x, y, size });
  }

  return items;
}
