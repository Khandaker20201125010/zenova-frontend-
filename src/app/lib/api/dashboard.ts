/* eslint-disable @typescript-eslint/no-explicit-any */
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
  getUserDashboard: async () => {
    try {
      const response = await apiClient.get<any>('/dashboard/user')
      return response
    } catch (error) {
      console.error('Error fetching user dashboard:', error)
      throw error
    }
  },
  
  // Manager dashboard
  getManagerDashboard: async () => {
    try {
      const response = await apiClient.get<any>('/dashboard/manager')
      return response
    } catch (error) {
      console.error('Error fetching manager dashboard:', error)
      throw error
    }
  },
  
  // Admin dashboard
  getAdminDashboard: async () => {
    try {
      const response = await apiClient.get<any>('/dashboard/admin')
      return response
    } catch (error) {
      console.error('Error fetching admin dashboard:', error)
      throw error
    }
  },
  
  // Analytics data
  getAnalytics: async (range: string = 'month') => {
    try {
      const response = await apiClient.get<any>(`/dashboard/analytics?timeRange=${range}`)
      return response
    } catch (error) {
      console.error('Error fetching analytics:', error)
      throw error
    }
  },
  
  // Revenue analytics
  getRevenueAnalytics: async (range: string = 'month') => {
    try {
      const response = await apiClient.get<any>(`/dashboard/analytics/revenue?timeRange=${range}`)
      return response
    } catch (error) {
      console.error('Error fetching revenue analytics:', error)
      throw error
    }
  },
  
  // User analytics
  getUserAnalytics: async (range: string = 'month') => {
    try {
      const response = await apiClient.get<any>(`/dashboard/analytics/users?timeRange=${range}`)
      return response
    } catch (error) {
      console.error('Error fetching user analytics:', error)
      throw error
    }
  },
  
  // Sales analytics
  getSalesAnalytics: async (range: string = 'month') => {
    try {
      const response = await apiClient.get<any>(`/dashboard/analytics/sales?timeRange=${range}`)
      return response
    } catch (error) {
      console.error('Error fetching sales analytics:', error)
      throw error
    }
  },
  
  // System status
  getSystemStatus: async () => {
    try {
      const response = await apiClient.get<any>('/dashboard/system-status')
      return response
    } catch (error) {
      console.error('Error fetching system status:', error)
      throw error
    }
  },
}