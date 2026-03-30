/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card } from "@/src/app/components/ui/card"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="font-medium mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Revenue:</span>
            <span className="font-bold text-primary">
              ${payload[0]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Users:</span>
            <span className="font-bold text-muted-foreground">
              {payload[1]?.value?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

interface OverviewProps {
  data?: {
    userGrowth?: Array<{ month: string; users: number }>
    revenue?: Array<{ month: string; revenue: number }>
  }
}

export function Overview({ data }: OverviewProps) {
  const chartData = data?.revenue?.map((item, index) => ({
    name: item.month,
    revenue: item.revenue,
    users: data?.userGrowth?.[index]?.users || 0,
  })) || []

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--muted))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--muted))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.5} />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="left"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="hsl(var(--primary))"
          fillOpacity={1}
          fill="url(#colorRevenue)"
          strokeWidth={2}
        />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="users"
          name="New Users"
          stroke="hsl(var(--muted-foreground))"
          fillOpacity={1}
          fill="url(#colorUsers)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}