// lib/api/categories.ts
import { apiClient } from './axios-client'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  order: number
  productCount: number
  children?: Category[]
}

export const categoriesApi = {
  // Get all categories
  getCategories: () =>
    apiClient.get<Category[]>('/categories'),
  
  // Get category tree
  getCategoryTree: () =>
    apiClient.get<Category[]>('/categories/tree'),
  
  // Get category by slug
  getCategoryBySlug: (slug: string) =>
    apiClient.get<Category>(`/categories/slug/${slug}`),
  
  // Get category products
  getCategoryProducts: (slug: string, page = 1, limit = 12) =>
    apiClient.get<any>(`/categories/${slug}/products`, { page, limit }),
  
  // Create category (admin)
  createCategory: (data: Partial<Category>) =>
    apiClient.post<Category>('/categories', data),
  
  // Update category (admin)
  updateCategory: (id: string, data: Partial<Category>) =>
    apiClient.put<Category>(`/categories/${id}`, data),
  
  // Delete category (admin)
  deleteCategory: (id: string) =>
    apiClient.delete(`/categories/${id}`),
}