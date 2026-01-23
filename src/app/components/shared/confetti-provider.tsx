// components/shared/confetti-provider.tsx
"use client"

import { useState, useEffect } from "react"
import confetti from "canvas-confetti"
import { createContext, useContext } from "react"

interface ConfettiContextType {
  fireConfetti: (options?: confetti.Options) => void
}

const ConfettiContext = createContext<ConfettiContextType | undefined>(undefined)

export function useConfetti() {
  const context = useContext(ConfettiContext)
  if (!context) {
    throw new Error("useConfetti must be used within a ConfettiProvider")
  }
  return context
}

export function ConfettiProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  const fireConfetti = (options?: confetti.Options) => {
    if (!isReady) return

    const defaults: confetti.Options = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      ...options,
    }

    confetti(defaults)
  }

  const value = { fireConfetti }

  return (
    <ConfettiContext.Provider value={value}>
      {children}
    </ConfettiContext.Provider>
  )
}

// Predefined confetti effects
export const confettiEffects = {
  celebration: () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  },

  firework: (x: number, y: number) => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { x, y },
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
    })
  },

  shower: () => {
    const end = Date.now() + 2000

    function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  },
}