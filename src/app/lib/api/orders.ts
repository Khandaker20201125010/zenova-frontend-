// lib/api/orders.ts
import { apiClient } from './axios-client'
import { Order, ApiResponse } from '../types'

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
  paymentMethod: string
  notes?: string
}

export interface OrderResponse {
  orders: Order[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const ordersApi = {
  // Create order
  createOrder: (data: CreateOrderData) =>
    apiClient.post<Order>('/orders', data),
  
  // Get user orders
  getUserOrders: (page = 1, limit = 10) =>
    apiClient.get<OrderResponse>('/orders/user', { page, limit }),
  
  // Get order by ID
  getOrderById: (id: string) =>
    apiClient.get<Order>(`/orders/${id}`),
  
  // Get order by number
  getOrderByNumber: (orderNumber: string) =>
    apiClient.get<Order>(`/orders/number/${orderNumber}`),
  
  // Cancel order
  cancelOrder: (id: string) =>
    apiClient.post<Order>(`/orders/${id}/cancel`),
  
  // Create checkout session
  createCheckoutSession: (orderId: string) =>
    apiClient.post<{ url: string }>(`/orders/${orderId}/checkout`),
  
  // Get all orders (admin)
  getAllOrders: (page = 1, limit = 10, filters?: any) =>
    apiClient.get<OrderResponse>('/orders', { page, limit, ...filters }),
  
  // Update order status (admin)
  updateOrderStatus: (id: string, status: string) =>
    apiClient.put<Order>(`/orders/${id}/status`, { status }),
  
  // Get order statistics
  getOrderStats: () =>
    apiClient.get<any>('/orders/stats'),
}