'use client';
import { useRef, useState } from 'react';
import { ArtLayers, jigsawPath, placeWhimsy } from './Art';
import { useStore } from './Store';
import { useReducedMotion, useScrollProgress, clamp01, easeOut } from './hooks';
import { addons, artists, featurePins, nextNumber, whimsy } from '@/lib/data';
import copy from '@/lib/copy.json'; // launch copy draft from /mnt/project-files/millwork-copy

const CUTS = jigsawPath();
const pad = (n) => String(n).padStart(3, '0');
const Plus = () => <svg className="icon plus" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;

/* ---------- Gallery with feature pins ---------- */
export function Gallery({ edition }) {
  const [active, setActive] = useState(null);
  const { tap } = useStore();
  return (
    <div className="gallery" onMouseLeave={() => setActive(null)}>
      <svg viewBox="0 0 1200 900" role="img" aria-label={`${edition.title}, placeholder artwork with cut lines`}>
        <ArtLayers palette={edition.palette} />
        <path d={CUTS} fill="none" stroke="#1B4532" strokeOpacity=".28" strokeWidth="1.5" />
      </svg>
      {featurePins.map((f, i) => ({ ...f, ...copy.product_sample.pins[i] })).map((f) => {
        const open = active === f.id;
        return (
          <div key={f.id}>
            <button
              className="pin" style={{ left: `${f.x}%`, top: `${f.y}%` }}
              aria-expanded={open} aria-controls={`pin-${f.id}`} aria-label={`Feature ${f.id}: ${f.title}`}
              onMouseEnter={() => setActive(f.id)} onFocus={() => setActive(f.id)}
              onClick={() => { setActive(open ? null : f.id); tap(); }}
            >{f.id}</button>
            {open && (
              <div id={`pin-${f.id}`} className="pin-card" role="tooltip"
                style={{ top: `calc(${f.y}% + 24px)`, ...(f.x > 55 ? { right: `${100 - f.x}%` } : { left: `${Math.max(f.x - 4, 2)}%` }) }}>
                <span className="mono" style={{ color: 'var(--accent-vermilion)', fontWeight: 700 }}>{f.id}</span>
                <strong>{f.title}</strong>{f.body}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Buy box ---------- */
export function BuyBox({ edition }) {
  const { reserve } = useStore();
  const [thick, setThick] = useState(edition.thickness[edition.thickness.length - 1]);
  const [picked, setPicked] = useState([]);
  const [engraving, setEngraving] = useState('');
  const [giftNote, setGiftNote] = useState('');
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const total = thick.price + addons.filter((a) => picked.includes(a.id)).reduce((s, a) => s + a.price, 0);

  return (
    <div className="buy">
      <div>
        <span className="mono eyebrow muted">{edition.drop}</span>
        <h1>{edition.title}</h1>
        <a href="#artist" style={{ display: 'inline-block', marginTop: 10, textUnderlineOffset: 4 }}>{artists[edition.artist].name}</a>
      </div>
      <div className="counter">
        <span className="mono scarcity" aria-live="polite">{pad(edition.remaining)} / {pad(edition.size)} remaining</span>
        <span className="mono">Yours: no. {nextNumber(edition)}</span>
      </div>
      <div>
        <span className="mono" style={{ display: 'block', marginBottom: 10 }}>{copy.product_sample.thickness_option.label}</span>
        <div className="seg" role="group" aria-label={copy.product_sample.thickness_option.label}>
          {edition.thickness.map((t) => (
            <button key={t.id} aria-pressed={thick.id === t.id} onClick={() => setThick(t)}>{t.label}</button>
          ))}
        </div>
      </div>
      <p className="price" style={{ margin: 0 }}>${total}</p>

      <div>
        <details className="accordion">
          <summary>Workshop add-ons <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}><span className="mono muted">{String(picked.length).padStart(2, '0')} / {String(addons.length).padStart(2, '0')}</span><Plus /></span></summary>
          <div className="body">
            {addons.map((a) => (
              <div className="check" key={a.id}>
                <label><input type="checkbox" checked={picked.includes(a.id)} onChange={() => toggle(a.id)} />{a.name}</label>
                <span className="mono">+${a.price}</span>
              </div>
            ))}
          </div>
        </details>
        <details className="accordion">
          <summary>Personalize edition / gift presentation <Plus /></summary>
          <div className="body">
            <label className="mono" htmlFor="engr">{copy.product_sample.personalize.engraving_label}</label>
            <input id="engr" className="input mono" maxLength={24} value={engraving} onChange={(e) => setEngraving(e.target.value.toUpperCase())} placeholder="FOR M. · WINTER 2026" />
            <label className="mono" htmlFor="gift">Gift note</label>
            <textarea id="gift" className="input" rows={3} style={{ padding: 12, minHeight: 88 }} maxLength={240} value={giftNote} onChange={(e) => setGiftNote(e.target.value)} />
          </div>
        </details>
      </div>

      <button className="btn btn-primary btn-block" onClick={() => reserve({ edition, thickness: thick, addons: picked, engraving, giftNote })}>
        Acquire edition
      </button>
      <p className="muted" style={{ margin: 0, fontSize: 14 }}>{copy.product_sample.shipping_note}</p>
    </div>
  );
}

/* ---------- Scroll-triggered whimsy pull-out (non-negotiable) ---------- */
export function WhimsyPullOut({ edition }) {
  const track = useRef(null);
  const reduced = useReducedMotion();
  const raw = useScrollProgress(track);
  const p = reduced ? 0.5 : raw;

  const lift = (i) => {
    const up = easeOut(clamp01((p - (0.04 + i * 0.09)) / 0.14));
    const down = easeOut(clamp01((p - (0.7 + i * 0.04)) / 0.12));
    return up * (1 - down);
  };

  return (
    <section ref={track} className="pull-track" style={reduced ? { height: 'auto' } : undefined} aria-label="Whimsy pieces">
      <div className="pull-stage" style={reduced ? { position: 'static', height: 'auto' } : undefined}>
        <div className="pull-head">
          <div><span className="mono eyebrow">{copy.product_sample.whimsy_pullout.eyebrow_mono}</span><h2>{copy.product_sample.whimsy_pullout.headline}</h2></div>
          <div className="progress" aria-hidden="true"><span style={{ width: `${p * 100}%` }} /></div>
        </div>
        <div className="pull-plane">
          <svg viewBox="0 0 1200 900" role="img" aria-label="Assembled puzzle with whimsy pieces lifting out">
            <defs>
              {whimsy.map((w) => <clipPath key={w.id} id={`wc-${w.id}`}><path d={w.d} transform={placeWhimsy(w)} /></clipPath>)}
            </defs>
            <ArtLayers palette={edition.palette} />
            <path d={CUTS} fill="none" stroke="#1B4532" strokeOpacity=".25" strokeWidth="1.5" />
            {/* Voids left behind: the bare wood well */}
            {whimsy.map((w, i) => (
              <path key={w.id} d={w.d} transform={placeWhimsy(w)} fill="#1B4532" fillOpacity={0.85 * Math.min(1, lift(i) * 3)} />
            ))}
            {whimsy.map((w, i) => {
              const l = lift(i);
              const cx = w.x + 50 * w.s, cy = w.y + 50 * w.s;
              return (
                <g key={w.id}>
                {/* Crisp elevation shadow: unblurred silhouette, offset toward the plane */}
                <path d={w.d} transform={`translate(${l * 30} ${-l * 34}) ${placeWhimsy(w)}`} fill="#1B4532" fillOpacity={0.38 * l} />
                <g className="whimsy-piece" style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: `translate(${l * 18}px, ${-l * 70}px) rotate(${l * (i % 2 ? 6 : -6)}deg) scale(${1 + l * 0.1})`,
                }}>
                  <g clipPath={`url(#wc-${w.id})`}><ArtLayers palette={edition.palette} /></g>
                  <path d={w.d} transform={placeWhimsy(w)} fill="none" stroke="#1B4532" strokeOpacity={l} strokeWidth={2.5 / w.s} />
                </g>
                </g>
              );
            })}
          </svg>
          {whimsy.map((w, i) => {
            const l = lift(i);
            const cx = w.x + 50 * w.s, top = w.y - l * 70 - 18;
            return (
              <div key={w.id} className="callout mono" aria-hidden={l < 0.5}
                style={{ left: `${(cx / 1200) * 100}%`, top: `${(top / 900) * 100}%`, opacity: l > 0.5 ? 1 : 0, transform: 'translate(-50%, -100%)' }}>
                <span className="idx">{w.id}</span>{w.name} · {edition.thickness.at(-1).label.split(' ')[0]}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Reverse-side & thickness inspector ---------- */
export function Inspector({ edition }) {
  const [back, setBack] = useState(false);
  const [backing, setBacking] = useState('veneer');
  const { tap } = useStore();
  const PX_PER_IN = 128; // true proportion: both slabs share one scale

  return (
    <section className="section rule-top">
      <div className="wrap inspector">
        <div>
          <div className="flip-scene">
            <div className={`flip ${back ? 'back' : ''}`}>
              <div><svg viewBox="0 0 1200 900" width="100%" height="100%" aria-hidden="true"><ArtLayers palette={edition.palette} /><path d={CUTS} fill="none" stroke="#1B4532" strokeOpacity=".28" strokeWidth="1.5" /></svg></div>
              <div className={`face-back ${backing}`}><svg viewBox="0 0 1200 900" width="100%" height="100%" aria-hidden="true"><path d={CUTS} fill="none" stroke={backing === 'velvet' ? '#0d2a1c' : '#9c7a4a'} strokeOpacity=".7" strokeWidth="2" /></svg></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" aria-pressed={back} onClick={() => { setBack(!back); tap(); }}>{back ? copy.product_sample.inspector.toggle_front : copy.product_sample.inspector.toggle_back}</button>
            {back && edition.backing?.map((b) => (
              <button key={b.id} className="btn" aria-pressed={backing === b.id} style={backing === b.id ? { background: 'var(--ink-forest)', color: 'var(--bg-parchment)' } : undefined} onClick={() => setBacking(b.id)}>{b.label}</button>
            ))}
          </div>
        </div>
        <div className="xsection">
          <div><span className="mono eyebrow">{copy.product_sample.inspector.cross_section_label}</span><h2>{copy.product_sample.inspector.headline}</h2><p className="muted" style={{ marginTop: 12 }}>{copy.product_sample.inspector.body}</p></div>
          {edition.thickness.map((t) => {
            const inches = t.id === 'half' ? 0.5 : 0.25;
            return (
              <div key={t.id} className="slab">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span className="mono">{t.label}</span><span className="mono muted">{inches * 25.4} MM</span></div>
                <div className="slab-bar" style={{ height: inches * PX_PER_IN }}>
                  {[18, 41, 63, 86].map((x) => <i key={x} style={{ left: `${x}%` }} />)}
                </div>
              </div>
            );
          })}
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>Shown at true relative proportion. Vermilion band = matte UV print layer; pale gaps = uncharred kerf.</p>
        </div>
      </div>
    </section>
  );
}
