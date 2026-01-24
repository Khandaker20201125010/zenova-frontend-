/* eslint-disable react/no-unescaped-entities */
// components/about/timeline-section.tsx
'use client'

import { Calendar, Rocket, Users, Award, Globe, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { motion } from 'framer-motion'

export default function TimelineSection() {
  const milestones = [
    {
      year: '2020',
      month: 'March',
      title: 'Company Founded',
      description: 'Started with a vision to simplify business operations',
      icon: <Rocket className="h-5 w-5" />,
      achievement: 'Seed funding secured',
    },
    {
      year: '2020',
      month: 'October',
      title: 'First Product Launch',
      description: 'Launched our MVP with 10 pilot customers',
      icon: <Users className="h-5 w-5" />,
      achievement: '100+ early adopters',
    },
    {
      year: '2021',
      month: 'June',
      title: 'Series A Funding',
      description: 'Raised $5M to expand engineering and sales teams',
      icon: <TrendingUp className="h-5 w-5" />,
      achievement: '$5M raised',
    },
    {
      year: '2022',
      month: 'January',
      title: 'Enterprise Launch',
      description: 'Introduced enterprise features and SLAs',
      icon: <Award className="h-5 w-5" />,
      achievement: 'Fortune 500 customers',
    },
    {
      year: '2022',
      month: 'September',
      title: 'International Expansion',
      description: 'Opened offices in Europe and Asia',
      icon: <Globe className="h-5 w-5" />,
      achievement: '50+ countries',
    },
    {
      year: '2023',
      month: 'Present',
      title: 'Platform 2.0',
      description: 'Launched AI-powered features and mobile apps',
      icon: <Calendar className="h-5 w-5" />,
      achievement: '10,000+ users',
    },
  ]

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Journey So Far
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From a startup idea to a global platform serving thousands of businesses.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden lg:block" />

          {/* Milestones */}
          <div className="space-y-12 lg:space-y-0">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative lg:flex lg:items-center lg:justify-between ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Left side (even) or Right side (odd) */}
                <div className={`lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                  <Card className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <div className="text-primary">{milestone.icon}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                              {milestone.year}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {milestone.month}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{milestone.title}</h3>
                          <p className="text-muted-foreground mb-3">{milestone.description}</p>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-primary/5">
                            <span className="text-sm font-medium text-primary">
                              {milestone.achievement}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Center point (desktop only) */}
                <div className="hidden lg:flex lg:w-2/12 lg:justify-center lg:relative">
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-background" />
                </div>

                {/* Year label (mobile only) */}
                <div className="lg:hidden flex justify-center my-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                  </div>
                </div>

                {/* Empty space for layout */}
                <div className="lg:w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Future Vision */}
        <div className="mt-20 text-center">
          <div className="inline-block relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient-primary mb-2">2024+</div>
                <div className="text-sm font-medium">The Future</div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-6 mb-4">What's Next?</h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're working on AI-powered automation, expanded global presence, and
            industry-specific solutions to serve even more businesses worldwide.
          </p>
        </div>
      </div>
    </section>
  )
}