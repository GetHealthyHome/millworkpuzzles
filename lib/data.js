// STUB DATA. Copy and commerce threads will replace this file; keep the shapes, swap the values.
// Shape notes: prices are whole US dollars; `remaining` / `size` drive the live scarcity counter.

export const artists = {
  'iris-calder': {
    slug: 'iris-calder',
    name: 'Iris Calder',
    note:
      'Placeholder curatorial note. Calder works in flat, quiet fields of colour, building each composition the way a joiner builds a cabinet: one honest plane at a time. Meridian began as a gouache study of late light over a river valley and was redrawn so that every whimsy piece falls where the eye already wants to rest.',
  },
  'tomas-reyes': { slug: 'tomas-reyes', name: 'Tomás Reyes', note: 'Placeholder note.' },
};

export const editions = [
  {
    slug: 'quiet-meridian',
    title: 'Quiet meridian',
    artist: 'iris-calder',
    drop: 'Drop 03 · Winter 2026',
    size: 50,
    remaining: 14,
    pieces: 512,
    dimensions: '18 × 24 IN',
    status: 'live',
    palette: 'meridian',
    thickness: [
      { id: 'quarter', label: '1/4" hardwood', price: 285 },
      { id: 'half', label: '1/2" hardwood', price: 385 },
    ],
    backing: [
      { id: 'veneer', label: 'Bird’s-eye maple veneer' },
      { id: 'velvet', label: 'Forest plush velvet' },
    ],
    specs: [
      ['Edition', '050 numbered'],
      ['Pieces', '512 PCS'],
      ['Whimsy pieces', '24 custom'],
      ['Substrate', 'Baltic birch core'],
      ['Thickness', '1/4" or 1/2"'],
      ['Print', 'Matte direct-to-wood UV'],
      ['Cut', 'Uncharred laser kerf'],
      ['Finished size', '18 × 24 IN'],
      ['Backing', 'Exotic veneer or velvet'],
    ],
  },
  { slug: 'low-tide-study', number: '002', title: 'Low tide study', artist: 'tomas-reyes', drop: 'Drop 02 · Autumn 2026', size: 25, remaining: 0, pieces: 380, status: 'archived', palette: 'tide', thickness: [{ id: 'half', label: '1/2" hardwood', price: 340 }] },
  { slug: 'orchard-in-rain', number: '001', title: 'Orchard in rain', artist: 'iris-calder', drop: 'Drop 01 · Summer 2026', size: 100, remaining: 0, pieces: 640, status: 'archived', palette: 'orchard', thickness: [{ id: 'half', label: '1/2" hardwood', price: 420 }] },
  { slug: 'commission-2026', number: '1/1', title: 'Annual commission', artist: 'tomas-reyes', drop: 'Commission · 2026', size: 1, remaining: 0, pieces: 1000, status: 'archived', palette: 'commission', thickness: [{ id: 'half', label: '1/2" hardwood', price: 2400 }] },
];

// Up to 10 modular slots per the blueprint.
export const addons = [
  { id: 'frame', name: 'Magnetic display frame', price: 145 },
  { id: 'tray', name: 'Milled walnut sorting trays (set of 4)', price: 95 },
  { id: 'whimsy', name: 'Custom whimsy piece', price: 60 },
  { id: 'plaque', name: 'Engraved brass plaque', price: 40 },
];

// Pins are % coordinates on the gallery image.
export const featurePins = [
  { id: '01', x: 22, y: 30, title: '1/4" vs 1/2" slab depth', body: 'Two true hardwood thicknesses. The half-inch slab stands on its edge.' },
  { id: '02', x: 64, y: 22, title: 'Uncharred kerf precision', body: 'Clean, pale edges with no scorch line, cut to a tolerance you can feel.' },
  { id: '03', x: 40, y: 70, title: 'Matte direct-to-wood UV', body: 'Ink sits in the grain, not on top of it. No gloss, no glare.' },
  { id: '04', x: 80, y: 62, title: 'Exotic wood veneers', body: 'Reverse faces in bird’s-eye maple, wenge or sapele.' },
];

// Whimsy silhouettes: local 0–100 path, placed on the 1200×900 art plane.
export const whimsy = [
  { id: '01', name: 'Heron', x: 180, y: 220, s: 1.5, d: 'M10 60 C25 40 45 38 55 50 C62 35 80 30 92 38 C82 42 76 50 74 58 C70 72 52 80 34 76 L20 86 L24 72 C16 70 12 66 10 60 Z' },
  { id: '02', name: 'Elm leaf', x: 820, y: 380, s: 1.4, d: 'M50 5 C80 25 90 55 50 95 C10 55 20 25 50 5 Z' },
  { id: '03', name: 'Waning moon', x: 900, y: 90, s: 1.3, d: 'M60 8 A44 44 0 1 0 92 70 A36 36 0 1 1 60 8 Z' },
  { id: '04', name: 'Workshop', x: 470, y: 600, s: 1.4, d: 'M50 8 L92 44 L82 44 L82 92 L18 92 L18 44 L8 44 Z' },
];

export const quotes = [
  { text: 'Placeholder. The pieces seat with a sound like a drawer closing in an old house. I left it on the table for a month.', who: 'Collector, Edition 007 / 025' },
  { text: 'Placeholder. The certificate, the box, the weight of it. It feels like acquiring a print, not buying a puzzle.', who: 'Collector, Edition 041 / 100' },
];

// Editions are numbered in order of acquisition: the next collector gets the next number in line.
export const nextNumber = (e) => String(e.size - e.remaining + 1).padStart(3, '0');

export const getEdition = (slug) => editions.find((e) => e.slug === slug);
