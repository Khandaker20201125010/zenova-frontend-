"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import { Button } from "../../../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "../../../ui/dropdown-menu"
import { 
  BarChart3, 
  Heart, 
  LogOut, 
  Settings, 
  ShoppingBag, 
  User, 
  Loader2,
  Shield,
  Activity,
  Package,
  Store,
  Users,
  TrendingUp,
  CreditCard,
  FileText,
  HelpCircle,
  Star,
  Tag,
  DollarSign,
  FileSpreadsheet,
  Bell
} from "lucide-react"
import { useToast } from "@/src/app/hooks/use-toast"
import { Badge } from "../../../ui/badge"

// Role-specific menu items
const roleMenus = {
  ADMIN: [
    { href: "/dashboard/admin", label: "Dashboard", icon: BarChart3, description: "Admin dashboard" },
    { href: "/dashboard/admin/users", label: "Users", icon: Users, description: "Manage users", badge: "156" },
    { href: "/dashboard/admin/products", label: "Products", icon: Package, description: "Manage products", badge: "89" },
    { href: "/dashboard/admin/orders", label: "Orders", icon: ShoppingBag, description: "Manage orders", badge: "23" },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: TrendingUp, description: "View analytics" },
    { href: "/dashboard/admin/payments", label: "Payments", icon: DollarSign, description: "Payment management" },
    { href: "/dashboard/admin/reports", label: "Reports", icon: FileSpreadsheet, description: "System reports" },
  ],
  MANAGER: [
    { href: "/dashboard/manager", label: "Dashboard", icon: BarChart3, description: "Manager dashboard" },
    { href: "/dashboard/manager/products", label: "Products", icon: Package, description: "Manage products", badge: "12" },
    { href: "/dashboard/manager/inventory", label: "Inventory", icon: Store, description: "Stock management", badge: "Low stock" },
    { href: "/dashboard/manager/orders", label: "Orders", icon: ShoppingBag, description: "Manage orders", badge: "5" },
    { href: "/dashboard/manager/categories", label: "Categories", icon: Tag, description: "Product categories" },
    { href: "/dashboard/manager/reports", label: "Reports", icon: FileSpreadsheet, description: "Sales reports" },
    { href: "/dashboard/manager/staff", label: "Staff", icon: Users, description: "Manage staff" },
  ],
  USER: [
    { href: "/dashboard/user", label: "Dashboard", icon: BarChart3, description: "Your dashboard" },
    { href: "/dashboard/user/orders", label: "Orders", icon: ShoppingBag, description: "Track your orders", badge: "2" },
    { href: "/dashboard/user/favorites", label: "Favorites", icon: Heart, description: "Your favorite items", badge: "3" },
    { href: "/dashboard/user/reviews", label: "Reviews", icon: Star, description: "Your reviews" },
    { href: "/dashboard/user/wishlist", label: "Wishlist", icon: Heart, description: "Your wishlist" },
    { href: "/dashboard/user/payments", label: "Payments", icon: CreditCard, description: "Payment methods" },
  ]
}

// Role badges
const roleBadges = {
  ADMIN: { icon: Shield, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200", label: "Administrator" },
  MANAGER: { icon: Activity, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200", label: "Manager" },
  USER: { icon: User, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200", label: "User" }
}

export function UserMenu() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut({ 
        redirect: false,
        callbackUrl: "/login"
      })
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (status === "loading") {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  if (!session?.user) {
    return (
      <Button asChild variant="default" size="sm">
        <Link href="/login">Sign In</Link>
      </Button>
    )
  }

  const role = session.user.role as keyof typeof roleMenus
  const menuItems = roleMenus[role] || roleMenus.USER
  const badge = roleBadges[role] || roleBadges.USER
  const RoleIcon = badge.icon

  // Safely handle the avatar source
  const avatarSrc = session.user.avatar || session.user.image || undefined
  
  // Safely generate initials
  const getInitials = () => {
    if (!session.user.name) return "U"
    return session.user.name
      .split(" ")
      .map((n: string) => n?.[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  }

  const initials = getInitials()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-primary/20 transition-all" 
          disabled={isLoggingOut}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={avatarSrc} 
              alt={session.user.name || "User avatar"}
            />
            <AvatarFallback delayMs={600} className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {/* User Info Header */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary/5 to-transparent">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage 
                src={avatarSrc} 
                alt={session.user.name || "User avatar"}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold leading-none">
                  {session.user.name || "User"}
                </p>
                <Badge variant="outline" className={badge.color}>
                  <RoleIcon className="h-3 w-3 mr-1" />
                  {badge.label}
                </Badge>
              </div>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email || "No email provided"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Quick Stats */}
        <div className="px-4 py-2 grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Orders</p>
            <p className="text-lg font-semibold">12</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Wishlist</p>
            <p className="text-lg font-semibold">8</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Reviews</p>
            <p className="text-lg font-semibold">5</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Role-Based Menu Items */}
        <DropdownMenuGroup>
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href} className="cursor-pointer">
                  <Icon className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Common Menu Items */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/notifications" className="cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
              <Badge variant="destructive" className="ml-auto">3</Badge>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/support" className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">⌘Q</kbd>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}