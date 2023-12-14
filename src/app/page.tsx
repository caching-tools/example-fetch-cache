import { memo } from "react";
import axios from "axios";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { Revalidate } from "@/components/revalidate-button";
import styles from "./page.module.css";
import { CacheView } from "@/components/cache-view";
import { formatTime } from "@/utils/formate-time";

type TimeData = {
  datetime: string;
};

/**
 * Force Next.js to always revalidate the whole page on every reload.
 * To check how static page works open the `/static` page.
 */
export const dynamic = "force-dynamic";

const revalidate = 15;

/**
 * In this example result of the fetch will be cached forever.
 *
 * Next.js caches the result of the fetch automatically.
 */
async function getDateViaFetchWithoutRevalidation(
  zone: string,
): Promise<TimeData> {
  /**
   * Notice that we added the `?` at the end of the URL.
   * This is because the Next.js create cache key based on the URL.
   * Try to remove the `?` and you will see the same date as in `dateViaFetchWithRevalidation`.
   */
  const result = await fetch(`https://worldtimeapi.org/api/timezone/${zone}?`, {
    next: {
      tags: ["time", "dateViaFetchWithoutRevalidation"],
      /**
       * By default Next.js will cache the result of the fetch forever
       * even without setting the `revalidate` option to `false`.
       *
       * But we used `export const dynamic = "force-dynamic"` above.
       * It forces Next.js to always revalidate fetch cache without setting the `revalidate` option to `false`.
       */
      revalidate: false,
    },
  });

  const data = (await result.json()) as TimeData;

  return data;
}

/**
 * In this example result of the axios request will not be cached.
 *
 * See the {@link getDateViaAxiosWithRevalidation} example below
 * to see how to cache the result of the axios request.
 */
async function getDateViaAxiosWithoutCaching(zone: string): Promise<TimeData> {
  const { data } = await axios.get<TimeData>(
    `https://worldtimeapi.org/api/timezone/${zone}`,
  );

  return data;
}

/**
 * In this example result of the fetch will be cached for 5 seconds.
 */
async function getDateViaFetchWithRevalidation(
  zone: string,
): Promise<TimeData> {
  const result = await fetch(`https://worldtimeapi.org/api/timezone/${zone}`, {
    next: { revalidate, tags: ["time", "dateViaFetchWithRevalidation"] },
  });

  const data = (await result.json()) as TimeData;

  return data;
}

/**
 * In this example result of the axios request will be cached for 5 seconds.
 */
const getDateViaAxiosWithRevalidation = unstable_cache(
  async (zone: string): Promise<TimeData> => {
    const { data } = await axios.get<TimeData>(
      `https://worldtimeapi.org/api/timezone/${zone}`,
    );

    return data;
  },
  /**
   * keyParts: This is an array that identifies the cached key.
   * It must contain globally unique values that together identify the key of the data being cached.
   * The cache key also includes the arguments passed to the function.
   */
  ["keyParts", "getDateViaAxiosWithRevalidation"],
  /**
   * options: This is an object that controls how the cache behaves. It can contain the following properties:
   * - tags: An array of tags that can be used to control cache invalidation.
   * - revalidate: The number of seconds after which the cache should be revalidated.
   */
  { revalidate, tags: ["time", "dateViaAxiosWithRevalidation"] },
);

/**
 * In this example result of the axios request will be cached for forever.
 */
const getDateViaAxiosWithoutRevalidation = unstable_cache(
  async (zone: string): Promise<TimeData> => {
    const { data } = await axios.get<TimeData>(
      `https://worldtimeapi.org/api/timezone/${zone}`,
    );

    return data;
  },
  /**
   * keyParts: This is an array that identifies the cached key.
   * It must contain globally unique values that together identify the key of the data being cached.
   * The cache key also includes the arguments passed to the function.
   */
  ["keyParts", "getDateViaAxiosWithoutRevalidation"],
  /**
   * options: This is an object that controls how the cache behaves. It can contain the following properties:
   * - tags: An array of tags that can be used to control cache invalidation.
   * - revalidate: The number of seconds after which the cache should be revalidated.
   */
  { tags: ["time", "dateViaAxiosWithoutRevalidation"], revalidate: false },
);

const Sections = memo(function Sections({
  datetime,
  tag,
  title,
}: {
  title: string;
  datetime: string | number | Date;
  tag?: string;
}) {
  return (
    <section className={styles.timeSection}>
      <h2>{title}</h2>
      <div className={styles.timeDisplay}>{formatTime(datetime)}</div>
      {typeof datetime === "string" && <CacheView datetime={datetime} />}
      {tag && <Revalidate className={styles.revalidate} tag={tag} />}
    </section>
  );
});

export default async function Home() {
  const dateViaFetchWithoutRevalidation =
    await getDateViaFetchWithoutRevalidation("UTC");

  const dateViaAxiosWithoutCaching = await getDateViaAxiosWithoutCaching("UTC");

  const dateViaFetchWithRevalidation =
    await getDateViaFetchWithRevalidation("UTC");

  const dateViaAxiosWithRevalidation =
    await getDateViaAxiosWithRevalidation("UTC");

  const dateViaAxiosWithoutRevalidation =
    await getDateViaAxiosWithoutRevalidation("UTC");

  return (
    <>
      <main className={styles.gridContainer}>
        <header className={styles.header}>
          <h1>Next.js Fetch Cache Example</h1>
          <Link href="/">Dynamic page</Link>
          <Link href="/static">Static page</Link>
          <Link href="/cache-store">View the cache</Link>
          <Revalidate
            className={styles.revalidate}
            tag="time"
            buttonText="Revalidate All"
          />
        </header>
        <Sections datetime={Date.now()} title="Browser Time" />
        <Sections
          datetime={dateViaAxiosWithoutCaching.datetime}
          title="Axios without caching"
        />
        <Sections
          datetime={dateViaFetchWithRevalidation.datetime}
          tag="dateViaFetchWithRevalidation"
          title={`Fetch with revalidation every ${revalidate} seconds`}
        />
        <Sections
          datetime={dateViaAxiosWithRevalidation.datetime}
          tag="dateViaAxiosWithRevalidation"
          title={`Axios with revalidation every ${revalidate} seconds`}
        />
        <Sections
          datetime={dateViaFetchWithoutRevalidation.datetime}
          tag="dateViaFetchWithoutRevalidation"
          title="Fetch without revalidation"
        />
        <Sections
          datetime={dateViaAxiosWithoutRevalidation.datetime}
          tag="dateViaAxiosWithoutRevalidation"
          title="Axios without revalidation"
        />
      </main>
    </>
  );
}
