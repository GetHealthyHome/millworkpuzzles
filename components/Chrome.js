'use client';
import copy from '@/lib/copy.json'; // launch copy draft from /mnt/project-files/millwork-copy
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import MakersMark from './MakersMark';
import lockup from '@/brand/lockup-640.png';
import { useStore } from './Store';
import { addons as allAddons, artists, nextNumber } from '@/lib/data';

const Icon = ({ d }) => <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>;
const BAG = 'M5 8h14l-1 12H6L5 8Z M9 8V6a3 3 0 0 1 6 0v2';
const SOUND_ON = 'M4 10v4h4l5 4V6L8 10H4Z M16 9a4 4 0 0 1 0 6 M18.5 6.5a8 8 0 0 1 0 11';
const SOUND_OFF = 'M4 10v4h4l5 4V6L8 10H4Z M17 10l4 4 M21 10l-4 4';
const CLOSE = 'M6 6l12 12 M18 6L6 18';

export function Header() {
  const path = usePathname();
  const overHero = path === '/';
  const [scrolled, setScrolled] = useState(false);
  const { cart, setOpen, sound, setSound } = useStore();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`header ${!overHero || scrolled ? 'solid' : ''}`}>
      <div className="wrap header-inner">
        <Link href="/" className="brand"><img src={lockup.src} width={lockup.width} height={lockup.height} alt="Millwork Puzzles" /></Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/editions/quiet-meridian/">Current drop</Link>
          <Link href="/#archive">Archive</Link>
          <Link href="/#registry">Collector registry</Link>
          <Link href="/teaser/">Pre-launch</Link>
        </nav>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setSound(!sound)} aria-pressed={sound} aria-label={sound ? 'Mute workshop sound' : 'Turn on workshop sound'}>
            <Icon d={sound ? SOUND_ON : SOUND_OFF} />
          </button>
          <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Open cart">
            <Icon d={BAG} /><span className="mono">{cart ? '01' : '00'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <MakersMark className="footer-mark" reversed alt="" />
        <p className="serif footer-manifesto">
          {copy.footer.manifesto}
        </p>
        <p className="footer-word" aria-hidden="true">Millwork Puzzles</p>
        <div className="footer-grid">
          <div><span className="mono">Collect</span><Link href="/editions/quiet-meridian/">Current drop</Link><Link href="/#archive">Permanent archive</Link><Link href="/#registry">Register a COA</Link></div>
          <div><span className="mono">Studio</span><Link href="/#craft">The craft</Link><Link href="/editions/quiet-meridian/#artist">Artists</Link><Link href="/teaser/">Inaugural drop</Link></div>
          <div><span className="mono">Care</span><a href="#">Shipping &amp; returns</a><a href="#">Contact the workshop</a></div>
          <div className="mono" style={{ alignSelf: 'end' }}>© 2026 Millwork Puzzles · {copy.global.domain}</div>
        </div>
      </div>
    </footer>
  );
}

export function CartDrawer() {
  const { cart, setCart, open, setOpen } = useStore();
  const [stub, setStub] = useState(false);
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [setOpen]);

  const picked = cart ? allAddons.filter((a) => cart.addons.includes(a.id)) : [];
  const subtotal = cart ? cart.thickness.price + picked.reduce((s, a) => s + a.price, 0) : 0;

  return (
    <>
      <div className={`scrim ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-label="Cart" aria-hidden={!open} inert={!open}>
        <div className="drawer-head">
          <span className="mono">{copy.cart.title}</span>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close cart"><Icon d={CLOSE} /></button>
        </div>
        <div className="ledger">
          {!cart ? (
            <p className="muted" style={{ paddingTop: 24 }}>{copy.cart.empty}</p>
          ) : (
            <>
              <div className="ledger-row main">
                <div>
                  <div style={{ fontWeight: 600 }}>{cart.edition.title}</div>
                  <div className="mono muted">Edition {nextNumber(cart.edition)} / {String(cart.edition.size).padStart(3, '0')} · {cart.thickness.label}</div>
                  <div className="muted" style={{ fontSize: 14 }}>{artists[cart.edition.artist]?.name}</div>
                </div>
                <div className="mono">${cart.thickness.price}</div>
              </div>
              {picked.map((a) => (
                <div className="ledger-row" key={a.id}><span>{a.name}</span><span className="mono">${a.price}</span></div>
              ))}
              {(cart.engraving || cart.giftNote) && (
                <div className="ledger-row" style={{ display: 'block' }}>
                  {cart.engraving && <div><span className="mono muted">Engraving · </span><span className="mono">{cart.engraving}</span></div>}
                  {cart.giftNote && <div className="serif" style={{ fontSize: 16, marginTop: 6 }}><em>“{cart.giftNote}”</em></div>}
                </div>
              )}
              <button className="icon-btn muted" style={{ padding: '12px 0', fontSize: 14 }} onClick={() => setCart(null)}>Release reservation</button>
            </>
          )}
        </div>
        <div className="drawer-foot">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{copy.cart.subtotal}</span><span className="mono" style={{ fontSize: 15 }}>${subtotal}</span></div>
          <button className="btn btn-primary btn-block" disabled={!cart} onClick={() => setStub(true)}>Proceed to checkout</button>
          {stub && <p className="mono muted" role="status" style={{ margin: 0 }}>Checkout is stubbed in this prototype.</p>}
        </div>
      </aside>
    </>
  );
}
