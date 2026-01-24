/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/axios-client.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { getSession, signOut } from 'next-auth/react'
import Swal from 'sweetalert2'
import { ApiResponse } from '../types'


// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get session
    const session = await getSession()
    
    // Add auth token if exists
    if (session?.accessToken) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${session.accessToken}`
    }
    
    // Add request ID for tracing
    config.headers = config.headers || {}
    config.headers['X-Request-ID'] = crypto.randomUUID()
    
    // Add timestamp
    config.headers['X-Timestamp'] = Date.now().toString()
    
    return config
  },
  (error: AxiosError) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Handle successful response
    if (response.data.success === false) {
      // Handle API error response
      return Promise.reject(new Error(response.data.message || 'API Error'))
    }
    
    return response
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as any
    
    // Handle network errors
    if (!error.response) {
      Swal.fire({
        title: 'Network Error',
        text: 'Please check your internet connection',
        icon: 'error',
        confirmButtonText: 'OK',
      })
      return Promise.reject(error)
    }
    
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        // Bad request
        Swal.fire({
          title: 'Validation Error',
          html: data.errors?.map(e => `<p>• ${e.message}</p>`).join('') || data.message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
        break
        
      case 401:
        // Unauthorized - token expired
        if (!originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            // Try to refresh token
            const refreshResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
              {},
              { withCredentials: true }
            )
            
            if (refreshResponse.data.success) {
              // Retry original request
              return api(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            await signOut({ redirect: false })
            window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
          }
        }
        break
        
      case 403:
        // Forbidden
        Swal.fire({
          title: 'Access Denied',
          text: 'You do not have permission to access this resource',
          icon: 'warning',
          confirmButtonText: 'OK',
        })
        break
        
      case 404:
        // Not found
        Swal.fire({
          title: 'Not Found',
          text: data.message || 'The requested resource was not found',
          icon: 'error',
          confirmButtonText: 'OK',
        })
        break
        
      case 422:
        // Validation error
        Swal.fire({
          title: 'Validation Error',
          html: data.errors?.map(e => `<p>• ${e.message}</p>`).join('') || data.message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
        break
        
      case 429:
        // Rate limited
        Swal.fire({
          title: 'Too Many Requests',
          text: 'Please wait a moment before trying again',
          icon: 'warning',
          confirmButtonText: 'OK',
        })
        break
        
      case 500:
        // Server error
        Swal.fire({
          title: 'Server Error',
          text: 'Something went wrong on our end. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        })
        break
        
      default:
        // Other errors
        Swal.fire({
          title: 'Error',
          text: data.message || 'An unexpected error occurred',
          icon: 'error',
          confirmButtonText: 'OK',
        })
    }
    
    return Promise.reject(error)
  }
)

// API methods
export const apiClient = {
  // GET request
  get: async <T>(url: string, params?: any): Promise<T> => {
    const response = await api.get<ApiResponse<T>>(url, { params })
    return response.data.data as T
  },
  
  // POST request
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.post<ApiResponse<T>>(url, data)
    return response.data.data as T
  },
  
  // PUT request
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.put<ApiResponse<T>>(url, data)
    return response.data.data as T
  },
  
  // PATCH request
  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.patch<ApiResponse<T>>(url, data)
    return response.data.data as T
  },
  
  // DELETE request
  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete<ApiResponse<T>>(url)
    return response.data.data as T
  },
  
  // Upload file
  upload: async <T>(url: string, file: File, fieldName = 'file'): Promise<T> => {
    const formData = new FormData()
    formData.append(fieldName, file)
    
    const response = await api.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data as T
  },
  
  // Upload multiple files
  uploadMultiple: async <T>(url: string, files: File[], fieldName = 'files'): Promise<T> => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append(fieldName, file)
    })
    
    const response = await api.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data as T
  },
}

export { api }