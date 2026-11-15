import { StoreProvider } from '@/components/Store';
import { Header, Footer, CartDrawer } from '@/components/Chrome';

// Store prototype (placeholder editions and prices). app/preview is deleted before
// production builds (package.json "build"); Vercel preview deployments still show them for review.
export const metadata = { title: 'Millwork Puzzles prototype', robots: { index: false, follow: false } };

export default function PreviewLayout({ children }) {
  return (
    <StoreProvider>
      <Header />
      {children}
      <Footer />
      <CartDrawer />
    </StoreProvider>
  );
}
