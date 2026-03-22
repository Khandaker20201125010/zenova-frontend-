/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './axios-client'
import { Order } from '../types'

export interface CreateOrderData {
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
    phone: string
  }
  paymentMethod?: string
  notes?: string
  tax?: number
  shipping?: number
}

export interface OrderFilters {
  page?: number
  limit?: number
  search?: string
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface OrderResponse {
  orders: Order[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const ordersApi = {
  // Get all orders (admin)
  getAllOrders: async (page = 1, limit = 10, filters: OrderFilters = {}): Promise<OrderResponse> => {
    const params: any = {
      page,
      limit,
      ...filters
    }
    
    // Remove empty values
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === undefined || params[key] === null) {
        delete params[key]
      }
    })
    
    const response = await apiClient.get<{
      data: Order[]
      meta?: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>('/orders', params)
    
    // Handle response structure
    let orders: Order[] = []
    let total = 0
    let responsePage = page
    let responseLimit = limit
    let totalPages = 0
    
    if (Array.isArray(response)) {
      orders = response
      total = response.length
      totalPages = Math.ceil(total / limit)
    } else if (response && typeof response === 'object') {
      if (Array.isArray(response.data)) {
        orders = response.data
        total = orders.length
        totalPages = Math.ceil(total / limit)
      } else if (response.data && Array.isArray(response.data)) {
        orders = response.data
        total = orders.length
        totalPages = Math.ceil(total / limit)
      }
      
      if (response.meta) {
        responsePage = response.meta.page || page
        responseLimit = response.meta.limit || limit
        total = response.meta.total || total
        totalPages = response.meta.totalPages || totalPages
      }
    }
    
    return {
      orders,
      total,
      page: responsePage,
      limit: responseLimit,
      totalPages,
    }
  },
  
  // Get order by ID
  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`)
    return response
  },
  
  // Get order by number
  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/number/${orderNumber}`)
    return response
  },
  
  // Get user orders
  getUserOrders: async (page = 1, limit = 10): Promise<OrderResponse> => {
    const response = await apiClient.get<{
      data: Order[]
      meta?: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>('/orders/user', { page, limit })
    
    let orders: Order[] = []
    let total = 0
    let totalPages = 0
    
    if (Array.isArray(response)) {
      orders = response
      total = response.length
      totalPages = Math.ceil(total / limit)
    } else if (response && typeof response === 'object') {
      if (Array.isArray(response.data)) {
        orders = response.data
        total = orders.length
        totalPages = Math.ceil(total / limit)
      }
      
      if (response.meta) {
        total = response.meta.total || total
        totalPages = response.meta.totalPages || totalPages
      }
    }
    
    return {
      orders,
      total,
      page,
      limit,
      totalPages,
    }
  },
  
  // Create order
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data)
    return response
  },
  
  // Cancel order
  cancelOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${id}/cancel`, {})
    return response
  },
  
  // Update order status (admin)
  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${id}/status`, { status })
    return response
  },
  
  // Create checkout session
  createCheckoutSession: async (orderId: string): Promise<{ url: string; sessionId: string }> => {
    const response = await apiClient.post<{ url: string; sessionId: string }>(`/orders/${orderId}/checkout`, {})
    return response
  },
  
  // Get order statistics
  getOrderStats: async (): Promise<any> => {
    const response = await apiClient.get<any>('/orders/stats')
    return response
  },
}