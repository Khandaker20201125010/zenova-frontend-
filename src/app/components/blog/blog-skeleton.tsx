// components/blog/blog-skeleton.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/src/app/components/ui/card"
import { Skeleton } from "@/src/app/components/ui/skeleton"

export function BlogSkeleton() {
  return (
    <Card>
      <Skeleton className="h-48 w-full" />
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}