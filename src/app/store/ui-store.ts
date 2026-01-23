// store/ui-store.ts
import { create } from "zustand"

interface UIStore {
  // State
  theme: "light" | "dark" | "system"
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  searchOpen: boolean
  notificationOpen: boolean
  modalOpen: boolean
  modalContent: React.ReactNode | null
  toastQueue: Array<{ message: string; type: "success" | "error" | "info" }>
  
  // Actions
  toggleTheme: () => void
  setTheme: (theme: "light" | "dark" | "system") => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  toggleSearch: () => void
  setSearchOpen: (open: boolean) => void
  toggleNotification: () => void
  setNotificationOpen: (open: boolean) => void
  openModal: (content: React.ReactNode) => void
  closeModal: () => void
  addToast: (message: string, type?: "success" | "error" | "info") => void
  removeToast: (index: number) => void
  
  // Computed
  isDarkMode: () => boolean
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  theme: "system",
  sidebarOpen: true,
  mobileMenuOpen: false,
  searchOpen: false,
  notificationOpen: false,
  modalOpen: false,
  modalContent: null,
  toastQueue: [],
  
  // Actions
  toggleTheme: () => {
    set((state) => {
      const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"]
      const currentIndex = themes.indexOf(state.theme)
      const nextIndex = (currentIndex + 1) % themes.length
      return { theme: themes[nextIndex] }
    })
  },
  
  setTheme: (theme) => {
    set({ theme })
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }))
  },
  
  setSidebarOpen: (open) => {
    set({ sidebarOpen: open })
  },
  
  toggleMobileMenu: () => {
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }))
  },
  
  setMobileMenuOpen: (open) => {
    set({ mobileMenuOpen: open })
  },
  
  toggleSearch: () => {
    set((state) => ({ searchOpen: !state.searchOpen }))
  },
  
  setSearchOpen: (open) => {
    set({ searchOpen: open })
  },
  
  toggleNotification: () => {
    set((state) => ({ notificationOpen: !state.notificationOpen }))
  },
  
  setNotificationOpen: (open) => {
    set({ notificationOpen: open })
  },
  
  openModal: (content) => {
    set({ modalOpen: true, modalContent: content })
  },
  
  closeModal: () => {
    set({ modalOpen: false, modalContent: null })
  },
  
  addToast: (message, type = "info") => {
    set((state) => ({
      toastQueue: [...state.toastQueue, { message, type }],
    }))
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      get().removeToast(get().toastQueue.length - 1)
    }, 5000)
  },
  
  removeToast: (index) => {
    set((state) => ({
      toastQueue: state.toastQueue.filter((_, i) => i !== index),
    }))
  },
  
  // Computed
  isDarkMode: () => {
    const { theme } = get()
    
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    
    return theme === "dark"
  },
}))