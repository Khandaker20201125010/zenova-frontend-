// components/about/cta-section.tsx
'use client'

import { ArrowRight, MessageSquare, Calendar } from 'lucide-react'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-primary rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of successful businesses using our platform to drive growth and efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 bg-white text-primary hover:bg-white/90"
              asChild
            >
              <a href="/contact">
                <MessageSquare className="h-5 w-5" />
                Contact Sales
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-white text-white hover:bg-white/10"
              asChild
            >
              <a href="/demo">
                <Calendar className="h-5 w-5" />
                Book a Demo
              </a>
            </Button>
          </div>
          
          <p className="mt-8 text-sm opacity-75">
            Start your free 14-day trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  )
}