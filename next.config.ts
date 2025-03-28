import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    compress: true,
    typescript: {
        // Skip type checking during the build
        ignoreBuildErrors: true,
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ["www.datocms-assets.com"],
    },
};

const withPWA = require("next-pwa")({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
  })

  module.exports = withPWA(nextConfig);