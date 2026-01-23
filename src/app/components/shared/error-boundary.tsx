// components/shared/error-boundary.tsx
"use client"

import React from "react"
import { Button } from "../ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <div className="flex gap-3">
            <Button onClick={this.resetError}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Error Display Component
export function ErrorDisplay({ 
  error, 
  title = "Error",
  onRetry 
}: { 
  error?: Error | string
  title?: string
  onRetry?: () => void
}) {
  const errorMessage = typeof error === "string" ? error : error?.message

  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-destructive mb-1">{title}</h4>
          <p className="text-sm text-destructive/80">{errorMessage || "An unknown error occurred"}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-destructive text-destructive hover:bg-destructive/10"
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}