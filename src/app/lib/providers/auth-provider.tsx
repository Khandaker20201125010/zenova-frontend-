"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { useAuthSync } from "../../hooks/use-auth-sync"

function AuthSync({ children }: { children: React.ReactNode }) {
  useAuthSync()
  return <>{children}</>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider 
      // Check every 5 minutes (300 seconds)
      refetchInterval={300} 
      // Recommended: check when the user returns to the tab
      refetchOnWindowFocus={true} 
      refetchWhenOffline={false}
    >
      <AuthSync>{children}</AuthSync>
    </SessionProvider>
  )
}