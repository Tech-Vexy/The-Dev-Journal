import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    compress: true,
    typescript: {
        // Skip type checking during the build
        ignoreBuildErrors: true,
    },
    images: {
        domains: ["www.datocms-assets.com"],
    },
};

export default nextConfig;
