/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/axios-client.ts
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { ApiResponse } from "../types";

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as any;

    // Don't handle auth errors on auth endpoints
    const authEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/social-login",
      "/auth/refresh-token",
      "/auth/logout",
    ];

    const isAuthEndpoint = authEndpoints.some((endpoint) =>
      originalRequest?.url?.includes(endpoint),
    );

    // If it's an auth endpoint, just reject
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refreshing already, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const session = await getSession();
        console.log("Session for refresh:", session);

        if (session?.refreshToken) {
          console.log("Attempting to refresh token...");

          // Get the refresh token from session
          const refreshToken = session.refreshToken;

          // Try multiple approaches
          let refreshResponse;
          let lastError;

          // Approach 1: Send in body (most common)
          try {
            console.log("Trying refresh with body...");
            refreshResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
              { refreshToken }, // Send in body
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );
            console.log("Refresh with body successful:", refreshResponse.data);
          } catch (err) {
            lastError = err;
            console.log("Refresh with body failed, trying with cookie only...");
            
            // Approach 2: Try with empty body (cookie only)
            try {
              refreshResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
                {}, // Empty body - rely on cookie
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                }
              );
              console.log("Refresh with cookie successful:", refreshResponse.data);
            } catch (err2) {
              lastError = err2;
              throw lastError;
            }
          }

          if (refreshResponse.data.success) {
            const newToken =
              refreshResponse.data.data?.token || refreshResponse.data.data?.accessToken;

            if (newToken) {
              console.log("Token refreshed successfully");
              
              // Update the original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;

              // Process queued requests
              processQueue(null, newToken);
              return api(originalRequest);
            }
          }
        }

        // If refresh fails, reject the queue but DON'T sign out automatically
        console.error("Token refresh failed");
        processQueue(error, null);
        return Promise.reject(error);
      } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      Swal.fire({
        title: "Access Denied",
        text: "You do not have permission to access this resource",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }

    return Promise.reject(error);
  },
);

export const apiClient = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    const response = await api.get<ApiResponse<T>>(url, { params });
    return response.data.data as T;
  },

  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.post<ApiResponse<T>>(url, data);
    return response.data.data as T;
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.put<ApiResponse<T>>(url, data);
    return response.data.data as T;
  },

  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.patch<ApiResponse<T>>(url, data);
    return response.data.data as T;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete<ApiResponse<T>>(url);
    return response.data.data as T;
  },
  
  upload: async <T>(url: string, file: File, fieldName = 'file'): Promise<T> => {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await api.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data as T;
  },

  uploadMultiple: async <T>(url: string, files: File[], fieldName = 'files'): Promise<T> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append(fieldName, file);
    });

    const response = await api.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data as T;
  },
};

export { api };