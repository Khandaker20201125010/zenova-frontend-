// components/home/cta-section.tsx
"use client"

import { motion } from "framer-motion"

import { ArrowRight, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useConfetti } from "../shared/confetti-provider"
import { Button } from "../ui/button"


export default function CTASection() {
  const { data: session } = useSession()
  const { fireConfetti } = useConfetti()

  const handleGetStarted = () => {
    fireConfetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    })
  }

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Get Started Today</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of successful businesses using our platform. 
            Start your free trial today — no credit card required.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              "14-day free trial",
              "No credit card required",
              "Cancel anytime",
              "24/7 support"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">
                    Schedule a Demo
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by companies worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              {["TechCorp", "Innovate", "GrowthLab", "ScaleFast", "NextGen"].map((company, index) => (
                <div key={index} className="text-lg font-semibold text-muted-foreground">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}