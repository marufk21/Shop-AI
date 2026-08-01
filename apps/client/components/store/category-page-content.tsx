"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  ShoppingBag,
  SlidersHorizontal,
  CaretLeft,
  CaretRight,
  X,
} from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import { useStoreProducts } from "@/hooks/store/use-products"
import { ProductCard } from "@/components/store/product-card"
import { ProductCardSkeleton } from "@/components/store/product-card-skeleton"
import { staggerContainer, fadeInUp } from "@/lib/animation-variants"

const ITEMS_PER_PAGE = 12

interface CategoryPageContentProps {
  categoryName: string
}

export function CategoryPageContent({ categoryName }: CategoryPageContentProps) {
  const [search, setSearch] = React.useState("")
  const [sort, setSort] = React.useState("Popular")
  const [currentPage, setCurrentPage] = React.useState(1)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, sort])

  const { data, isError, isLoading, refetch } = useStoreProducts({
    limit: 10000,
    category: categoryName,
  })

  const products = React.useMemo(() => data?.items ?? [], [data?.items])

  const filteredAndSorted = React.useMemo(() => {
    return products
      .filter((p) => {
        const q = search.toLowerCase()
        return (
          !q ||
          p.name.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false)
        )
      })
      .sort((a, b) => {
        if (sort.includes("Low")) return a.price - b.price
        if (sort.includes("High")) return b.price - a.price
        if (sort === "Newest")
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        return a.name.localeCompare(b.name)
      })
  }, [products, search, sort])

  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAndSorted, currentPage])

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE))

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-10">
      {/* Toolbar */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-2 sm:flex">
          <div className="relative min-w-0">
            <SlidersHorizontal className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-8 w-full rounded-lg border-border bg-background pl-7 pr-7 text-xs font-medium sm:w-40"
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
          <Select value={sort} onValueChange={(v) => setSort(v ?? "popular")}>
            <SelectTrigger className="h-8 w-full shrink-0 cursor-pointer rounded-lg border-border bg-background text-xs font-semibold sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="Popular" className="text-xs">Popular</SelectItem>
              <SelectItem value="Price: Low → High" className="text-xs">Price: Low → High</SelectItem>
              <SelectItem value="Price: High → Low" className="text-xs">Price: High → Low</SelectItem>
              <SelectItem value="Newest" className="text-xs">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!isLoading && (
          <span className="inline-flex h-8 w-full items-center justify-center rounded-lg border border-border bg-muted/40 px-3 text-xs font-semibold text-muted-foreground sm:w-auto sm:justify-start">
            {filteredAndSorted.length.toLocaleString()} products
          </span>
        )}
      </div>

      {/* Products grid */}
      <div className="min-h-96">
        {isLoading && (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm text-muted-foreground">Failed to load products.</p>
            <Button onClick={() => refetch()} size="sm" className="mt-4 rounded-xl">
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && filteredAndSorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="size-12 text-muted-foreground/20 mb-4" />
            <h3 className="font-heading text-base font-semibold">No products found</h3>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters.</p>
          </div>
        )}

        {!isLoading && !isError && filteredAndSorted.length > 0 && (
          <motion.div
            key={sort + currentPage}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
          >
            {paginatedProducts.map((product) => (
              <motion.div key={product.id} variants={fadeInUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <CaretLeft className="size-3.5" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1
            const show =
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1
            if (!show) {
              const isGap =
                (page === 2 && currentPage > 3) ||
                (page === totalPages - 1 && currentPage < totalPages - 2)
              if (isGap) {
                return (
                  <span key={page} className="flex size-8 items-center justify-center text-xs text-muted-foreground select-none">
                    …
                  </span>
                )
              }
              return null
            }
            const isActive = page === currentPage
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/25"
                }`}
              >
                {page}
              </button>
            )
          })}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <CaretRight className="size-3.5" />
          </button>
        </div>
      )}
      {!isLoading && totalPages > 5 && (
        <p className="text-center text-[10px] text-muted-foreground mt-3">
          Page {currentPage} of {totalPages}
        </p>
      )}
    </div>
  )
}
