"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card"
import { Button } from "@/src/app/components/ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useProductForm } from "@/src/app/hooks/use-product-form"

import { ArrayField, SpecificationsField } from "@/src/app/components/dashboard/Admin/product-form-fields"
import { ImageUpload } from "@/src/app/components/dashboard/Admin/image-upload"
import { SEOFields } from "@/src/app/components/dashboard/Admin/seo-fields"
import { BasicInfoFields } from "@/src/app/components/dashboard/Admin/product-form-fields"

export default function AdminProductCreatePage() {
  const router = useRouter()
  const {
    loading,
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
    addTag,
    removeTag,
    addFeature,
    removeFeature,
    addSpecification,
    removeSpecification,
    addKeyword,
    removeKeyword,
    handleImageUpload,
    removeImage,
  } = useProductForm({ mode: "create" })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create Product</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <BasicInfoFields
                  formData={formData}
                  categories={categories}
                  onChange={handleChange}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <ArrayField
                  label="Tags"
                  items={formData.tags}
                  inputValue={tagInput}
                  onInputChange={setTagInput}
                  onAdd={addTag}
                  onRemove={removeTag}
                  placeholder="Add tag"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ArrayField
                  label="Features"
                  items={formData.features}
                  inputValue={featureInput}
                  onInputChange={setFeatureInput}
                  onAdd={addFeature}
                  onRemove={removeFeature}
                  placeholder="Add feature"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <SpecificationsField
                  specifications={formData.specifications}
                  specKey={specKey}
                  specValue={specValue}
                  onKeyChange={setSpecKey}
                  onValueChange={setSpecValue}
                  onAdd={addSpecification}
                  onRemove={removeSpecification}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  images={formData.images}
                  uploading={uploadingImages}
                  onUpload={handleImageUpload}
                  onRemove={removeImage}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <SEOFields
                  seoTitle={formData.seoTitle}
                  seoDescription={formData.seoDescription}
                  seoKeywords={formData.seoKeywords}
                  keywordInput={keywordInput}
                  onTitleChange={(value) => handleChange("seoTitle", value)}
                  onDescriptionChange={(value) => handleChange("seoDescription", value)}
                  onKeywordInputChange={setKeywordInput}
                  onAddKeyword={addKeyword}
                  onRemoveKeyword={removeKeyword}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}