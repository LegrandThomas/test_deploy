/** @type {import('next').NextConfig} */
const nextConfig = {devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    apiPort: 3001,
  },
  publicRuntimeConfig: {
    apiPort: 3001,
  },};

export default nextConfig;
