/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-query.ts
"use client"

import { useQuery as useReactQuery } from "@tanstack/react-query"
import { apiClient } from "../lib/api/axios-client"

// Common queries with proper typing
export function useProductsQuery(filters?: any) {
  return useReactQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      console.log("Fetching products with filters:", filters);
      const response = await apiClient.get("/products", { params: filters });
      console.log("Products API response:", response);
      return response;
    },
  })
}

export function useProductQuery(slug: string) {
  return useReactQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await apiClient.get(`/products/slug/${slug}`);
      return response;
    },
  })
}

export function useUserQuery() {
  return useReactQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/me");
      return response;
    },
  })
}

export function useOrdersQuery(page?: number, limit?: number) {
  return useReactQuery({
    queryKey: ["orders", page, limit],
    queryFn: async () => {
      const response = await apiClient.get("/orders/user", { params: { page, limit } });
      return response;
    },
  })
}

export function useDashboardQuery() {
  return useReactQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/user");
      return response;
    },
  })
}