import type { NextConfig } from "next";

const allowedDevOrigins = [
  "http://10.142.104.128:3000",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(process.env.ALLOWED_DEV_ORIGINS
    ? process.env.ALLOWED_DEV_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : []),
];

const nextConfig: NextConfig = {
  allowedDevOrigins,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
