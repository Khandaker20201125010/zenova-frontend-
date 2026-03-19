"use client"

import { Avatar, AvatarFallback } from "@/src/app/components/ui/avatar"
import { Badge } from "@/src/app/components/ui/badge"

interface RecentOrdersProps {
  data?: Array<{
    id: string
    total: number
    status: string
    createdAt: string
    user: { name: string; email: string }
  }>
}

export function RecentOrders({ data = [] }: RecentOrdersProps) {
  return (
    <div className="space-y-8">
      {data.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {order.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.user.name}</p>
            <p className="text-sm text-muted-foreground">
              ${order.total.toFixed(2)}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <Badge variant={order.status === "DELIVERED" ? "default" : "secondary"}>
              {order.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}