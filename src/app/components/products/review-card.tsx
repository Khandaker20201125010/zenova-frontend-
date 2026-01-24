// components/products/review-card.tsx
import { User, Calendar, ThumbsUp } from "lucide-react"
import { Card, CardContent } from "@/src/app/components/ui/card"
import { Button } from "@/src/app/components/ui/button"
import { Review } from "../../lib/types"
import Image from "next/image"

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              {review.user?.avatar ? (
                <Image
                  width={40}
                    height={40}
                  src={review.user.avatar}
                  alt={review.user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">{review.user?.name || "Anonymous"}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
                {review.verifiedPurchase && (
                  <>
                    <span>•</span>
                    <span className="text-green-600">Verified Purchase</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Helpful ({review.helpful || 0})</span>
          </Button>
        </div>
        
        <p className="text-muted-foreground">{review.comment}</p>
      </CardContent>
    </Card>
  )
}