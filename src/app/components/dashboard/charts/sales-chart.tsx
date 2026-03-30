/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Package } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface SalesChartProps {
  data?: Array<{
    category: string
    revenue: number
    percentage?: number
  }>
  type?: "pie" | "bar"
}

// Modern color palette that works in both light and dark modes
const COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#6366f1", // indigo
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
        <p className="font-semibold mb-2 text-foreground">{payload[0].payload.category || label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Revenue:</span>
            <span className="font-bold text-foreground">
              ${payload[0].value?.toLocaleString()}
            </span>
          </div>
          {payload[0].payload.percentage && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Share:</span>
              <span className="font-bold text-primary">
                {payload[0].payload.percentage}%
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

export function SalesChart({ data = [], type = "bar" }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-muted/50 p-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No sales data available</p>
      </div>
    )
  }

  // Calculate percentages
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0)
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: ((item.revenue / totalRevenue) * 100).toFixed(1)
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dataWithPercentage} layout="vertical" margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" horizontal={false} />
        <XAxis 
          type="number" 
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          className="text-xs"
        />
        <YAxis 
          type="category" 
          dataKey="category" 
          width={100} 
          tick={{ fontSize: 12 }}
          className="text-xs"
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
        <Bar dataKey="revenue" name="Revenue" radius={[0, 8, 8, 0]}>
          {dataWithPercentage.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]}
              className="transition-opacity hover:opacity-80"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}