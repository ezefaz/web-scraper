/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // serverActions: true,
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    domains: ['m.media-mercadolibre.com', 'http2.mlstatic.com', 'valordolarblue.com.ar', 'lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;
