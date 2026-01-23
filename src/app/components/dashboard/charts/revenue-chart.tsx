/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/charts/revenue-chart.tsx
"use client"

import { api } from "@/src/app/lib/api/axios-client"
import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"


const revenueData = [
  { month: "Jan", revenue: 4000, orders: 2400 },
  { month: "Feb", revenue: 3000, orders: 1398 },
  { month: "Mar", revenue: 9800, orders: 2000 },
  { month: "Apr", revenue: 3908, orders: 2780 },
  { month: "May", revenue: 4800, orders: 1890 },
  { month: "Jun", revenue: 3800, orders: 2390 },
  { month: "Jul", revenue: 4300, orders: 3490 },
  { month: "Aug", revenue: 2400, orders: 4300 },
  { month: "Sep", revenue: 9800, orders: 2000 },
  { month: "Oct", revenue: 3908, orders: 2780 },
  { month: "Nov", revenue: 4800, orders: 1890 },
  { month: "Dec", revenue: 3800, orders: 2390 },
]

export function RevenueChart() {
  const [timeRange, setTimeRange] = useState("year")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(revenueData)

  useEffect(() => {
    fetchRevenueData()
  }, [timeRange])

  const fetchRevenueData = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/dashboard/analytics/revenue?range=${timeRange}`)
      if (response.data.success) {
        setData(response.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch revenue data:", error)
    } finally {
      setLoading(false)
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-4">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-brand">
            Revenue: <span className="font-bold">${payload[0].value}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Orders: <span className="font-bold">{payload[1].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue and orders</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">This month</SelectItem>
            <SelectItem value="quarter">This quarter</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                name="Orders"
                dot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}