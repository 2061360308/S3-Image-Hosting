let cacheInit;

if (typeof window !== "undefined") {
  // 创建 Dexie 数据库实例
  const { browserCacheInit } = await import('./browser');
  cacheInit = browserCacheInit;
} else {
  const { nodeCacheInit } = await import('./node');
  cacheInit = nodeCacheInit;
}

interface DateItemCache {
  key: string;
  value: any;
  timestamp: number;
  etag: string;
}

interface ResponseCache {
  getDateItemCache(key: string): Promise<DateItemCache | null>;
  setDateItemCache(key: string, value: any, etag: string): Promise<void>;
  removeDateItemCache(key: string): Promise<void>;
}

export const getCacheInstance = async (): Promise<ResponseCache> => {
  return await cacheInit();
};
