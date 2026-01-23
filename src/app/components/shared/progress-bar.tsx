// components/shared/progress-bar.tsx
"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function ProgressBar() {
  const [isAnimating, setIsAnimating] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => setIsAnimating(true)
    const handleStop = () => setIsAnimating(false)

    // Listen to route changes
    const handleRouteChange = () => {
      handleStart()
      const timer = setTimeout(() => handleStop(), 500)
      return () => clearTimeout(timer)
    }

    handleRouteChange()

    return () => {
      handleStop()
    }
  }, [pathname, searchParams])

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 h-1 z-[100] overflow-hidden"
        >
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-primary via-primary/50 to-primary animate-progress" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Custom styles for progress animation
const styles = `
@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-progress {
  animation: progress 1.5s ease-in-out infinite;
}
`

// Add to your global styles or create a style tag
export function ProgressBarStyles() {
  return <style>{styles}</style>
}