/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/blog/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, ArrowRight } from "lucide-react"
import { Input } from "@/src/app/components/ui/input"
import { Button } from "@/src/app/components/ui/button"
import { Card, CardContent } from "@/src/app/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/app/components/ui/select"
import { Pagination } from "@/src/app/components/shared/pagination"
import Link from "next/link"
import { BlogCard } from "../../components/blog/blog-card"
import { BlogSkeleton } from "../../components/blog/blog-skeleton"
import { blogsApi } from "../../lib/api/blog"

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchBlogData()
  }, [search, category, sortBy, page])

  const fetchBlogData = async () => {
    try {
      setLoading(true)
      
      // Fetch all posts with filters
      const filters: any = { page, limit: 12 }
      if (search) filters.search = search
      if (category !== "all") filters.category = category
      if (sortBy === "popular") filters.sortBy = "views"
      if (sortBy === "oldest") filters.sortOrder = "asc"
      
      const postsResponse = await blogsApi.getPosts(filters)
      
      // Handle different response structures
      if (postsResponse.posts) {
        setPosts(postsResponse.posts || [])
        setTotalPages(postsResponse.totalPages || 1)
      } else if (Array.isArray(postsResponse)) {
        setPosts(postsResponse)
        setTotalPages(1)
      } else {
        setPosts([])
      }

      // Fetch featured posts
      try {
        const featured = await blogsApi.getFeaturedPosts()
        setFeaturedPosts(Array.isArray(featured) ? featured : [])
      } catch (error) {
        console.error("Failed to fetch featured posts:", error)
      }

      // Fetch categories and tags
      try {
        const [cats, tgs] = await Promise.all([
          blogsApi.getCategories(),
          blogsApi.getTags(),
        ])
        setCategories(Array.isArray(cats) ? cats : [])
        setTags(Array.isArray(tgs) ? tgs : [])
      } catch (error) {
        console.error("Failed to fetch categories/tags:", error)
      }
    } catch (error) {
      console.error("Failed to fetch blog data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog & News</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stay updated with the latest news, tutorials, and insights from our team
        </p>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Articles</h2>
            <Button variant="ghost" asChild>
              <Link href="/blog/featured">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.slice(0, 3).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BlogCard post={post} featured />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Button */}
            <Button
              variant="outline"
              onClick={() => {
                setSearch("")
                setCategory("all")
                setSortBy("newest")
                setPage(1)
              }}
            >
              Reset Filters
            </Button>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground mr-2">Popular tags:</span>
                {tags.slice(0, 10).map((tag) => (
                  <Button
                    key={tag}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearch(tag)}
                  >
                    #{tag}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Posts Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <BlogSkeleton key={i} />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}