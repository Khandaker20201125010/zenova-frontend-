"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Heart,
  Star,
  Settings,
  User,
  CreditCard,
  Bell,
  History,
  ChevronRight,
  LogOut,
  Home
} from "lucide-react"

import { Button } from "../../../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import { Badge } from "../../../ui/badge"
import { Separator } from "../../../ui/separator"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/src/app/lib/utils/helpers"
import { useToast } from "@/src/app/hooks/use-toast"
import { useRouter } from "next/navigation"

const userNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart, badge: "3" },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: "5" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function UserSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [collapsed, setCollapsed] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut({ redirect: false })
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      })
      router.push("/login")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <aside className={cn(
      "flex flex-col h-full border-r bg-background transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <span className="font-bold">Dashboard</span>
            </Link>
          )}
          {collapsed && (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto">
              <span className="text-white font-bold">D</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex"
          >
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )} />
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && session?.user && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={session.user.image || session.user.avatar || ""} alt={session.user.name || ""} />
              <AvatarFallback>
                {session.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
            </div>
          </div>
          <div className="mt-3">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/user/profile">
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {userNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                    active && "bg-accent text-accent-foreground",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <Separator className="my-4" />

        {/* Quick Actions */}
        {!collapsed && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/products">
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    Shop
                  </div>

                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/cart">
                  <div className="flex items-center">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart
                  </div>

                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/support">
                  <div className="flex items-center">
                    <Bell className="mr-2 h-4 w-4" />
                    Support
                  </div>

                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        {!collapsed ? (
          <Button
            variant="outline"
            className="w-full"
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isSigningOut ? "Signing out..." : "Sign out"}
          </Button>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}