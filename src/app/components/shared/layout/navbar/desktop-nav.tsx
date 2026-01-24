/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Menu, 
  X, 
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
  ShoppingBag
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
} from "../../../ui/dropdown-menu"

import { NotificationCenter } from "../../../notifications/notification-center"

// Desktop Navigation Component
export function DesktopNav({ 
  routes, 
  session, 
  cartItems,
  theme,
  setTheme,
  searchOpen,
  setSearchOpen 
}: { 
  routes: any[], 
  session: any, 
  cartItems: number,
  theme: string | undefined,
  setTheme: (theme: string) => void,
  searchOpen: boolean,
  setSearchOpen: (open: boolean) => void
}) {
  const pathname = usePathname()

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
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand ${
                isActive ? "text-brand" : "text-muted-foreground"
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
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
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
          <Link href="/cart">
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
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user?.image} alt={session.user?.name} />
                  <AvatarFallback>
                    {session.user?.name?.split(" ").map(( n: any) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/favorites">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Orders
                </Link>
              </DropdownMenuItem>
              {session.user?.role === "ADMIN" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
