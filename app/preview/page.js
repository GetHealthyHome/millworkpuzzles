import copy from '@/lib/copy.json'; // launch copy draft from /mnt/project-files/millwork-copy
import Link from 'next/link';
import ExplodedHero from '@/components/ExplodedHero';
import { Artwork } from '@/components/Art';
import MakersMark from '@/components/MakersMark';
import RegistryForm from '@/components/RegistryForm';
import { editions, artists } from '@/lib/data';

const pad = (n) => String(n).padStart(3, '0');

export default function Home() {
  const live = editions.find((e) => e.status === 'live');
  const archive = editions.filter((e) => e.status === 'archived');
  return (
    <>
      <ExplodedHero edition={live} />

      <section className="section rule-top">
        <div className="wrap split">
          <Link href={`/preview/editions/${live.slug}/`} className="card">
            <div className="thumb"><Artwork palette={live.palette} /></div>
          </Link>
          <div>
            <span className="mono eyebrow">{copy.home.current_drop.eyebrow_mono} · {live.drop}</span>
            <h2>{live.title}</h2>
            <p className="muted" style={{ margin: '12px 0 28px' }}>{artists[live.artist].name}</p>
            <div className="counter"><span className="mono scarcity">{pad(live.remaining)} / {pad(live.size)} remaining</span><span className="mono">{live.pieces} PCS</span></div>
            <p className="price" style={{ margin: '20px 0' }}>From ${live.thickness[0].price}</p>
            <Link href={`/preview/editions/${live.slug}/`} className="btn btn-primary">Acquire edition</Link>
          </div>
        </div>
      </section>

      <section id="craft" className="section dark">
        <div className="wrap split">
          <div>
            <span className="mono eyebrow">{copy.home.craft.eyebrow_mono}</span>
            <h2>{copy.home.craft.headline}</h2>
          </div>
          <div className="serif">
            <p>{copy.home.craft.body}</p>
            <p>{copy.home.model.headline} {copy.home.model.body}</p>
          </div>
        </div>
      </section>

      <section id="archive" className="section">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 40, gap: 24, flexWrap: 'wrap' }}>
            <div><span className="mono eyebrow">Permanent archive</span><h2>{copy.home.archive_teaser.headline}</h2></div>
            <p className="muted" style={{ maxWidth: 360, margin: 0 }}>{copy.home.archive_teaser.body}</p>
          </div>
          <div className="grid-rule archive">
            {archive.map((e) => (
              <div key={e.slug} className="card">
                <div className="thumb sold"><Artwork palette={e.palette} label={`${e.title}, archived`} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <h3>{e.title}</h3><span className="mono muted">{e.number === '1/1' ? '1 / 1' : `${pad(e.size)} ED.`}</span>
                </div>
                <span className="mono muted">{e.drop} · Sold out</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="registry" className="section dark">
        <div className="wrap split">
          <div>
            <MakersMark className="footer-mark" reversed alt="" />
            <span className="mono eyebrow">Collector registry</span>
            <h2>{copy.home.registry_teaser.headline}</h2>
            <p className="muted" style={{ maxWidth: 440 }}>{copy.home.registry_teaser.body}</p>
          </div>
          <RegistryForm />
        </div>
      </section>
    </>
  );
}
