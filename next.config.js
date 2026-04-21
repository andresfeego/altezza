const path = require('path');
const withImages = require('next-images');


const isProd = process.env.NODE_ENV === 'production';
const LOCAL_BACKEND_ORIGIN = (process.env.LOCAL_BACKEND_ORIGIN || 'http://127.0.0.1:3022').replace(/\/$/, '');
const HOST_NAME = (process.env.HOST_NAME || '/api/responseAltezza').replace(/\/$/, '');
const HOST_NAME_INTERNAL = (process.env.HOST_NAME_INTERNAL || (
  HOST_NAME.startsWith('http://') || HOST_NAME.startsWith('https://')
    ? HOST_NAME
    : `${LOCAL_BACKEND_ORIGIN}${HOST_NAME}`
)).replace(/\/$/, '');

// Public browser requests should stay same-origin.
// Server-side fetches still need an absolute URL, so we expose HOST_NAME_INTERNAL too.

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("HOST_NAME:", HOST_NAME);
console.log("HOST_NAME_INTERNAL:", HOST_NAME_INTERNAL);
console.log("VERCEL_ENV:", process.env.VERCEL_ENV || 'local');
console.log("VERCEL_URL:", process.env.VERCEL_URL || 'http://localhost:3000');


module.exports = {
  reactStrictMode: isProd,
  ...withImages(),
  sassOptions: {
    includePaths: [path.join(__dirname, './components/initialized')],
    prependData: `@use './variables' as *;`,
  },
  i18n: {
    locales: ["es"],
    defaultLocale: "es",
  },
  images: {
    disableStaticImages: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mievento.www.altezzaeventos.in',
      },
    ]
  },
  async redirects() {
    return [
      
    ];
  },
  async rewrites() {
    const baseRewrites = [
      {
        source: '/robots.txt',
        destination: '/api/robots'
      }
    ];

    if (isProd) {
      return baseRewrites;
    }

    return [
      ...baseRewrites,
      {
        source: '/api/responseAltezza/:path*',
        destination: `${LOCAL_BACKEND_ORIGIN}/api/responseAltezza/:path*`,
      },
      {
        source: '/scrAppaltezza/:path*',
        destination: `${LOCAL_BACKEND_ORIGIN}/scrAppaltezza/:path*`,
      },
    ];
  },
  env: {
    HOST_NAME,
    HOST_NAME_INTERNAL,
    HOST_NAME_altezza: 'https://www.altezzaeventos.in/',
    NEXT_PUBLIC_ID_ANALYTICS: "G-5JYYZXZD6J",
    DEV_ENV: true
  }
};
