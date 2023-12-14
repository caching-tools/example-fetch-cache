"use client";

import { useEffect, useState } from "react";
import { JsonView, allExpanded, darkStyles } from "react-json-view-lite";

export default function CacheStore() {
  const [json, setJson] = useState<object | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchJson() {
      const result = await fetch("/api/cache-store", {
        signal: controller.signal,
        cache: "no-store",
      });

      const data = await result.json();

      setJson(data);
    }

    fetchJson();

    return () => {
      controller.abort();
    };
  }, []);

  if (!json) {
    return null;
  }

  return (
    <JsonView data={json} shouldExpandNode={allExpanded} style={darkStyles} />
  );
}
