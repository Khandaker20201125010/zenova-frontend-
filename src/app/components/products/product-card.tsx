// components/products/product-card.tsx
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/src/app/components/ui/card"
import { Button } from "@/src/app/components/ui/button"
import { Badge } from "@/src/app/components/ui/badge"
import { Product } from "../../lib/types"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={product.images[0] || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isNew && (
          <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
        )}
        {product.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>
        )}
        <Button
          size="icon"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{product.category}</Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{product.rating}</span>
          </div>
        </div>
        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                ${product.compareAtPrice}
              </span>
            )}
          </div>
          <Badge variant={product.inventory > 0 ? "default" : "destructive"}>
            {product.inventory > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/products/${product.slug}`}>
            View Details
          </Link>
        </Button>
        <Button className="flex-1 gap-2" disabled={product.inventory === 0}>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}