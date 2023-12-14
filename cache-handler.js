// @ts-check
const { IncrementalCache } = require("@neshca/cache-handler");
const fs = require("fs");
const path = require("path");
const fastify = require("fastify")({
  logger: false,
});

IncrementalCache.onCreation(async () => {
  let cacheStore = new Map();

  const cachePath = path.join(
    process.cwd(),
    ".next",
    "custom-cache",
    "cache.json",
  );

  await fs.promises.mkdir(path.dirname(cachePath), { recursive: true });

  try {
    const fileString = await fs.promises.readFile(cachePath, "utf-8");

    if (!fileString) {
      throw new Error("File is empty");
    }

    const cacheData = JSON.parse(fileString);

    cacheStore = new Map(Object.entries(cacheData));
  } catch (error) {}

  fastify.get("/internal/cache-store", async (_request, reply) => {
    await reply.code(200).send(Object.fromEntries(cacheStore));
  });

  fastify.get("/internal/cache", async (request, reply) => {
    const reversedCache = new Map();

    for (const [key, cacheHandlerValue] of cacheStore) {
      if (cacheHandlerValue?.value?.kind === "FETCH") {
        let datetime;

        try {
          datetime = JSON.parse(
            atob(cacheHandlerValue.value.data.body),
          ).datetime;
        } catch (error) {
          datetime = JSON.parse(cacheHandlerValue.value.data.body).datetime;
        }

        if (!cacheHandlerValue.lastModified) {
          throw new Error("lastModified is not defined");
        }

        reversedCache.set(datetime, {
          key,
          url: cacheHandlerValue.value.data.url,
          lastModified: cacheHandlerValue.lastModified,
          revalidate: cacheHandlerValue.value.revalidate,
        });
      }
    }

    // @ts-expect-error
    const searchedDatetime = request.query.datetime;

    const searchedData = reversedCache.get(searchedDatetime);

    if (!searchedData) {
      reply.code(404).send();
      return;
    }

    await reply.code(200).send(searchedData);
  });

  try {
    await fastify.listen({ port: 3002 });
  } catch (err) {}

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

      await fs.promises.writeFile(
        cachePath,
        JSON.stringify(Object.fromEntries(cacheStore)),
      );
    },
  };

  return {
    cache,
    useFileSystem: false,
  };
});

module.exports = IncrementalCache;
