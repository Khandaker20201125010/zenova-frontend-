/* eslint-disable @typescript-eslint/no-explicit-any */
// components/notifications/notification-center.tsx
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Check, X, AlertCircle, Info, CheckCircle } from "lucide-react"


import { api } from "../../lib/api/axios-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { ScrollArea } from "@/src/app/components/ui/scroll-area"
import { Badge } from "../ui/badge"
import { useToast } from "../../hooks/use-toast"


interface Notification {
  id: string
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR"
  title: string
  message: string
  read: boolean
  createdAt: string
  metadata?: Record<string, any>
}

export function NotificationCenter() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetchNotifications()
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications")
      if (response.data.success) {
        setNotifications(response.data.data)
        setUnreadCount(
          response.data.data.filter((n: Notification) => !n.read).length
        )
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    setLoading(true)
    try {
      await api.put("/notifications/mark-all-read")
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`)
      setNotifications(notifications.filter((n) => n.id !== id))
      setUnreadCount(
        notifications.filter((n) => n.id !== id && !n.read).length
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "WARNING":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "ERROR":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
      case "WARNING":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800"
      case "ERROR":
        return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={loading}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="h-96">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <DropdownMenuItem
                    className={`flex flex-col items-start p-4 cursor-pointer ${getNotificationColor(
                      notification.type
                    )} ${!notification.read ? "border-l-4 border-l-brand" : ""}`}
                    onSelect={(e) => {
                      e.preventDefault()
                      markAsRead(notification.id)
                    }}
                  >
                    <div className="flex items-start gap-3 w-full">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className="font-semibold">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <a href="/notifications" className="w-full text-center">
                View all notifications
              </a>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}