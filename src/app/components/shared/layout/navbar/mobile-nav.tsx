/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { Button } from "../../../ui/button"
import { 
  Heart, 
  LogOut, 
  Menu, 
  Moon, 
  Settings, 
  ShoppingBag, 
  ShoppingCart, 
  Sun, 
  User, 
  X,
  Shield,
  Activity,
  BarChart3,
  Package,
  Users,
  TrendingUp,
  Store,
  CreditCard,
  FileText,
  HelpCircle,
  Star,
  Tag,
  DollarSign,
  FileSpreadsheet
} from "lucide-react"
import { Badge } from "../../../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "../../../ui/sheet"
import { useToast } from "@/src/app/hooks/use-toast"
import { ScrollArea } from "@/src/app/components/ui/scroll-area"
import { Separator } from "../../../ui/separator"

interface Route {
  href: string;
  label: string;
  icon: any;
}

interface MobileNavProps {
  routes: Route[];
  session: any;
  cartItems: number;
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

// Role-specific quick actions
const getRoleQuickActions = (role: string) => {
  switch(role) {
    case "ADMIN":
      return [
        { href: "/admin/users", label: "Manage Users", icon: Users },
        { href: "/admin/products", label: "Manage Products", icon: Package },
        { href: "/admin/orders", label: "Manage Orders", icon: ShoppingBag },
        { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
      ]
    case "MANAGER":
      return [
        { href: "/manager/products", label: "Products", icon: Package },
        { href: "/manager/inventory", label: "Inventory", icon: Store },
        { href: "/manager/orders", label: "Orders", icon: ShoppingBag },
        { href: "/manager/reports", label: "Reports", icon: FileSpreadsheet },
      ]
    case "USER":
    default:
      return [
        { href: "/dashboard/orders", label: "My Orders", icon: ShoppingBag },
        { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
        { href: "/dashboard/reviews", label: "Reviews", icon: Star },
        { href: "/wishlist", label: "Wishlist", icon: Heart },
      ]
  }
}

export function MobileNav({
  routes,
  session,
  cartItems,
  theme,
  setTheme
}: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut({
        redirect: false,
        callbackUrl: "/login"
      })
      setOpen(false)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
      window.location.href = "/login"
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

  const getUserInitials = () => {
    if (!session?.user?.name) return "U"
    return session.user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Get role-specific styling
  const getRoleStyles = () => {
    const role = session?.user?.role
    switch(role) {
      case "ADMIN":
        return {
          badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
          icon: Shield,
          gradient: "from-red-500 to-red-600"
        }
      case "MANAGER":
        return {
          badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
          icon: Activity,
          gradient: "from-blue-500 to-blue-600"
        }
      default:
        return {
          badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
          icon: User,
          gradient: "from-green-500 to-green-600"
        }
    }
  }

  const roleStyles = getRoleStyles()
  const RoleIcon = roleStyles.icon
  const quickActions = session ? getRoleQuickActions(session.user?.role) : []

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${roleStyles.gradient} flex items-center justify-center`}>
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold">SaaS Platform</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6">
              {/* User Info */}
              {session && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                    <Avatar className="h-14 w-14 border-2 border-primary">
                      <AvatarImage
                        src={session.user?.image || session.user?.avatar}
                        alt={session.user?.name}
                      />
                      <AvatarFallback className="text-lg">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-base font-semibold truncate">{session.user?.name}</p>
                        <Badge className={roleStyles.badge}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {session.user?.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Navigation */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                  Navigation
                </h3>
                <nav className="space-y-1">
                  {routes.map((route) => {
                    const Icon = route.icon
                    const isActive = pathname === route.href

                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {route.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Quick Actions (Role-Based) */}
              {session && quickActions.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <Button
                          key={action.href}
                          variant="outline"
                          size="sm"
                          className="h-auto py-3 flex flex-col items-center gap-2"
                          asChild
                          onClick={() => setOpen(false)}
                        >
                          <Link href={action.href}>
                            <Icon className="h-5 w-5" />
                            <span className="text-xs">{action.label}</span>
                          </Link>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Shopping Links */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                  Shopping
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-4 w-4" />
                      Shopping Cart
                    </div>
                    {cartItems > 0 && (
                      <Badge variant="default" className="ml-auto">
                        {cartItems}
                      </Badge>
                    )}
                  </Link>

                  {session?.user?.role === "USER" && (
                    <>
                      <Link
                        href="/dashboard/favorites"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
                      >
                        <Heart className="h-4 w-4" />
                        Favorites
                      </Link>
                      <Link
                        href="/dashboard/orders"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Orders
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Account Settings */}
              {session && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                    Account
                  </h3>
                  <div className="space-y-1">
                    <Link
                      href="/user/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
                    >
                      <User className="h-4 w-4" />
                      Profile Settings
                    </Link>
                    
                    <Link
                      href="/settings"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
                    >
                      <Settings className="h-4 w-4" />
                      Preferences
                    </Link>

                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin/settings"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
                      >
                        <Shield className="h-4 w-4" />
                        Admin Settings
                      </Link>
                    )}

                    <Separator className="my-2" />

                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4" />
                          Logout
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Theme Section */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                  Theme
                </h3>
                <div className="grid grid-cols-3 gap-2 px-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    onClick={() => setTheme("system")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-6 border-t bg-muted/50">
            {!session ? (
              <div className="space-y-2">
                <Button asChild className="w-full" onClick={() => setOpen(false)}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="outline" asChild className="w-full" onClick={() => setOpen(false)}>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">
                  Logged in as {session.user?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} SaaS Platform
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}