import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/components/Store';
import { Header, Footer, CartDrawer } from '@/components/Chrome';

// One typeface site-wide (Ande, 2026-11-14): the face used on edition titles.
const ui = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--font-ui' });

export const metadata = {
  metadataBase: new URL('https://millworkpuzzles.com'), // millworkpuzzle.com should 301 here at the host
  title: 'Millwork Puzzles prototype',
  description: 'Numbered editions of hardwood puzzles, cut and printed by hand.',
  applicationName: 'Millwork Puzzles',
  alternates: { canonical: '/' },
  openGraph: { siteName: 'Millwork Puzzles', type: 'website', url: '/' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={ui.variable}>
      <body>
        <StoreProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
