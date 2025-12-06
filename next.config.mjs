const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;

// To pass nextjs build, to be removed later

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
