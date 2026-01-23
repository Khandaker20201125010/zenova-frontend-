// components/ui/input.tsx
import * as React from "react"
import { cn } from "../../lib/utils/utils"
import { Eye, EyeOff, Search, X } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type,
    error,
    label,
    helperText,
    leftIcon,
    rightIcon,
    clearable,
    onClear,
    value,
    onChange,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(value || "")
    
    const inputType = type === "password" && showPassword ? "text" : type
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value)
      onChange?.(e)
    }
    
    const handleClear = () => {
      setInternalValue("")
      if (onChange) {
        const event = {
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }
      onClear?.()
    }
    
    const showClearButton = clearable && internalValue
    
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            type={inputType}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              (rightIcon || type === "password" || showClearButton) && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            value={internalValue}
            onChange={handleChange}
            {...props}
          />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center space-x-1">
            {type === "password" && (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
            {showClearButton && (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {rightIcon && !type && !showClearButton && (
              <div className="text-muted-foreground">
                {rightIcon}
              </div>
            )}
          </div>
        </div>
        {(error || helperText) && (
          <p className={cn(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Search Input Variant
const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      type="search"
      leftIcon={<Search className="h-4 w-4" />}
      placeholder="Search..."
      className={cn("max-w-sm", className)}
      {...props}
    />
  )
)
SearchInput.displayName = "SearchInput"

export { Input, SearchInput }