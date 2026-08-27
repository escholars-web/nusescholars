/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // TEMPORARY: Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
