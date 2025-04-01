/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'localhost',
    ],
  },
  webpack: (config) => {
    config.resolve.extensions.push('.node');
    return config;
  },
}

module.exports = nextConfig