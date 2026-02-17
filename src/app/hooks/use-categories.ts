/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-categories.ts
import { useQuery } from "@tanstack/react-query"
import { categoriesApi } from "../lib/api/categories"
import { Category } from "../lib/types"

export interface CategoryWithCount extends Category {
  _count?: {
    products: number
    children: number
  }
  children?: CategoryWithCount[]
}

export function useCategories(includeProducts = false) {
  return useQuery<CategoryWithCount[]>({
    queryKey: ["categories", includeProducts],
    queryFn: async () => {
      try {
        const response = await categoriesApi.getCategories(includeProducts)
        console.log("Categories loaded:", response)
       return Array.isArray(response) ? response : [] 
      } catch (error) {
        console.error('Error in useCategories:', error)
        return []
      }
    },
  
    staleTime: 1000 * 60 * 5, 
  })
}

export function useCategoryTree() {
  return useQuery<CategoryWithCount[]>({
    queryKey: ["categories", "tree"],
    queryFn: async () => {
      try {
        const response = await categoriesApi.getCategoryTree()
        return response || []
      } catch (error) {
        console.error('Error in useCategoryTree:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useCategoryBySlug(slug: string) {
  return useQuery<CategoryWithCount | null>({
    queryKey: ["category", slug],
    queryFn: async () => {
      if (!slug) return null
      try {
        const response = await categoriesApi.getCategoryBySlug(slug)
        return response || null
      } catch (error) {
        console.error('Error in useCategoryBySlug:', error)
        return null
      }
    },
    enabled: !!slug,
  })
}

export function useCategoryProducts(slug: string, page = 1, limit = 12) {
  return useQuery({
    queryKey: ["category", slug, "products", page, limit],
    queryFn: async () => {
      if (!slug) return { products: [], meta: {} }
      try {
        const response = await categoriesApi.getCategoryProducts(slug, page, limit)
        return response || { products: [], meta: {} }
      } catch (error) {
        console.error('Error in useCategoryProducts:', error)
        return { products: [], meta: {} }
      }
    },
    enabled: !!slug,
  })
}