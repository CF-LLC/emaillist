/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Make sure this matches your repository name EXACTLY
  basePath: "/emaillist",
  // Add this to disable trailing slashes
  trailingSlash: false,
}

module.exports = nextConfig

