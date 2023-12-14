"use client";

import { useEffect, useState } from "react";
import { CacheInternalData } from "@/types/common-types";
import { formatTime } from "@/utils/formate-time";
import styles from "./cache-view.module.css";

const DAY_MS = 24 * 60 * 60 * 1000;

function CountDown({
  revalidate,
  lastModified,
}: {
  revalidate: number;
  lastModified: number;
}) {
  const [time, setTime] = useState(revalidate * 1000 + lastModified);

  useEffect(() => {
    let rafId = -1;

    function update() {
      const now = Date.now();
      const diff = revalidate * 1000 + lastModified - now;

      if (diff <= 0) {
        setTime(0);
        return;
      }

      setTime(diff);

      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [revalidate, lastModified]);

  return (
    <code className={styles.item}>
      stale after: {(time / 1000).toFixed(2)} seconds
    </code>
  );
}

export function CacheView({ datetime }: { datetime: string }) {
  const [data, setData] = useState<CacheInternalData | null>(null);
  const [error, setError] = useState<unknown>(null);
  const isLoading = !data && !error;

  useEffect(() => {
    const controller = new AbortController();

    async function getCache() {
      const params = new URLSearchParams({ datetime });

      const result = await fetch(`/api/cache?${params.toString()}`, {
        signal: controller.signal,
        cache: "no-store",
      });

      if (!result.ok) {
        throw new Error("cache not found");
      }

      const cache = await result.json();

      return cache;
    }

    getCache().then(setData).catch(setError);

    return () => {
      controller.abort();
    };
  }, [datetime]);

  if (error) {
    return <div>no cache</div>;
  }

  if (isLoading) {
    return <div>loading cache</div>;
  }

  if (!data) {
    return <div>no cache</div>;
  }

  return (
    <div className={styles.container}>
      <code className={styles.item}>
        lastModified: {formatTime(data.lastModified)}
      </code>
      <CountDown
        revalidate={data.revalidate}
        lastModified={data.lastModified}
      />
      <code className={styles.item}>
        url: {data.url ? data.url : "unstable_cache; url is not available"}
      </code>
    </div>
  );
}
