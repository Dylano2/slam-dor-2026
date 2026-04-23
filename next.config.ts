import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "thispersondoesnotexist.com" },
    ],
  },
};

export default nextConfig;
