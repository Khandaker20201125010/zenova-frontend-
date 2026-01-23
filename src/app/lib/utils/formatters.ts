// lib/utils/formatters.ts
/**
 * Formatters for various data types
 */

import { format, formatDistanceToNow } from "date-fns"

// Number formatters
export const numberFormatters = {
  compact: (num: number): string => {
    const formatter = Intl.NumberFormat("en", { notation: "compact" })
    return formatter.format(num)
  },
  
  percent: (num: number, decimals: number = 1): string => {
    return `${(num * 100).toFixed(decimals)}%`
  },
  
  decimal: (num: number, decimals: number = 2): string => {
    return num.toFixed(decimals)
  },
  
  ordinal: (num: number): string => {
    const suffixes = ["th", "st", "nd", "rd"]
    const v = num % 100
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
  },
}

// Date formatters
export const dateFormatters = {
  full: (date: Date | string): string => {
    return format(new Date(date), "PPPP")
  },
  
  long: (date: Date | string): string => {
    return format(new Date(date), "PPpp")
  },
  
  medium: (date: Date | string): string => {
    return format(new Date(date), "PPp")
  },
  
  short: (date: Date | string): string => {
    return format(new Date(date), "P")
  },
  
  time: (date: Date | string): string => {
    return format(new Date(date), "p")
  },
  
  relative: (date: Date | string): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  },
  
  monthYear: (date: Date | string): string => {
    return format(new Date(date), "MMMM yyyy")
  },
  
  year: (date: Date | string): string => {
    return format(new Date(date), "yyyy")
  },
}

// File size formatters
export const fileSizeFormatters = {
  bytes: (bytes: number): string => {
    const units = ["B", "KB", "MB", "GB", "TB"]
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  },
  
  precise: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  },
}

// Text formatters
export const textFormatters = {
  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim()
  },
  
  camelToTitle: (text: string): string => {
    return text
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  },
  
  snakeToTitle: (text: string): string => {
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  },
  
  kebabToTitle: (text: string): string => {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  },
  
  truncate: (text: string, maxLength: number, ellipsis: string = "..."): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - ellipsis.length) + ellipsis
  },
  
  initials: (name: string, maxLength: number = 2): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, maxLength)
  },
}

// Color formatters
export const colorFormatters = {
  hexToRgb: (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return "rgb(0, 0, 0)"
    return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
  },
  
  hexToRgba: (hex: string, alpha: number = 1): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return `rgba(0, 0, 0, ${alpha})`
    return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
  },
  
  rgbToHex: (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  },
}

// Phone number formatters
export const phoneFormatters = {
  us: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "")
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
  },
  
  international: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length === 10) {
      return `+1 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    }
    return phone
  },
}

// Social media formatters
export const socialFormatters = {
  twitterHandle: (handle: string): string => {
    return handle.startsWith("@") ? handle : `@${handle}`
  },
  
  instagramHandle: (handle: string): string => {
    return handle.startsWith("@") ? handle : `@${handle}`
  },
  
  youtubeUrl: (channelId: string): string => {
    return `https://www.youtube.com/channel/${channelId}`
  },
  
  facebookUrl: (username: string): string => {
    return `https://www.facebook.com/${username}`
  },
  
  twitterUrl: (username: string): string => {
    return `https://twitter.com/${username.replace("@", "")}`
  },
  
  instagramUrl: (username: string): string => {
    return `https://instagram.com/${username.replace("@", "")}`
  },
}

// Currency formatters by country
export const currencyFormatters = {
  usd: (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  },
  
  eur: (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  },
  
  gbp: (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  },
  
  jpy: (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "JPY",
    }).format(amount)
  },
  
  inr: (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  },
}

// Export all formatters
export const formatters = {
  ...numberFormatters,
  ...dateFormatters,
  ...fileSizeFormatters,
  ...textFormatters,
  ...colorFormatters,
  ...phoneFormatters,
  ...socialFormatters,
  ...currencyFormatters,
}