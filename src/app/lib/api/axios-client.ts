/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
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
    const session = await getSession()
    
    if (session?.accessToken) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${session.accessToken}`
    }
    
    config.headers = config.headers || {}
    config.headers['X-Request-ID'] = crypto.randomUUID()
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
    if (response.data.success === false) {
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
    
    const { status, config } = error.response
    
    // Skip auth handling for public endpoints
    const publicEndpoints = [
      '/auth/login', 
      '/auth/register', 
      '/auth/social-login', 
      '/auth/refresh-token',
      '/auth/forgot-password',
      '/auth/reset-password'
    ]
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint))
    
    if (isPublicEndpoint) {
      return Promise.reject(error)
    }
    
    // Handle 401 Unauthorized
    if (status === 401) {
      // Prevent infinite loops
      if (originalRequest._retry) {
        console.log('Token refresh already attempted, logging out...')
        await signOut({ redirect: false })
        window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
        return Promise.reject(error)
      }
      
      originalRequest._retry = true
      
      try {
        const session = await getSession()
        console.log('Current session for refresh:', session)
        
        if (session?.refreshToken) {
          console.log('Attempting to refresh token...')
          
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            { refreshToken: session.refreshToken },
            { 
              headers: { 
                'Content-Type': 'application/json',
              },
            }
          )
          
          console.log('Refresh response:', refreshResponse.data)
          
          if (refreshResponse.data.success) {
            const newToken = refreshResponse.data.data?.token || refreshResponse.data.data?.accessToken
            
            if (newToken) {
              // Update the original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              
              // You might want to update the session here
              // For now, just retry the request
              return api(originalRequest)
            }
          }
        }
        
        // If refresh fails, logout
        console.error('Token refresh failed - logging out')
        await signOut({ redirect: false })
        window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
        return Promise.reject(error)
      } catch (refreshError: any) {
        console.error('Token refresh error:', {
          message: refreshError.message,
          response: refreshError.response?.data,
          status: refreshError.response?.status
        })
        
        await signOut({ redirect: false })
        window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
        return Promise.reject(error)
      }
    }
    
    // Handle other status codes
    switch (status) {
      case 400:
        Swal.fire({
          title: 'Validation Error',
          html: error.response?.data?.errors?.map((e: any) => `<p>• ${e.message}</p>`).join('') || error.response?.data?.message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
        break
        
      case 403:
        Swal.fire({
          title: 'Access Denied',
          text: 'You do not have permission to access this resource',
          icon: 'warning',
          confirmButtonText: 'OK',
        })
        break
        
      case 404:
        Swal.fire({
          title: 'Not Found',
          text: error.response?.data?.message || 'The requested resource was not found',
          icon: 'error',
          confirmButtonText: 'OK',
        })
        break
        
      case 422:
        Swal.fire({
          title: 'Validation Error',
          html: error.response?.data?.errors?.map((e: any) => `<p>• ${e.message}</p>`).join('') || error.response?.data?.message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
        break
        
      case 429:
        Swal.fire({
          title: 'Too Many Requests',
          text: 'Please wait a moment before trying again',
          icon: 'warning',
          confirmButtonText: 'OK',
        })
        break
        
      case 500:
        Swal.fire({
          title: 'Server Error',
          text: 'Something went wrong on our end. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        })
        break
        
      default:
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'An unexpected error occurred',
          icon: 'error',
          confirmButtonText: 'OK',
        })
    }
    
    return Promise.reject(error)
  }
)

// API methods
export const apiClient = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    const response = await api.get<ApiResponse<T>>(url, { params })
    return response.data.data as T
  },
  
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.post<ApiResponse<T>>(url, data)
    return response.data.data as T
  },
  
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.put<ApiResponse<T>>(url, data)
    return response.data.data as T
  },
  
  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.patch<ApiResponse<T>>(url, data)
    return response.data.data as T
  },
  
  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete<ApiResponse<T>>(url)
    return response.data.data as T
  },
  
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