/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/users.ts
import { apiClient } from './axios-client'
import { User, ApiResponse } from '../types'

export interface UserFilters {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UserResponse {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  suspended: number
  verified: number
  monthlyGrowth: number
}

export const usersApi = {
  // Get user profile
  getProfile: () =>
    apiClient.get<User>('/users/profile'),
  
  // Update profile
  updateProfile: (data: Partial<User>) =>
    apiClient.put<User>('/users/profile', data),
  
  // Upload avatar
  uploadAvatar: (file: File) =>
    apiClient.upload<User>('/users/avatar', file),
  
  // Get user stats
  getUserStats: () =>
    apiClient.get<any>('/users/stats'),
  
  // Get user activities
  getUserActivities: (page = 1, limit = 10) =>
    apiClient.get<any>('/users/activities', { page, limit }),
  
  // Get all users (admin)
  getAllUsers: async (filters: UserFilters = {}): Promise<UserResponse> => {
    const response = await apiClient.get<{
      users: User[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>('/users', filters);
    
    // The response from apiClient.get already returns the data property
    return {
      users: response.users || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 0,
    };
  },
  
  // Get user by ID (admin)
  getUserById: (id: string) =>
    apiClient.get<User>(`/users/${id}`),
  
  // Update user status (admin)
  updateUserStatus: (id: string, status: string) =>
    apiClient.put<User>(`/users/${id}/status`, { status }),
  
  // Update user role (admin)
  updateUserRole: (id: string, role: string) =>
    apiClient.put<User>(`/users/${id}/role`, { role }),
  
  // Delete user (admin)
  deleteUser: (id: string) =>
    apiClient.delete(`/users/${id}`),
  
  // Get user statistics (admin)
  getUserStatistics: () =>
    apiClient.get<UserStats>('/users/statistics'),
}