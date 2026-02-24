import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User, UserRole } from "../lib/types"

interface AuthStore {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  setUser: (user: User | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      
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
      
      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      },
      
      hasAnyRole: (roles) => {
        const { user } = get()
        return user ? roles.includes(user.role) : false
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)