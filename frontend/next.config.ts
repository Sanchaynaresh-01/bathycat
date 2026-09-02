import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow access from external devices on the local network
  experimental: {
    allowedDevOrigins: ["192.168.42.60"],
  },
};

export default nextConfig;
