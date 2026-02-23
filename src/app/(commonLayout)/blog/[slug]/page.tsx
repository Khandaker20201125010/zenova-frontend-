/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/blog/[slug]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Calendar,
  User,
  Clock,
  Eye,
  Tag,
  ArrowLeft,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/src/app/components/ui/button"
import { Card, CardContent } from "@/src/app/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/app/components/ui/avatar"
import { Badge } from "@/src/app/components/ui/badge"
import { Separator } from "@/src/app/components/ui/separator"
import { Skeleton } from "@/src/app/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/app/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/app/components/ui/dropdown-menu"

import { blogsApi } from "@/src/app/lib/api/blog"
import { BlogCard } from "@/src/app/components/blog/blog-card"
import { BlogSkeleton } from "@/src/app/components/blog/blog-skeleton"
import { CommentsSection } from "@/src/app/components/blog/comments-section"
import { useToast } from "@/src/app/hooks/use-toast"
import { BlogPost } from "@/src/app/lib/types"

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  // Safely extract slug from params
  const slug = typeof params.slug === 'string' 
    ? params.slug 
    : Array.isArray(params.slug) 
      ? params.slug[0] 
      : ''

  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [readingProgress, setReadingProgress] = useState(0)

  // Fetch post data
  useEffect(() => {
    if (slug) {
      fetchPostData()
    } else {
      // Handle case where slug is missing
      setLoading(false)
      toast({
        title: "Error",
        description: "Invalid blog post URL",
        variant: "destructive",
      })
      router.push('/blog')
    }
  }, [slug])

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrollTop = window.scrollY
      const progress = (scrollTop / documentHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchPostData = async () => {
    if (!slug) return
    
    try {
      setLoading(true)
      
      // Fetch post by slug
      const response = await blogsApi.getPostBySlug(slug)
      setPost(response)
      
      // Set initial like count from views
      setLikeCount(response.views || 0)
      
      // Fetch related posts based on category/tags
      if (response.category || response.tags?.length > 0) {
        const filters: any = { limit: 3 }
        if (response.category) filters.category = response.category
        if (response.tags?.length > 0) filters.tags = response.tags.slice(0, 3)
        
        const relatedResponse = await blogsApi.getPosts(filters)
        
        // Handle different response structures
        let related: BlogPost[] = []
        if (relatedResponse.posts) {
          related = relatedResponse.posts.filter((p: BlogPost) => p.id !== response.id)
        } else if (Array.isArray(relatedResponse)) {
          related = relatedResponse.filter((p: BlogPost) => p.id !== response.id)
        }
        
        setRelatedPosts(related.slice(0, 3))
      }
    } catch (error) {
      console.error("Failed to fetch blog post:", error)
      toast({
        title: "Error",
        description: "Failed to load blog post. Please try again.",
        variant: "destructive",
      })
      router.push('/blog')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href
    const title = post?.title || "Check out this article"
    
    let shareUrl = ""
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case "copy":
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "Article link has been copied to clipboard.",
        })
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    toast({
      title: isLiked ? "Removed like" : "Liked!",
      description: isLiked ? "You unliked this article" : "Thanks for liking this article",
    })
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked ? "Article removed from your reading list" : "Article saved for later",
    })
  }

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content?.split(/\s+/).length || 0
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min read`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        {/* Progress bar skeleton */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
          <div className="h-full bg-primary w-0" />
        </div>

        {/* Back button skeleton */}
        <div className="mb-6">
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-12 w-3/4 mb-4" />
        
        {/* Meta info skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Cover image skeleton */}
        <Skeleton className="w-full h-[400px] rounded-lg mb-8" />

        {/* Content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Related posts skeleton */}
        <div className="mt-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container max-w-4xl py-8 text-center">
        <Card>
          <CardContent className="p-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">📄</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/blog')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const readingTime = calculateReadingTime(post.content)
  const publishedDate = post.publishedAt || post.createdAt

  return (
    <TooltipProvider>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article className="container max-w-4xl py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Categories */}
          {post.category && (
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">
                {post.category}
              </Badge>
              {post.tags?.slice(0, 2).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author and Meta Info */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author?.avatar || ''} />
                <AvatarFallback>
                  {post.author?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{post.author?.name || 'Anonymous'}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(publishedDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readingTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views?.toLocaleString()} views
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleLike}
                    className={isLiked ? "text-red-500" : ""}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLiked ? "Unlike" : "Like"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleBookmark}
                    className={isBookmarked ? "text-yellow-500" : ""}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isBookmarked ? "Remove bookmark" : "Bookmark"}</p>
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleShare("twitter")}>
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("facebook")}>
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("copy")}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        {/* Cover Image */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8"
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none mb-8"
        >
          {/* Excerpt if exists */}
          {post.excerpt && (
            <div className="text-xl text-muted-foreground italic border-l-4 border-primary pl-4 mb-6">
              {post.excerpt}
            </div>
          )}

          {/* Main content - Split into paragraphs for better display */}
          <div className="space-y-4">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-2 mb-8"
          >
            <Tag className="h-4 w-4 text-muted-foreground" />
            {post.tags.map((tag: string) => (
              <Link key={tag} href={`/blog?tag=${tag}`}>
                <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </motion.div>
        )}

        <Separator className="my-8" />

        {/* Author Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={post.author?.avatar || ''} />
                  <AvatarFallback>
                    {post.author?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {post.author?.name || 'Anonymous'}
                  </h3>
                  {post.author?.position && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {post.author.position}
                    </p>
                  )}
                  {post.author?.bio && (
                    <p className="text-muted-foreground">{post.author.bio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="comments">
                <MessageCircle className="mr-2 h-4 w-4" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="reactions">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Reactions ({likeCount})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="mt-6">
              <CommentsSection postId={post.id} />
            </TabsContent>
            <TabsContent value="reactions" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Reactions feature coming soon!
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Related Articles</h2>
              <Link href="/blog">
                <Button variant="ghost">
                  View All
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Table of Contents (optional - can be made sticky) */}
        <div className="hidden xl:block fixed left-[max(0px,calc(50%-45rem))] top-24 w-64">
          <div className="text-sm">
            <h4 className="font-semibold mb-2">Table of Contents</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer">Introduction</li>
              <li className="hover:text-foreground cursor-pointer">Main Content</li>
              <li className="hover:text-foreground cursor-pointer">Conclusion</li>
            </ul>
          </div>
        </div>
      </article>
    </TooltipProvider>
  )
}