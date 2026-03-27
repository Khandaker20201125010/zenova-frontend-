"use client"

import { Label } from "@/src/app/components/ui/label"
import { Input } from "@/src/app/components/ui/input"
import { Textarea } from "@/src/app/components/ui/textarea"
import { Button } from "@/src/app/components/ui/button"
import { Badge } from "@/src/app/components/ui/badge"
import { X, Plus, Search, Globe, FileText } from "lucide-react"
import { useState } from "react"

interface SEOFieldsProps {
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  keywordInput: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onKeywordInputChange: (value: string) => void
  onAddKeyword: () => void
  onRemoveKeyword: (keyword: string) => void
}

export function SEOFields({
  seoTitle,
  seoDescription,
  seoKeywords,
  keywordInput,
  onTitleChange,
  onDescriptionChange,
  onKeywordInputChange,
  onAddKeyword,
  onRemoveKeyword
}: SEOFieldsProps) {
  const [titleLength, setTitleLength] = useState(seoTitle.length)
  const [descriptionLength, setDescriptionLength] = useState(seoDescription.length)

  const handleTitleChange = (value: string) => {
    setTitleLength(value.length)
    onTitleChange(value)
  }

  const handleDescriptionChange = (value: string) => {
    setDescriptionLength(value.length)
    onDescriptionChange(value)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="seoTitle" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            SEO Title
          </Label>
          <span className={`text-xs ${titleLength > 60 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {titleLength}/60
          </span>
        </div>
        <Input
          id="seoTitle"
          placeholder="Title for search engines (recommended: 50-60 characters)"
          value={seoTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={titleLength > 60 ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        <p className="text-xs text-muted-foreground">
          This is what appears in search engine results
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="seoDescription" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            SEO Description
          </Label>
          <span className={`text-xs ${descriptionLength > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {descriptionLength}/160
          </span>
        </div>
        <Textarea
          id="seoDescription"
          placeholder="Description for search engines (recommended: 150-160 characters)"
          rows={3}
          value={seoDescription}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className={descriptionLength > 160 ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        <p className="text-xs text-muted-foreground">
          This appears below the title in search results
        </p>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          SEO Keywords
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add keyword (e.g., product, ecommerce, shop)"
            value={keywordInput}
            onChange={(e) => onKeywordInputChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onAddKeyword()}
          />
          <Button type="button" variant="outline" onClick={onAddKeyword} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {seoKeywords.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {seoKeywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="px-3 py-1">
                {keyword}
                <button
                  type="button"
                  onClick={() => onRemoveKeyword(keyword)}
                  className="ml-2 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No keywords added yet. Add keywords to improve SEO.
          </p>
        )}
      </div>

      {/* Preview Section */}
      {(seoTitle || seoDescription) && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Search Result Preview</p>
          <div className="space-y-1">
            <p className="text-base font-medium text-blue-600 hover:underline cursor-pointer">
              {seoTitle || "Your Product Title"}
            </p>
            <p className="text-xs text-green-700">https://yourstore.com/products/product-name</p>
            <p className="text-sm text-muted-foreground">
              {seoDescription || "Your product description will appear here..."}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}