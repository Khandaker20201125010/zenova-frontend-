/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/src/app/hooks/use-toast"
import { productsApi } from "@/src/app/lib/api/products"
import { categoriesApi } from "@/src/app/lib/api/categories"
import { Category, Product } from "@/src/app/lib/types"

interface UseProductFormProps {
  productId?: string
  mode: "create" | "edit"
}

interface ProductFormData {
  id: string
  name: string
  description: string
  shortDescription: string
  price: string
  discountedPrice: string
  categoryId: string
  tags: string[]
  features: string[]
  specifications: Record<string, string>
  stock: string
  isFeatured: boolean
  isActive: boolean
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  images: string[]
}

const initialState: ProductFormData = {
  id: "",
  name: "",
  description: "",
  shortDescription: "",
  price: "",
  discountedPrice: "",
  categoryId: "",
  tags: [],
  features: [],
  specifications: {},
  stock: "",
  isFeatured: false,
  isActive: true,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
  images: [],
}

export function useProductForm({ productId, mode }: UseProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(mode === "edit")
  const [uploadingImages, setUploadingImages] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<ProductFormData>(initialState)
  const [tagInput, setTagInput] = useState("")
  const [featureInput, setFeatureInput] = useState("")
  const [specKey, setSpecKey] = useState("")
  const [specValue, setSpecValue] = useState("")
  const [keywordInput, setKeywordInput] = useState("")

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getCategories()
        setCategories(Array.isArray(response) ? response : [])
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch product if in edit mode
  useEffect(() => {
    if (mode === "edit" && productId) {
      fetchProduct()
    }
  }, [productId, mode])

  const fetchProduct = async () => {
    try {
      setFetching(true)
      const product = await productsApi.getProductById(productId!)
      if (product) {
        setFormData({
          id: product.id,
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription || "",
          price: product.price.toString(),
          discountedPrice: product.discountedPrice?.toString() || "",
          categoryId: product.categoryId,
          tags: product.tags || [],
          features: product.features || [],
          specifications: product.specifications || {},
          stock: product.stock?.toString() || "0",
          isFeatured: product.isFeatured || false,
          isActive: product.isActive !== false,
          seoTitle: product.seoTitle || "",
          seoDescription: product.seoDescription || "",
          seoKeywords: product.seoKeywords || [],
          images: product.images || [],
        })
      } else {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        })
        router.push("/dashboard/admin/products")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      })
      router.push("/dashboard/admin/products")
    } finally {
      setFetching(false)
    }
  }

  const handleChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // Array management utilities
  const addItem = useCallback((
    field: keyof Pick<ProductFormData, "tags" | "features" | "seoKeywords">,
    input: string,
    setInput: (value: string) => void
  ) => {
    if (input.trim() && !formData[field].includes(input.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], input.trim()]
      }))
      setInput("")
    }
  }, [formData])

  const removeItem = useCallback((
    field: keyof Pick<ProductFormData, "tags" | "features" | "seoKeywords">,
    item: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item)
    }))
  }, [])

  const addSpecification = useCallback(() => {
    if (specKey.trim() && specValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim()
        }
      }))
      setSpecKey("")
      setSpecValue("")
    }
  }, [specKey, specValue])

  const removeSpecification = useCallback((key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return { ...prev, specifications: newSpecs }
    })
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setUploadingImages(true)
      const fileArray = Array.from(files)
      
      // TODO: Replace with actual upload logic
      const uploadedUrls = fileArray.map(file => URL.createObjectURL(file))
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))
      
      toast({
        title: "Success",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }, [])

  const validateForm = useCallback(() => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Product name is required", variant: "destructive" })
      return false
    }
    if (!formData.price) {
      toast({ title: "Error", description: "Price is required", variant: "destructive" })
      return false
    }
    if (!formData.categoryId) {
      toast({ title: "Error", description: "Category is required", variant: "destructive" })
      return false
    }
    return true
  }, [formData, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      
      // Build dataToSend - filter out empty values and convert null/empty to undefined
      const dataToSend: Partial<Product> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        tags: formData.tags,
        features: formData.features,
        specifications: formData.specifications,
        stock: parseInt(formData.stock) || 0,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        images: formData.images,
      }
      
      // Only add optional fields if they have values
      if (formData.shortDescription.trim()) {
        dataToSend.shortDescription = formData.shortDescription.trim()
      }
      
      if (formData.discountedPrice && parseFloat(formData.discountedPrice) > 0) {
        dataToSend.discountedPrice = parseFloat(formData.discountedPrice)
      }
      
      if (formData.seoTitle.trim()) {
        dataToSend.seoTitle = formData.seoTitle.trim()
      }
      
      if (formData.seoDescription.trim()) {
        dataToSend.seoDescription = formData.seoDescription.trim()
      }
      
      if (formData.seoKeywords.length > 0) {
        dataToSend.seoKeywords = formData.seoKeywords
      }

      if (mode === "create") {
        await productsApi.createProduct(dataToSend)
        toast({ title: "Success", description: "Product created successfully" })
      } else {
        await productsApi.updateProduct(formData.id, dataToSend)
        toast({ title: "Success", description: "Product updated successfully" })
      }
      
      router.push("/dashboard/admin/products")
    } catch (error: any) {
      console.error('Submit error:', error)
      toast({
        title: "Error",
        description: error?.message || `Failed to ${mode} product`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    
    loading,
    fetching,
    uploadingImages,
    categories,
    formData,
    tagInput,
    featureInput,
    specKey,
    specValue,
    keywordInput,
    
   
    setTagInput,
    setFeatureInput,
    setSpecKey,
    setSpecValue,
    setKeywordInput,
    
    handleChange,
    handleSubmit,
    addTag: () => addItem("tags", tagInput, setTagInput),
    removeTag: (tag: string) => removeItem("tags", tag),
    addFeature: () => addItem("features", featureInput, setFeatureInput),
    removeFeature: (feature: string) => removeItem("features", feature),
    addSpecification,
    removeSpecification,
    addKeyword: () => addItem("seoKeywords", keywordInput, setKeywordInput),
    removeKeyword: (keyword: string) => removeItem("seoKeywords", keyword),
    handleImageUpload,
    removeImage,
  }
}