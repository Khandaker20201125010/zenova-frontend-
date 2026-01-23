/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/types/index.ts
// Base types

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  error?: string
  errors?: Array<{
    field: string
    message: string
  }>
}

// User types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "USER" | "ADMIN" | "MANAGER"
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED"
  emailVerified: boolean
  phone?: string
  bio?: string
  website?: string
  location?: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface UserProfile extends User {
  ordersCount: number
  reviewsCount: number
  favoritesCount: number
  totalSpent: number
}

// Product types
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  tags: string[]
  inventory: number
  sku?: string
  rating: number
  reviewCount: number
  isFeatured: boolean
  isNew: boolean
  specifications?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  price: number
  sku: string
  inventory: number
  attributes: Record<string, string>
}

// Category types
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  order: number
  productCount: number
  children?: Category[]
}

// Order types
export interface Order {
  id: string
  orderNumber: string
  userId: string
  user?: User
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  paymentMethod: string
  shippingAddress: Address
  billingAddress?: Address
  items: OrderItem[]
  notes?: string
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingNumber?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productImage?: string
  variant?: string
  quantity: number
  price: number
  total: number
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  phone: string
}

// Payment types
export interface Payment {
  id: string
  orderId: string
  amount: number
  currency: string
  method: string
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
  transactionId?: string
  paymentIntentId?: string
  refundId?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

// Review types
export interface Review {
  id: string
  productId: string
  product?: Product
  userId: string
  user?: User
  rating: number
  comment: string
  verifiedPurchase: boolean
  helpful: number
  images?: string[]
  createdAt: string
  updatedAt: string
}

// Blog types
export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  authorId: string
  author?: User
  category: string
  tags: string[]
  published: boolean
  views: number
  readTime: number
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR"
  title: string
  message: string
  read: boolean
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

// Contact types
export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "PENDING" | "READ" | "RESPONDED" | "CLOSED"
  response?: string
  respondedAt?: string
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
  createdAt: string
  updatedAt: string
}

// Settings types
export interface Settings {
  id: string
  key: string
  value: any
  category: string
  type: "STRING" | "NUMBER" | "BOOLEAN" | "JSON" | "ARRAY"
  description?: string
  createdAt: string
  updatedAt: string
}

export interface SiteSettings {
  site: {
    name: string
    description: string
    logo?: string
    favicon?: string
    theme: "light" | "dark" | "auto"
    language: string
    timezone: string
    currency: string
  }
  contact: {
    email: string
    phone?: string
    address?: string
    socialLinks: Record<string, string>
  }
  email: {
    from: string
    smtp: {
      host: string
      port: number
      secure: boolean
      user: string
      password: string
    }
    templates: Record<string, string>
  }
  payment: {
    stripe: {
      publicKey: string
      secretKey: string
      webhookSecret: string
    }
    currency: string
    methods: string[]
  }
  storage: {
    cloudinary: {
      cloudName: string
      apiKey: string
      apiSecret: string
    }
    maxFileSize: number
    allowedTypes: string[]
  }
  security: {
    passwordMinLength: number
    requireEmailVerification: boolean
    enable2FA: boolean
    sessionTimeout: number
  }
  analytics: {
    googleAnalyticsId?: string
    facebookPixelId?: string
  }
}

// Activity types
export interface Activity {
  id: string
  userId: string
  user?: User
  action: string
  entityType: string
  entityId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

// Favorite types
export interface Favorite {
  id: string
  userId: string
  productId: string
  product?: Product
  createdAt: string
}

// Subscription types
export interface Subscription {
  id: string
  userId: string
  plan: string
  status: "ACTIVE" | "CANCELLED" | "EXPIRED"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  createdAt: string
  updatedAt: string
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  activeUsers: number
  pendingOrders: number
  monthlyGrowth: number
  conversionRate: number
  averageOrderValue: number
}

export interface RevenueData {
  date: string
  revenue: number
  orders: number
  averageOrderValue: number
}

export interface UserGrowthData {
  date: string
  totalUsers: number
  newUsers: number
  activeUsers: number
}

export interface SalesData {
  category: string
  sales: number
  percentage: number
}

export interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
  stock: number
}

// Form types
export interface FormState {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error?: string
  message?: string
}

// Pagination types
export interface PaginationParams {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Filter types
export interface FilterParams {
  search?: string
  category?: string
  tags?: string[]
  minPrice?: number
  maxPrice?: number
  status?: string
  role?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  dateFrom?: string
  dateTo?: string
}

// Table types
export interface TableColumn<T> {
  key: keyof T | string
  header: string
  cell?: (item: T) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: "left" | "center" | "right"
}

// Chart types
export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor: string | string[]
    borderColor: string | string[]
    borderWidth: number
  }>
}

// NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      avatar?: string
      role: string
    }
    accessToken: string
  }
  
  interface User {
    id: string
    email: string
    name: string
    role: string
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    role: string
    accessToken: string
  }
}

// Export all types
// export type {
//   ApiResponse,
//   User,
//   UserProfile,
//   Product,
//   ProductVariant,
//   Category,
//   Order,
//   OrderItem,
//   Address,
//   Payment,
//   Review,
//   BlogPost,
//   Notification,
//   ContactMessage,
//   FAQ,
//   Settings,
//   SiteSettings,
//   Activity,
//   Favorite,
//   Subscription,
//   DashboardStats,
//   RevenueData,
//   UserGrowthData,
//   SalesData,
//   TopProduct,
//   FormState,
//   PaginationParams,
//   FilterParams,
//   TableColumn,
//   ChartData,
// }