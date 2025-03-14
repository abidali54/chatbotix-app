import { useState, useEffect } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxItems?: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  private config: CacheConfig;

  private constructor() {
    this.cache = new Map();
    this.config = {
      ttl: 5 * 60 * 1000, // 5 minutes default TTL
      maxItems: 100
    };
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public setConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public set<T>(key: string, data: T): void {
    if (this.cache.size >= (this.config.maxItems || 100)) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > this.config.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  public clear(): void {
    this.cache.clear();
  }

  public remove(key: string): void {
    this.cache.delete(key);
  }
}

export const useCache = <T>(key: string, fetchFn: () => Promise<T>, config?: Partial<CacheConfig>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cacheService = CacheService.getInstance();
    if (config) {
      cacheService.setConfig(config);
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const cachedData = cacheService.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        const freshData = await fetchFn();
        cacheService.set(key, freshData);
        setData(freshData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, fetchFn]);

  return { data, loading, error };
};

export default CacheService;