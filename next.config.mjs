import { resolve } from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-json-view-lite"],
  experimental: {
    incrementalCacheHandlerPath: resolve("./cache-handler.js"),
  },
};

export default nextConfig;
