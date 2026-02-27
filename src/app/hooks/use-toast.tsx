// hooks/use-toast.tsx
"use client"

import * as React from "react"

type ToastVariant = "default" | "destructive" | "success" | "warning" | "error"

interface ToastProps {
  title: string
  duration?: number
  description?: string
  variant?: ToastVariant
  icon?: React.ReactNode
}

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void
}>({
  toast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    setToasts((prev) => [...prev, props])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-lg border ${
              toast.variant === "error" || toast.variant === "destructive"
                ? "bg-destructive text-destructive-foreground border-destructive"
                : toast.variant === "success"
                ? "bg-green-500 text-white border-green-600"
                : toast.variant === "warning"
                ? "bg-yellow-500 text-white border-yellow-600"
                : "bg-background text-foreground border"
            }`}
          >
            <div className="flex items-start gap-3">
              {toast.icon && <div className="mt-0.5">{toast.icon}</div>}
              <div>
                <p className="font-semibold">{toast.title}</p>
                {toast.description && (
                  <p className="text-sm opacity-90 mt-1">{toast.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}