/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-auth.ts
"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { useToast } from "./use-toast"
import { authApi } from "../lib/api/auth"

export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const user = session?.user

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          throw new Error(result.error)
        }

        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        return { success: true }
      } catch (error: any) {
        toast({
          title: "Login failed",
          description: error.message || "Invalid credentials",
          variant: "error",
        })
        return { success: false, error: error.message }
      }
    },
    [toast]
  )

  const register = useCallback(
    async (data: any) => {
      try {
        await authApi.register(data)
        
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account",
        })

        // Auto login after registration
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        })

        return { success: true }
      } catch (error: any) {
        toast({
          title: "Registration failed",
          description: error.message || "An error occurred",
          variant: "error",
        })
        return { success: false, error: error.message }
      }
    },
    [toast]
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
      await signOut({ redirect: false })
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
      
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred",
        variant: "error",
      })
    }
  }, [router, toast])

  const refreshSession = useCallback(async () => {
    try {
      await update()
    } catch (error) {
      console.error("Failed to refresh session:", error)
    }
  }, [update])

  const hasRole = useCallback(
    (role: string) => {
      return (user as any)?.role === role
    },
    [user]
  )

  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return roles.includes((user as any)?.role || "")
    },
    [user]
  )

  const isAdmin = (user as any)?.role === "ADMIN"
  const isManager = (user as any)?.role === "MANAGER"
  const isUser = (user as any)?.role === "USER"

  return {
    // State
    session,
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isManager,
    isUser,
    
    // Actions
    login,
    register,
    logout,
    refreshSession,
    hasRole,
    hasAnyRole,
    
    // Helpers
    getToken: () => session?.accessToken,
    getUserId: () => (user as any)?.id,
  }
}