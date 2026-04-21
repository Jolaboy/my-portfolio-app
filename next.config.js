const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  // Dev-only hardening for Windows + OneDrive folders:
  // OneDrive/AV can transiently lock, rename, or dehydrate files under `.next/`,
  // which can lead to missing chunk/module errors at runtime.
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },

  // If you access the dev server via your LAN IP (e.g. from another device),
  // Next warns about cross-origin requests for `/_next/*` resources.
  // This is future-proofing for Next.js 16.
  allowedDevOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.0.12:3000'],
};

module.exports = nextConfig;
