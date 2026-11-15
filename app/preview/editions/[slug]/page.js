import { notFound } from 'next/navigation';
import { editions, getEdition, artists } from '@/lib/data';
import copy from '@/lib/copy.json'; // launch copy draft from /mnt/project-files/millwork-copy
import { Gallery, BuyBox, WhimsyPullOut, Inspector } from '@/components/Pdp';
import MakersMark from '@/components/MakersMark';

// Only live editions get a purchase page; archived ones live in the archive grid.
export const generateStaticParams = () => editions.filter((e) => e.status === 'live').map((e) => ({ slug: e.slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const e = getEdition((await params).slug);
  return { title: e ? `${e.title} · Millwork Puzzles` : 'Millwork Puzzles' };
}

export default async function EditionPage({ params }) {
  const edition = getEdition((await params).slug);
  if (!edition) notFound();
  const artist = artists[edition.artist];

  return (
    <>
      <div className="wrap pdp-top">
        <Gallery edition={edition} />
        <BuyBox edition={edition} />
      </div>

      <div className="rule-top"><WhimsyPullOut edition={edition} /></div>
      <Inspector edition={edition} />

      <section className="section rule-top">
        <div className="wrap">
          <span className="mono eyebrow">{copy.product_sample.spec_matrix.heading}</span>
          <div className="spec">
            <div className="spec-mark"><MakersMark /><span className="mono">{copy.product_sample.spec_matrix.makers_mark_caption}</span></div>
            <div className="spec-cells">
              {edition.specs.map(([k, v]) => (<div key={k}><span className="mono muted">{k}</span><span className="v">{v}</span></div>))}
            </div>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="wrap">
          <span className="mono eyebrow">Provenance</span>
          <h2 style={{ marginBottom: 16 }}>{copy.product_sample.provenance.heading}</h2>
          <p className="muted" style={{ maxWidth: 640, margin: '0 0 40px' }}>{copy.product_sample.provenance.body}</p>
          <div className="grid-rule provenance" style={{ borderColor: 'var(--bg-parchment)' }}>
            {copy.product_sample.provenance.items.map((it, i) => [String(i + 1).padStart(2, '0'), it.label, it.detail]).map(([n, t, b]) => (
              <div key={n} style={{ borderColor: 'var(--bg-parchment)', display: 'grid', gap: 10 }}>
                <span className="mono" style={{ color: 'var(--accent-vermilion)', fontWeight: 700, fontSize: 16 }}>{n}</span>
                <h3>{t}</h3><p className="muted" style={{ margin: 0 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="artist" className="section">
        <div className="wrap split" style={{ alignItems: 'start' }}>
          <div><span className="mono eyebrow">Curatorial note</span><h2>{artist.name}</h2><a href="#" style={{ display: 'inline-block', marginTop: 16, textUnderlineOffset: 4 }}>All works by {artist.name}</a></div>
          <div className="serif"><p>{artist.note}</p></div>
        </div>
      </section>

      <section className="section rule-top">
        <div className="wrap">
          <span className="mono eyebrow">{copy.product_sample.testimonials.heading}</span>
          <div className="split" style={{ alignItems: 'start' }}>
            {copy.product_sample.testimonials.items.map((q) => ({ text: q.quote, who: q.attribution_mono })).map((q) => (
              <figure key={q.who} className="quote"><p className="serif"><em>“{q.text}”</em></p><figcaption className="mono muted">{q.who}</figcaption></figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
