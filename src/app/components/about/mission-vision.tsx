// components/about/mission-vision.tsx
'use client'

import { Target, Eye, Rocket } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { motion } from 'framer-motion'

export default function MissionVision() {
  const items = [
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Our Mission',
      description: 'To empower businesses of all sizes with intuitive, powerful software solutions that drive growth, efficiency, and innovation.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: 'Our Vision',
      description: 'To become the leading global platform for business transformation, making advanced technology accessible to every organization.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: 'Our Promise',
      description: 'To deliver exceptional value through continuous innovation, world-class support, and a commitment to our customers success.',
      color: 'from-green-500 to-green-600',
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Drives Us Forward
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe in building software that not only solves problems but also
            inspires innovation and growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-xl hover-lift">
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} mb-6`}>
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}