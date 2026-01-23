// hooks/use-scroll.ts
"use client"

import { useState, useEffect } from "react"

export function useScroll() {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")
  const [isAtTop, setIsAtTop] = useState(true)
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateScroll = () => {
      const scrollY = window.scrollY
      
      setScrollPosition({
        x: window.scrollX,
        y: scrollY,
      })
      
      setScrollDirection(scrollY > lastScrollY ? "down" : "up")
      setIsAtTop(scrollY <= 0)
      setIsAtBottom(
        window.innerHeight + scrollY >= document.documentElement.scrollHeight - 100
      )
      
      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    
    // Initial call
    updateScroll()
    
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return {
    scrollPosition,
    scrollDirection,
    isAtTop,
    isAtBottom,
    scrollToTop: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    scrollToBottom: () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
  }
}