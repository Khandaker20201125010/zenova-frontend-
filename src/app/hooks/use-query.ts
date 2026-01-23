/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-query.ts
"use client"

import { useQuery as useReactQuery, UseQueryOptions } from "@tanstack/react-query"
import { apiClient } from "../lib/api/axios-client"




export function useQuery<T>(
  key: string | string[],
  queryFn: () => Promise<T>,
  options?: UseQueryOptions<T>
) {
  return useReactQuery<T>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn,
    ...options,
  })
}

// Common queries
export function useProductsQuery(filters?: any) {
  return useQuery(
    ["products", filters],
    () => apiClient.get("/products", filters)
  )
}

export function useProductQuery(slug: string) {
  return useQuery(
    ["product", slug],
    () => apiClient.get(`/products/slug/${slug}`)
  )
}

export function useUserQuery() {
  return useQuery(
    ["user"],
    () => apiClient.get("/auth/me")
  )
}

export function useOrdersQuery(page?: number, limit?: number) {
  return useQuery(
    ["orders", page, limit],
    () => apiClient.get("/orders/user", { page, limit })
  )
}

export function useDashboardQuery() {
  return useQuery(
    ["dashboard"],
    () => apiClient.get("/dashboard/user")
  )
}