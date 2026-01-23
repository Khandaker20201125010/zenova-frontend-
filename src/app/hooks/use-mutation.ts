/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-mutation.ts
"use client"

import { useState, useCallback } from "react"
import { apiClient } from "../lib/api/axios-client"



interface UseMutationOptions<T, V> {
  onSuccess?: (data: T, variables: V) => void
  onError?: (error: any, variables: V) => void
  onSettled?: (data: T | null, error: any, variables: V) => void
}

export function useMutation<T, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  options?: UseMutationOptions<T, V>
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const mutate = useCallback(
    async (variables: V) => {
      setIsLoading(true)
      setError(null)
      setIsSuccess(false)

      try {
        const result = await mutationFn(variables)
        setData(result)
        setIsSuccess(true)
        options?.onSuccess?.(result, variables)
        return result
      } catch (err: any) {
        setError(err)
        options?.onError?.(err, variables)
        throw err
      } finally {
        setIsLoading(false)
        options?.onSettled?.(data, error, variables)
      }
    },
    [mutationFn, options, data, error]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
    setIsSuccess(false)
  }, [])

  return {
    // State
    data,
    error,
    isLoading,
    isSuccess,
    
    // Methods
    mutate,
    reset,
    
    // Setters
    setData,
    setError,
  }
}

// Common mutations
export function useAuthMutation() {
  const { mutate: login, ...loginState } = useMutation(
    (credentials: { email: string; password: string }) =>
      apiClient.post("/auth/login", credentials)
  )

  const { mutate: register, ...registerState } = useMutation(
    (data: any) => apiClient.post("/auth/register", data)
  )

  const { mutate: logout, ...logoutState } = useMutation(() =>
    apiClient.post("/auth/logout")
  )

  return {
    login: { mutate: login, ...loginState },
    register: { mutate: register, ...registerState },
    logout: { mutate: logout, ...logoutState },
  }
}