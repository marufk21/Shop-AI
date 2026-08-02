"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import {
  DotsThree,
  Eye,
  MagnifyingGlass,
  Pencil,
  Plus,
  Tag,
  Trash,
  X,
} from "@phosphor-icons/react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"

import { DataTable } from "@/components/shared/data-table"
import { getProductImageUrl } from "@/lib/image-url"
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

function parseCategoryHierarchy(category: string): {
  master: string
  articleType: string
} {
  const parts = category.split(">").map((s) => s.trim())
  return {
    master: parts[0] ?? category,
    articleType: parts[parts.length - 1] ?? category,
  }
}

function buildCategoryTree(products: { category: string }[]) {
  const masterSet = new Set<string>()
  const articlesByMaster: Record<string, string[]> = {}
  const productCountByMaster: Record<string, number> = {}

  for (const product of products) {
    const { master, articleType } = parseCategoryHierarchy(product.category)
    if (!master) continue
    masterSet.add(master)
    if (!articlesByMaster[master]) {
      articlesByMaster[master] = []
    }
    if (!articlesByMaster[master].includes(articleType)) {
      articlesByMaster[master].push(articleType)
    }
    productCountByMaster[master] = (productCountByMaster[master] ?? 0) + 1
  }

  return {
    masters: Array.from(masterSet).sort(),
    articlesByMaster,
    productCountByMaster,
  }
}

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [masterCategory, setMasterCategory] = useState("All")
  const [articleType, setArticleType] = useState("All")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const { data, isError, isLoading } = useAdminProducts({
    search: search || undefined,
    limit: 10000,
  })
  const createProduct = useCreateAdminProduct()
  const updateProduct = useUpdateAdminProduct()
  const deleteProduct = useDeleteAdminProduct()
  const allProducts = useMemo(() => data?.items ?? [], [data?.items])
  const isSubmitting = createProduct.isPending || updateProduct.isPending

  const { masters, articlesByMaster, productCountByMaster } = useMemo(
    () => buildCategoryTree(allProducts),
    [allProducts],
  )

  const visibleArticleTypes = useMemo(() => {
    if (masterCategory === "All") return []
    return articlesByMaster[masterCategory] ?? []
  }, [masterCategory, articlesByMaster])

  // Filter products by category (client-side)
  const filteredProducts = useMemo(() => {
    if (masterCategory === "All") return allProducts

    return allProducts.filter((p) => {
      const { master, articleType: pArticle } = parseCategoryHierarchy(p.category)
      if (master !== masterCategory) return false
      if (articleType !== "All" && pArticle !== articleType) return false
      return true
    })
  }, [allProducts, masterCategory, articleType])

  const columns = [
    {
      key: "name",
      header: "Product",
      sortable: true,
      cell: (row: Product) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <Image
              src={getProductImageUrl(row.image_url, "thumbnail")!}
              alt={row.name}
              width={32}
              height={32}
              className="size-8 rounded-lg object-cover"
            />
          ) : (
            <div className="size-8 rounded-lg bg-muted" />
          )}
          <div>
            <p className="text-sm font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      cell: (row: Product) => {
        const { master, articleType: art } = parseCategoryHierarchy(row.category)
        return (
          <span className="text-xs">
            <span className="font-semibold">{master}</span>
            {art !== master && (
              <span className="text-muted-foreground"> · {art}</span>
            )}
          </span>
        )
      },
    },
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

      {/* Filter toolbar: categories + search */}
      {masters.length > 0 && (
        <div className="mt-4 mb-4 space-y-3">
          {/* Primary: Master categories + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
            {/* Category pills — wrap to multiple lines, no scroll */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setMasterCategory("All")}
                className={`h-8 px-3.5 rounded-lg text-[11px] font-semibold cursor-pointer shrink-0 transition-all duration-200 border ${
                  masterCategory === "All"
                    ? "bg-foreground border-foreground text-background shadow-sm"
                    : "bg-background border-border hover:border-foreground/25 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                All
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({allProducts.length})
                </span>
              </button>

              {masters.map((master) => {
                const active = masterCategory === master
                const count = productCountByMaster[master] ?? 0
                return (
                  <button
                    key={master}
                    onClick={() => {
                      setMasterCategory(master)
                      setArticleType("All")
                    }}
                    className={`h-8 px-3.5 rounded-lg text-[11px] font-semibold cursor-pointer shrink-0 transition-all duration-200 border ${
                      active
                        ? "bg-foreground border-foreground text-background shadow-sm"
                        : "bg-background border-border hover:border-foreground/25 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {master}
                    <span className="ml-1.5 text-[10px] opacity-60">
                      ({count})
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Spacer pushes search right on desktop */}
            <div className="hidden sm:block flex-1 min-w-4" />

            {/* Search input — compact, right-aligned on desktop */}
            <div className="relative shrink-0">
              <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="h-7 w-full sm:w-48 pl-7 pr-7 rounded-lg border-border bg-background text-[11px] font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Secondary: Article types — wrap to multiple lines */}
          {masterCategory !== "All" && visibleArticleTypes.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="size-3 text-muted-foreground shrink-0" />

              <button
                onClick={() => setArticleType("All")}
                className={`h-7 px-3 rounded-lg text-[11px] font-semibold cursor-pointer shrink-0 transition-all duration-200 border ${
                  articleType === "All"
                    ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                    : "bg-background border-border hover:border-primary/25 hover:bg-primary/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                All {masterCategory}
              </button>

              {visibleArticleTypes.map((at) => {
                const active = articleType === at
                return (
                  <button
                    key={at}
                    onClick={() => setArticleType(at)}
                    className={`h-7 px-3 rounded-lg text-[11px] font-semibold cursor-pointer shrink-0 transition-all duration-200 border capitalize ${
                      active
                        ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                        : "bg-background border-border hover:border-primary/25 hover:bg-primary/5 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {at}
                  </button>
                )
              })}
            </div>
          )}

          {/* Active filter indicator + clear */}
          {masterCategory !== "All" && (
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-muted/60 text-xs font-medium">
                {masterCategory}
                {articleType !== "All" && ` › ${articleType}`}
                <button
                  onClick={() => {
                    setMasterCategory("All")
                    setArticleType("All")
                  }}
                  className="ml-0.5 hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              </span>
              <span className="text-muted-foreground/60">
                {filteredProducts.length} product{filteredProducts.length !== 1 && "s"}
              </span>
            </p>
          )}
        </div>
      )}

      <DataTable
        key={`${masterCategory}-${articleType}`}
        columns={columns}
        data={filteredProducts}
        isLoading={isLoading}
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
                onClick={() => {
                  setEditing(row)
                  setFormOpen(true)
                }}
              >
                <Pencil className="mr-2 size-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditing(row)
                  setFormOpen(true)
                }}
              >
                <Eye className="mr-2 size-3.5" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => deleteProduct.mutate(row.id)}
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
              } satisfies ProductFormData)
            : undefined
        }
        existingImageUrl={editing?.image_url}
        existingProducts={allProducts}
        isSubmitting={isSubmitting}
        onSubmit={async (productData, imageFile, removeImage) => {
          if (editing) {
            await updateProduct.mutateAsync({
              productId: editing.id,
              productData,
              imageFile,
              removeImage,
            })
          } else {
            await createProduct.mutateAsync({ productData, imageFile })
          }
        }}
      />
    </>
  )
}
