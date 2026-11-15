'use client';
import copy from '@/lib/copy.json'; // launch copy draft from /mnt/project-files/millwork-copy
import { useRef } from 'react';
import Link from 'next/link';
import { ArtLayers, jigsawPath, placeWhimsy } from './Art';
import { whimsy } from '@/lib/data';
import { useReducedMotion, useScrollProgress, clamp01, easeOut } from './hooks';

const CUTS = jigsawPath();

export default function ExplodedHero({ edition }) {
  const track = useRef(null);
  const reduced = useReducedMotion();
  const raw = useScrollProgress(track);
  // Reduced motion: hold a static, half-exploded diagram instead of scrubbing.
  const p = reduced ? 0.55 : raw;
  const e = easeOut(clamp01((p - 0.08) / 0.5)); // explode 8% → 58% of the track
  const labels = e > 0.6;

  const layers = [
    { key: 'wood', label: `04  ${copy.home.layers.items[3].label}`, node: <div className="wood" style={{ position: 'absolute', inset: 0, borderRadius: 3 }} /> },
    { key: 'print', label: `01  ${copy.home.layers.items[0].label}`, node: <svg viewBox="0 0 1200 900" aria-hidden="true"><ArtLayers palette={edition.palette} /></svg> },
    {
      key: 'cuts', label: `02  ${copy.home.layers.items[1].label}`,
      node: <svg viewBox="0 0 1200 900" aria-hidden="true"><path d={CUTS} fill="none" stroke="#1B4532" strokeWidth="2" strokeOpacity={0.35 + 0.5 * e} /></svg>,
    },
    {
      key: 'whimsy', label: `03  ${copy.home.layers.items[2].label}`,
      node: (
        <svg viewBox="0 0 1200 900" aria-hidden="true">
          {whimsy.map((w) => (
            <path key={w.id} d={w.d} transform={placeWhimsy(w)} fill={`rgba(238,65,41,${0.15 * e})`} stroke="#EE4129" strokeWidth={2 / w.s} />
          ))}
        </svg>
      ),
    },
  ];

  return (
    <section ref={track} className="hero-track" style={reduced ? { height: '100vh' } : undefined} aria-label="Anatomy of a Millwork Puzzles edition">
      <div className="hero-stage">
        <div className="stack" style={{ transform: `rotateX(${54 * e}deg) rotateZ(${-24 * e}deg) scale(${1 - 0.28 * e})` }}>
          {layers.map((l, i) => (
            <div key={l.key} className="layer" style={{ transform: `translateZ(${i * 90 * e}px)` }}>
              {l.node}
              <span className="layer-label mono" style={{ opacity: labels ? 1 : 0 }}>{l.label}</span>
            </div>
          ))}
        </div>
        <div className="hero-copy">
          <span className="mono eyebrow">{edition.drop} · Edition of {String(edition.size).padStart(3, '0')}</span>
          <h1>{copy.home.hero.headline}</h1>
          <p style={{ fontSize: 18, maxWidth: 440 }}>{copy.home.hero.subhead}</p>
          <Link href={`/preview/editions/${edition.slug}/`} className="btn btn-primary" style={{ marginTop: 16 }}>{copy.home.hero.cta_primary}</Link>
        </div>
      </div>
    </section>
  );
}
