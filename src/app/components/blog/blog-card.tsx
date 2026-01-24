/* eslint-disable @typescript-eslint/no-explicit-any */
// components/blog/blog-card.tsx
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/src/app/components/ui/card"
import { Button } from "@/src/app/components/ui/button"
import Image from "next/image"

export function BlogCard({ post, featured = false }: { post: any; featured?: boolean }) {
  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={post.coverImage || "/placeholder.jpg"}
          alt={post.title}
          fill
          className="object-cover"
        />
        {featured && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
            Featured
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {post.author?.name || "Anonymous"}
          </div>
        </div>
        <h3 className="font-semibold text-lg line-clamp-2">{post.title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/blog/${post.slug}`} className="w-full">
          <Button variant="ghost" className="w-full justify-between">
            Read More
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}