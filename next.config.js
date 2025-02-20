/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Update basePath to match your repository name
  basePath: "/emaillist",
  assetPrefix: "/emaillist/",
}

module.exports = nextConfig

