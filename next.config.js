/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  optimizeFonts: true,
};

module.exports = nextConfig;
