/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/contact.ts
import { apiClient } from './axios-client'

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'PENDING' | 'READ' | 'RESPONDED' | 'CLOSED'
  createdAt: string
  updatedAt: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export const contactApi = {
  // Send contact message
  sendMessage: (data: ContactFormData) =>
    apiClient.post<ContactMessage>('/contact/messages', data),
  
  // Get FAQs
  getFAQs: () =>
    apiClient.get<FAQ[]>('/contact/faqs'),
  
  // Get contact messages (admin)
  getMessages: (page = 1, limit = 20) =>
    apiClient.get<any>('/contact/messages', { page, limit }),
  
  // Get message by ID (admin)
  getMessage: (id: string) =>
    apiClient.get<ContactMessage>(`/contact/messages/${id}`),
  
  // Update message (admin)
  updateMessage: (id: string, data: Partial<ContactMessage>) =>
    apiClient.put<ContactMessage>(`/contact/messages/${id}`, data),
  
  // Delete message (admin)
  deleteMessage: (id: string) =>
    apiClient.delete(`/contact/messages/${id}`),
  
  // Create FAQ (admin)
  createFAQ: (data: Partial<FAQ>) =>
    apiClient.post<FAQ>('/contact/faqs', data),
  
  // Update FAQ (admin)
  updateFAQ: (id: string, data: Partial<FAQ>) =>
    apiClient.put<FAQ>(`/contact/faqs/${id}`, data),
  
  // Delete FAQ (admin)
  deleteFAQ: (id: string) =>
    apiClient.delete(`/contact/faqs/${id}`),
  
  // Get contact statistics (admin)
  getContactStats: () =>
    apiClient.get<any>('/contact/stats'),
}