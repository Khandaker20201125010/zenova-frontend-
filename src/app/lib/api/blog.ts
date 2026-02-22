/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const blogsApi = {
  // Get all blogs posts
  getPosts: async (filters: BlogFilters = {}) => {
    const response = await apiClient.get<any>('/blogs', filters);
    // Handle the nested data structure from backend
    return response.data || response;
  },
  
  // Get featured posts
  getFeaturedPosts: async () => {
    const response = await apiClient.get<any>('/blogs/featured');
    return response.data || response;
  },
  
  // Get recent posts
  getRecentPosts: async (limit = 5) => {
    const response = await apiClient.get<any>('/blogs/recent', { limit });
    return response.data || response;
  },
  
  // Get categories
  getCategories: async () => {
    const response = await apiClient.get<any>('/blogs/categories');
    return response.data || response;
  },
  
  // Get tags
  getTags: async () => {
    const response = await apiClient.get<any>('/blogs/tags');
    return response.data || response;
  },
  
  // Get post by slug
  getPostBySlug: async (slug: string) => {
    const response = await apiClient.get<any>(`/blogs/slug/${slug}`);
    return response.data || response;
  },
  
  // Get post by ID
  getPostById: async (id: string) => {
    const response = await apiClient.get<any>(`/blogs/${id}`);
    return response.data || response;
  },
  
  // Create post (admin)
  createPost: async (data: Partial<BlogPost>) => {
    const response = await apiClient.post<any>('/blogs', data);
    return response.data || response;
  },
  
  // Update post (admin)
  updatePost: async (id: string, data: Partial<BlogPost>) => {
    const response = await apiClient.put<any>(`/blogs/${id}`, data);
    return response.data || response;
  },
  
  // Delete post (admin)
  deletePost: async (id: string) => {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response;
  },
  
  // Upload cover image
  uploadCoverImage: async (file: File) => {
    const response = await apiClient.upload<any>('/blogs/upload', file);
    return response.data || response;
  },
  
  // Get blogs statistics (admin)
  getBlogStats: async () => {
    const response = await apiClient.get<any>('/blogs/stats');
    return response.data || response;
  },
}