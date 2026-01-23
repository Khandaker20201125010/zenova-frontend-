// lib/api/auth.ts
import { apiClient } from './axios-client'
import { User, ApiResponse } from '../types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const authApi = {
  // Login
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>('/auth/login', credentials),
  
  // Register
  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>('/auth/register', data),
  
  // Demo login
  demoLogin: () =>
    apiClient.post<AuthResponse>('/auth/demo-login'),
  
  // Logout
  logout: () =>
    apiClient.post('/auth/logout'),
  
  // Refresh token
  refreshToken: () =>
    apiClient.post<{ accessToken: string }>('/auth/refresh-token'),
  
  // Forgot password
  forgotPassword: (email: string) =>
    apiClient.post('/auth/reset-password', { email }),
  
  // Reset password
  resetPassword: (token: string, password: string, confirmPassword: string) =>
    apiClient.post('/auth/change-password', { token, password, confirmPassword }),
  
  // Get current user
  getCurrentUser: () =>
    apiClient.get<User>('/auth/me'),
  
  // Update profile
  updateProfile: (data: Partial<User>) =>
    apiClient.put<User>('/users/profile', data),
  
  // Upload avatar
  uploadAvatar: (file: File) =>
    apiClient.upload<User>('/users/avatar', file),
  
  // Change password
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post('/auth/change-password', { currentPassword, newPassword }),
  
  // Verify email
  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),
  
  // Resend verification email
  resendVerification: () =>
    apiClient.post('/auth/resend-verification'),
}