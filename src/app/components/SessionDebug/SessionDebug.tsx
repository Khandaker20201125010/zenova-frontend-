// components/SessionDebug.tsx
"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export function SessionDebug() {
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log("🔄 Session Debug Update:")
    console.log("Status:", status)
    console.log("Session:", session)
    console.log("Has user:", !!session?.user)
    console.log("Has tokens:", !!(session?.accessToken && session?.refreshToken))
  }, [session, status])

  // This component doesn't render anything
  return null
}