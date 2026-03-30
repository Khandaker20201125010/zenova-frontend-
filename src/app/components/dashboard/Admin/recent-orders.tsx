"use client"

import { Avatar, AvatarFallback } from "@/src/app/components/ui/avatar"
import { Badge } from "@/src/app/components/ui/badge"
import { formatCurrency, formatDate } from "@/src/app/lib/utils/helpers"
import { Package } from "lucide-react"

interface RecentOrdersProps {
  data?: Array<{
    id: string
    total: number
    status: string
    createdAt: string
    user: { name: string; email: string }
  }>
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "default"
    case "PENDING":
      return "secondary"
    case "PROCESSING":
      return "default"
    case "CANCELLED":
      return "destructive"
    default:
      return "secondary"
  }
}

export function RecentOrders({ data = [] }: RecentOrdersProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center gap-4">
        <Package className="h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No recent orders</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.slice(0, 5).map((order) => (
        <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary">
                {order.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{order.user.name}</p>
              <p className="text-xs text-muted-foreground">
                Order #{order.id.slice(-8)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(order.createdAt, "MMM dd, yyyy")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
            <Badge variant={getStatusColor(order.status)} className="mt-1">
              {order.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}