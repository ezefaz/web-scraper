/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    domains: ['m.media-mercadolibre.com'],
  },
};

module.exports = nextConfig;
