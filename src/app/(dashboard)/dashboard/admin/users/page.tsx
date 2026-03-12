/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card"
import {
  Package,
  ShoppingCart,
  Heart,
  Star,
  Bell,
  User,
  Clock,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { dashboardApi } from "@/src/app/lib/api/dashboard"
import { Button } from "@/src/app/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/app/components/ui/avatar"
import { Badge } from "@/src/app/components/ui/badge"
import { useToast } from "@/src/app/hooks/use-toast"

export default function UserDashboardPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      redirect("/login")
    }

    if (session.user?.role === "ADMIN") {
      redirect("/dashboard/admin")
    }

    if (session.user?.role === "MANAGER") {
      redirect("/dashboard/manager")
    }

    fetchDashboardData()
  }, [session, status])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await dashboardApi.getUserDashboard()
      setDashboardData(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const user = dashboardData?.user || {}
  const overview = dashboardData?.overview || {}

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.name}!
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your account today.
          </p>
        </div>
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.orders?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {overview.orders?.pending || 0} pending orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${overview.orders?.totalSpent?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.favorites || 0}</div>
            <p className="text-xs text-muted-foreground">Saved items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.reviews || 0}</div>
            <p className="text-xs text-muted-foreground">Product reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData?.quickActions?.map((action: any, index: number) => (
          <Button
            key={index}
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            asChild
          >
            <Link href={action.link}>
              <span className="text-2xl">{action.icon}</span>
              <span>{action.label}</span>
            </Link>
          </Button>
        ))}
      </div>

      {/* Recent Orders and Notifications */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest orders</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.recentOrders?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Order #{order.id.slice(-8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={order.status === "PENDING" ? "secondary" : "default"}>
                        {order.status}
                      </Badge>
                      <span className="font-medium">${order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Unread notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.notifications?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.notifications.slice(0, 5).map((notification: any) => (
                  <div key={notification.id} className="flex items-start gap-3">
                    <Bell className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No notifications</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscription Info */}
      {overview.subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-semibold">{overview.subscription.plan}</p>
                <p className="text-sm text-muted-foreground">
                  {overview.subscription.status === "ACTIVE" ? (
                    <>Active until {new Date(overview.subscription.currentPeriodEnd).toLocaleDateString()}</>
                  ) : (
                    "No active subscription"
                  )}
                </p>
              </div>
              <Badge variant={overview.subscription.status === "ACTIVE" ? "default" : "secondary"}>
                {overview.subscription.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}