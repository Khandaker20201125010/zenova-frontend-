// components/home/products-section.tsx
"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "../ui/button"
import { ArrowRight, Star } from "lucide-react"
import { useProductsQuery } from "../../hooks/use-query"
import { ProductCard } from "../products/product-card"
import { Product } from "../../lib/types"
import { useEffect } from "react"

export default function ProductsSection() {
  const { data: response, isLoading, error } = useProductsQuery({ limit: 8, isFeatured: true })
  
 
  
  // Extract products from the response
  const products = response?.products || [];
  const productArray = Array.isArray(products) ? products : [];

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
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Failed to load products. Please try again later.
          </div>
        ) : productArray.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productArray.map((product: Product, index: number) => (
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
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No featured products found.
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