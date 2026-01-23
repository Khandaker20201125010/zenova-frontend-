// components/home/products-section.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "../ui/button"
import { ArrowRight, Star } from "lucide-react"
import { useProductsQuery } from "../../hooks/use-query"


const featuredProducts = [
  {
    id: "1",
    name: "Premium Analytics Suite",
    slug: "premium-analytics-suite",
    description: "Advanced analytics platform with real-time insights and predictive modeling.",
    price: 299,
    images: ["/products/analytics.jpg"],
    category: "Analytics",
    tags: ["analytics", "premium", "business"],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    isFeatured: true,
    isNew: true,
  },
  {
    id: "2",
    name: "E-Commerce Pro",
    slug: "e-commerce-pro",
    description: "Complete e-commerce solution with inventory management and payment processing.",
    price: 199,
    images: ["/products/ecommerce.jpg"],
    category: "E-Commerce",
    tags: ["ecommerce", "store", "shopping"],
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Team Collaboration",
    slug: "team-collaboration",
    description: "Collaboration tools for remote teams with video calls and file sharing.",
    price: 149,
    images: ["/products/collaboration.jpg"],
    category: "Productivity",
    tags: ["collaboration", "team", "remote"],
    rating: 4.7,
    reviewCount: 67,
    inStock: true,
    isFeatured: true,
    isNew: true,
  },
  {
    id: "4",
    name: "Marketing Automation",
    slug: "marketing-automation",
    description: "Automate your marketing campaigns with AI-powered tools.",
    price: 249,
    images: ["/products/marketing.jpg"],
    category: "Marketing",
    tags: ["marketing", "automation", "ai"],
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    isFeatured: true,
  },
]

export default function ProductsSection() {
  const { data: products, isLoading } = useProductsQuery({ limit: 8, isFeatured: true })
  const [displayProducts] = useState(featuredProducts)

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
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Featured Products</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Popular Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover our most popular products trusted by thousands of businesses
          </p>
          <Button variant="outline" asChild>
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[400px] bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg">
            <Link href="/products">
              Explore All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}