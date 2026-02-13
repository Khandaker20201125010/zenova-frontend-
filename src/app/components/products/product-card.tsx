// components/products/product-card.tsx
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/src/app/components/ui/card"
import { Button } from "@/src/app/components/ui/button"
import { Badge } from "@/src/app/components/ui/badge"
import { Product } from "../../lib/types"

export function ProductCard({ product }: { product: Product }) {
  // Handle category display
  const categoryName = product.category?.name || 'Uncategorized';

  // Handle stock - using 'stock' from backend
  const stock = product.stock || 0;
  const isInStock = stock > 0;

  // Handle rating
  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || product._count?.reviews || 0;

  // Handle images
  const imageUrl = product.images?.[0] || "/placeholder-product.jpg";

  return (
    <Card className="group hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {product.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-primary hover:bg-primary/90">Featured</Badge>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 rounded-full"
          aria-label="Add to favorites"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <CardHeader className="flex-grow-0">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {categoryName}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            {reviewCount > 0 && (
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            )}
          </div>
        </div>
        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.shortDescription || product.description || 'No description available'}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">${product.price}</span>
            {product.discountedPrice && product.discountedPrice < product.price && (
              <>
                <span className="text-sm text-muted-foreground line-through ml-2">
                  ${product.price}
                </span>
                <span className="text-sm text-green-600 ml-2">
                  ${product.discountedPrice}
                </span>
              </>
            )}
          </div>
          <Badge variant={isInStock ? "default" : "destructive"} className="text-xs">
            {isInStock ? `${stock} in stock` : "Out of Stock"}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/products/${product.slug}`}>
            View Details
          </Link>
        </Button>
        <Button className="flex-1 gap-2" disabled={!isInStock}>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}