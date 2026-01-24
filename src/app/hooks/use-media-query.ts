// hooks/use-media-query.ts
"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    const updateMatches = () => {
      setMatches(media.matches)
    }

    updateMatches()

    const listener = () => updateMatches()
    
    // Modern browsers
    media.addEventListener("change", listener)
    
    // Clean up
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

// Common media queries
export const useIsMobile = () => useMediaQuery("(max-width: 767px)")
export const useIsTablet = () => useMediaQuery("(min-width: 768px) and (max-width: 1023px)")
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)")
export const useIsDarkMode = () => useMediaQuery("(prefers-color-scheme: dark)")