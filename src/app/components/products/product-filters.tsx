/* eslint-disable @typescript-eslint/no-explicit-any */
// components/products/products-filters.tsx
"use client"

import { useState } from "react"
import {
  Filter,
  DollarSign,
  Tag,
  Check,
  Star
} from "lucide-react"
import { Category } from "../../lib/api/categories"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { Slider } from "@/src/app/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/src/app/components/ui/radio-group"


interface ProductsFiltersProps {
  categories: Category[]
  currentFilters: any
}

export default function ProductsFilters({
  categories,
  currentFilters
}: ProductsFiltersProps) {
  const [priceRange, setPriceRange] = useState([
    currentFilters.minPrice || 0,
    currentFilters.maxPrice || 1000,
  ])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentFilters.category ? [currentFilters.category] : []
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentFilters.tags || []
  )
  const [selectedRating, setSelectedRating] = useState<number | null>(
    currentFilters.minRating || null
  )
  const [inStockOnly, setInStockOnly] = useState(
    currentFilters.inStock || false
  )

  // Common tags (in a real app, these would come from API)
  const commonTags = [
    "New Arrival", "Best Seller", "On Sale", "Limited Edition",
    "Premium", "Eco-Friendly", "Wireless", "Smart Home"
  ]

  // Popular categories with counts
  const popularCategories = categories.slice(0, 6)

  const applyFilters = () => {
    const params = new URLSearchParams()

    // Reset to page 1 when applying filters
    params.set("page", "1")

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories[0])
    }

    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      params.set("minPrice", priceRange[0].toString())
      params.set("maxPrice", priceRange[1].toString())
    }

    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","))
    }

    if (selectedRating) {
      params.set("minRating", selectedRating.toString())
    }

    if (inStockOnly) {
      params.set("inStock", "true")
    }

    window.location.href = `/products?${params.toString()}`
  }

  const clearFilters = () => {
    window.location.href = "/products"
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [category]
    )
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
        >
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium">Categories</h4>
        <div className="space-y-2">
          {popularCategories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category.id}`}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => toggleCategory(category.name)}
              />
              <Label
                htmlFor={`cat-${category.id}`}
                className="flex-1 cursor-pointer"
              >
                {category.name}
              </Label>
              <span className="text-xs text-muted-foreground">
                ({category.productCount || 0})
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <h4 className="font-medium">Price Range</h4>
        </div>

        <Slider
          value={priceRange}
          min={0}
          max={1000}
          step={10}
          onValueChange={setPriceRange}
          className="my-6"
        />

        <div className="flex items-center justify-between">
          <div className="text-sm">
            ${priceRange[0]} - ${priceRange[1]}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPriceRange([0, 1000])}
          >
            Reset
          </Button>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          <h4 className="font-medium">Rating</h4>
        </div>

        <RadioGroup
          value={selectedRating?.toString() || ""}
          onValueChange={(value: any) => setSelectedRating(value ? parseInt(value) : null)}
        >
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
              <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    & above
                  </span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Tags */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          <h4 className="font-medium">Tags</h4>
        </div>

        <div className="flex flex-wrap gap-2">
          {commonTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => toggleTag(tag)}
            >
              {selectedTags.includes(tag) && <Check className="h-3 w-3" />}
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Stock Status */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(checked: any) => setInStockOnly(checked as boolean)}
          />
          <Label htmlFor="in-stock" className="cursor-pointer">
            In Stock Only
          </Label>
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button className="w-full" onClick={applyFilters}>
        Apply Filters
      </Button>
    </div>
  )
}