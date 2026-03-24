"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card"
import { Input } from "@/src/app/components/ui/input"
import { Button } from "@/src/app/components/ui/button"
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal, ImageIcon, Upload } from "lucide-react"
import { useToast } from "@/src/app/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/app/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/app/components/ui/dropdown-menu"
import { Badge } from "@/src/app/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/app/components/ui/avatar"
import Image from "next/image"

import { BlogPost } from "@/src/app/lib/types"
import { formatDate } from "@/src/app/lib/utils/helpers"
import { blogsApi } from "@/src/app/lib/api/blog"

export default function AdminBlogsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchPosts()
  }, [pagination.page, search])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await blogsApi.getPosts({
        page: pagination.page,
        limit: pagination.limit,
        search: search,
      })
      
      // Handle different response structures
      const postsData = response.posts || response.data?.posts || response
      const postsArray = Array.isArray(postsData) ? postsData : []
      
      setPosts(postsArray)
      setPagination({
        page: response.page || response.meta?.page || 1,
        limit: response.limit || response.meta?.limit || 10,
        total: response.total || response.meta?.total || 0,
        totalPages: response.totalPages || response.meta?.totalPages || 0,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await blogsApi.deletePost(id)
        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        })
        fetchPosts()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete blog post",
          variant: "destructive",
        })
      }
    }
  }

  const handleView = (slug: string) => {
    window.open(`/blogs/${slug}`, '_blank')
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/blogs/${id}/edit`)
  }

  const handleCreate = () => {
    router.push("/dashboard/admin/blogs/create")
  }

  // Helper function to check if image URL is valid
  const isValidImageUrl = (url: string) => {
    return url && (url.startsWith('http') || url.startsWith('/uploads/'))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Blog Posts</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <Button variant="outline" onClick={fetchPosts}>
              Search
            </Button>
          </div>

          {/* Posts Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No blog posts found
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      {/* Image Column */}
                      <TableCell className="w-16">
                        {post.coverImage && isValidImageUrl(post.coverImage) ? (
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      
                      {/* Post Column */}
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-1">{post.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {post.excerpt || "No excerpt"}
                          </p>
                          {!post.coverImage && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                              <Upload className="h-3 w-3" />
                              No image uploaded
                            </span>
                          )}
                        </div>
                      </TableCell>
                      
                      {/* Author Column */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author?.avatar || ""} />
                            <AvatarFallback>
                              {post.author?.name?.charAt(0) || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{post.author?.name || "Unknown"}</span>
                        </div>
                      </TableCell>
                      
                      {/* Category Column */}
                      <TableCell>
                        <Badge variant="outline">{post.category || "Uncategorized"}</Badge>
                      </TableCell>
                      
                      {/* Status Column */}
                      <TableCell>
                        <Badge variant={post.isPublished ? "default" : "secondary"}>
                          {post.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      
                      {/* Views Column */}
                      <TableCell>{post.views || 0}</TableCell>
                      
                      {/* Date Column */}
                      <TableCell>{formatDate(post.createdAt, "MMM dd, yyyy")}</TableCell>
                      
                      {/* Actions Column */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleView(post.slug)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {!post.coverImage && (
                              <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                                <Upload className="mr-2 h-4 w-4" />
                                Add Image
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(post.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} posts
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum = i + 1
                    if (pagination.totalPages > 5 && pagination.page > 3) {
                      pageNum = pagination.page - 3 + i
                    }
                    if (pageNum > pagination.totalPages) return null
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPagination({ ...pagination, page: pageNum })}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}