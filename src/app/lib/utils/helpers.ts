/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/utils/helpers.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, parseISO } from "date-fns"
import { enUS } from "date-fns/locale"

/**
 * Merge class names with tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format date
 */
export function formatDate(
  date: string | Date,
  formatStr: string = "PP",
  locale: any = enUS
): string {
  return format(new Date(date), formatStr, { locale })
}

/**
 * Format date relative to now
 */
export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.slice(0, length) + "..."
}

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim()
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === "undefined") return false
  return window.innerWidth < 768
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === "undefined") return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

/**
 * Check if device is desktop
 */
export function isDesktop(): boolean {
  if (typeof window === "undefined") return false
  return window.innerWidth >= 1024
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Generate random ID
 */
export function generateId(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate random number in range
 */
export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Delay function
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand("copy")
      return true
    } catch {
      return false
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

/**
 * Get query params from URL
 */
export function getQueryParams(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)
  const result: Record<string, string> = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  return result
}

/**
 * Set query params in URL
 */
export function setQueryParams(params: Record<string, string>): void {
  if (typeof window === "undefined") return
  const url = new URL(window.location.href)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  window.history.replaceState({}, "", url.toString())
}

/**
 * Remove query params from URL
 */
export function removeQueryParams(keys: string[]): void {
  if (typeof window === "undefined") return
  const url = new URL(window.location.href)
  keys.forEach((key) => {
    url.searchParams.delete(key)
  })
  window.history.replaceState({}, "", url.toString())
}

/**
 * Generate gradient from string
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`
  return color
}

/**
 * Safe parse JSON
 */
export function safeParseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const output = { ...target } as T

  for (const key of Object.keys(source)) {
    const typedKey = key as keyof T

    const sourceValue = source[typedKey]
    const targetValue = target[typedKey]

    if (
      isObject(sourceValue) &&
      isObject(targetValue)
    ) {
      ;(output as Record<string, any>)[key] = deepMerge(
        targetValue as Record<string, any>,
        sourceValue as Record<string, any>
      )
    } else if (sourceValue !== undefined) {
      ;(output as Record<string, any>)[key] = sourceValue
    }
  }

  return output
}


function isObject(item: any): boolean {
  return item && typeof item === "object" && !Array.isArray(item)
}

/**
 * Group array by key
 */
export function groupBy<T>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key])
    groups[groupKey] = groups[groupKey] || []
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Remove duplicates from array
 */
export function removeDuplicates<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(array)]
  }
  const seen = new Set()
  return array.filter((item) => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Generate pagination array
 */
export function generatePagination(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | string)[] {
  const pages: (number | string)[] = []
  
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }
  
  const half = Math.floor(maxVisible / 2)
  let start = currentPage - half
  let end = currentPage + half
  
  if (start < 1) {
    end += 1 - start
    start = 1
  }
  
  if (end > totalPages) {
    start -= end - totalPages
    end = totalPages
  }
  
  if (start < 1) start = 1
  
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push("...")
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...")
    pages.push(totalPages)
  }
  
  return pages
}