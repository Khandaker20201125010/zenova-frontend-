// components/dashboard/widgets/recent-activities.tsx
import { formatRelativeDate } from "@/src/app/lib/utils/helpers"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Badge } from "../../ui/badge"
import { Activity, ShoppingCart, UserPlus, Star, Package } from "lucide-react"


const activities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "/avatars/01.png",
    },
    action: "placed an order",
    target: "Premium Analytics Suite",
    timestamp: "2024-03-20T10:30:00Z",
    icon: ShoppingCart,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      avatar: "/avatars/02.png",
    },
    action: "signed up",
    target: "",
    timestamp: "2024-03-20T09:15:00Z",
    icon: UserPlus,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30",
  },
  {
    id: 3,
    user: {
      name: "Bob Johnson",
      avatar: "/avatars/03.png",
    },
    action: "left a review",
    target: "Team Collaboration",
    timestamp: "2024-03-19T16:45:00Z",
    icon: Star,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30",
  },
  {
    id: 4,
    user: {
      name: "Alice Brown",
      avatar: "/avatars/04.png",
    },
    action: "purchased",
    target: "Marketing Automation",
    timestamp: "2024-03-19T14:20:00Z",
    icon: Package,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30",
  },
  {
    id: 5,
    user: {
      name: "Charlie Wilson",
      avatar: "/avatars/05.png",
    },
    action: "completed onboarding",
    target: "",
    timestamp: "2024-03-19T11:10:00Z",
    icon: Activity,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30",
  },
]

export function RecentActivities() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activity.icon
        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${activity.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{activity.user.name}</span>
                <span className="text-muted-foreground">{activity.action}</span>
                {activity.target && (
                  <span className="font-medium">{activity.target}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatRelativeDate(activity.timestamp)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

