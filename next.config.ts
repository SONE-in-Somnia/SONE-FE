import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer, dev }) => {
    // Only apply this configuration if not using Turbopack
    if (!dev || process.env.TURBOPACK !== "1") {
      config.externals.push("pino-pretty", "lokijs", "encoding");
    }
    return config;
  },
};

export default nextConfig;
