// lib/utils/constants.ts
// Application constants

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SaaS Platform'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

// Pagination
export const DEFAULT_PAGE_SIZE = 12
export const DEFAULT_PAGE = 1

// Cache
export const CACHE_TTL = parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '3600')
export const REVALIDATE_TIME = parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TIME || '60')

// Upload limits
export const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760') // 10MB
export const ALLOWED_FILE_TYPES = (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',')

// User roles
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
} as const

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
} as const

// Colors for notification types
export const NOTIFICATION_COLORS = {
  INFO: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200',
  SUCCESS: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200',
  WARNING: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200',
  ERROR: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200',
}

// Theme colors
export const THEME_COLORS = {
  light: {
    background: '#ffffff',
    foreground: '#111827',
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#f3f4f6',
  },
  dark: {
    background: '#111827',
    foreground: '#f9fafb',
    primary: '#60a5fa',
    secondary: '#9ca3af',
    accent: '#1f2937',
  },
}

// Navigation items
export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

// Dashboard navigation
export const DASHBOARD_NAV_ITEMS = {
  USER: [
    { href: '/dashboard', label: 'Overview', icon: 'LayoutDashboard' },
    { href: '/dashboard/orders', label: 'Orders', icon: 'Package' },
    { href: '/dashboard/favorites', label: 'Favorites', icon: 'Heart' },
    { href: '/dashboard/reviews', label: 'Reviews', icon: 'Star' },
    { href: '/dashboard/settings', label: 'Settings', icon: 'Settings' },
  ],
  ADMIN: [
    { href: '/admin', label: 'Overview', icon: 'LayoutDashboard' },
    { href: '/admin/users', label: 'Users', icon: 'Users' },
    { href: '/admin/products', label: 'Products', icon: 'Package' },
    { href: '/admin/orders', label: 'Orders', icon: 'ShoppingCart' },
    { href: '/admin/blog', label: 'Blog', icon: 'FileText' },
    { href: '/admin/analytics', label: 'Analytics', icon: 'BarChart3' },
    { href: '/admin/settings', label: 'Settings', icon: 'Settings' },
  ],
}

// Social links
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/saasplatform',
  facebook: 'https://facebook.com/saasplatform',
  instagram: 'https://instagram.com/saasplatform',
  linkedin: 'https://linkedin.com/company/saasplatform',
  github: 'https://github.com/saasplatform',
}

// Feature flags
export const FEATURES = {
  SOCIAL_LOGIN: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN === 'true',
  STRIPE: process.env.NEXT_PUBLIC_ENABLE_STRIPE === 'true',
  BLOG: process.env.NEXT_PUBLIC_ENABLE_BLOG === 'true',
  NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
}

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (length: number) => `Must be at least ${length} characters`,
  MAX_LENGTH: (length: number) => `Must be at most ${length} characters`,
  PASSWORD_MATCH: 'Passwords do not match',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_NUMBER: 'Please enter a valid number',
  INVALID_DATE: 'Please enter a valid date',
}

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    ME: '/auth/me',
  },
  USERS: {
    PROFILE: '/users/profile',
    AVATAR: '/users/avatar',
    LIST: '/users',
  },
  PRODUCTS: {
    LIST: '/products',
    FEATURED: '/products/featured',
    DETAILS: (slug: string) => `/products/slug/${slug}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },
  ORDERS: {
    CREATE: '/orders',
    USER: '/orders/user',
    DETAILS: (id: string) => `/orders/${id}`,
    CHECKOUT: (id: string) => `/orders/${id}/checkout`,
  },
} as const