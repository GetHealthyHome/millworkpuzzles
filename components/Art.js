// Placeholder artwork + cut geometry. Swap <Artwork> for real photography/scans at launch.
const palettes = {
  meridian: { sky: '#EEE2CB', sun: '#EE4129', far: '#9DB3A3', mid: '#4A6B5C', near: '#1B4532', river: '#E4D6BC' },
  tide: { sky: '#E4D6BC', sun: '#1B4532', far: '#B9C7BD', mid: '#7F9C8C', near: '#4A6B5C', river: '#EEE2CB' },
  orchard: { sky: '#D9C9A8', sun: '#EE4129', far: '#4A6B5C', mid: '#1B4532', near: '#2E5A43', river: '#EEE2CB' },
  commission: { sky: '#1B4532', sun: '#EEE2CB', far: '#2E5A43', mid: '#4A6B5C', near: '#EE4129', river: '#E4D6BC' },
};

export function ArtLayers({ palette = 'meridian' }) {
  const p = palettes[palette] || palettes.meridian;
  return (
    <>
      <rect width="1200" height="900" fill={p.sky} />
      <circle cx="880" cy="250" r="120" fill={p.sun} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1="0" x2="1200" y1={120 + i * 22} y2={120 + i * 22} stroke={p.mid} strokeOpacity=".18" />
      ))}
      <path d="M0 520 C180 420 320 470 470 430 C640 380 780 460 960 410 C1060 385 1140 400 1200 420 V900 H0 Z" fill={p.far} />
      <path d="M0 610 C200 540 360 600 560 560 C760 520 900 590 1200 540 V900 H0 Z" fill={p.mid} />
      <path d="M520 900 C560 780 640 700 760 640 C820 610 900 600 980 610 C900 650 820 700 760 780 C720 830 700 870 690 900 Z" fill={p.river} />
      <path d="M0 720 C160 680 300 740 480 720 C600 706 640 760 600 900 H0 Z" fill={p.near} />
      <path d="M1200 700 C1060 690 960 740 900 900 H1200 Z" fill={p.near} />
    </>
  );
}

export function Artwork({ palette, className, label = 'Placeholder artwork' }) {
  return (
    <svg viewBox="0 0 1200 900" className={className} role="img" aria-label={label}>
      <ArtLayers palette={palette} />
    </svg>
  );
}

// Deterministic classic jigsaw cut lines. cols × rows grid on a w × h plane.
export function jigsawPath(cols = 12, rows = 9, w = 1200, h = 900, seed = 7) {
  let s = seed;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const edge = (x0, y0, x1, y1) => {
    // One edge with a tab; local frame along (dx,dy), normal (nx,ny).
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
    const flip = rand() > 0.5 ? 1 : -1, j = (rand() - 0.5) * 0.08;
    const P = (t, n) => `${(x0 + ux * len * t + nx * len * n * flip).toFixed(1)} ${(y0 + uy * len * t + ny * len * n * flip).toFixed(1)}`;
    return ` C ${P(0.2, 0)} ${P(0.35 + j, 0.02)} ${P(0.38 + j, -0.08)}` +
      ` C ${P(0.3 + j, -0.25)} ${P(0.7 + j, -0.25)} ${P(0.62 + j, -0.08)}` +
      ` C ${P(0.65 + j, 0.02)} ${P(0.8, 0)} ${P(1, 0)}`;
  };
  const cw = w / cols, rh = h / rows;
  let d = '';
  for (let r = 1; r < rows; r++) {
    d += `M 0 ${r * rh}`;
    for (let c = 0; c < cols; c++) d += edge(c * cw, r * rh, (c + 1) * cw, r * rh);
  }
  for (let c = 1; c < cols; c++) {
    d += ` M ${c * cw} 0`;
    for (let r = 0; r < rows; r++) d += edge(c * cw, r * rh, c * cw, (r + 1) * rh);
  }
  return d;
}

export const placeWhimsy = (wm) => `translate(${wm.x} ${wm.y}) scale(${wm.s})`;
