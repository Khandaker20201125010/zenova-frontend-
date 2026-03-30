/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs"
import { RecentOrders } from "@/src/app/components/dashboard/Admin/recent-orders"
import { TopProducts } from "@/src/app/components/dashboard/Admin/top-products"
import { ActivityFeed } from "@/src/app/components/dashboard/Admin/activity-feed"
import { RevenueChart } from "@/src/app/components/dashboard/charts/revenue-chart"
import { UserGrowthChart } from "@/src/app/components/dashboard/charts/user-growth-chart"
import { SalesChart } from "@/src/app/components/dashboard/charts/sales-chart"
import { dashboardApi } from "@/src/app/lib/api/dashboard"
import { useToast } from "@/src/app/hooks/use-toast"
import { Skeleton } from "@/src/app/components/ui/skeleton"
import { DashboardStats } from "@/src/app/components/dashboard/Admin/dashboard-stats"
import { Overview } from "@/src/app/components/dashboard/Admin/overview"
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package, AlertCircle, Calendar, Download, Filter, Sparkles } from "lucide-react"
import { Button } from "@/src/app/components/ui/button"
import { Alert, AlertDescription } from "@/src/app/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/components/ui/select"
import { Badge } from "@/src/app/components/ui/badge"

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("month")
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const { toast } = useToast()

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await dashboardApi.getAdminDashboard()
      const data = response.data || response
      return data
    } catch (error: any) {
      console.error('Dashboard fetch error:', error)
      throw new Error(error?.response?.data?.message || 'Failed to load dashboard data')
    }
  }, [])

  const fetchAnalyticsData = useCallback(async (range: string) => {
    try {
      const response = await dashboardApi.getAnalytics(range)
      const data = response.data || response
      return data
    } catch (error: any) {
      console.error('Analytics fetch error:', error)
      return null
    }
  }, [])

  const refreshAllData = async () => {
    setRefreshing(true)
    setError(null)
    try {
      const [dashboard, analytics] = await Promise.all([
        fetchDashboardData(),
        fetchAnalyticsData(timeRange)
      ])
      setDashboardData(dashboard)
      setAnalyticsData(analytics)
      toast({
        title: "Success",
        description: "Dashboard data refreshed",
      })
    } catch (error: any) {
      setError(error.message)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [dashboard, analytics] = await Promise.all([
          fetchDashboardData(),
          fetchAnalyticsData(timeRange)
        ])
        setDashboardData(dashboard)
        setAnalyticsData(analytics)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [fetchDashboardData, fetchAnalyticsData, timeRange])

  if (loading) {
    return <AdminDashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex-1 p-6 md:p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={refreshAllData} className="mt-4" variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header Section with Gradient */}
      <div className="relative rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-6 ">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
             
              <span className="text-sm font-medium text-primary">Analytics Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Admin</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] bg-background/50 backdrop-blur-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
                <SelectItem value="year">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={refreshAllData} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {dashboardData?.overview && <DashboardStats data={dashboardData.overview} />}

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue trends and projections</CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                +23.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <RevenueChart data={analyticsData?.charts?.revenueTrend} />
          </CardContent>
        </Card>

        {/* Sales by Category Chart */}
        <Card className="overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
                <CardDescription>Revenue distribution across categories</CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                <Package className="h-3 w-3 mr-1" />
                Top Performing
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <SalesChart data={analyticsData?.charts?.categorySales} type="bar" />
          </CardContent>
        </Card>
      </div>

      {/* Combined Overview Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Revenue and user growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Overview data={dashboardData?.charts} />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest transactions from customers</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders data={dashboardData?.recentOrders} />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50">
          <TabsTrigger value="products" className="data-[state=active]:bg-background">Top Products</TabsTrigger>
          <TabsTrigger value="growth" className="data-[state=active]:bg-background">Growth Metrics</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-background">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card className="border border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best-selling products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <TopProducts data={analyticsData?.topProducts} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <UserGrowthChart data={analyticsData?.charts?.userGrowth} />
              </CardContent>
            </Card>
            <Card className="border border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Important business metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Order Value</p>
                      <p className="text-2xl font-bold">${analyticsData?.metrics?.averageOrderValue?.toFixed(2) || 0}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary opacity-60" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
                    <div>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-bold">{analyticsData?.metrics?.conversionRate?.toFixed(1) || 0}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary opacity-60" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
                    <div>
                      <p className="text-sm text-muted-foreground">User Retention Rate</p>
                      <p className="text-2xl font-bold">{analyticsData?.metrics?.userRetentionRate?.toFixed(1) || 0}%</p>
                    </div>
                    <Users className="h-8 w-8 text-primary opacity-60" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest user actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed data={dashboardData?.recentActivities} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AdminDashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="rounded-2xl bg-muted/20 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-7">
        <Skeleton className="lg:col-span-4 h-[400px] rounded-xl" />
        <Skeleton className="lg:col-span-3 h-[400px] rounded-xl" />
      </div>
    </div>
  )
}