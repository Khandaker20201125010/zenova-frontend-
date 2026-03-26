/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card"
import { Input } from "@/src/app/components/ui/input"
import { Button } from "@/src/app/components/ui/button"
import { Textarea } from "@/src/app/components/ui/textarea"
import { Label } from "@/src/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/app/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/src/app/hooks/use-toast"
import { categoriesApi } from "@/src/app/lib/api/categories"
import { CategoryWithCount } from "@/src/app/hooks/use-categories"

export default function AdminCategoryEditPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    parentId: "",
  })

  useEffect(() => {
    if (params?.id) {
      fetchCategory()
      fetchCategories()
    }
  }, [params?.id])

  const fetchCategory = async () => {
    try {
      setFetching(true)
      const categoryId = params.id as string
      const allCategories = await categoriesApi.getCategories()
      const category = allCategories.find(c => c.id === categoryId)
      
      if (category) {
        setFormData({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          parentId: category.parentId || "",
        })
      } else {
        toast({
          title: "Error",
          description: "Category not found",
          variant: "destructive",
        })
        router.push("/dashboard/admin/categories")
      }
    } catch (error) {
      console.error("Error fetching category:", error)
      toast({
        title: "Error",
        description: "Failed to load category",
        variant: "destructive",
      })
      router.push("/dashboard/admin/categories")
    } finally {
      setFetching(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getCategories()
      setCategories(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const dataToSend = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        parentId: formData.parentId === "none" ? undefined : formData.parentId,
      }
      
      const category = await categoriesApi.updateCategory(formData.id, dataToSend)
      
      if (category) {
        toast({
          title: "Success",
          description: "Category updated successfully",
        })
        router.push("/dashboard/admin/categories")
      } else {
        throw new Error("Failed to update category")
      }
    } catch (error: any) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: error?.message || "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Filter out current category from parent options to prevent self-parent
  const availableParents = categories.filter(cat => cat.id !== formData.id)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/admin/categories")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Slug is auto-generated and cannot be edited
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter category description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Category</Label>
                <Select
                  value={formData.parentId || "none"}
                  onValueChange={(value) => handleChange("parentId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {availableParents.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}