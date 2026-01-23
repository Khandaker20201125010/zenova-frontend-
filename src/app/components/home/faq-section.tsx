// components/home/faq-section.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { Plus, Minus, HelpCircle } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils/helpers"


const faqs = [
  {
    question: "How does the pricing work?",
    answer: "We offer flexible pricing plans based on your business needs. You can start with our free tier and upgrade as you grow. All paid plans include a 14-day free trial.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, all paid plans come with a 14-day free trial. No credit card required to start the trial.",
  },
  {
    question: "How secure is my data?",
    answer: "We use enterprise-grade security measures including encryption at rest and in transit, regular security audits, and compliance with industry standards.",
  },
  {
    question: "Can I integrate with other tools?",
    answer: "Yes, we offer comprehensive API documentation and pre-built integrations with popular tools like Slack, Google Workspace, and more.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "We provide 24/7 email support for all users, and premium support with live chat and phone support for enterprise plans.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm font-medium">FAQs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions about our platform
            </p>
            <div className="space-y-4">
              <Button asChild>
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/docs">View Documentation</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg border bg-card transition-all duration-200",
                  openIndex === index && "border-primary/50 shadow-md"
                )}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex items-center justify-between w-full p-6 text-left"
                >
                  <span className="font-semibold">{faq.question}</span>
                  {openIndex === index ? (
                    <Minus className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}