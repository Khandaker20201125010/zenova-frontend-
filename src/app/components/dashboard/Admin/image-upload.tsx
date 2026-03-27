"use client"

import { useState, useRef } from "react"
import { Button } from "@/src/app/components/ui/button"
import { 
  Upload, 
  X, 
  Loader2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Plus
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/src/app/lib/utils/helpers"

interface ImageUploadProps {
  images: string[]
  uploading: boolean
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: (index: number) => void
  maxImages?: number
}

export function ImageUpload({ 
  images, 
  uploading, 
  onUpload, 
  onRemove, 
  maxImages = 10 
}: ImageUploadProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Calculate valid current index based on images array length
  // This is derived state - calculated during render, no effect needed
  const validCurrentIndex = images.length === 0 
    ? 0 
    : Math.min(currentIndex, images.length - 1)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleFileSelect = () => {
    inputRef.current?.click()
  }

  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove(index)
    
    // Update current index after removal
    const newLength = images.length - 1
    if (newLength === 0) {
      setCurrentIndex(0)
    } else if (index === currentIndex) {
      if (index === images.length - 1) {
        setCurrentIndex(currentIndex - 1)
      }
    } else if (index < currentIndex) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (images.length === 0) {
    return (
      <div className="space-y-4">
        <div 
          className="border-2 border-dashed rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer" 
          onClick={handleFileSelect}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onUpload}
            disabled={uploading}
          />
          {uploading ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-sm font-medium">Uploading images...</p>
            </>
          ) : (
            <>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium">Click to upload images</p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {maxImages} images maximum
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  // Use validCurrentIndex instead of currentIndex directly
  const activeIndex = validCurrentIndex

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Product Images</p>
          <p className="text-xs text-muted-foreground">
            {images.length} of {maxImages} images
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFileSelect}
          disabled={images.length >= maxImages}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add More
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onUpload}
          disabled={uploading}
        />
      </div>

      {/* Main Image Carousel */}
      <div className="relative bg-muted/20 rounded-xl overflow-hidden aspect-video">
        <div className="relative w-full h-full">
          <Image
            src={images[activeIndex]}
            alt={`Product image ${activeIndex + 1}`}
            fill
            className="object-contain"
          />
          
          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={handlePrev}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 group",
              activeIndex === index 
                ? "border-primary ring-2 ring-primary/20" 
                : "border-transparent hover:border-muted-foreground/30"
            )}
            onClick={() => setCurrentIndex(index)}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive z-10"
              onClick={(e) => handleRemoveImage(index, e)}
            >
              <X className="h-3 w-3 text-white" />
            </button>
            {activeIndex === index && (
              <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-lg" />
            )}
          </div>
        ))}
        
        {/* Add More Button */}
        {images.length < maxImages && (
          <div
            className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors flex-shrink-0 hover:bg-primary/5"
            onClick={handleFileSelect}
          >
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Image Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-3 w-3" />
          <span>{activeIndex + 1} of {images.length}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setPreviewImage(images[activeIndex])}
        >
          <Eye className="h-3 w-3 mr-1" />
          Preview Full Size
        </Button>
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              fill
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}