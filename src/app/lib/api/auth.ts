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
  token: string
  refreshToken: string
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>('/auth/login', credentials),
  
  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>('/auth/register', data),
  
  demoLogin: () =>
    apiClient.post<AuthResponse>('/auth/demo-login'),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  refreshToken: (refreshToken: string) =>
    apiClient.post<{ token: string }>('/auth/refresh-token', { refreshToken }),
  
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
  
  getCurrentUser: () =>
    apiClient.get<User>('/auth/me'),
  
  updateProfile: (data: Partial<User>) =>
    apiClient.put<User>('/users/profile', data),
  
  uploadAvatar: (file: File) =>
    apiClient.upload<User>('/users/avatar', file),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post('/auth/change-password', { currentPassword, newPassword }),
  
  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),
  
  resendVerification: () =>
    apiClient.post('/auth/resend-verification'),
}