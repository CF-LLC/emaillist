/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  basePath: "/emaillist", // Update this to match your GitHub Pages repository name
  assetPrefix: "/emaillist/",
  output: "export", // Enable static export
};

module.exports = nextConfig;