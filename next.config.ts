import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.amazon.it",
      },
      {
        protocol: "https",
        hostname: "www.amazon.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "*.amazon.com",
      },
      {
        protocol: "https",
        hostname: "*.amazon.it",
      },
      {
        protocol: "https",
        hostname: "*.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "photos-cdn.amazon.com",
      },
      {
        protocol: "https",
        hostname: "*.photos.amazon.com",
      },
      {
        protocol: "https",
        hostname: "*.photos.amazon.it",
      },
      {
        protocol: "https",
        hostname: "thumbnails-photos.amazon.com",
      },
      {
        protocol: "https",
        hostname: "*.drive.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "content-eu.drive.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
