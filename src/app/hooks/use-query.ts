/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-query.ts
"use client"

import { useQuery as useReactQuery, UseQueryOptions } from "@tanstack/react-query"
import { apiClient } from "../lib/api/axios-client"

export function useQuery<T>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: UseQueryOptions<T>
) {
  return useReactQuery<T>({
    queryKey: key,
    queryFn,
    ...options,
  })
}

// Common queries
export function useProductsQuery(filters?: any) {
  const key = ["products", JSON.stringify(filters || {})]
  return useQuery(
    key,
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
  const key = ["orders", page?.toString() || "1", limit?.toString() || "10"]
  return useQuery(
    key,
    () => apiClient.get("/orders/user", { page, limit })
  )
}

export function useDashboardQuery() {
  return useQuery(
    ["dashboard"],
    () => apiClient.get("/dashboard/user")
  )
}