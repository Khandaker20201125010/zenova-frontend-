/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts"

interface RevenueChartProps {
  data?: Array<{ date: string; revenue: number }>
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="font-medium mb-1">{label}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Revenue:</span>
          <span className="font-bold text-primary">
            ${payload[0].value?.toLocaleString()}
          </span>
        </div>
      </div>
    )
  }
  return null
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">No revenue data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.5} />
        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value.toLocaleString()}`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${0.3 + (index / data.length) * 0.7})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}