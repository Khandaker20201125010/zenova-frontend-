/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/blog.ts
import { BlogPost } from '../types'
import { apiClient } from './axios-client'


export interface BlogFilters {
  page?: number
  limit?: number
  search?: string
  category?: string
  tags?: string[]
  published?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface BlogResponse {
  posts: BlogPost[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const blogApi = {
  // Get all blog posts
  getPosts: (filters: BlogFilters = {}) =>
    apiClient.get<BlogResponse>('/blog', filters),
  
  // Get featured posts
  getFeaturedPosts: () =>
    apiClient.get<BlogPost[]>('/blog/featured'),
  
  // Get recent posts
  getRecentPosts: (limit = 5) =>
    apiClient.get<BlogPost[]>('/blog/recent', { limit }),
  
  // Get categories
  getCategories: () =>
    apiClient.get<string[]>('/blog/categories'),
  
  // Get tags
  getTags: () =>
    apiClient.get<string[]>('/blog/tags'),
  
  // Get post by slug
  getPostBySlug: (slug: string) =>
    apiClient.get<BlogPost>(`/blog/slug/${slug}`),
  
  // Get post by ID
  getPostById: (id: string) =>
    apiClient.get<BlogPost>(`/blog/${id}`),
  
  // Create post (admin)
  createPost: (data: Partial<BlogPost>) =>
    apiClient.post<BlogPost>('/blog', data),
  
  // Update post (admin)
  updatePost: (id: string, data: Partial<BlogPost>) =>
    apiClient.put<BlogPost>(`/blog/${id}`, data),
  
  // Delete post (admin)
  deletePost: (id: string) =>
    apiClient.delete(`/blog/${id}`),
  
  // Upload cover image
  uploadCoverImage: (file: File) =>
    apiClient.upload<BlogPost>('/blog/upload', file),
  
  // Get blog statistics (admin)
  getBlogStats: () =>
    apiClient.get<any>('/blog/stats'),
}