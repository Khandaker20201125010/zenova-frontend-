/* eslint-disable @typescript-eslint/no-explicit-any */
// app/products/[slug]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowLeft,
  Check,
  Minus,
  Plus,
  Package,
  RefreshCw,
} from "lucide-react"

import { Card, CardContent } from "@/src/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs"
import { Badge } from "@/src/app/components/ui/badge"
import { Skeleton } from "@/src/app/components/ui/skeleton"
import { Button } from "@/src/app/components/ui/button"
import { useToast } from "@/src/app/hooks/use-toast"
import { useCartStore } from "@/src/app/store/cart-store"
import { productsApi } from "@/src/app/lib/api/products"
import { reviewsApi } from "@/src/app/lib/api/reviews"
import { ReviewCard } from "@/src/app/components/products/review-card"
import { ProductCard } from "@/src/app/components/products/product-card"
import { ReviewForm } from "@/src/app/components/products/review-form"
import { Product } from "@/src/app/lib/types"

// Main component - make sure it's exported as default
export default function ProductDetailsPage() {
  const params = useParams()
  const { toast } = useToast()
  const addToCart = useCartStore((state) => state.addItem)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  useEffect(() => {
    if (params?.slug) {
      fetchProductDetails()
    }
  }, [params?.slug])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      
      // Safely extract slug
      const slugParam = params?.slug
      if (!slugParam) {
        notFound()
        return
      }
      
      const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam
      if (!slug) {
        notFound()
        return
      }
      
      const productData = await productsApi.getProductBySlug(slug)
      setProduct(productData)

      // Fetch related products
      if (productData?.id) {
        const related = await productsApi.getRelatedProducts(productData.id)
        setRelatedProducts(related || [])
      }

      // Fetch reviews
      if (productData?.id) {
        const reviewsData = await reviewsApi.getProductReviews(productData.id)
        setReviews(reviewsData?.reviews || [])
      }
    } catch (error) {
      console.error("Failed to fetch product:", error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.discountedPrice || product.price,
      quantity,
      image: product.images?.[0] || "/placeholder.jpg",
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      setQuantity(prev => prev + 1)
    } else {
      setQuantity(prev => Math.max(1, prev - 1))
    }
  }

  if (loading) {
    return <ProductDetailsSkeleton />
  }

  if (!product) {
    return notFound()
  }

  // Get category name safely
  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : product.category?.name || 'Uncategorized';

  // Get current price (with discount if available)
  const currentPrice = product.discountedPrice || product.price;

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <span className="mx-2">/</span>
          <Link href={`/products?category=${product.categoryId || ''}`} className="hover:text-foreground">
            {categoryName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div>
          {/* Main Image */}
          <Card className="overflow-hidden mb-4">
            <div className="relative aspect-square">
              <Image
                src={product.images?.[selectedImage] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-green-500">NEW</Badge>
              )}
              {product.isFeatured && (
                <Badge className="absolute top-4 right-4 bg-primary">FEATURED</Badge>
              )}
            </div>
          </Card>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.jpg"}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                ({product.reviewCount || 0} reviews)
              </span>
              <Badge variant="outline" className="ml-4">
                {categoryName}
              </Badge>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold">${currentPrice}</span>
                {product.discountedPrice && product.discountedPrice < product.price && (
                  <>
                    <span className="text-2xl text-muted-foreground line-through">
                      ${product.price}
                    </span>
                    <Badge className="bg-green-500">
                      Save {Math.round((1 - product.discountedPrice / product.price) * 100)}%
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Tax included. Shipping calculated at checkout.
              </p>
            </div>

            {/* Inventory Status */}
            <div className="mb-6">
              {(product.stock || 0) > 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span>In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <Minus className="h-5 w-5" />
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-8">{product.description}</p>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("increase")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {product.stock && product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>

                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>

                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Buy Now Button */}
              <Button
                size="lg"
                className="w-full gap-2"
                variant="secondary"
                disabled={!product.stock || product.stock === 0}
              >
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Free Shipping</p>
                      <p className="text-sm text-muted-foreground">On orders over $100</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Easy Returns</p>
                      <p className="text-sm text-muted-foreground">30-day return policy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Secure Payment</p>
                      <p className="text-sm text-muted-foreground">100% secure & encrypted</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Warranty</p>
                      <p className="text-sm text-muted-foreground">2-year warranty included</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="description" className="flex-1">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="flex-1">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex-1">
              Shipping & Returns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <h3>Product Description</h3>
                  <p>{product.description}</p>
                  
                  {product.features && product.features.length > 0 && (
                    <>
                      <h4>Key Features</h4>
                      <ul>
                        {product.features.map((feature: string, index: number) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between py-3 border-b">
                        <span className="font-medium text-muted-foreground">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No specifications available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              
              <div>
                <ReviewForm productId={product.id} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <h3>Shipping Information</h3>
                  <ul>
                    <li>Standard shipping: 5-7 business days</li>
                    <li>Express shipping: 2-3 business days</li>
                    <li>Free shipping on orders over $100</li>
                    <li>International shipping available</li>
                  </ul>
                  
                  <h3>Return Policy</h3>
                  <ul>
                    <li>30-day return policy</li>
                    <li>Items must be in original condition</li>
                    <li>Free returns for defective items</li>
                    <li>Refund processed within 7 business days</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Related Products</h2>
            <Link
              href="/products"
              className="text-primary hover:underline flex items-center gap-2"
            >
              View All
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ProductDetailsSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Skeleton */}
        <div>
          <Skeleton className="aspect-square w-full rounded-lg mb-4" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}