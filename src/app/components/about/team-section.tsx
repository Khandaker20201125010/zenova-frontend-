/* eslint-disable react/no-unescaped-entities */
// components/about/team-section.tsx
'use client'

import { Linkedin, Twitter, Mail } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'

export default function TeamSection() {
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      bio: 'Former tech lead at Google with 15+ years in SaaS innovation.',
      image: '/team/alex.jpg',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'alex@saasplatform.com',
      },
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      bio: 'Expert in scalable architecture and machine learning systems.',
      image: '/team/sarah.jpg',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'sarah@saasplatform.com',
      },
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Product',
      bio: 'Product visionary with successful launches at multiple startups.',
      image: '/team/michael.jpg',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'michael@saasplatform.com',
      },
    },
    {
      name: 'Emma Wilson',
      role: 'Head of Engineering',
      bio: 'Full-stack expert passionate about clean code and DevOps.',
      image: '/team/emma.jpg',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'emma@saasplatform.com',
      },
    },
    {
      name: 'David Kim',
      role: 'Head of Design',
      bio: 'Award-winning designer focused on user experience and accessibility.',
      image: '/team/david.jpg',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'david@saasplatform.com',
      },
    },
    {
      name: 'Lisa Wang',
      role: 'Head of Customer Success',
      bio: 'Dedicated to ensuring every customer achieves their goals.',
      image: '/team/lisa.jpg',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'lisa@saasplatform.com',
      },
    },
  ]

  const departments = [
    { name: 'Engineering', count: 45, color: 'bg-blue-500' },
    { name: 'Product & Design', count: 18, color: 'bg-purple-500' },
    { name: 'Sales & Marketing', count: 22, color: 'bg-green-500' },
    { name: 'Customer Success', count: 28, color: 'bg-yellow-500' },
    { name: 'Operations', count: 15, color: 'bg-red-500' },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Our Leadership Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Passionate experts dedicated to building the future of business software.
          </p>
        </div>

        {/* Team Members */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover-lift hover-glow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="text-2xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground mb-4">{member.bio}</p>
                    
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" asChild>
                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="icon" variant="outline" asChild>
                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="icon" variant="outline" asChild>
                        <a href={`mailto:${member.social.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Team Stats */}
        <div className="bg-card rounded-2xl p-8 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Growing Team</h3>
              <p className="text-muted-foreground mb-6">
                We're a diverse team of 128+ professionals across 5 departments,
                united by our passion for innovation and customer success.
              </p>
              
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{dept.name}</span>
                      <span className="text-muted-foreground">{dept.count} members</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${dept.color} rounded-full`}
                        style={{ width: `${(dept.count / 128) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-6xl font-bold text-gradient-primary">128+</div>
                </div>
                <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <span className="text-white font-bold">5</span>
                </div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">15</span>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-muted-foreground">
                  Team members across 15 countries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Join Team CTA */}
        <div className="text-center mt-12">
          <p className="text-xl mb-6">
            Want to join our mission?
          </p>
          <Button size="lg" asChild>
            <a href="/careers">View Open Positions</a>
          </Button>
        </div>
      </div>
    </section>
  )
}