import createWithMakeswift from "@makeswift/runtime/next/plugin";

const withMakeswift = createWithMakeswift();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withMakeswift(nextConfig);
