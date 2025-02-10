import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "res.cloudinary.com",
      "plus.unsplash.com",
      "anthroholic.com",
    ],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, "canvas"];
    }
    return config;
  },
};

export default nextConfig;
