/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  ShoppingCart, 
  Bell, 
  Search,
  User,
  Settings,
  LogOut,
  Home,
  Package,
  FileText,
  BarChart3,
  Users,
  CreditCard,
  HelpCircle,
  Sun,
  Moon,
  Heart,
  ShoppingBag,
  Loader2,
  Store,
  Activity,
  Shield,
  TrendingUp,
  Star,
  DollarSign,
  FileSpreadsheet,
  Tag,
  HelpCircle as Help
} from "lucide-react"

import { Button } from "../../../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import { Badge } from "../../../ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "../../../ui/dropdown-menu"

import { useToast } from "@/src/app/hooks/use-toast"
import { NotificationCenter } from "../../../notifications/notification-center"

interface Route {
  href: string;
  label: string;
  icon: any;
}

interface DesktopNavProps {
  routes: Route[];
  session: any;
  cartItems: number;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

// User-specific dropdown items (excluding Dashboard and Profile)
const userMenuItems = [
  {
    label: "Orders",
    href: "/dashboard/user/orders",
    icon: ShoppingBag,
    description: "Track your orders",
    badge: "2"
  },
  {
    label: "Favorites",
    href: "/dashboard/user/favorites",
    icon: Heart,
    description: "Your favorite items",
    badge: "3"
  },
  {
    label: "Reviews",
    href: "/dashboard/user/reviews",
    icon: Star,
    description: "Your reviews"
  },
  {
    label: "Wishlist",
    href: "/dashboard/user/wishlist",
    icon: Heart,
    description: "Your wishlist"
  },
  {
    label: "Payments",
    href: "/dashboard/user/payments",
    icon: CreditCard,
    description: "Payment methods"
  }
]

// Manager-specific dropdown items (excluding Dashboard and Profile)
const managerMenuItems = [
  {
    label: "Products",
    href: "/dashboard/manager/products",
    icon: Package,
    description: "Manage products",
    badge: "12"
  },
  {
    label: "Inventory",
    href: "/dashboard/manager/inventory",
    icon: Store,
    description: "Stock management",
    badge: "Low stock"
  },
  {
    label: "Orders",
    href: "/dashboard/manager/orders",
    icon: ShoppingBag,
    description: "Manage orders",
    badge: "5"
  },
  {
    label: "Categories",
    href: "/dashboard/manager/categories",
    icon: Tag,
    description: "Product categories"
  },
  {
    label: "Reports",
    href: "/dashboard/manager/reports",
    icon: FileSpreadsheet,
    description: "Sales reports"
  },
  {
    label: "Staff",
    href: "/dashboard/manager/staff",
    icon: Users,
    description: "Manage staff"
  }
]

// Admin-specific dropdown items (excluding Dashboard and Profile)
const adminMenuItems = [
  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
    description: "Manage users",
    badge: "156"
  },
  {
    label: "Products",
    href: "/dashboard/admin/products",
    icon: Package,
    description: "Manage products",
    badge: "89"
  },
  {
    label: "Orders",
    href: "/dashboard/admin/orders",
    icon: ShoppingBag,
    description: "Manage orders",
    badge: "23"
  },
  {
    label: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: TrendingUp,
    description: "View analytics"
  },
  {
    label: "Payments",
    href: "/dashboard/admin/payments",
    icon: DollarSign,
    description: "Payment management"
  },
  {
    label: "Blog",
    href: "/dashboard/admin/blog",
    icon: FileText,
    description: "Manage blog posts"
  },
  {
    label: "Support",
    href: "/dashboard/admin/support",
    icon: HelpCircle,
    description: "Customer support"
  },
  {
    label: "Reports",
    href: "/dashboard/admin/reports",
    icon: FileSpreadsheet,
    description: "System reports"
  },
  {
    label: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    description: "System settings"
  }
]

export function DesktopNav({ 
  routes, 
  session, 
  cartItems,
  theme,
  setTheme,
  searchOpen,
  setSearchOpen 
}: DesktopNavProps) {
  const pathname = usePathname()
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

  // Helper function to get user initials
  const getUserInitials = () => {
    if (!session?.user?.name) return "U"
    return session.user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Get role-specific menu items (without Dashboard and Profile)
  const getRoleSpecificMenu = () => {
    const role = session?.user?.role
    
    switch(role) {
      case "ADMIN":
        return adminMenuItems
      case "MANAGER":
        return managerMenuItems
      case "USER":
      default:
        return userMenuItems
    }
  }

  // Get role-specific icon and color
  const getRoleBadge = () => {
    const role = session?.user?.role
    
    switch(role) {
      case "ADMIN":
        return { 
          icon: Shield, 
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
          label: "Administrator"
        }
      case "MANAGER":
        return { 
          icon: Activity, 
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
          label: "Manager"
        }
      case "USER":
      default:
        return { 
          icon: User, 
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
          label: "User"
        }
    }
  }

  // Get dashboard link based on role
  const getDashboardLink = () => {
    const role = session?.user?.role
    switch(role) {
      case "ADMIN":
        return "/dashboard/admin"
      case "MANAGER":
        return "/dashboard/manager"
      case "USER":
      default:
        return "/dashboard/user"
    }
  }

  // Get profile link based on role
  const getProfileLink = () => {
    const role = session?.user?.role
    switch(role) {
      case "ADMIN":
        return "/dashboard/admin/profile"
      case "MANAGER":
        return "/dashboard/manager/profile"
      case "USER":
      default:
        return "/dashboard/user/profile"
    }
  }

  const roleSpecificMenu = getRoleSpecificMenu()
  const roleBadge = getRoleBadge()
  const RoleIcon = roleBadge.icon
  const dashboardLink = getDashboardLink()
  const profileLink = getProfileLink()

  return (
    <div className="hidden md:flex items-center gap-6">
      {/* Navigation Links */}
      <nav className="flex items-center gap-6">
        {routes.slice(0, 6).map((route) => {
          const Icon = route.icon
          const isActive = pathname === route.href
          
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {route.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-2">
        {/* Search Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Toggle theme">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Settings className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Cart */}
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/cart" aria-label="Shopping cart">
            <ShoppingCart className="h-5 w-5" />
            {cartItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cartItems > 9 ? "9+" : cartItems}
              </Badge>
            )}
          </Link>
        </Button>

        {/* Notifications */}
        <NotificationCenter />

        {/* User Menu or Login Button */}
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={session.user?.image || session.user?.avatar} 
                    alt={session.user?.name} 
                  />
                  <AvatarFallback>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {/* User Info Header */}
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={session.user?.image || session.user?.avatar} 
                      alt={session.user?.name} 
                    />
                    <AvatarFallback className="text-lg">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">
                        {session.user?.name}
                      </p>
                      <Badge variant="outline" className={`text-xs ${roleBadge.color}`}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleBadge.label}
                      </Badge>
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Primary Navigation - Dashboard & Profile (ONLY ONCE) */}
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={dashboardLink} className="cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                    <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={profileLink} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Role-Specific Menu Items (All other features) */}
              {roleSpecificMenu.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {session.user?.role === "ADMIN" ? "Administration" : 
                     session.user?.role === "MANAGER" ? "Management" : "Your Account"}
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {roleSpecificMenu.map((item) => {
                      const Icon = item.icon
                      return (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link href={item.href} className="cursor-pointer justify-between">
                            <div className="flex items-center">
                              <Icon className="mr-2 h-4 w-4" />
                              <div>
                                <p className="text-sm">{item.label}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
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
                </>
              )}

              {/* Settings & Support */}
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/support" className="cursor-pointer">
                    <Help className="mr-2 h-4 w-4" />
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
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}