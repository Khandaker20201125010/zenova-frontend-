"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/src/app/components/ui/card"

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
      <LineChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="users"
          stroke="#82ca9d"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}