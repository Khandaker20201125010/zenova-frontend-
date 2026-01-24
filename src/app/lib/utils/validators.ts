// lib/utils/validators.ts
import { z } from "zod"
import { VALIDATION_MESSAGES } from "./constants"

/**
 * Common validation schemas using Zod
 */

// Email validation
export const emailSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.REQUIRED)
  .email(VALIDATION_MESSAGES.EMAIL)

// Password validation
export const passwordSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.REQUIRED)
  .min(6, VALIDATION_MESSAGES.MIN_LENGTH(6))
  .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))

// Name validation
export const nameSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.REQUIRED)
  .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
  .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))

// URL validation
export const urlSchema = z
  .string()
  .url(VALIDATION_MESSAGES.INVALID_URL)
  .or(z.literal(""))

// Phone validation
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number")

// Date validation
export const dateSchema = z
  .string()
  .or(z.date())
  .refine((val) => !isNaN(new Date(val).getTime()), VALIDATION_MESSAGES.INVALID_DATE)

// Number validation
export const numberSchema = z
  .number()
  .or(z.string().regex(/^\d+$/).transform(Number))
  .refine((val) => !isNaN(val), VALIDATION_MESSAGES.INVALID_NUMBER)

// Positive number validation
export const positiveNumberSchema = numberSchema.refine(
  (val) => val > 0,
  "Must be a positive number"
)

// Non-negative number validation
export const nonNegativeNumberSchema = numberSchema.refine(
  (val) => val >= 0,
  "Must be a non-negative number"
)

// File validation
export const fileSchema = z.instanceof(File).refine(
  (file) => {
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    return file.size <= MAX_SIZE
  },
  "File size must be less than 10MB"
).refine(
  (file) => {
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ]
    return ALLOWED_TYPES.includes(file.type)
  },
  "File type not supported. Allowed types: JPEG, PNG, GIF, WEBP, PDF"
)

// Array validation
export const arraySchema = z
  .array(z.any())
  .min(1, "At least one item is required")

// Object validation
export const objectSchema = z
  .object({})
  .refine((obj) => Object.keys(obj).length > 0, "Object cannot be empty")

