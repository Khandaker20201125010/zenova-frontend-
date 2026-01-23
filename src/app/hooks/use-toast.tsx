// hooks/use-toast.ts
"use client"

import { toast as hotToast, ToastOptions } from "react-hot-toast"

export type ToastType = "success" | "error" | "loading" | "blank"

export interface ToastProps {
  title?: string
  description?: string
  type?: ToastType
  duration?: number
  position?: ToastOptions["position"]
}

export function useToast() {
  const toast = ({
    title,
    description,
    type = "blank",
    duration = 4000,
    position = "top-right",
  }: ToastProps) => {
    const message = description ? (
      <div>
        {title && <div className="font-semibold">{title}</div>}
        <div className="text-sm opacity-90">{description}</div>
      </div>
    ) : (
      title
    )

    const options: ToastOptions = {
      duration,
      position,
      className: "!bg-background !text-foreground !border !border-border",
    }

    switch (type) {
      case "success":
        return hotToast.success(message, options)
      case "error":
        return hotToast.error(message, options)
      case "loading":
        return hotToast.loading(message, options)
      default:
        return hotToast(message, options)
    }
  }

  toast.success = (message: string, options?: ToastOptions) =>
    hotToast.success(message, options)
  toast.error = (message: string, options?: ToastOptions) =>
    hotToast.error(message, options)
  toast.loading = (message: string, options?: ToastOptions) =>
    hotToast.loading(message, options)
  toast.custom = (message: React.ReactNode, options?: ToastOptions) =>
    hotToast.custom(message, options)
  toast.dismiss = (toastId?: string) => hotToast.dismiss(toastId)
  toast.remove = (toastId?: string) => hotToast.remove(toastId)
  toast.promise = hotToast.promise

  return toast
}