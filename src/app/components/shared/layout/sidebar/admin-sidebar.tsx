// components/layout/sidebar/admin-sidebar.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  ChevronRight,
  LogOut,
  User,
  Home,
  Bell,
  CreditCard,
  Tag,
  HelpCircle,
  Globe
} from "lucide-react"
import { cn } from "@/src/app/lib/utils/helpers"
import { Button } from "../../../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import { Badge } from "../../../ui/badge"
import { Separator } from "../../../ui/separator"
import { useSession } from "next-auth/react"

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users, badge: "12" },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, badge: "5" },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/contact", label: "Contact", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href
    }
    return pathname.startsWith(href)
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
            <Link href="/admin" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-bold">Admin Panel</span>
            </Link>
          )}
          {collapsed && (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto">
              <span className="text-white font-bold">A</span>
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
      {!collapsed && session && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={session.user.avatar} alt={session.user.name} />
              <AvatarFallback>
                {session.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {session.user.role}
            </Badge>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {adminNavItems.map((item) => {
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

        {/* Quick Links */}
        {!collapsed && (
          <div className="space-y-1">
            <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-1">
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-9"
                  asChild
                >
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-9"
                  asChild
                >
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-9"
                  asChild
                >
                  <Link href="/notifications">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Link>
                </Button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
              <Badge variant="success" className="h-2 w-2 p-0" />
            </div>
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              asChild
            >
              <Link href="/api/auth/signout">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/api/auth/signout">
                <LogOut className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}