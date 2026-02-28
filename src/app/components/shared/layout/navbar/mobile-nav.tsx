// components/layout/navbar/mobile-nav.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { Button } from "../../../ui//button"
import { Heart, LogOut, Menu, Moon, Settings, ShoppingBag, ShoppingCart, Sun, User, X } from "lucide-react"
import { Badge } from "../../../ui//badge"

import { Avatar, AvatarFallback, AvatarImage } from "../../../ui//avatar"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "../../../ui//sheet"
import { useToast } from "@/src/app/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

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
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
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
                <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-muted">
                  <Avatar>
                    <AvatarImage 
                      src={session.user?.image || session.user?.avatar} 
                      alt={session.user?.name} 
                    />
                    <AvatarFallback>
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {session.user?.role}
                  </Badge>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-1">
                {routes.map((route) => {
                  const Icon = route.icon
                  const isActive = pathname === route.href
                  
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

              {/* Shopping Links */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2">
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-4 w-4" />
                      Shopping Cart
                    </div>
                    {cartItems > 0 && (
                      <Badge variant="secondary" className="h-5 px-1.5">
                        {cartItems}
                      </Badge>
                    )}
                  </Link>

                  <Link
                    href="/favorites"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
                  >
                    <Heart className="h-4 w-4" />
                    Favorites
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Orders
                  </Link>
                </div>
              </div>

              {/* Account Section */}
              {session && (
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-1">
                    <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase">
                      Account
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
                    >
                      <User className="h-4 w-4" />
                      Profile Settings
                    </Link>
                    
                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
                      >
                        <Settings className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted text-red-600 hover:text-red-700 disabled:opacity-50"
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
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase mb-3">
                  Theme
                </div>
                <div className="grid grid-cols-3 gap-2">
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
          <div className="p-6 border-t">
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
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} SaaS Platform. All rights reserved.
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}