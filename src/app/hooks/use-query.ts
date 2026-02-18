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
      console.log("Sending filters to API:", filters);
      
      // Ensure filters are flat, not nested
      const flatFilters = { ...filters };
      
      const response = await apiClient.get<any>("/products", { 
        params: flatFilters  // This should send flat params
      });
      
      console.log("API response:", response);
      
      if (Array.isArray(response)) {
        return {
          products: response,
          total: response.length,
          page: 1,
          limit: 12,
          totalPages: Math.ceil(response.length / 12),
        };
      }
      
      return {
        products: [],
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 1,
      };
    },
  })
}

export function useProductQuery(slug: string) {
  return useReactQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await apiClient.get<any>(`/products/slug/${slug}`);
      
      // Handle different response structures
      if (response && response.data) {
        return response.data;
      }
      
      return response;
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