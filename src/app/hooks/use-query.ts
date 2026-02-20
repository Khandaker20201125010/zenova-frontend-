/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useQuery as useReactQuery } from "@tanstack/react-query"
import { apiClient } from "../lib/api/axios-client"
import { Product } from "../lib/types"

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

export function useProductsQuery(filters?: any) {
  return useReactQuery<ProductsResponse>({
    queryKey: ["products", filters],
    queryFn: async () => {
      const flatParams: any = {};
      
      Object.keys(filters || {}).forEach(key => {
        const value = filters[key];
        
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            flatParams[key] = value.join(',');
          } else if (typeof value === 'boolean') {
            flatParams[key] = value.toString();
          } else {
            flatParams[key] = value;
          }
        }
      });
      
      const response = await apiClient.get<any>("/products", { 
        params: flatParams
      });
      
      if (Array.isArray(response)) {
        return {
          products: response,
          total: response.length,
          page: 1,
          limit: 12,
          totalPages: Math.ceil(response.length / 12),
        };
      }
      
      if (response && response.data && Array.isArray(response.data)) {
        return {
          products: response.data,
          total: response.meta?.total || response.data.length,
          page: response.meta?.page || 1,
          limit: response.meta?.limit || 12,
          totalPages: response.meta?.totalPages || 1,
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