import Dexie from "dexie";

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

export const browserCacheInit = async () => {

  class BrowserCache implements ResponseCache {
    private static instance: BrowserCache;
    public db: any;

    private constructor() {
      // 私有构造函数，防止外部实例化
      // 动态导入 Dexie，避免在 Node.js 环境中引入浏览器环境的代码
      this.init().then((db) => {
        this.db = db;
      });
    }

    public init = async (): Promise<any> => {
      const db = new Dexie("CacheDB");

      db.version(1).stores({
        dataCache: "key, value, timestamp, etag",
      });

      // 清除过期数据 3天
      db.table("dataCache").hook("deleting", (key, obj, transaction) => {
        if (obj.timestamp + 3 * 24 * 60 * 60 * 1000 < Date.now()) {
          return transaction.table("dataCache").delete(key);
        }
      });

      return db;
    };

    public static getInstance(): BrowserCache {
      if (!BrowserCache.instance) {
        BrowserCache.instance = new BrowserCache();
      }
      return BrowserCache.instance;
    }

    public getDateItemCache = async (
      key: string
    ): Promise<DateItemCache | null> => {
      const cacheItem = await this.db.table("dataCache").get(key);
      if (cacheItem) {
        return cacheItem;
      }
      return null;
    };

    public setDateItemCache = async (
      key: string,
      value: any,
      etag: string
    ): Promise<void> => {
      const timestamp = Date.now();
      await this.db.table("dataCache").put({
        key,
        value,
        timestamp,
        etag,
      });
    };

    public removeDateItemCache = async (key: string): Promise<void> => {
      await this.db.table("dataCache").delete(key);
    };
  }

  return BrowserCache.getInstance();
};
