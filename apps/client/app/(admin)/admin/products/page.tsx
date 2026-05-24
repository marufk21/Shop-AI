"use client"

import { useState } from "react"
import { DotsThree, Eye, Pencil, Plus, Trash } from "@phosphor-icons/react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

import { DataTable } from "@/components/shared/data-table"
import {
  useAdminProducts,
  useCreateAdminProduct,
  useDeleteAdminProduct,
  useUpdateAdminProduct,
} from "@/hooks/admin/use-products"
import type { Product, ProductStatus } from "@/types/product"

import { ProductForm, type ProductFormData } from "./product-form"

const statusVariant: Record<
  ProductStatus,
  "default" | "secondary" | "outline"
> = {
  active: "default",
  draft: "secondary",
  archived: "outline",
}

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const { data, isError, isLoading } = useAdminProducts({
    search: search || undefined,
    limit: 100,
  })
  const createProduct = useCreateAdminProduct()
  const updateProduct = useUpdateAdminProduct()
  const deleteProduct = useDeleteAdminProduct()
  const products = data?.items ?? []
  const isSubmitting = createProduct.isPending || updateProduct.isPending

  const columns = [
    {
      key: "name",
      header: "Product",
      sortable: true,
      cell: (row: Product) => (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-muted" />
          <div>
            <p className="text-sm font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.slug}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category", sortable: true },
    {
      key: "price",
      header: "Price",
      sortable: true,
      cell: (row: Product) => (
        <span className="font-medium">${row.price.toFixed(2)}</span>
      ),
    },
    {
      key: "inventory",
      header: "Inventory",
      sortable: true,
      cell: (row: Product) => (
        <span
          className={row.inventory < 20 ? "font-medium text-destructive" : ""}
        >
          {row.inventory}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (row: Product) => (
        <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
      ),
    },
  ]

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog, inventory, and pricing.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus className="mr-1.5 size-3.5" />
          Add Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        onSearch={setSearch}
        searchPlaceholder="Search products..."
        rowKey={(row) => row.id}
        emptyMessage={
          isError ? "Could not load products." : "No products found."
        }
        actions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-xs">
                  <DotsThree className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  setEditing(row)
                  setFormOpen(true)
                }}
              >
                <Pencil className="mr-2 size-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 size-3.5" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => deleteProduct.mutate(row.id)}
              >
                <Trash className="mr-2 size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <ProductForm
        key={`${editing?.id ?? "new"}-${formOpen ? "open" : "closed"}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={
          editing
            ? ({
                name: editing.name,
                description: editing.description ?? "",
                price: editing.price,
                category: editing.category,
                status: editing.status,
                inventory: editing.inventory,
                image_url: editing.image_url ?? "",
              } satisfies ProductFormData)
            : undefined
        }
        isSubmitting={isSubmitting}
        onSubmit={async (data) => {
          if (editing) {
            await updateProduct.mutateAsync({ productId: editing.id, payload: data })
          } else {
            await createProduct.mutateAsync(data)
          }
        }}
      />
    </>
  )
}
