/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-fetch.ts
"use client";

import { useState, useCallback } from "react";
import { apiClient } from "../lib/api/axios-client";

interface UseFetchOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  onFinally?: () => void;
}

export function useFetch<T>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchData = useCallback(
    async (
      method: "get" | "post" | "put" | "delete" | "patch",
      url: string,
      payload?: any,
      options?: UseFetchOptions<T>,
    ) => {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      try {
        const response = await apiClient[method]<T>(url, payload);
        const result = response.data;
        setData(result);
        setIsSuccess(true);
        options?.onSuccess?.(result);
        return result;
      } catch (err: any) {
        setError(err);
        options?.onError?.(err);
        throw err;
      } finally {
        setIsLoading(false);
        options?.onFinally?.();
      }
    },
    [],
  );

  const get = useCallback(
    (url: string, params?: any, options?: UseFetchOptions<T>) =>
      fetchData("get", url, params, options),
    [fetchData],
  );

  const post = useCallback(
    (url: string, data?: any, options?: UseFetchOptions<T>) =>
      fetchData("post", url, data, options),
    [fetchData],
  );

  const put = useCallback(
    (url: string, data?: any, options?: UseFetchOptions<T>) =>
      fetchData("put", url, data, options),
    [fetchData],
  );

  const patch = useCallback(
    (url: string, data?: any, options?: UseFetchOptions<T>) =>
      fetchData("patch", url, data, options),
    [fetchData],
  );

  const del = useCallback(
    (url: string, options?: UseFetchOptions<T>) =>
      fetchData("delete", url, undefined, options),
    [fetchData],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsSuccess(false);
  }, []);

  return {
    // State
    data,
    error,
    isLoading,
    isSuccess,

    // Methods
    get,
    post,
    put,
    patch,
    delete: del,
    reset,

    // Setters
    setData,
    setError,
  };
}
