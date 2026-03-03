"use client"

import { useSession } from "next-auth/react"

import { Loader2 } from "lucide-react"
import { AdminSidebar } from "../components/shared/layout/sidebar/admin-sidebar"
import { UserSidebar } from "../components/shared/layout/sidebar/user-sidebar"

export function Sidebar() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <aside className="w-64 h-full border-r bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </aside>
    )
  }

  // Return null if no session (protected routes will handle redirect)
  if (!session) return null

  // Return appropriate sidebar based on role
  return session.user?.role === "ADMIN" ? <AdminSidebar /> : <UserSidebar />
}