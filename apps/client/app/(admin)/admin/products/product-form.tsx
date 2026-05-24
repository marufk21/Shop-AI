"use client"

import { useState } from "react"
import { ImageSquare, Upload } from "@phosphor-icons/react"
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
  image_url: string
}

type ProductFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ProductCreateInput) => Promise<void>
  initial?: Partial<ProductFormData>
  isSubmitting?: boolean
}

const defaultValues: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  category: "",
  status: "draft",
  inventory: 0,
  image_url: "",
}

export function ProductForm({
  open,
  onOpenChange,
  onSubmit,
  initial,
  isSubmitting = false,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>({
    ...defaultValues,
    ...initial,
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit({
        ...form,
        description: form.description || null,
        image_url: form.image_url || null,
      })
      onOpenChange(false)
      setForm(defaultValues)
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
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed p-8">
              <div className="text-center">
                <ImageSquare className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop or click to upload
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  <Upload className="mr-1.5 size-3.5" />
                  Upload Image
                </Button>
              </div>
            </div>

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

            <div className="grid grid-cols-2 gap-4">
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
              <div className="grid gap-3">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  value={form.image_url}
                  onChange={(e) =>
                    setForm({ ...form, image_url: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>
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
