export type CacheInternalData = {
  key: string;
  revalidate: number;
  tags: string[];
  lastModified: number;
  url: string;
};
