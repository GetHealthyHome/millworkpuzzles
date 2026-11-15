import copy from '@/lib/copy.json'; // launch copy draft from /mnt/project-files/millwork-copy
import MakersMark from '@/components/MakersMark';
import { EmailCapture, AssemblePreview } from '@/components/Teaser';

export const metadata = { title: 'Millwork Puzzles inaugural drop' };

export default function Teaser() {
  return (
    <>
      <section className="teaser-hero">
        <div>
          <MakersMark className="mark" />
          <span className="mono eyebrow">{copy.teaser.eyebrow_mono}</span>
          <h1 style={{ maxWidth: '14ch', margin: '0 auto' }}>{copy.teaser.headline}</h1>
          <p style={{ fontSize: 18, maxWidth: 480, margin: '24px auto 0' }} className="muted">{copy.teaser.subhead}</p>
          <EmailCapture />
        </div>
      </section>
      <AssemblePreview />
    </>
  );
}
