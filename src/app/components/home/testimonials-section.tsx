/* eslint-disable react/no-unescaped-entities */
// components/home/testimonials-section.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils/helpers"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO, TechCorp",
    avatar: "/avatars/01.png",
    content: "This platform transformed our business operations. The analytics tools alone helped us increase revenue by 40% in the first quarter.",
    rating: 5,
    company: "TechCorp",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "CTO, Innovate Inc.",
    avatar: "/avatars/02.png",
    content: "The best decision we made was migrating to this platform. The API is well-documented and the support team is exceptional.",
    rating: 5,
    company: "Innovate Inc.",
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Marketing Director, GrowthLab",
    avatar: "/avatars/03.png",
    content: "Our marketing automation has never been more efficient. The platform saved us 20 hours per week in manual work.",
    rating: 4,
    company: "GrowthLab",
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Operations Manager, ScaleFast",
    avatar: "/avatars/04.png",
    content: "The scalability of this platform is incredible. We grew from 10 to 1000 users without any performance issues.",
    rating: 5,
    company: "ScaleFast",
  },
  {
    id: 5,
    name: "Lisa Rodriguez",
    role: "Product Lead, NextGen",
    avatar: "/avatars/05.png",
    content: "The user experience is outstanding. Our team adopted it instantly and productivity skyrocketed.",
    rating: 5,
    company: "NextGen",
  },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Quote className="h-4 w-4" />
            <span className="text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust our platform
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border"
            >
              <Quote className="h-12 w-12 text-primary/20 mb-6" />
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                "{currentTestimonial.content}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={currentTestimonial.avatar} alt={currentTestimonial.name} />
                    <AvatarFallback>{currentTestimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{currentTestimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{currentTestimonial.role}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < currentTestimonial.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center justify-center gap-4 mt-8 md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Logo Cloud */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by industry leaders
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 opacity-60">
            {["TechCorp", "Innovate Inc.", "GrowthLab", "ScaleFast", "NextGen"].map((company, index) => (
              <div
                key={index}
                className="h-12 flex items-center justify-center text-lg font-semibold text-muted-foreground"
              >
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}