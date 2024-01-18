/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "*.bigcommerce.com",
      },
    ],
  },
};

module.exports = nextConfig;
