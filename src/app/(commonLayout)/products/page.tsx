/* eslint-disable @typescript-eslint/no-explicit-any */
// app/products/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Filter, 
  Grid, 
  List, 
  Search, 
  ChevronDown,
  X,
  Star,
  Package
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Checkbox } from "../../components/ui/checkbox"
import { Separator } from "../../components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Pagination, PaginationInfo } from "../../components/shared/pagination"
import { Skeleton } from "../../components/ui/skeleton"
import Image from "next/image"
import { useProductsQuery } from "../../hooks/use-query"
import { Slider } from "@/components/ui/slider"
import { ProductCard } from "@/src/app/components/products/product-card"

const categories = [
  "All Categories",
  "Analytics",
  "E-Commerce",
  "Productivity",
  "Marketing",
  "Collaboration",
  "Security",
]

const tags = [
  "Popular",
  "New",
  "Featured",
  "Best Seller",
  "On Sale",
  "Limited",
]

const sortOptions = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating", value: "rating" },
]

interface ProductsResponse {
  products: any[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("popular")
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const limit = 12
  const { data: productsData, isLoading } = useProductsQuery({
    page,
    limit,
    search: searchQuery,
    category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sortBy: sortBy === "price_asc" ? "price" : 
            sortBy === "price_desc" ? "price" :
            sortBy === "rating" ? "rating" : "createdAt",
    sortOrder: sortBy === "price_desc" ? "desc" : "asc",
  }) as { data: ProductsResponse | undefined; isLoading: boolean }

  const products = productsData?.products || []
  const total = productsData?.total || 0

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    
    if (searchQuery) params.set("search", searchQuery)
    else params.delete("search")
    
    if (selectedCategory !== "All Categories") params.set("category", selectedCategory)
    else params.delete("category")
    
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","))
    else params.delete("tags")
    
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())
    params.set("sort", sortBy)
    params.set("page", page.toString())
    
    router.push(`/products?${params.toString()}`, { scroll: false })
  }, [searchQuery, selectedCategory, selectedTags, priceRange, sortBy, page, router, searchParams])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All Categories")
    setSelectedTags([])
    setPriceRange([0, 1000])
    setSortBy("popular")
    setPage(1)
  }

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Products</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover powerful solutions to grow your business
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Clear all
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Tags */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* In Stock */}
              <div className="flex items-center space-x-2">
                <Checkbox id="inStock" />
                <label
                  htmlFor="inStock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  In stock only
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="text-sm text-muted-foreground">
              Showing {products.length} of {total} products
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Sort by
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                    {sortOptions.map((option) => (
                      <DropdownMenuRadioItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Filters Button */}
              <Button
                variant="outline"
                className="lg:hidden gap-2"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Products Grid/List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any, index: number) => (
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
          ) : (
            <div className="space-y-4">
              {products.map((product: any, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            fill
                            src={product.images[0] || "/placeholder-product.jpg"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                {product.name}
                              </h3>
                              <p className="text-muted-foreground line-clamp-2 mb-3">
                                {product.description}
                              </p>
                            </div>
                            <div className="text-2xl font-bold">
                              ${product.price}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <Badge variant="outline">
                              {product.category}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{product.rating}</span>
                              <span className="text-sm text-muted-foreground">
                                ({product.reviewCount})
                              </span>
                            </div>
                            {product.inventory > 0 ? (
                              <Badge className="bg-green-500">In Stock</Badge>
                            ) : (
                              <Badge variant="destructive">Out of Stock</Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-4">
                            <Button size="sm">Add to Cart</Button>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm" variant="ghost">
                              Add to Wishlist
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {products.length > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(total / limit)}
                onPageChange={setPage}
              />
              <PaginationInfo
                currentPage={page}
                pageSize={limit}
                totalItems={total}
                className="mt-4 text-center"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}