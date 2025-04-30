/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  basePath: "/emaillist",
  assetPrefix: "/emaillist/",
  output: "export", // Enable static export
};

module.exports = nextConfig;