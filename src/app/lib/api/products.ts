// lib/api/products.ts
import { apiClient } from './axios-client'
import { Product, ApiResponse } from '../types'

export interface ProductFilters {
  page?: number
  limit?: number
  search?: string
  category?: string
  tags?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  isFeatured?: boolean
  sortBy?: 'price' | 'rating' | 'createdAt' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export interface ProductResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const productsApi = {
  // Get all products with filters
  getProducts: (filters: ProductFilters = {}) =>
    apiClient.get<ProductResponse>('/products', filters),
  
  // Get featured products
  getFeaturedProducts: () =>
    apiClient.get<Product[]>('/products/featured'),
  
  // Get product by slug
  getProductBySlug: (slug: string) =>
    apiClient.get<Product>(`/products/slug/${slug}`),
  
  // Get product by ID
  getProductById: (id: string) =>
    apiClient.get<Product>(`/products/${id}`),
  
  // Get related products
  getRelatedProducts: (productId: string) =>
    apiClient.get<Product[]>(`/products/${productId}/related`),
  
  // Create product (admin)
  createProduct: (data: Partial<Product>) =>
    apiClient.post<Product>('/products', data),
  
  // Update product (admin)
  updateProduct: (id: string, data: Partial<Product>) =>
    apiClient.put<Product>(`/products/${id}`, data),
  
  // Delete product (admin)
  deleteProduct: (id: string) =>
    apiClient.delete(`/products/${id}`),
  
  // Upload product images (admin)
  uploadProductImages: (productId: string, files: File[]) =>
    apiClient.uploadMultiple(`/products/${productId}/images`, files),
  
  // Remove product image (admin)
  removeProductImage: (productId: string, imageId: string) =>
    apiClient.delete(`/products/${productId}/images/${imageId}`),
  
  // Get user favorites
  getFavorites: () =>
    apiClient.get<Product[]>('/products/favorites'),
  
  // Toggle favorite
  toggleFavorite: (productId: string) =>
    apiClient.post<{ isFavorite: boolean }>('/products/favorites/toggle', { productId }),
}