// components/home/stats-section.tsx
"use client"

import { motion } from "framer-motion"
import { Users, TrendingUp, Globe, CheckCircle } from "lucide-react"
import { cn } from "../../lib/utils/helpers"

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Active Users",
    change: "+24%",
    color: "text-blue-500",
  },
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Uptime",
    change: "+0.1%",
    color: "text-green-500",
  },
  {
    icon: Globe,
    value: "150+",
    label: "Countries",
    change: "+15",
    color: "text-purple-500",
  },
  {
    icon: CheckCircle,
    value: "5,000+",
    label: "Businesses",
    change: "+42%",
    color: "text-orange-500",
  },
]

export default function StatsSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Trusted by Growing Businesses Worldwide
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of companies that rely on our platform to power their digital transformation.
            </p>
            <div className="space-y-4">
              {[
                "Enterprise-grade security and compliance",
                "24/7 customer support with 99% satisfaction",
                "Scalable infrastructure that grows with you",
                "Regular updates and new features"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-card rounded-xl p-6 shadow-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("p-3 rounded-lg bg-opacity-10", stat.color.replace("text-", "bg-"))}>
                        <Icon className={cn("h-6 w-6", stat.color)} />
                      </div>
                      <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}