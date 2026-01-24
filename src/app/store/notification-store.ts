// store/notification-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Notification as TNotification } from "../lib/types"

interface NotificationStore {
  // State
  notifications: TNotification[]
  unreadCount: number
  soundEnabled: boolean
  pushEnabled: boolean
  
  // Actions
  addNotification: (notification: Omit<TNotification, "id" | "createdAt" | "updatedAt">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  toggleSound: () => void
  togglePush: () => void
  
  // Computed
  getUnreadNotifications: () => TNotification[]
  getReadNotifications: () => TNotification[]
  getRecentNotifications: (limit?: number) => TNotification[]
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      soundEnabled: true,
      pushEnabled: true,
      
      // Actions
      addNotification: (notification) => {
        const newNotification: TNotification = {
          id: Math.random().toString(36).substr(2, 9),
          ...notification,
          read: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
        
        // Play sound if enabled
        if (get().soundEnabled) {
          const audio = new Audio("/notification.mp3")
          audio.play().catch(() => {})
        }
        
        // Show browser notification if enabled and granted
        if (get().pushEnabled && "Notification" in window && window.Notification.permission === "granted") {
          new window.Notification(notification.title, {
            body: notification.message,
            icon: "/favicon.ico",
          })
        }
      },
      
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true, updatedAt: new Date().toISOString() } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }))
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read: true,
            updatedAt: new Date().toISOString(),
          })),
          unreadCount: 0,
        }))
      },
      
      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id)
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: notification?.read ? state.unreadCount : Math.max(0, state.unreadCount - 1),
          }
        })
      },
      
      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 })
      },
      
      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }))
      },
      
      togglePush: () => {
        set((state) => ({ pushEnabled: !state.pushEnabled }))
      },
      
      // Computed
      getUnreadNotifications: () => {
        return get().notifications.filter((n) => !n.read)
      },
      
      getReadNotifications: () => {
        return get().notifications.filter((n) => n.read)
      },
      
      getRecentNotifications: (limit = 10) => {
        return get().notifications.slice(0, limit)
      },
    }),
    {
      name: "notification-storage",
    }
  )
)