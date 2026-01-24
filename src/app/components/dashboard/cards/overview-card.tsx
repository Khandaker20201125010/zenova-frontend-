/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/cards/overview-cards.tsx
"use client"

import { Users, DollarSign, ShoppingCart, Package, TrendingUp, TrendingDown } from "lucide-react"
import { StatsCard } from "./stats-card"
import { useDashboardQuery } from "@/src/app/hooks/use-query"

interface DashboardStats {
  totalRevenue?: number
  totalUsers?: number
  totalOrders?: number
  totalProducts?: number
  activeUsers?: number
  pendingOrders?: number
  monthlyGrowth?: number
  conversionRate?: number
  averageOrderValue?: number
  refundRate?: number
  topProducts?: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
  recentOrders?: any[]
  recentUsers?: any[]
}

export function OverviewCards() {
  const { data: stats, isLoading } = useDashboardQuery()

  const dashboardStats = stats as DashboardStats | undefined

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Total Revenue",
      value: `$${(dashboardStats?.totalRevenue || 0).toLocaleString()}`,
      change: "+20.1%",
      icon: DollarSign,
      color: "bg-green-500",
      description: "This month",
    },
    {
      title: "Total Users",
      value: (dashboardStats?.totalUsers || 0).toLocaleString(),
      change: "+12.5%",
      icon: Users,
      color: "bg-blue-500",
      description: "Active users",
    },
    {
      title: "Total Orders",
      value: (dashboardStats?.totalOrders || 0).toLocaleString(),
      change: "+8.2%",
      icon: ShoppingCart,
      color: "bg-purple-500",
      description: "This month",
    },
    {
      title: "Products",
      value: (dashboardStats?.totalProducts || 0).toLocaleString(),
      change: "+5.3%",
      icon: Package,
      color: "bg-orange-500",
      description: "In inventory",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  )
}