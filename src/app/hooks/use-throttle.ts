/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-throttle.ts
"use client"

import { useRef, useCallback } from "react"

export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastExecuted = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const timeSinceLastExecution = now - lastExecuted.current

      if (timeSinceLastExecution >= delay) {
        lastExecuted.current = now
        func(...args)
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          lastExecuted.current = Date.now()
          func(...args)
        }, delay - timeSinceLastExecution)
      }
    },
    [func, delay]
  )
}