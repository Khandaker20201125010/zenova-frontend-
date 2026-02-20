/* eslint-disable @typescript-eslint/no-explicit-any */
// app/products/page.tsx
"use client"

import { useState, useMemo, useCallback } from "react"
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
import { useCategories } from "../../hooks/use-categories"
import { Slider } from "@/components/ui/slider"
import { ProductCard } from "@/src/app/components/products/product-card"
import { Category } from "@/src/app/lib/types"

// Update tags to use value/label pairs
const tags = [
  { label: "New", value: "new" },
  { label: "Popular", value: "popular" },
  { label: "Featured", value: "featured" },
  { label: "Best Seller", value: "best-seller" },
  { label: "On Sale", value: "on-sale" },
  { label: "Limited", value: "limited" },
]

// Sort options with proper mapping
const sortOptions = [
  { label: "Most Popular", value: "popular", sortBy: "rating", sortOrder: "desc" },
  { label: "Newest", value: "newest", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Price: Low to High", value: "price_asc", sortBy: "price", sortOrder: "asc" },
  { label: "Price: High to Low", value: "price_desc", sortBy: "price", sortOrder: "desc" },
  { label: "Rating", value: "rating", sortBy: "rating", sortOrder: "desc" },
]

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- Local state for input fields ---
  const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get("search") || "")

  // --- State derived from URL ---
  const searchQuery = searchParams.get("search") || ""
  const selectedCategoryId = searchParams.get("category")
  const selectedTags = useMemo(() => searchParams.get("tags")?.split(",").filter(Boolean) || [], [searchParams])
  const minPrice = parseInt(searchParams.get("minPrice") || "0")
  const maxPrice = parseInt(searchParams.get("maxPrice") || "1000")
  const priceRange: [number, number] = [minPrice, maxPrice]
  const sortValue = searchParams.get("sort") || "popular"
  const page = parseInt(searchParams.get("page") || "1")
  const inStock = searchParams.get("inStock") === "true"
  const limit = 12

  // Find the current sort option
  const currentSortOption = sortOptions.find(opt => opt.value === sortValue) || sortOptions[0]

  // --- UI-only state ---
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()
  const categories = Array.isArray(categoriesData) ? categoriesData : []

  // Find selected category name
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategoryId) return "All Categories"
    const category = categories.find(c => c.id === selectedCategoryId)
    return category?.name || "All Categories"
  }, [selectedCategoryId, categories])

  // Fetch products with proper sort parameters
  const { data: productsData, isLoading } = useProductsQuery({
    page,
    limit,
    search: searchQuery || undefined,
    category: selectedCategoryId || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    inStock: inStock || undefined,
    sortBy: currentSortOption.sortBy,
    sortOrder: currentSortOption.sortOrder as 'asc' | 'desc',
  })

  const products = productsData?.products || []
  const total = productsData?.total || 0
  const totalPages = productsData?.totalPages || 1

  // --- Helper to build new URL ---
  const buildUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    // Always reset to page 1 when filters change (except page itself)
    if (!('page' in updates)) {
      params.set('page', '1')
    }
    
    params.set('limit', limit.toString())
    const queryString = params.toString()
    return queryString ? `/products?${queryString}` : "/products"
  }, [searchParams, limit])

  // --- Event Handlers ---
  const handleCategorySelect = (category: Category | null) => {
    const url = buildUrl({ category: category?.id || null })
    router.push(url, { scroll: false })
  }

  const handleTagToggle = (tagValue: string) => {
    const newTags = selectedTags.includes(tagValue)
      ? selectedTags.filter(t => t !== tagValue)
      : [...selectedTags, tagValue]
    const url = buildUrl({ tags: newTags.length ? newTags.join(',') : null })
    router.push(url, { scroll: false })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const url = buildUrl({ search: localSearchQuery || null })
    router.push(url, { scroll: false })
  }

  const handlePriceChange = (value: number[]) => {
    const url = buildUrl({ 
      minPrice: value[0].toString(), 
      maxPrice: value[1].toString() 
    })
    router.push(url, { scroll: false })
  }

  const handleSortChange = (value: string) => {
    const url = buildUrl({ sort: value })
    router.push(url, { scroll: false })
  }

  const handlePageChange = (newPage: number) => {
    const url = buildUrl({ page: newPage.toString() })
    router.push(url, { scroll: false })
  }

  const clearFilters = () => {
    setLocalSearchQuery("")
    const url = buildUrl({
      search: null,
      category: null,
      tags: null,
      minPrice: '0',
      maxPrice: '1000',
      sort: 'popular',
      inStock: null,
      page: '1'
    })
    router.push(url, { scroll: false })
  }

  const handleInStockChange = (checked: boolean) => {
    const url = buildUrl({ inStock: checked ? 'true' : null })
    router.push(url, { scroll: false })
  }

  return (
    <div className="container py-8">
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
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10"
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                {categoriesLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategorySelect(null)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        !selectedCategoryId
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category: any) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategoryId === category.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          {category._count?.products > 0 && (
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">
                              {category._count.products}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    min={0}
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
                      key={tag.value}
                      variant={selectedTags.includes(tag.value) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag.value)}
                    >
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* In Stock */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="inStock" 
                  checked={inStock}
                  onCheckedChange={handleInStockChange}
                />
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
              {selectedCategoryName !== "All Categories" && (
                <span className="ml-2">
                  in <span className="font-medium">{selectedCategoryName}</span>
                </span>
              )}
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
                    Sort by: {sortOptions.find(opt => opt.value === sortValue)?.label || "Popular"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuRadioGroup value={sortValue} onValueChange={handleSortChange}>
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

          {/* Products Grid */}
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
                        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            fill
                            src={product.images?.[0] || "/placeholder-product.jpg"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
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
                              ${(product.discountedPrice || product.price).toFixed(2)}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">
                              {product.category?.name || 'Uncategorized'}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{product.rating || 0}</span>
                            </div>
                            {(product.stock || 0) > 0 ? (
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
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
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

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[300px] bg-background p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Filters</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}