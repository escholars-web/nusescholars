/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/nusescholars",
  output: "export",
  reactStrictMode: true,
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
