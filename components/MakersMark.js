// Ande's approved maker's mark (brand kit: /mnt/project-files/millwork-brand/kit). Do not redraw or restyle.
// PNG exports at 2x+: the source SVGs are ~460 KB each because they keep the burned edge texture.
import mark from '@/brand/mark-480.png';
import markReversed from '@/brand/mark-reversed-480.png';

export default function MakersMark({ className, reversed = false, alt = 'Millwork Puzzles maker’s mark' }) {
  const img = reversed ? markReversed : mark;
  return <img src={img.src} width={img.width} height={img.height} className={`makers-mark ${className || ''}`} alt={alt} />;
}
