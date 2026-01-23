/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/notifications.ts
import { Notification } from '../types'
import { apiClient } from './axios-client'


export interface NotificationResponse {
  notifications: Notification[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const notificationsApi = {
  // Get notifications
  getNotifications: (page = 1, limit = 20) =>
    apiClient.get<NotificationResponse>('/notifications', { page, limit }),
  
  // Get notification statistics
  getNotificationStats: () =>
    apiClient.get<any>('/notifications/stats'),
  
  // Get unread count
  getUnreadCount: () =>
    apiClient.get<{ count: number }>('/notifications/unread-count'),
  
  // Mark as read
  markAsRead: (id: string) =>
    apiClient.put<Notification>(`/notifications/${id}/read`),
  
  // Mark all as read
  markAllAsRead: () =>
    apiClient.put('/notifications/mark-all-read'),
  
  // Delete notification
  deleteNotification: (id: string) =>
    apiClient.delete(`/notifications/${id}`),
  
  // Delete all notifications
  deleteAllNotifications: () =>
    apiClient.delete('/notifications'),
  
  // Create notification (admin)
  createNotification: (data: {
    userId?: string
    type: string
    title: string
    message: string
    metadata?: any
  }) =>
    apiClient.post<Notification>('/notifications', data),
}