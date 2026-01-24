// components/about/values-section.tsx
'use client'

import { Heart, Shield, Zap, Users, TrendingUp, Globe } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { motion } from 'framer-motion'

export default function ValuesSection() {
  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Customer First',
      description: 'Every decision starts with our customers needs and success.',
      color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Trust & Security',
      description: 'Building trust through transparency and enterprise-grade security.',
      color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Innovation',
      description: 'Constantly pushing boundaries to deliver cutting-edge solutions.',
      color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Collaboration',
      description: 'Great things happen when we work together towards common goals.',
      color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Growth Mindset',
      description: 'Always learning, always improving, always growing.',
      color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Global Impact',
      description: 'Making technology accessible and beneficial worldwide.',
      color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    },
  ]

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Core Values
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            These principles guide everything we do, from product development to customer support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="h-full hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${value.color}`}>
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}