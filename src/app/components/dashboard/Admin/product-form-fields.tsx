/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Label } from "@/src/app/components/ui/label"
import { Input } from "@/src/app/components/ui/input"
import { Textarea } from "@/src/app/components/ui/textarea"
import { Switch } from "@/src/app/components/ui/switch"
import { Badge } from "@/src/app/components/ui/badge"
import { Button } from "@/src/app/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/app/components/ui/select"
import { X, Plus, Tag, List, Settings, Info } from "lucide-react"

interface BasicInfoFieldsProps {
  formData: any
  categories: any[]
  onChange: (field: string, value: any) => void
}

export function BasicInfoFields({ formData, categories, onChange }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          Product Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Enter product name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="focus-visible:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Textarea
          id="shortDescription"
          placeholder="Brief description (max 200 chars)"
          rows={2}
          value={formData.shortDescription}
          onChange={(e) => onChange("shortDescription", e.target.value)}
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground text-right">
          {formData.shortDescription.length}/200
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          placeholder="Full product description"
          rows={6}
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-7"
              value={formData.price}
              onChange={(e) => onChange("price", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountedPrice">Discounted Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="discountedPrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-7"
              value={formData.discountedPrice}
              onChange={(e) => onChange("discountedPrice", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            placeholder="0"
            value={formData.stock}
            onChange={(e) => onChange("stock", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
          <Select value={formData.categoryId} onValueChange={(value) => onChange("categoryId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-6 pt-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => onChange("isFeatured", checked)}
          />
          <Label htmlFor="featured">Feature this product</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.isActive}
            onCheckedChange={(checked) => onChange("isActive", checked)}
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>
    </div>
  )
}

interface ArrayFieldProps {
  label: string
  items: string[]
  inputValue: string
  onInputChange: (value: string) => void
  onAdd: () => void
  onRemove: (item: string) => void
  placeholder?: string
  icon?: React.ReactNode
}

export function ArrayField({ 
  label, 
  items, 
  inputValue, 
  onInputChange, 
  onAdd, 
  onRemove, 
  placeholder = "Add item",
  icon
}: ArrayFieldProps) {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        {icon || <Tag className="h-4 w-4" />}
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onAdd()}
        />
        <Button type="button" variant="outline" onClick={onAdd} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Badge key={item} variant="secondary" className="px-3 py-1">
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="ml-2 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No {label.toLowerCase()} added yet
        </p>
      )}
    </div>
  )
}

interface SpecificationsFieldProps {
  specifications: Record<string, string>
  specKey: string
  specValue: string
  onKeyChange: (value: string) => void
  onValueChange: (value: string) => void
  onAdd: () => void
  onRemove: (key: string) => void
}

export function SpecificationsField({
  specifications,
  specKey,
  specValue,
  onKeyChange,
  onValueChange,
  onAdd,
  onRemove
}: SpecificationsFieldProps) {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Specifications
      </Label>
      <div className="flex gap-2">
        <Input
          placeholder="Key (e.g., Color, Size, Weight)"
          value={specKey}
          onChange={(e) => onKeyChange(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Value (e.g., Black, Large, 1.5kg)"
          value={specValue}
          onChange={(e) => onValueChange(e.target.value)}
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={onAdd} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {Object.keys(specifications).length > 0 ? (
        <div className="space-y-2 mt-3">
          {Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group hover:bg-muted transition-colors">
              <div className="flex-1">
                <span className="font-medium text-sm">{key}:</span>
                <span className="text-sm text-muted-foreground ml-2">{value}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(key)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No specifications added yet
        </p>
      )}
    </div>
  )
}