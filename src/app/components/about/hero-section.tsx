/* eslint-disable react/no-unescaped-entities */
// components/about/hero-section.tsx
'use client'

import { motion } from 'framer-motion'
import { Target, Users, Globe, Award } from 'lucide-react'

export default function HeroSection() {
  const stats = [
    { icon: <Users className="h-6 w-6" />, value: '10,000+', label: 'Active Users' },
    { icon: <Globe className="h-6 w-6" />, label: '50+', value: 'Countries' },
    { icon: <Award className="h-6 w-6" />, value: '99.9%', label: 'Uptime' },
    { icon: <Target className="h-6 w-6" />, value: '24/7', label: 'Support' },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <span className="text-sm font-medium">SINCE 2020</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Revolutionizing{' '}
              <span className="text-gradient-primary">Business Software</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              We're on a mission to simplify complex business operations through intuitive,
              powerful software solutions that drive growth and efficiency.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="card p-6 text-center hover-lift hover-glow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <div className="text-primary">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}