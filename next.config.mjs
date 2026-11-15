/** @type {import('next').NextConfig} */
export default {
  output: 'export', // static preview build; drop when moving to a real host with commerce APIs
  trailingSlash: true,
  images: { unoptimized: true },
};
