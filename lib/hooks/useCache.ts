import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

interface CacheOptions<T> {
  key: string;
  ttl?: number; // Time to live in milliseconds
  initialData?: T;
}

export const useCache = <T>({ key, ttl = 5 * 60 * 1000, initialData }: CacheOptions<T>) => {
  const [data, setData] = useState<T | null>(() => {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const { value, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < ttl) {
          return value;
        }
        localStorage.removeItem(key);
      }
      return initialData || null;
    } catch (err) {
      logger.error('Cache retrieval failed', err);
      return initialData || null;
    }
  });

  useEffect(() => {
    if (data) {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({
            value: data,
            timestamp: Date.now()
          })
        );
      } catch (err) {
        logger.error('Cache storage failed', err);
      }
    }
  }, [key, data]);

  const updateCache = (newData: T) => {
    setData(newData);
  };

  const clearCache = () => {
    localStorage.removeItem(key);
    setData(null);
  };

  return {
    data,
    updateCache,
    clearCache
  };
};
