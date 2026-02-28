// components/layout/navbar/index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Home,
  Package,
  FileText,
  BarChart3,
  Users,
  CreditCard,
  HelpCircle,
  Settings,
  User,
  Search
} from "lucide-react"
import { useTheme } from "next-themes"
import { useCartStore } from "@/src/app/store/cart-store"

import { MobileNav } from "./mobile-nav"
import { DesktopNav } from "./desktop-nav"
import { Input } from "../../../ui/input"

export function Navbar() {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const cartItems = useCartStore((state: any) => state.getItemCount?.() || 0)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Define routes based on authentication status and role
  const publicRoutes = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: Package },
    { href: "/blog", label: "Blog", icon: FileText },
    { href: "/about", label: "About", icon: Users },
    { href: "/contact", label: "Contact", icon: HelpCircle },
  ]

  const userRoutes = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: Package },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/orders", label: "Orders", icon: CreditCard },
  ]

  const adminRoutes = [
    { href: "/", label: "Home", icon: Home },
    { href: "/admin", label: "Admin", icon: Settings },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/orders", label: "Orders", icon: CreditCard },
    { href: "/admin/products", label: "Products", icon: Package },
  ]

  // Determine which routes to show
  let routes = publicRoutes
  if (session?.user) {
    if (session.user.role === "ADMIN") {
      routes = adminRoutes
    } else {
      routes = userRoutes
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-background"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline-block">
              SaaS Platform
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <DesktopNav 
          routes={routes} 
          session={session} 
          cartItems={cartItems}
          theme={theme}
          setTheme={setTheme}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
        />

        {/* Mobile Navigation */}
        <MobileNav 
          routes={routes} 
          session={session} 
          cartItems={cartItems}
          theme={theme}
          setTheme={setTheme}
        />
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b"
          >
            <div className="container py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products, blog posts, etc..."
                  className="pl-10"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}