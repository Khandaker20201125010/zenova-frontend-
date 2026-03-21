/* eslint-disable @typescript-eslint/no-explicit-any */
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
   getProducts: async (filters: ProductFilters = {}): Promise<ProductResponse> => {
    // Convert filters to query params
    const params: any = { ...filters }
    
    // Handle special cases
    if (filters.inStock !== undefined) {
      params.inStock = filters.inStock
    }
    if (filters.isFeatured !== undefined) {
      params.isFeatured = filters.isFeatured
    }
    if (filters.tags && filters.tags.length > 0) {
      params.tags = filters.tags.join(',')
    }
    
    // Make the API call
    const response = await apiClient.get<{
      data: Product[]
      meta?: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>('/products', params)
    
    // Handle different response structures
    let products: Product[] = []
    let total = 0
    let page = filters.page || 1
    let limit = filters.limit || 10
    let totalPages = 0
    
    if (Array.isArray(response)) {
      // If response is directly an array
      products = response
      total = response.length
      totalPages = Math.ceil(total / limit)
    } else if (response && typeof response === 'object') {
      // If response has data property
      if (Array.isArray(response.data)) {
        products = response.data
        total = products.length
        totalPages = Math.ceil(total / limit)
      } else if (response.data && Array.isArray(response.data)) {
        products = response.data
        total = products.length
        totalPages = Math.ceil(total / limit)
      }
      
      // Check for meta info
      if (response.meta) {
        page = response.meta.page || page
        limit = response.meta.limit || limit
        total = response.meta.total || total
        totalPages = response.meta.totalPages || totalPages
      }
    }
    
    return {
      products,
      total,
      page,
      limit,
      totalPages,
    }
  },
  
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