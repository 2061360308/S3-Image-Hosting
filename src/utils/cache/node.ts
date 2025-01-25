import NodeCache from "node-cache";

let NodeCacheLib: any = NodeCache;

if (typeof window !== 'undefined'){
  NodeCacheLib = null;
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

export const nodeCacheInit = async () => {


  class NodeCacheWrapper implements ResponseCache {
    public cache: any;

    constructor() {
      this.cache = new NodeCache();

      // 清除过期数据 3天
      this.cache.on("del", (key: string, value: DateItemCache) => {
        if (value.timestamp + 3 * 24 * 60 * 60 * 1000 < Date.now()) {
          this.cache.del(key);
        }
      });
    }

    public async getDateItemCache(key: string): Promise<DateItemCache | null> {
      return this.cache.get(key);
    }

    public async setDateItemCache(
      key: string,
      value: any,
      etag: string
    ): Promise<void> {
      const timestamp = Date.now();
      this.cache.set(key, { key, value, timestamp, etag });
    }

    public async removeDateItemCache(key: string): Promise<void> {
      this.cache.del(key);
    }
  }

  return new NodeCacheWrapper();
};
