
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [], // Add image domains if needed
  },
  env: {
    NEXT_PUBLIC_SITE_NAME: "Nutron Universe",
    NEXT_PUBLIC_API_BASE: "http://localhost:3000/api"
  }
};

module.exports = nextConfig;
