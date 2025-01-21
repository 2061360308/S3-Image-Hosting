import { browserCacheInit } from "./browser";
import { nodeCacheInit } from "./node";

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
  if (typeof window !== "undefined") {
    // 创建 Dexie 数据库实例
    return await browserCacheInit();
  } else {
    return await nodeCacheInit();
  }
};
