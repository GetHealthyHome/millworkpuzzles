import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

// One typeface site-wide (Ande, 2026-11-14): the face used on edition titles.
const ui = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--font-ui' });

export const metadata = {
  metadataBase: new URL('https://millworkpuzzles.com'), // millworkpuzzle.com 301s here at the host
  title: 'Millwork Puzzles',
  description: 'Numbered editions of hardwood puzzles, cut and printed by hand.',
  applicationName: 'Millwork Puzzles',
  alternates: { canonical: '/' },
  openGraph: { siteName: 'Millwork Puzzles', type: 'website', url: '/' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={ui.variable}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
