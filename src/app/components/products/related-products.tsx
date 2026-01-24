// components/products/related-products.tsx
"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Product } from "../../lib/types"
import { Button } from "../ui/button"
import Link from "next/link"
import { ProductCard } from "./product-card"


interface RelatedProductsProps {
  products: Product[]
  currentProductId: string
}

export default function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  // Filter out current product
  const filteredProducts = products.filter(p => p.id !== currentProductId).slice(0, 4)
  
  if (filteredProducts.length === 0) return null
  
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Related Products</h2>
          <p className="text-muted-foreground">
            Customers also viewed these products
          </p>
        </div>
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/products">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}