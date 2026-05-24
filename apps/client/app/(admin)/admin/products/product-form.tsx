"use client"

import { useRef, useState } from "react"
import { ImageSquare, Upload, X } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"

import type { ProductCreateInput, ProductStatus } from "@/types/product"

export interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  status: ProductStatus
  inventory: number
}

type ProductFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ProductCreateInput, imageFile?: File | null, removeImage?: boolean) => Promise<void>
  initial?: Partial<ProductFormData>
  existingImageUrl?: string | null
  isSubmitting?: boolean
}

const defaultValues: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  category: "",
  status: "draft",
  inventory: 0,
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]

export function ProductForm({
  open,
  onOpenChange,
  onSubmit,
  initial,
  existingImageUrl,
  isSubmitting = false,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>({
    ...defaultValues,
    ...initial,
  })
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    existingImageUrl ?? null
  )
  const [removedExistingImage, setRemovedExistingImage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const imageToShow = removedExistingImage
    ? null
    : (imagePreview || existingImageUrl || null)

  const resetForm = () => {
    setForm(defaultValues)
    setImageFile(null)
    setImagePreview(null)
    setRemovedExistingImage(false)
    setError(null)
  }

  const handleFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Invalid file type. Allowed: JPEG, PNG, WebP, AVIF")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10 MB limit")
      return
    }
    setError(null)
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  const removeImage = () => {
    if (imagePreview && imagePreview !== existingImageUrl) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(null)
    setRemovedExistingImage(true)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit(
        {
          name: form.name,
          description: form.description || null,
          price: form.price,
          category: form.category,
          status: form.status,
          inventory: form.inventory,
        },
        imageFile,
        removedExistingImage,
      )
      onOpenChange(false)
      resetForm()
    } catch {
      setError("Failed to save product. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initial ? "Edit Product" : "New Product"}
            </DialogTitle>
            <DialogDescription>
              {initial
                ? "Update the product details below."
                : "Add a new product to your store catalog."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {imageToShow ? (
              <div className="relative overflow-hidden rounded-xl border">
                <img
                  src={imageToShow}
                  alt="Preview"
                  className="h-48 w-full object-contain bg-muted"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-xs"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                  disabled={isSubmitting}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ) : (
              <div
                className={`flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <ImageSquare className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop or click to upload
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 pointer-events-none"
                  >
                    <Upload className="mr-1.5 size-3.5" />
                    Upload Image
                  </Button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
                e.target.value = ""
              }}
            />

            <div className="grid gap-3">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label>Category</Label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
                >
                  <option value="">Select category</option>
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="tech">Tech</option>
                  <option value="fashion">Fashion</option>
                </select>
              </div>
              <div className="grid gap-3">
                <Label>Status</Label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as ProductFormData["status"],
                    })
                  }
                  disabled={isSubmitting}
                  className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="inventory">Inventory</Label>
              <Input
                id="inventory"
                type="number"
                min={0}
                value={form.inventory || ""}
                onChange={(e) =>
                  setForm({ ...form, inventory: parseInt(e.target.value) || 0 })
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : initial
                  ? "Save Changes"
                  : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
