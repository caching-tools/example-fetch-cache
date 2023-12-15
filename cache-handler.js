// @ts-check
const { IncrementalCache } = require("@neshca/cache-handler");
const { createClient } = require("redis");

const client = createClient({
  url: process.env.KV_URL,
});

IncrementalCache.onCreation(async ({ buildId }) => {
  let cacheStore = new Map();

  await client.connect();

  /** @type {import('@neshca/cache-handler').Cache} */
  const cache = {
    async get(key) {
      const cacheData = cacheStore.get(key);

      if (cacheData?.value?.kind === "ROUTE") {
        cacheData.value.body = Buffer.from(cacheData.value.body, "base64");
      }

      return cacheData;
    },
    async set(key, cacheData) {
      if (cacheData?.value?.kind === "ROUTE") {
        // @ts-expect-error
        cacheData.value.body = cacheData.value.body.toString("base64");
      }

      cacheStore.set(key, cacheData);

      await client.set(key, JSON.stringify(cacheData));
    },
  };

  return {
    cache,
    useFileSystem: true,
  };
});

module.exports = IncrementalCache;
