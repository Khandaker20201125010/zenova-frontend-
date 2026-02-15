/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Zap,
  ShieldCheck,
  Cloud,
  LifeBuoy,
  ArrowLeft,
  Check,
  Minus,
  Plus,
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

export default function ProductDetailsPage() {
  const params = useParams()
  const { toast } = useToast()
  const addToCart = useCartStore((state) => state.addItem)
  
  // State
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1) 
  const [activeTab, setActiveTab] = useState("description")

  // Optimized Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const slugParam = params?.slug
        if (!slugParam) return
        
        const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam

        // 1. Get Product First
        const productData = await productsApi.getProductBySlug(slug)
        
        if (!productData) {
          notFound() // This might need handling in the parent, but works here for client-side
          return
        }

        setProduct(productData)

        // 2. Fetch related data in parallel (Faster)
        if (productData.id) {
          const [related, reviewsData] = await Promise.all([
            productsApi.getRelatedProducts(productData.id),
            reviewsApi.getProductReviews(productData.id)
          ])
          
          setRelatedProducts(related || [])
          setReviews(reviewsData?.reviews || [])
        }

      } catch (error) {
        console.error("Failed to fetch product data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params?.slug) {
      fetchData()
    }
  }, [params?.slug])

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
      description: `${quantity} license(s) for ${product.name} added to cart`,
    })
  }

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      setQuantity(prev => prev + 1)
    } else {
      setQuantity(prev => Math.max(1, prev - 1))
    }
  }

  if (loading) return <ProductDetailsSkeleton />
  if (!product) return notFound()

  // Helpers
  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : product.category?.name || 'Uncategorized';

  const currentPrice = product.discountedPrice || product.price;

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-foreground">Software</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div>
          <Card className="overflow-hidden mb-4 bg-muted/30 border-muted">
            <div className="relative aspect-video flex items-center justify-center">
              <Image
                src={product.images?.[selectedImage] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700">NEW VERSION</Badge>
              )}
              {product.isFeatured && (
                <Badge className="absolute top-4 right-4 bg-primary">POPULAR</Badge>
              )}
            </div>
          </Card>

          {/* Thumbnails */}
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
                    alt={`${product.name} preview ${index + 1}`}
                    fill
                    className="object-cover"
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
                ({product.reviewCount || 0} verified users)
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
                    <Badge className="bg-green-600">
                      Save {Math.round((1 - product.discountedPrice / product.price) * 100)}%
                    </Badge>
                  </>
                )}
                <span className="text-sm text-muted-foreground self-end mb-2">/ license</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                One-time payment. Lifetime updates included.
              </p>
            </div>

            {/* SaaS Availability Status */}
            <div className="mb-6">
              {product.isActive ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span>Available Now (Instant Delivery)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <Minus className="h-5 w-5" />
                  <span>Currently Unavailable</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Quantity (Licenses) & Actions */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg bg-background">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-medium">
                    {quantity} {quantity === 1 ? 'Seat' : 'Seats'}
                  </span>
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
                  disabled={!product.isActive}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>

                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>

                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <Button
                size="lg"
                className="w-full gap-2 text-lg py-6"
                variant="default" // Changed to primary for emphasis
                disabled={!product.isActive}
              >
                <Zap className="h-5 w-5" />
                Get Instant Access
              </Button>
            </div>

            {/* SaaS Features Grid */}
            <Card className="mb-8 bg-slate-50 dark:bg-slate-900/50 border-none shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Instant Access</p>
                      <p className="text-xs text-muted-foreground">Get your API Key immediately</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Cloud className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Cloud Hosted</p>
                      <p className="text-xs text-muted-foreground">99.9% Uptime Guarantee</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Secure</p>
                      <p className="text-xs text-muted-foreground">256-bit SSL Encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <LifeBuoy className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-sm">24/7 Support</p>
                      <p className="text-xs text-muted-foreground">Direct developer access</p>
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
          <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="description" className="py-2.5 px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="specifications" className="py-2.5 px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Tech Specs
            </TabsTrigger>
            <TabsTrigger value="reviews" className="py-2.5 px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="delivery" className="py-2.5 px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Delivery & Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-8 animate-in fade-in-50 duration-500">
            <Card>
              <CardContent className="p-8">
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold mb-4">About {product.name}</h3>
                  <p className="mb-6">{product.description}</p>
                  
                  {product.features && product.features.length > 0 && (
                    <>
                      <h4 className="text-lg font-semibold mb-3">Key Capabilities</h4>
                      <ul className="grid sm:grid-cols-2 gap-2 list-none p-0">
                        {product.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-8 animate-in fade-in-50 duration-500">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6">Technical Specifications</h3>
                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-border">
                        <span className="font-medium text-muted-foreground">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                          {String(value)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No technical specifications available for this tool.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8 animate-in fade-in-50 duration-500">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <Card className="bg-muted/30 border-dashed">
                    <CardContent className="p-12 text-center">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">No reviews yet</h3>
                      <p className="text-muted-foreground">Be the first to share your experience with {product.name}!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                   <ReviewForm productId={product.id} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="mt-8 animate-in fade-in-50 duration-500">
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Instant Digital Delivery
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      This is a digital product. You will receive your access credentials and API keys immediately after payment confirmation.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Instant access via User Dashboard</li>
                      <li>• Confirmation email with license keys</li>
                      <li>• Documentation and setup guide included</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <LifeBuoy className="h-5 w-5 text-primary" />
                      Technical Support
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      We stand by our software. Every purchase includes standard technical support.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 24/7 Email Support</li>
                      <li>• Access to Knowledge Base</li>
                      <li>• Community Forum Access</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t pt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Similar Tools</h2>
            <Link
              href="/products"
              className="text-primary hover:text-primary/80 flex items-center gap-2 font-medium"
            >
              View All Software
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
        <div>
          <Skeleton className="aspect-video w-full rounded-lg mb-4" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex gap-4">
             <Skeleton className="h-5 w-32" />
             <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-16 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <div className="flex gap-4 pt-4">
             <Skeleton className="h-12 w-32" />
             <Skeleton className="h-12 flex-1" />
          </div>
        </div>
      </div>
    </div>
  )
}