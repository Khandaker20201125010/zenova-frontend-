// components/shared/cookie-consent.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Cookie, X } from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils/helpers"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setIsVisible(false)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={cn(
            "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-96",
            "z-50 rounded-xl border bg-background p-6 shadow-xl"
          )}
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">Cookie Consent</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mt-1 -mr-1"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                We use cookies to enhance your browsing experience, analyze site traffic, 
                and personalize content. By continuing to use our site, you consent to our use of cookies.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" onClick={handleAccept}>
                  Accept All
                </Button>
                <Button size="sm" variant="outline" onClick={handleDecline}>
                  Decline
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <a href="/privacy#cookies" className="text-xs">
                    Learn More
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}