"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card"
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/src/app/lib/utils/helpers"

interface DashboardStatsProps {
  data?: {
    users?: { total: number; active: number; newThisMonth: number }
    products?: { total: number; active: number; outOfStock: number }
    orders?: { total: number; pending: number; revenue: number }
  }
}

const getGradientByIndex = (index: number) => {
  const gradients = [
    "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
    "from-blue-500/10 to-blue-500/5 border-blue-500/20",
    "from-purple-500/10 to-purple-500/5 border-purple-500/20",
    "from-orange-500/10 to-orange-500/5 border-orange-500/20",
  ]
  return gradients[index % gradients.length]
}

const getIconColorByIndex = (index: number) => {
  const colors = [
    "text-emerald-500",
    "text-blue-500",
    "text-purple-500",
    "text-orange-500",
  ]
  return colors[index % colors.length]
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Revenue",
      value: `$${data?.orders?.revenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      description: `${data?.orders?.total || 0} total orders`,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Users",
      value: data?.users?.total?.toLocaleString() || 0,
      icon: Users,
      description: `${data?.users?.active || 0} active users`,
      trend: `${data?.users?.newThisMonth || 0} new this month`,
      trendUp: true,
    },
    {
      title: "Total Products",
      value: data?.products?.total?.toLocaleString() || 0,
      icon: Package,
      description: `${data?.products?.active || 0} active products`,
      trend: `${data?.products?.outOfStock || 0} out of stock`,
      trendUp: false,
    },
    {
      title: "Pending Orders",
      value: data?.orders?.pending || 0,
      icon: ShoppingCart,
      description: "Awaiting processing",
      trend: `${((data?.orders?.pending || 0) / (data?.orders?.total || 1) * 100).toFixed(1)}% of total`,
      trendUp: false,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const TrendIcon = stat.trendUp ? ArrowUpRight : ArrowDownRight
        const gradientClass = getGradientByIndex(index)
        const iconColor = getIconColorByIndex(index)
        
        return (
          <Card key={stat.title} className={cn("overflow-hidden border transition-all duration-300 hover:shadow-lg bg-gradient-to-br", gradientClass)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg bg-background/50 backdrop-blur-sm", iconColor)}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              {stat.trend && (
                <div className="mt-2 flex items-center gap-1">
                  <TrendIcon className={cn("h-3 w-3", stat.trendUp ? "text-emerald-500" : "text-red-500")} />
                  <span className={cn("text-xs", stat.trendUp ? "text-emerald-500" : "text-red-500")}>
                    {stat.trend}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}