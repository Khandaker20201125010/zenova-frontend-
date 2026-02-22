/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/types/index.ts
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "USER" | "ADMIN" | "MANAGER"
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED"
  emailVerified: boolean
  phone?: string
  address?: Address
  preferences?: UserPreferences
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  language: string
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
}

export interface Product {
  id: string;
  name: string;
  slug: string  | undefined;
  description: string;
  shortDescription?: string;
  price: number;
  discountedPrice?: number;
  compareAtPrice?: number;
  images: string[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  features?: string[];
  specifications?: Record<string, any>;
  rating: number;
  reviewCount: number;
  stock: number;  // This is what your backend uses (not inventory)
  isFeatured: boolean;
  isActive?: boolean;
  isNew?: boolean; // For UI only
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    reviews: number;
    favorites: number;
  };
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  sku: string
  inventory: number
  attributes: Record<string, string>
}

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
  seo?: SEO
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  user?: User
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount?: number
  currency: string
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED"
  paymentMethod: string
  shippingAddress: Address
  billingAddress?: Address
  items: OrderItem[]
  notes?: string
  trackingNumber?: string
  estimatedDelivery?: string
  deliveredAt?: string
  cancelledAt?: string
  refundedAt?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  variantId?: string
  name: string
  sku: string
  quantity: number
  price: number
  total: number
  tax: number
  discount?: number
}

export interface Address {
  id?: string
  firstName: string
  lastName: string
  company?: string
  street: string
  apartment?: string
  city: string
  state: string
  country: string
  zipCode: string
  phone: string
  isDefault?: boolean
}

export interface Payment {
  id: string
  orderId: string
  userId: string
  amount: number
  currency: string
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
  method: string
  transactionId?: string
  gatewayResponse?: any
  refundedAmount?: number
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  productId: string
  product?: Product
  userId: string
  user?: User
  rating: number
  title?: string
  comment: string
  verifiedPurchase: boolean
  helpful: number
  reported: boolean
  status: "PENDING" | "APPROVED" | "REJECTED"
  images?: string[]
  replies?: ReviewReply[]
  createdAt: string
  updatedAt: string
}

export interface ReviewReply {
  id: string
  reviewId: string
  userId: string
  user?: User
  comment: string
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  authorId: string
  author?: {
    id: string
    name: string
    avatar: string | null
    position?: string | null
    bio?: string | null
  }
  category: string | null
  tags: string[]
  isPublished: boolean
  publishedAt: string | null
  views: number
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  userId: string
  user?: User
  parentId?: string
  content: string
  likes: number
  status: "PENDING" | "APPROVED" | "SPAM"
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR"
  title: string
  message: string
  data?: any
  read: boolean
  actionUrl?: string
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

export interface Setting {
  id: string
  key: string
  value: any
  type: "STRING" | "NUMBER" | "BOOLEAN" | "JSON" | "ARRAY"
  group: string
  label: string
  description?: string
  options?: any[]
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  userId: string
  user?: User
  planId: string
  plan?: Plan
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  cancelledAt?: string
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  interval: "MONTHLY" | "YEARLY" | "LIFETIME"
  features: string[]
  isActive: boolean
  isPopular: boolean
  trialDays?: number
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  userId: string
  user?: User
  type: string
  description: string
  ipAddress?: string
  userAgent?: string
  metadata?: any
  createdAt: string
}

export interface Favorite {
  id: string
  userId: string
  productId: string
  product?: Product
  createdAt: string
}

export interface ApiKey {
  id: string
  name: string
  key: string
  prefix: string
  userId: string
  user?: User
  permissions: string[]
  lastUsed?: string
  expiresAt?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SEO {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  canonical?: string
}

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
  refundRate: number
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
  recentOrders: Order[]
  recentUsers: User[]
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error?: string
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  [key: string]: any
}

export interface ReviewResponse {
  reviews: Review[]
  total: number
  page: number
  limit: number
  totalPages: number
  averageRating: number
  totalReviews: number
  distribution?: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}