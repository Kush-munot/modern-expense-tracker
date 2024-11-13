import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Wrap the whole configuration with the withPWA function
  ...withPWA({
    pwa: {
      dest: 'public', // This is where the service worker and other assets will be stored
      disable: process.env.NODE_ENV === 'development', // Disable in development mode for debugging
    },
  }),
};

export default nextConfig;