// Common validation schemas
export const validationSchemas = {
  // Auth schemas
  login: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
  
  register: z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  }).refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORD_MATCH,
    path: ["confirmPassword"],
  }),
  
  resetPassword: z.object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  }).refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORD_MATCH,
    path: ["confirmPassword"],
  }),
  
  changePassword: z.object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORD_MATCH,
    path: ["confirmPassword"],
  }),
  
  // Profile schemas
  profile: z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema.optional().or(z.literal("")),
    bio: z.string().max(500, VALIDATION_MESSAGES.MAX_LENGTH(500)).optional(),
    website: urlSchema.optional(),
    location: z.string().max(100, VALIDATION_MESSAGES.MAX_LENGTH(100)).optional(),
  }),
  
  // Product schemas
  product: z.object({
    name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED).max(200, VALIDATION_MESSAGES.MAX_LENGTH(200)),
    description: z.string().min(1, VALIDATION_MESSAGES.REQUIRED).max(2000, VALIDATION_MESSAGES.MAX_LENGTH(2000)),
    price: positiveNumberSchema,
    compareAtPrice: positiveNumberSchema.optional(),
    category: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    tags: z.array(z.string()).optional(),
    inventory: nonNegativeNumberSchema,
    sku: z.string().max(100, VALIDATION_MESSAGES.MAX_LENGTH(100)).optional(),
    isFeatured: z.boolean().optional(),
    isNew: z.boolean().optional(),
    specifications: z.record(z.any()).optional(),
  }),
  
  // Order schemas
  order: z.object({
    shippingAddress: z.object({
      street: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
      city: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
      state: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
      country: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
      zipCode: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
      phone: phoneSchema,
    }),
    paymentMethod: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    notes: z.string().max(500, VALIDATION_MESSAGES.MAX_LENGTH(500)).optional(),
  }),
  
  // Review schemas
  review: z.object({
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    comment: z.string().min(1, VALIDATION_MESSAGES.REQUIRED).max(1000, VALIDATION_MESSAGES.MAX_LENGTH(1000)),
  }),
  
  // Contact schemas
  contact: z.object({
    name: nameSchema,
    email: emailSchema,
    subject: z.string().min(1, VALIDATION_MESSAGES.REQUIRED).max(200, VALIDATION_MESSAGES.MAX_LENGTH(200)),
    message: z.string().min(1, VALIDATION_MESSAGES.REQUIRED).max(2000, VALIDATION_MESSAGES.MAX_LENGTH(2000)),
  }),
  
  // Blog schemas
  blogPost: z.object({
    title: z.string().min(1, VALIDATION_MESSAGES.REQUIRED).max(200, VALIDATION_MESSAGES.MAX_LENGTH(200)),
    content: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    excerpt: z.string().max(300, VALIDATION_MESSAGES.MAX_LENGTH(300)).optional(),
    category: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
  }),
  
  // Category schemas
  category: z.object({
    name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED).max(100, VALIDATION_MESSAGES.MAX_LENGTH(100)),
    description: z.string().max(500, VALIDATION_MESSAGES.MAX_LENGTH(500)).optional(),
    parentId: z.string().optional().nullable(),
    order: z.number().int().optional(),
  }),
  
  // FAQ schemas
  faq: z.object({
    question: z.string().min(1, VALIDATION_MESSAGES.REQUIRED).max(200, VALIDATION_MESSAGES.MAX_LENGTH(200)),
    answer: z.string().min(1, VALIDATION_MESSAGES.REQUIRED).max(2000, VALIDATION_MESSAGES.MAX_LENGTH(2000)),
    category: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
  
  // Settings schemas
  settings: z.object({
    siteName: z.string().min(1, VALIDATION_MESSAGES.REQUIRED).max(100, VALIDATION_MESSAGES.MAX_LENGTH(100)),
    siteDescription: z.string().max(300, VALIDATION_MESSAGES.MAX_LENGTH(300)).optional(),
    contactEmail: emailSchema,
    supportEmail: emailSchema,
    phone: phoneSchema.optional(),
    address: z.string().max(200, VALIDATION_MESSAGES.MAX_LENGTH(200)).optional(),
    socialLinks: z.record(z.string(), z.string()).optional(),
    currency: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    timezone: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    maintenanceMode: z.boolean().optional(),
  }),
}

/**
 * Validate data against schema
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((err) => {
        const path = err.path.join(".")
        errors[path] = err.message
      })
      return { success: false, errors }
    }
    throw error
  }
}

/**
 * Create a validation resolver for react-hook-form
 */
export function createResolver<T>(schema: z.ZodSchema<T>) {
  return async (data: unknown) => {
    const result = validateData(schema, data)
    if (result.success) {
      return { values: result.data, errors: {} }
    } else {
      return { values: {}, errors: result.errors }
    }
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0
  
  // Length check
  if (password.length >= 8) score += 1
  else feedback.push("Password should be at least 8 characters long")
  
  // Upper case check
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push("Include at least one uppercase letter")
  
  // Lower case check
  if (/[a-z]/.test(password)) score += 1
  else feedback.push("Include at least one lowercase letter")
  
  // Number check
  if (/\d/.test(password)) score += 1
  else feedback.push("Include at least one number")
  
  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  else feedback.push("Include at least one special character")
  
  return {
    valid: score >= 4,
    score,
    feedback: score >= 4 ? [] : feedback,
  }
}

/**
 * Validate URL
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): boolean {
  const regex = /^\+?[\d\s\-\(\)]{10,}$/
  return regex.test(phone.replace(/\s/g, ""))
}

/**
 * Validate file
 */
export function validateFile(file: File, options: {
  maxSize?: number
  allowedTypes?: string[]
} = {}): { valid: boolean; error?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = [] } = options
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${formatFileSize(maxSize)}`,
    }
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    }
  }
  
  return { valid: true }
}

/**
 * Format file size for error messages
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

/**
 * Sanitize input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove < and >
    .trim()
}

/**
 * Sanitize HTML
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/on\w+="[^"]*"/g, "") // Remove event handlers
    .replace(/javascript:/gi, "") // Remove javascript: URLs
}

/**
 * Escape regex characters
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Export types
export type LoginData = z.infer<typeof validationSchemas.login>
export type RegisterData = z.infer<typeof validationSchemas.register>
export type ProfileData = z.infer<typeof validationSchemas.profile>
export type ProductData = z.infer<typeof validationSchemas.product>
export type OrderData = z.infer<typeof validationSchemas.order>
export type ReviewData = z.infer<typeof validationSchemas.review>
export type ContactData = z.infer<typeof validationSchemas.contact>
export type BlogPostData = z.infer<typeof validationSchemas.blogPost>
export type CategoryData = z.infer<typeof validationSchemas.category>
export type FAQData = z.infer<typeof validationSchemas.faq>
export type SettingsData = z.infer<typeof validationSchemas.settings>