// store/settings-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SettingsStore {
  // State
  language: string
  currency: string
  timezone: string
  dateFormat: string
  timeFormat: "12h" | "24h"
  notifications: {
    email: boolean
    push: boolean
    sound: boolean
    marketing: boolean
  }
  privacy: {
    profileVisible: boolean
    activityVisible: boolean
    searchable: boolean
  }
  accessibility: {
    highContrast: boolean
    reducedMotion: boolean
    largeText: boolean
  }
  
  // Actions
  setLanguage: (language: string) => void
  setCurrency: (currency: string) => void
  setTimezone: (timezone: string) => void
  setDateFormat: (format: string) => void
  setTimeFormat: (format: "12h" | "24h") => void
  setNotificationSetting: (key: keyof SettingsStore["notifications"], value: boolean) => void
  setPrivacySetting: (key: keyof SettingsStore["privacy"], value: boolean) => void
  setAccessibilitySetting: (key: keyof SettingsStore["accessibility"], value: boolean) => void
  resetSettings: () => void
  
  // Computed
  getLocale: () => string
  getCurrencySymbol: () => string
}

const defaultSettings = {
  language: "en",
  currency: "USD",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h" as const,
  notifications: {
    email: true,
    push: true,
    sound: true,
    marketing: false,
  },
  privacy: {
    profileVisible: true,
    activityVisible: true,
    searchable: true,
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    largeText: false,
  },
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      // Actions
      setLanguage: (language) => {
        set({ language })
      },
      
      setCurrency: (currency) => {
        set({ currency })
      },
      
      setTimezone: (timezone) => {
        set({ timezone })
      },
      
      setDateFormat: (dateFormat) => {
        set({ dateFormat })
      },
      
      setTimeFormat: (format) => {
        set({ timeFormat: format })
      },
      
      setNotificationSetting: (key, value) => {
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        }))
      },
      
      setPrivacySetting: (key, value) => {
        set((state) => ({
          privacy: { ...state.privacy, [key]: value },
        }))
      },
      
      setAccessibilitySetting: (key, value) => {
        set((state) => ({
          accessibility: { ...state.accessibility, [key]: value },
        }))
      },
      
      resetSettings: () => {
        set(defaultSettings)
      },
      
      // Computed
      getLocale: () => {
        const { language } = get()
        return `${language}-${language.toUpperCase()}`
      },
      
      getCurrencySymbol: () => {
        const { currency } = get()
        const formatter = new Intl.NumberFormat(undefined, {
          style: "currency",
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
        return formatter.format(0).replace(/[0-9.,\s]/g, "")
      },
    }),
    {
      name: "settings-storage",
    }
  )
)