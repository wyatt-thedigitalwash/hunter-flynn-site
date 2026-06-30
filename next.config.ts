import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://use.typekit.net",
              "style-src 'self' 'unsafe-inline' https://use.typekit.net https://p.typekit.net",
              "font-src 'self' https://use.typekit.net https://p.typekit.net data:",
              "img-src 'self' https://img.youtube.com https://res.cloudinary.com data: blob:",
              "media-src 'self' https://res.cloudinary.com",
              "frame-src https://www.youtube-nocookie.com",
              "connect-src 'self' https://use.typekit.net https://p.typekit.net https://performance.typekit.net",
            ].join('; '),
          },
        ],
      },
      {
        source: '/logos/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/covers/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/backgrounds/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/artwork/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Old site: /artwork -> /about
      { source: '/artwork', destination: '/about', permanent: true },
      { source: '/artwork/', destination: '/about', permanent: true },

      // Old site: /merch-1 -> /
      { source: '/merch-1', destination: '/', permanent: true },
      { source: '/merch-1/', destination: '/', permanent: true },

      // Old site: /privacy-policy -> Big Machine Records privacy
      { source: '/privacy-policy', destination: 'https://www.bigmachinerecords.com/privacy', permanent: true },
      { source: '/privacy-policy/', destination: 'https://www.bigmachinerecords.com/privacy', permanent: true },

      // Old site: /terms-and-conditions -> Big Machine Records terms
      { source: '/terms-and-conditions', destination: 'https://www.bigmachinerecords.com/terms', permanent: true },
      { source: '/terms-and-conditions/', destination: 'https://www.bigmachinerecords.com/terms', permanent: true },

      // Old site: /m/account -> /
      { source: '/m/account', destination: '/', permanent: true },
      { source: '/m/account/', destination: '/', permanent: true },

      // Old site: /m/create-account -> /
      { source: '/m/create-account', destination: '/', permanent: true },
      { source: '/m/create-account/', destination: '/', permanent: true },

      // Old site: /m/orders -> /
      { source: '/m/orders', destination: '/', permanent: true },
      { source: '/m/orders/', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
