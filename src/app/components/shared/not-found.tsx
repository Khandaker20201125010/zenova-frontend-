// components/shared/not-found.tsx
import Link from "next/link"
import { Button } from "../ui/button"
import { Search, Home, ArrowLeft } from "lucide-react"

interface NotFoundProps {
  title?: string
  message?: string
  showHomeButton?: boolean
  showBackButton?: boolean
  showSearchButton?: boolean
}

export function NotFound({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  showHomeButton = true,
  showBackButton = true,
  showSearchButton = true,
}: NotFoundProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-8">
        <div className="text-9xl font-bold text-muted/30">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold">Not Found</div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        {message}
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {showHomeButton && (
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
        )}
        
        {showBackButton && (
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        )}
        
        {showSearchButton && (
          <Button variant="outline" asChild>
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Link>
          </Button>
        )}
      </div>
      
      {/* Suggestions */}
      <div className="mt-12 pt-8 border-t w-full max-w-md">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
          You might be looking for:
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">Products</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">Blog</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/about">About</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}