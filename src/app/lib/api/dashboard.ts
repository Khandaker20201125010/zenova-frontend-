/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/dashboard.ts
import { apiClient } from './axios-client'

export interface DashboardStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  activeUsers: number
  pendingOrders: number
  monthlyGrowth: number
  conversionRate: number
}

export interface RevenueData {
  date: string
  revenue: number
  orders: number
}

export interface UserGrowthData {
  date: string
  users: number
  newUsers: number
}

export interface SalesData {
  category: string
  sales: number
  percentage: number
}

export const dashboardApi = {
  // User dashboard
  getUserDashboard: () =>
    apiClient.get<any>('/dashboard/user'),
  
  // Manager dashboard
  getManagerDashboard: () =>
    apiClient.get<any>('/dashboard/manager'),
  
  // Admin dashboard
  getAdminDashboard: () =>
    apiClient.get<DashboardStats>('/dashboard/admin'),
  
  // Analytics data
  getAnalytics: (range: string = 'month') =>
    apiClient.get<any>(`/dashboard/analytics?range=${range}`),
  
  // Revenue analytics
  getRevenueAnalytics: (range: string = 'month') =>
    apiClient.get<RevenueData[]>(`/dashboard/analytics/revenue?range=${range}`),
  
  // User analytics
  getUserAnalytics: (range: string = 'month') =>
    apiClient.get<UserGrowthData[]>(`/dashboard/analytics/users?range=${range}`),
  
  // Sales analytics
  getSalesAnalytics: (range: string = 'month') =>
    apiClient.get<SalesData[]>(`/dashboard/analytics/sales?range=${range}`),
  
  // System status
  getSystemStatus: () =>
    apiClient.get<any>('/dashboard/system-status'),
}