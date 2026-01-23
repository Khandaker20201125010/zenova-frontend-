// lib/api/reviews.ts
import { Review } from '../types'
import { apiClient } from './axios-client'


export interface CreateReviewData {
  productId: string
  rating: number
  comment: string
}

export interface ReviewResponse {
  reviews: Review[]
  total: number
  page: number
  limit: number
  totalPages: number
  averageRating: number
  totalReviews: number
}

export const reviewsApi = {
  // Get product reviews
  getProductReviews: (productId: string, page = 1, limit = 10) =>
    apiClient.get<ReviewResponse>(`/reviews/product/${productId}`, { page, limit }),
  
  // Get user reviews
  getUserReviews: (page = 1, limit = 10) =>
    apiClient.get<ReviewResponse>('/reviews/user', { page, limit }),
  
  // Get recent reviews
  getRecentReviews: (limit = 10) =>
    apiClient.get<Review[]>('/reviews/recent', { limit }),
  
  // Create review
  createReview: (data: CreateReviewData) =>
    apiClient.post<Review>('/reviews', data),
  
  // Update review
  updateReview: (id: string, data: Partial<Review>) =>
    apiClient.put<Review>(`/reviews/${id}`, data),
  
  // Delete review
  deleteReview: (id: string) =>
    apiClient.delete(`/reviews/${id}`),
  
  // Mark review as helpful
  markHelpful: (id: string) =>
    apiClient.post(`/reviews/${id}/helpful`),
  
  // Report review
  reportReview: (id: string, reason: string) =>
    apiClient.post(`/reviews/${id}/report`, { reason }),
  
  // Get review statistics (admin)
  getReviewStats: () =>
    apiClient.get<any>('/reviews/stats'),
}