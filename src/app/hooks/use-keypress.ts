// hooks/use-keypress.ts
"use client"

import { useEffect } from "react"

export function useKeypress(key: string, handler: (event: KeyboardEvent) => void): void {
  useEffect(() => {
    const handleKeypress = (event: KeyboardEvent) => {
      if (event.key === key) {
        handler(event)
      }
    }

    document.addEventListener("keydown", handleKeypress)
    
    return () => {
      document.removeEventListener("keydown", handleKeypress)
    }
  }, [key, handler])
}

// Common key combinations
export const useEscapeKey = (handler: () => void) => useKeypress("Escape", handler)
export const useEnterKey = (handler: () => void) => useKeypress("Enter", handler)