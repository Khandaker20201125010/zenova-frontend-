// store/auth-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User } from "../lib/types"


interface AuthStore {
  // State
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  
  // Computed
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Actions
      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },
      
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken })
      },
      
      setAccessToken: (accessToken) => {
        set({ accessToken })
      },
      
      setRefreshToken: (refreshToken) => {
        set({ refreshToken })
      },
      
      setLoading: (isLoading) => {
        set({ isLoading })
      },
      
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },
      
      // Computed
      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      },
      
      hasAnyRole: (roles) => {
        const { user } = get()
        return roles.includes(user?.role || "")
      },
    }),
    {
      name: "auth-storage",
      // Only persist certain fields
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)