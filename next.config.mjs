import { resolve } from "path";
import getProt from "get-port";

const fPort = await getProt({ port: [3001, 3002, 3003, 3004, 3004] });

console.log(fPort);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-json-view-lite"],
  experimental: {
    incrementalCacheHandlerPath: resolve("./cache-handler.js"),
  },
  generateBuildId() {
    return `${fPort}|${Math.random()}`;
  },
  async rewrites() {
    return [
      {
        source: "/api/cache",
        destination: `http://localhost:${fPort}/internal/cache`,
        has: [
          {
            type: "query",
            key: "datetime",
          },
        ],
      },
      {
        source: "/api/cache-store",
        destination: `http://localhost:${fPort}/internal/cache-store`,
      },
    ];
  },
};

export default nextConfig;
