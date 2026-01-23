// components/shared/empty-state.tsx
import { LucideIcon } from "lucide-react"


interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}>
      {Icon && (
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex gap-3">
          {action && (
            <Button onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Specific empty states
export function EmptyCart() {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Your cart is empty"
      description="Looks like you haven't added any items to your cart yet."
      action={{
        label: "Start Shopping",
        onClick: () => window.location.href = "/products"
      }}
    />
  )
}

export function EmptyFavorites() {
  return (
    <EmptyState
      icon={Heart}
      title="No favorites yet"
      description="Save products you love to find them easily later."
      action={{
        label: "Browse Products",
        onClick: () => window.location.href = "/products"
      }}
    />
  )
}

export function EmptyOrders() {
  return (
    <EmptyState
      icon={Package}
      title="No orders yet"
      description="Your order history will appear here once you make a purchase."
      action={{
        label: "Start Shopping",
        onClick: () => window.location.href = "/products"
      }}
    />
  )
}

export function EmptySearch() {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description="Try adjusting your search or filter to find what you're looking for."
      action={{
        label: "Clear Filters",
        onClick: () => window.location.reload()
      }}
    />
  )
}

import { ShoppingCart, Heart, Package, Search } from "lucide-react"
import { Button } from "../ui/button"import { cn } from "../../lib/utils/helpers"

