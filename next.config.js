/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-json-view-lite"],
  experimental: {
    incrementalCacheHandlerPath: require.resolve("./cache-handler.js"),
  },
};

module.exports = nextConfig;
