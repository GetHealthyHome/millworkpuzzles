import copy from '@/lib/copy.json'; // launch copy draft from /mnt/project-files/millwork-copy
import MakersMark from '@/components/MakersMark';
import { EmailCapture, AssemblePreview } from '@/components/Teaser';

// Launch copy still has [BRACKET] placeholders; never show them on the live page.
const eyebrow = copy.teaser.eyebrow_mono.replace(/\s*·?\s*\[[^\]]*\]/g, '');

export default function Teaser() {
  return (
    <>
      <section className="teaser-hero">
        <div>
          <MakersMark className="mark" />
          <span className="mono eyebrow">{eyebrow}</span>
          <h1 style={{ maxWidth: '14ch', margin: '0 auto' }}>{copy.teaser.headline}</h1>
          <p style={{ fontSize: 18, maxWidth: 480, margin: '24px auto 0' }} className="muted">{copy.teaser.subhead}</p>
          <EmailCapture />
        </div>
      </section>
      <AssemblePreview />
    </>
  );
}
