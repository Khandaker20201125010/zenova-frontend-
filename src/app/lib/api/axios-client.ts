/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { ApiResponse } from "../types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Optional if strictly using Bearer headers
});

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
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as any;

    const authEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/social-login",
      "/auth/refresh-token",
      "/auth/logout",
    ];

    const isAuthEndpoint = authEndpoints.some((endpoint) =>
      originalRequest?.url?.includes(endpoint)
    );

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
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
        // Fetching the session natively triggers NextAuth's jwt callback
        // This will securely grab the newly rotated tokens if the old one expired
        const session = await getSession();

        // If NextAuth explicitly set a RefreshAccessTokenError, the refresh failed permanently
        if (!session || (session as any).error === "RefreshAccessTokenError") {
          await signOut({ redirect: false });
          if (typeof window !== "undefined") {
            window.location.href = "/login?error=SessionExpired";
          }
          throw new Error("Session expired. Please log in again.");
        }

        if (session?.accessToken) {
          originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
          processQueue(null, session.accessToken as string);
          return api(originalRequest);
        }

        throw new Error("Failed to retrieve new access token.");
      } catch (refreshError) {
        console.error("Token refresh error via NextAuth:", refreshError);
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      Swal.fire({
        title: "Access Denied",
        text: "You do not have permission to access this resource",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }

    return Promise.reject(error);
  }
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
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data as T;
  },
  uploadMultiple: async <T>(url: string, files: File[], fieldName = 'files'): Promise<T> => {
    const formData = new FormData();
    files.forEach(file => { formData.append(fieldName, file); });
    const response = await api.post<ApiResponse<T>>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data as T;
  },
};

export { api };