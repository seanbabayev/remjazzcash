import { useState, useCallback } from 'react';
import { ApiResponse } from '@/components/shared/types/shared-types';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export const useApi = <T>(options: UseApiOptions<T> = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (
    promise: Promise<Response>,
    transformResponse?: (data: any) => T
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await promise;
      const jsonData = await response.json();

      if (!response.ok) {
        throw new Error(jsonData.error || 'Ett fel uppstod');
      }

      const transformedData = transformResponse ? transformResponse(jsonData) : jsonData;
      setData(transformedData);
      options.onSuccess?.(transformedData);
      
      return {
        data: transformedData,
        status: response.status
      } as ApiResponse<T>;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(errorMessage);
      options.onError?.(errorMessage);
      
      return {
        error: errorMessage,
        status: 500
      } as ApiResponse<T>;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    isLoading,
    error,
    data,
    execute
  };
};
