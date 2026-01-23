// components/ui/progress.tsx
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "../../lib/utils/utils"
interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string
  showValue?: boolean
  value?: number
  max?: number
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, max = 100, showValue = false, indicatorClassName, ...props }, ref) => {
  const percentage = Math.min(100, Math.max(0, ((value || 0) / max) * 100))
  
  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between">
        {showValue && (
          <span className="text-xs font-medium text-muted-foreground">
            {value}/{max}
          </span>
        )}
        <span className="text-xs font-medium text-muted-foreground">
          {percentage.toFixed(0)}%
        </span>
      </div>
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        value={percentage}
        max={100}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out",
            indicatorClassName
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }