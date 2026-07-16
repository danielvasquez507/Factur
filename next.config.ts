import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["*"],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), payment=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.cloudflareinsights.com https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://factur.danielvasquez.cloud; font-src 'self' data:; connect-src 'self' http://0.0.0.0:* ws://0.0.0.0:* http://localhost:* ws://localhost:* https://cloudflareinsights.com data: blob: https://factur.danielvasquez.cloud; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'self' blob: data:; worker-src 'self' blob: https://unpkg.com; upgrade-insecure-requests;" },
        ],
      },
    ]
  },
};

export default nextConfig;
