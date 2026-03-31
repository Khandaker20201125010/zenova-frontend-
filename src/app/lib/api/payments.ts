/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './axios-client'

export interface PaymentFilters {
  page?: number
  limit?: number
  search?: string
  status?: string
  dateRange?: string
  startDate?: string
  endDate?: string
}

export const paymentsApi = {
  // Get all payments (admin)
  getAllPayments: async (filters: PaymentFilters = {}) => {
    const response = await apiClient.get<any>('/payments', filters)
    return response
  },
  
  // Get payment by ID
  getPaymentById: async (id: string) => {
    const response = await apiClient.get<any>(`/payments/${id}`)
    return response
  },
  
  // Get payment stats
  getPaymentStats: async () => {
    const response = await apiClient.get<any>('/payments/stats')
    return response
  },
  
  // Update payment status (admin)
  updatePaymentStatus: async (id: string, status: string) => {
    const response = await apiClient.put<any>(`/payments/${id}/status`, { status })
    return response
  },
  
  // Refund payment (admin)
  refundPayment: async (id: string) => {
    const response = await apiClient.post<any>(`/payments/${id}/refund`)
    return response
  },
  
  // Export payments (admin)
  exportPayments: async (filters: PaymentFilters = {}) => {
    const response = await apiClient.get<any>('/payments/export', filters)
    return response
  },
  
  // Get user payments
  getUserPayments: async () => {
    const response = await apiClient.get<any>('/payments/user')
    return response
  },
}