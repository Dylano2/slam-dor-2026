import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.pravatar.cc.com" }],
  },
};

export default nextConfig;
