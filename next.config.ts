import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "photo-portfolio-bucket.fra1.cdn.digitaloceanspaces.com",
      },
    ],
  },
};

export default nextConfig;
