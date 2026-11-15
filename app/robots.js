export const dynamic = 'force-static';
export default function robots() {
  return { rules: { userAgent: '*', allow: '/', disallow: '/preview/' }, sitemap: 'https://millworkpuzzles.com/sitemap.xml' };
}
