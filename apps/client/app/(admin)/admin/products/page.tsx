"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { DataTable } from "@/components/shared/data-table"
import { ProductForm } from "./product-form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Plus, DotsThree, Pencil, Trash, Eye } from "@phosphor-icons/react"

type Product = {
  id: number
  name: string
  category: string
  price: number
  inventory: number
  status: "active" | "draft" | "archived"
  sku: string
  description: string
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Minimal Desk Lamp",
    category: "Home",
    price: 89,
    inventory: 45,
    status: "active",
    sku: "MDL-001",
    description: "Modern minimalist desk lamp with adjustable brightness.",
  },
  {
    id: 2,
    name: "Leather Notebook",
    category: "Office",
    price: 34,
    inventory: 120,
    status: "active",
    sku: "LN-002",
    description: "Premium leather-bound notebook with 200 pages.",
  },
  {
    id: 3,
    name: "Ceramic Mug Set",
    category: "Kitchen",
    price: 52,
    inventory: 78,
    status: "active",
    sku: "CMS-003",
    description: "Set of 4 handcrafted ceramic mugs.",
  },
  {
    id: 4,
    name: "Wireless Charger",
    category: "Tech",
    price: 45,
    inventory: 200,
    status: "active",
    sku: "WC-004",
    description: "Fast wireless charging pad for all devices.",
  },
  {
    id: 5,
    name: "Wool Throw Blanket",
    category: "Home",
    price: 78,
    inventory: 33,
    status: "draft",
    sku: "WTB-005",
    description: "Soft merino wool throw blanket.",
  },
  {
    id: 6,
    name: "Bamboo Desk Organizer",
    category: "Office",
    price: 29,
    inventory: 90,
    status: "active",
    sku: "BDO-006",
    description: "Sustainable bamboo desk organizer.",
  },
  {
    id: 7,
    name: "Scented Candle Trio",
    category: "Home",
    price: 42,
    inventory: 15,
    status: "archived",
    sku: "SCT-007",
    description: "Set of 3 hand-poured soy candles.",
  },
  {
    id: 8,
    name: "Mechanical Keyboard",
    category: "Tech",
    price: 149,
    inventory: 55,
    status: "active",
    sku: "MK-008",
    description: "Premium mechanical keyboard with RGB.",
  },
]

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  draft: "secondary",
  archived: "outline",
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

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
            <p className="text-xs text-muted-foreground">{row.sku}</p>
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
        searchPlaceholder="Search products..."
        rowKey={(row) => row.id}
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
                onSelect={() =>
                  setProducts((prev) => prev.filter((p) => p.id !== row.id))
                }
              >
                <Trash className="mr-2 size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing ?? undefined}
        onSubmit={(data) => {
          if (editing) {
            setProducts((prev) =>
              prev.map((p) => (p.id === editing.id ? { ...p, ...data } : p))
            )
          } else {
            setProducts((prev) => [
              ...prev,
              {
                ...data,
                id: Math.max(0, ...prev.map((p) => p.id)) + 1,
                description: data.description,
              } as Product,
            ])
          }
        }}
      />
    </>
  )
}
