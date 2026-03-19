"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card"
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react"

interface DashboardStatsProps {
  data?: {
    users?: { total: number; active: number; newThisMonth: number }
    products?: { total: number; active: number; outOfStock: number }
    orders?: { total: number; pending: number; revenue: number }
  }
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Users",
      value: data?.users?.total || 0,
      icon: Users,
      description: `${data?.users?.active || 0} active users`,
    },
    {
      title: "Total Products",
      value: data?.products?.total || 0,
      icon: Package,
      description: `${data?.products?.outOfStock || 0} out of stock`,
    },
    {
      title: "Total Orders",
      value: data?.orders?.total || 0,
      icon: ShoppingCart,
      description: `${data?.orders?.pending || 0} pending`,
    },
    {
      title: "Revenue",
      value: `$${data?.orders?.revenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      description: "Total revenue",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}