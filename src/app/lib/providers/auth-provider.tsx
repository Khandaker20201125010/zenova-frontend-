// lib/providers/auth-provider.tsx
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
      refetchInterval={0} // Don't refetch automatically
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <AuthSync>{children}</AuthSync>
    </SessionProvider>
  )
}