/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Avatar, AvatarFallback } from "@/src/app/components/ui/avatar"
import { Card, CardContent } from "@/src/app/components/ui/card"
import { formatRelativeDate } from "@/src/app/lib/utils/helpers"
import { Activity, ShoppingCart, Package, User, DollarSign } from "lucide-react"

interface ActivityFeedProps {
  data?: Array<{
    id: string
    action: string
    entity: string
    details: any
    createdAt: string
    user: { name: string; avatar?: string }
  }>
}

const getActivityIcon = (action: string) => {
  if (action.includes("ORDER")) return ShoppingCart
  if (action.includes("PRODUCT")) return Package
  if (action.includes("USER")) return User
  if (action.includes("PAYMENT")) return DollarSign
  return Activity
}

export function ActivityFeed({ data = [] }: ActivityFeedProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {data.slice(0, 10).map((activity) => {
        const Icon = getActivityIcon(activity.action)
        return (
          <div key={activity.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {activity.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  {activity.action.toLowerCase().replace(/_/g, " ")}
                </p>
              </div>
              {activity.details && (
                <p className="text-xs text-muted-foreground">
                  {JSON.stringify(activity.details)}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formatRelativeDate(activity.createdAt)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}