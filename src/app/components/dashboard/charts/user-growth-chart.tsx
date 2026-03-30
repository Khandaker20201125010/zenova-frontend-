/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

interface UserGrowthChartProps {
  data?: Array<{ date: string; users: number }>
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="font-medium mb-1">{label}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">New Users:</span>
          <span className="font-bold text-primary">
            {payload[0].value?.toLocaleString()}
          </span>
        </div>
      </div>
    )
  }
  return null
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">No user growth data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.5} />
        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="users" 
          name="New Users"
          stroke="hsl(var(--primary))" 
          strokeWidth={3} 
          dot={{ fill: "hsl(var(--primary))", r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}