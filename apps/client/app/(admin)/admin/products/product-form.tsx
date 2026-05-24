"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { ImageSquare, Upload } from "@phosphor-icons/react"

type ProductFormData = {
  name: string
  description: string
  price: number
  category: string
  status: "active" | "draft" | "archived"
  sku: string
  inventory: number
}

type ProductFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ProductFormData) => void
  initial?: Partial<ProductFormData>
}

const defaultValues: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  category: "",
  status: "draft",
  sku: "",
  inventory: 0,
}

export function ProductForm({
  open,
  onOpenChange,
  onSubmit,
  initial,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>({
    ...defaultValues,
    ...initial,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
    onOpenChange(false)
    setForm(defaultValues)
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
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
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
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {initial ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
