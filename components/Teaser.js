'use client';
import copy from '@/lib/copy.json'; // launch copy draft from /mnt/project-files/millwork-copy
import { useRef, useState } from 'react';
import { ArtLayers } from './Art';
import { useReducedMotion, useScrollProgress, clamp01, easeOut } from './hooks';

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  const submit = (e) => {
    e.preventDefault();
    // Stub: wire to the email provider chosen in the commerce plan.
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'ok' : 'bad');
  };
  if (state === 'ok') return <p className="mono" role="status" style={{ marginTop: 32 }}>{copy.teaser.capture.success}</p>;
  return (
    <form onSubmit={submit} noValidate>
      <div className="capture">
        <label htmlFor="email" className="sr-only">Email address</label>
        <input id="email" type="email" className="input" placeholder={copy.teaser.capture.placeholder} value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={state === 'bad'} aria-describedby="email-msg" autoComplete="email" />
        <button className="btn btn-primary" type="submit" style={{ whiteSpace: 'nowrap' }}>{copy.teaser.capture.cta}</button>
      </div>
      <p id="email-msg" role="status" className="mono" style={{ minHeight: 20 }}>{state === 'bad' ? copy.teaser.capture.error_invalid : copy.teaser.capture.helper}</p>
    </form>
  );
}

const COLS = 4, ROWS = 3, TW = 300, TH = 300;
const tiles = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS, r = Math.floor(i / COLS);
  const a = (i * 137.5 * Math.PI) / 180; // golden-angle scatter, deterministic
  return { c, r, dx: Math.cos(a) * (260 + (i % 3) * 120), dy: Math.sin(a) * (220 + (i % 4) * 80), rot: ((i * 47) % 50) - 25 };
});

export function AssemblePreview() {
  const track = useRef(null);
  const reduced = useReducedMotion();
  const raw = useScrollProgress(track);
  const e = reduced ? 1 : easeOut(clamp01(raw / 0.7));
  return (
    <section ref={track} className="assemble-track rule-top" style={reduced ? { height: '100vh' } : undefined} aria-label="Craft preview">
      <div className="assemble-stage">
        <div style={{ width: 'min(86vw, 900px)', display: 'grid', gap: 24 }}>
          <span className="mono" style={{ textAlign: 'center' }}>{e < 0.99 ? 'Scroll to assemble' : 'Seated. 512 pieces, one plane.'}</span>
          <svg viewBox="0 0 1200 900" style={{ overflow: 'visible' }} role="img" aria-label="Puzzle sections assembling as you scroll">
            <defs>{tiles.map((t, i) => <clipPath key={i} id={`tc-${i}`}><rect x={t.c * TW} y={t.r * TH} width={TW} height={TH} rx="3" /></clipPath>)}</defs>
            {tiles.map((t, i) => {
              const k = 1 - e;
              return (
                <g key={i} style={{ transformBox: 'view-box', transformOrigin: `${t.c * TW + TW / 2}px ${t.r * TH + TH / 2}px`, transform: `translate(${t.dx * k}px, ${t.dy * k}px) rotate(${t.rot * k}deg)` }}>
                  <g clipPath={`url(#tc-${i})`}><ArtLayers /></g>
                  <rect x={t.c * TW} y={t.r * TH} width={TW} height={TH} rx="3" fill="none" stroke="#1B4532" strokeOpacity={0.15 + 0.5 * k} />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
