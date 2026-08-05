/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'commons.wikimedia.org',
        pathname: '/**'
      }
    ]
  }
};

module.exports = nextConfig;
