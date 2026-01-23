// components/ui/textarea.tsx
import * as React from "react"
import { cn } from "../../lib/utils/utils"
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  helperText?: string
  maxLength?: number
  showCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    error,
    label,
    helperText,
    maxLength,
    showCount,
    value,
    ...props 
  }, ref) => {
    const [charCount, setCharCount] = React.useState(
      value ? String(value).length : 0
    )
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (maxLength) {
        const newValue = e.target.value.slice(0, maxLength)
        e.target.value = newValue
        setCharCount(newValue.length)
      } else {
        setCharCount(e.target.value.length)
      }
      props.onChange?.(e)
    }
    
    return (
      <div className="w-full space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </label>
            {showCount && maxLength && (
              <span className="text-xs text-muted-foreground">
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
        {!label && showCount && maxLength && (
          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">
              {charCount}/{maxLength}
            </span>
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }