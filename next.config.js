const path = require('path');
const withImages = require('next-images');


const isProd = process.env.NODE_ENV === 'production';

// Backend base URL for Altezza endpoints.
// In VPS deployments we proxy same-origin:
//   /api/responseAltezza/*  -> backend-altezza (3022)
// so no external feegosystem proxy is needed.
const HOST_NAME = process.env.HOST_NAME || (isProd
  ? '/api/responseAltezza'
  : 'http://127.0.0.1:3022/api/responseAltezza');

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("HOST_NAME:", HOST_NAME);
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
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots'
      }
    ];
  },
  env: {
    HOST_NAME,
    HOST_NAME_altezza: 'https://www.altezzaeventos.in/',
    NEXT_PUBLIC_ID_ANALYTICS: "G-5JYYZXZD6J",
    DEV_ENV: true
  }
};