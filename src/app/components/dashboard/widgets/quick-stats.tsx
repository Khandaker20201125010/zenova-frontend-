// components/dashboard/widgets/quick-stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Package } from "lucide-react"
import { formatRelativeDate } from "@/src/app/lib/utils/helpers"

export function QuickStats() {
  const stats = [
    {
      label: "Today's Revenue",
      value: "$2,450",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "Active Users",
      value: "1,245",
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Pending Orders",
      value: "42",
      change: "-3.1%",
      trend: "down",
      icon: ShoppingCart,
      color: "text-yellow-600",
    },
    {
      label: "Low Stock",
      value: "8",
      change: "+2.0%",
      trend: "up",
      icon: Package,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
        
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color.replace("text-", "bg-")} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendIcon className={`h-4 w-4 ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`} />
                <span className={`text-sm ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  vs yesterday
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}