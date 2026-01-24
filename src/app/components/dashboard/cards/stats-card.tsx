// components/dashboard/cards/stats-card.tsx
import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { cn } from "@/src/app/lib/utils/helpers"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  icon: LucideIcon
  color: string
  description?: string
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  description,
}: StatsCardProps) {
  const isPositive = change?.startsWith("+")
  const isNegative = change?.startsWith("-")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={cn(
            "text-xs",
            isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-muted-foreground"
          )}>
            {change} from last month
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

