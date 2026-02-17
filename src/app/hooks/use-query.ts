/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-query.ts
"use client"

import { useQuery as useReactQuery } from "@tanstack/react-query"
import { apiClient } from "../lib/api/axios-client"
import { Product } from "../lib/types"

// Define response types
export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Common queries with proper typing
export function useProductsQuery(filters?: any) {
  return useReactQuery<ProductsResponse>({
    queryKey: ["products", filters],
    queryFn: async () => {
      console.log("Fetching products with filters:", filters);
      const response = await apiClient.get<ApiResponse<Product[]>>("/products", { params: filters });
      console.log("Products API response:", response);
      
      // Transform API response to match ProductsResponse
      return {
        products: response.data || [],
        total: response.meta?.total || 0,
        page: response.meta?.page || 1,
        limit: response.meta?.limit || 12,
        totalPages: response.meta?.totalPages || 1,
      };
    },
  })
}

export function useProductQuery(slug: string) {
  return useReactQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/slug/${slug}`);
      return response.data;
    },
    enabled: !!slug,
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