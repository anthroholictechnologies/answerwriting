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
    if (!isServer) {
      config.resolve.alias["canvas"] = false; // Prevents using native `canvas`
      config.resolve.alias["pdfjs-dist"] = "pdfjs-dist/build/pdf.mjs";
    }
    return config;
  },
  experimental: { esmExternals: "loose" }, // Needed for ES module compatibility
};

export default nextConfig;
