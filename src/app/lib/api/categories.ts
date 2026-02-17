/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/categories.ts
import { apiClient } from './axios-client'
import { Category, ApiResponse } from '../types'

export interface CategoryWithCount extends Category {
  _count?: {
    products: number
    children: number
  }
  children?: CategoryWithCount[]
}

export const categoriesApi = {
  // Get all categories
  getCategories: async (includeProducts = false): Promise<CategoryWithCount[]> => {
    try {
      const response = await apiClient.get<any>('/categories', { 
        params: { includeProducts } 
      })
      console.log('Categories API raw response:', response)
      
      // Check if response has data property (API response format)
      if (response && response.data && Array.isArray(response.data)) {
        return response.data
      }
      
      // If response is already the array (your apiClient might be returning data directly)
      if (Array.isArray(response)) {
        return response
      }
      
      return []
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },
  
  // Get category tree (hierarchical)
  getCategoryTree: async (): Promise<CategoryWithCount[]> => {
    try {
      const response = await apiClient.get<any>('/categories/tree')
      
      if (response && response.data && Array.isArray(response.data)) {
        return response.data
      }
      
      if (Array.isArray(response)) {
        return response
      }
      
      return []
    } catch (error) {
      console.error('Error fetching category tree:', error)
      return []
    }
  },
  
  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<CategoryWithCount | null> => {
    try {
      const response = await apiClient.get<any>(`/categories/slug/${slug}`)
      
      if (response && response.data) {
        return response.data
      }
      
      if (response && typeof response === 'object') {
        return response
      }
      
      return null
    } catch (error) {
      console.error('Error fetching category by slug:', error)
      return null
    }
  },
  
  // Get products in category
  getCategoryProducts: async (slug: string, page = 1, limit = 12): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/categories/${slug}/products`, { 
        params: { page, limit } 
      })
      
      if (response && response.data) {
        return response.data
      }
      
      return response || { products: [], meta: {} }
    } catch (error) {
      console.error('Error fetching category products:', error)
      return { products: [], meta: {} }
    }
  },
  
  // Admin routes
  createCategory: async (data: Partial<Category>): Promise<Category | null> => {
    try {
      const response = await apiClient.post<any>('/categories', data)
      
      if (response && response.data) {
        return response.data
      }
      
      return response || null
    } catch (error) {
      console.error('Error creating category:', error)
      return null
    }
  },
  
  updateCategory: async (id: string, data: Partial<Category>): Promise<Category | null> => {
    try {
      const response = await apiClient.put<any>(`/categories/${id}`, data)
      
      if (response && response.data) {
        return response.data
      }
      
      return response || null
    } catch (error) {
      console.error('Error updating category:', error)
      return null
    }
  },
  
  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/categories/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      return false
    }
  },
}