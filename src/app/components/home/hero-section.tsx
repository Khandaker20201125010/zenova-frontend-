// components/home/hero-section.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { ArrowRight, Play, Shield, Zap, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { confettiEffects, useConfetti } from "../shared/confetti-provider"


export default function HeroSection() {
  const { data: session } = useSession()
  const { fireConfetti } = useConfetti()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Transform Your Business",
      subtitle: "All-in-one SaaS platform for modern businesses",
      description: "Streamline operations, boost productivity, and drive growth with our comprehensive suite of tools.",
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "E-Commerce Solutions",
      subtitle: "Sell products seamlessly",
      description: "Complete e-commerce system with payment processing, inventory management, and analytics.",
      color: "from-green-500 to-teal-600",
    },
    {
      title: "Powerful Analytics",
      subtitle: "Data-driven decisions",
      description: "Get actionable insights with our advanced analytics dashboard and reporting tools.",
      color: "from-orange-500 to-red-600",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = () => {
    confettiEffects.celebration()
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-300/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      
      <div className="container relative py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Version 2.0 Released</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="block">Build Your</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                Digital Ecosystem
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Everything you need to run your business efficiently. From e-commerce to analytics,
              we provide the tools for success in the digital age.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {[
                "No coding required",
                "24/7 customer support",
                "Enterprise-grade security",
                "Scalable infrastructure"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">10K+</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">99.9%</p>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {session ? (
                <Button asChild size="lg" className="gap-2" onClick={handleGetStarted}>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="gap-2" onClick={handleGetStarted}>
                    <Link href="/register">
                      Get Started Free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Play className="h-4 w-4" />
                    Watch Demo
                  </Button>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <p className="text-sm text-muted-foreground mt-8">
              Trusted by 5,000+ businesses worldwide
            </p>
          </motion.div>

          {/* Hero Image/Animation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-purple-500/10">
              {/* Animated dashboard preview */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-2xl">
                  {/* Dashboard mockup */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
                    {/* Dashboard header */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-white/30"></div>
                          <div className="h-3 w-3 rounded-full bg-white/30"></div>
                          <div className="h-3 w-3 rounded-full bg-white/30"></div>
                        </div>
                        <div className="text-white/80 text-sm">Dashboard</div>
                        <div className="h-2 w-8 bg-white/30 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Dashboard content */}
                    <div className="p-6">
                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                            <div className="h-2 w-16 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Chart */}
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <div className="h-2 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="flex items-end h-32 gap-1">
                          {[30, 50, 70, 90, 70, 50, 30, 50, 70, 90].map((height, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t"
                              style={{ height: `${height}%` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl rotate-12 opacity-80 animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl -rotate-12 opacity-80 animate-float animation-delay-2000"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}