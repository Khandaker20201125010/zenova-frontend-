// components/products/products-grid.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Grid3x3, 
  List, 
  SlidersHorizontal,
  X,
  Search,
  Heart
} from "lucide-react"

import Image from "next/image"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Product } from "../../lib/types"
import { Pagination } from "../shared/pagination"
import { ProductCard } from "./product-card"

interface ProductsGridProps {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function ProductsGrid({ 
  products, 
  total, 
  page, 
  limit, 
  totalPages 
}: ProductsGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams(window.location.search)
      params.set("search", searchQuery.trim())
      params.set("page", "1")
      window.location.href = `/products?${params.toString()}`
    }
  }

  const clearFilters = () => {
    window.location.href = "/products"
  }

  const hasFilters = () => {
    const params = new URLSearchParams(window.location.search)
    return Array.from(params.keys()).some(key => 
      !["page", "limit"].includes(key)
    )
  }

  // Helper function to get category name safely
  const getCategoryName = (product: Product): string => {
    if (typeof product.category === 'string') {
      return product.category
    }
    return product.category?.name || 'Uncategorized'
  }

  // Helper function to get stock status
  const getStockStatus = (product: Product): { text: string; inStock: boolean } => {
    const stock = product.stock || 0
    return {
      text: stock > 0 ? "In Stock" : "Out of Stock",
      inStock: stock > 0
    }
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-muted-foreground">
            Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total} products
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[200px]"
            />
          </form>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              size="icon"
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
              className="h-8 w-8"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden gap-2"
            onClick={() => setShowMobileFilters(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>

          {/* Clear Filters */}
          {hasFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Products */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {products.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product, index) => {
                  const categoryName = getCategoryName(product)
                  const stockStatus = getStockStatus(product)
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Product Image */}
                        <div className="md:w-48 h-48 md:h-auto relative">
                          <Image
                            fill
                            src={product.images?.[0] || "/placeholder.jpg"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {product.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {product.description}
                                  </p>
                                </div>
                                <span className="text-2xl font-bold">
                                  ${(product.discountedPrice || product.price).toFixed(2)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-sm ${
                                        i < Math.floor(product.rating || 0)
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                  <span className="text-sm text-muted-foreground ml-1">
                                    ({product.reviewCount || 0})
                                  </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {categoryName}
                                </span>
                                <span className={`text-sm ${
                                  stockStatus.inStock ? "text-green-600" : "text-red-600"
                                }`}>
                                  {stockStatus.text}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button size="sm">Add to Cart</Button>
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </div>
                              <Button size="sm" variant="ghost">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <div className="h-24 w-24 mx-auto mb-6 text-muted-foreground">
                <Search className="h-full w-full" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-8 border-t">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              const params = new URLSearchParams(window.location.search)
              params.set("page", newPage.toString())
              window.location.href = `/products?${params.toString()}`
            }}
          />
        </div>
      )}

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-background shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              {/* Mobile filters content would go here */}
              <p className="text-muted-foreground">
                Filter options would appear here
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}