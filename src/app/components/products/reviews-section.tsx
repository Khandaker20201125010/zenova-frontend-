// components/products/reviews-section.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Star, 
  User, 
  Calendar, 
  ThumbsUp, 
  MessageSquare,
} from "lucide-react"

import { Textarea } from "../ui/textarea"
import { Separator } from "../ui/separator"
import { Progress } from "../ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useSession } from "next-auth/react"

import { Button } from "../ui/button"
import { useToast } from "../../hooks/use-toast"
import { Review, ReviewResponse } from "../../lib/types"
import { reviewsApi } from "../../lib/api/reviews"

interface ReviewsSectionProps {
  productId: string
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  })
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    loadReviews()
  }, [productId, sortBy])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await reviewsApi.getProductReviews(productId, 1, 10) as ReviewResponse
      setReviews(response.reviews)
      setStats({
        average: response.averageRating,
        total: response.totalReviews,
        distribution: response.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review",
        variant: "default",
      })
      return
    }

    if (!newReview.comment.trim()) {
      toast({
        title: "Error",
        description: "Please write a review comment",
        variant: "error",
      })
      return
    }

    try {
      await reviewsApi.createReview({
        productId,
        rating: newReview.rating,
        comment: newReview.comment,
      })
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      })
      
      setNewReview({ rating: 5, comment: "" })
      loadReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "error",
      })
    }
  }

  const handleHelpfulClick = async (reviewId: string) => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to vote",
        variant: "default",
      })
      return
    }

    try {
      await reviewsApi.markHelpful(reviewId)
      toast({
        title: "Thanks for your feedback!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to vote",
        variant: "error",
      })
    }
  }

  const RatingStars = ({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
    const sizeClass = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5"
    }[size]

    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClass} ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <section id="reviews-section" className="py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Review Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{stats.average.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              <RatingStars rating={Math.round(stats.average)} size="lg" />
            </div>
            <p className="text-muted-foreground">
              Based on {stats.total} reviews
            </p>
          </div>

          <Separator />

          {/* Rating Distribution */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating as keyof typeof stats.distribution] || 0
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Write Review Button */}
          <Button 
            className="w-full" 
            onClick={() => {
              if (!session) {
                toast({
                  title: "Login Required",
                  description: "Please login to write a review",
                  variant: "default",
                })
                return
              }
              document.getElementById('write-review')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Write a Review
          </Button>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">
              Customer Reviews ({stats.total})
            </h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {review.user?.avatar ? (
                          <img
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
                          <RatingStars rating={review.rating} />
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
                      onClick={() => handleHelpfulClick(review.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful ({review.helpful || 0})</span>
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <div className="h-12 w-12 mx-auto mb-4 text-muted-foreground">
                <MessageSquare className="h-full w-full" />
              </div>
              <h4 className="text-lg font-medium mb-2">No reviews yet</h4>
              <p className="text-muted-foreground mb-6">
                Be the first to share your thoughts!
              </p>
              <Button onClick={() => {
                document.getElementById('write-review')?.scrollIntoView({ behavior: 'smooth' })
              }}>
                Write the First Review
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Form */}
      <div id="write-review" className="mt-12 pt-8 border-t">
        <h3 className="text-xl font-bold mb-6">Write a Review</h3>
        <div className="max-w-2xl space-y-6">
          <div>
            <p className="font-medium mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                  className="p-1"
                >
                  <Star
                    className={`h-8 w-8 ${
                      rating <= newReview.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Your Review</p>
            <Textarea
              placeholder="Share your experience with this product..."
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Minimum 10 characters required
            </p>
          </div>

          <Button 
            onClick={handleSubmitReview}
            disabled={!newReview.comment.trim() || newReview.comment.length < 10}
          >
            Submit Review
          </Button>
        </div>
      </div>
    </section>
  )
}