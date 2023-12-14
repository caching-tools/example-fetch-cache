/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-json-view-lite"],
  experimental: {
    incrementalCacheHandlerPath: require.resolve("./cache-handler.js"),
  },
  rewrites() {
    return [
      {
        source: "/api/cache",
        destination: "http://localhost:3002/internal/cache",
        has: [
          {
            type: "query",
            key: "datetime",
          },
        ],
      },
      {
        source: "/api/cache-store",
        destination: "http://localhost:3002/internal/cache-store",
      },
    ];
  },
};

module.exports = nextConfig;
