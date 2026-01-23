// components/home/features-section.tsx
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  Cloud, 
  Lock, 
  TrendingUp,
  Smartphone,
  Code,
  Database
} from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time insights and data visualization to drive business decisions.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with industry standards.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with sub-second response times.",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamless collaboration tools for distributed teams.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Globe,
    title: "Global Infrastructure",
    description: "Deployed across multiple regions for maximum uptime.",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Cloud,
    title: "Cloud Native",
    description: "Built for the cloud with auto-scaling capabilities.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Lock,
    title: "Data Privacy",
    description: "GDPR compliant with full data control.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: TrendingUp,
    title: "Scalable Architecture",
    description: "Grow from startup to enterprise without limits.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Fully responsive design for all devices.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Comprehensive API and SDK documentation.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Database,
    title: "Data Integration",
    description: "Connect with all your existing tools and services.",
    color: "from-violet-500 to-violet-600",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Packed with features designed to help you grow your business efficiently
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}