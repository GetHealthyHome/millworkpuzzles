/** @type {import('next').NextConfig} */
export default {
  output: 'export', // static site; drop when commerce APIs arrive
  trailingSlash: true,
  images: { unoptimized: true },
};
