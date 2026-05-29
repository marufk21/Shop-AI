"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  MagnifyingGlass,
  SlidersHorizontal,
  FolderOpen,
  ArrowClockwise,
  CaretLeft,
  CaretRight,
  ShoppingBag,
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

export function ProductsSection() {
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState("All")
  const [sort, setSort] = React.useState("popular")
  const [currentPage, setCurrentPage] = React.useState(1)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, category, sort])

  const { data, isError, isLoading, refetch } = useStoreProducts({ limit: 100 })
  const products = data?.items ?? []

  const categories = React.useMemo(() => {
    const list = new Set(products.map((p) => p.category))
    return ["All", ...Array.from(list).sort()]
  }, [products])

  const filteredAndSortedProducts = React.useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = category === "All" || p.category.toLowerCase() === category.toLowerCase()
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
        return matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price
        if (sort === "price-high") return b.price - a.price
        if (sort === "newest")
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        return a.name.localeCompare(b.name)
      })
  }, [products, search, category, sort])

  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredAndSortedProducts, currentPage])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE))
  const hasActiveFilters = category !== "All"

  return (
    <section id="products" className="py-10 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
              <ShoppingBag className="size-3" weight="fill" />
              Catalogue
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Explore Products
            </h2>
          </div>

          <div className="h-8 px-3 flex items-center rounded-lg border border-border bg-muted/40 text-xs font-semibold text-muted-foreground whitespace-nowrap">
            {isLoading ? "—" : `${filteredAndSortedProducts.length} products`}
          </div>
        </motion.div>

        {/* ── Filter toolbar: categories | search | sort — single row ── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">

          {/* Category pills — scrollable on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {isLoading && categories.length <= 1
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-7 w-20 rounded-lg bg-muted animate-pulse shrink-0" />
                ))
              : categories.map((cat) => {
                  const active = category === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`h-7 px-3.5 rounded-lg text-[11px] font-semibold cursor-pointer shrink-0 transition-all duration-200 border capitalize ${
                        active
                          ? "bg-foreground border-foreground text-background shadow-sm"
                          : "bg-background border-border hover:border-foreground/25 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  )
                })}
          </div>

          {/* Spacer pushes controls right on desktop */}
          <div className="hidden sm:block flex-1 min-w-4" />

          {/* Search + Sort — compact, right-aligned on desktop */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Compact search input */}
            <div className="relative">
              <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-7 w-40 sm:w-44 pl-7 pr-7 rounded-lg border-border bg-background text-[11px] font-medium"
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

            {/* Sort select */}
            <Select value={sort} onValueChange={(v) => setSort(v ?? "popular")}>
              <SelectTrigger className="h-7 w-36 sm:w-40 shrink-0 rounded-lg border-border bg-background text-[11px] font-semibold cursor-pointer gap-1.5 capitalize">
                <SlidersHorizontal className="size-3 text-muted-foreground shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl p-1">
                <SelectItem value="popular" className="text-xs font-medium rounded-lg cursor-pointer py-1.5 capitalize">
                  Alphabetical
                </SelectItem>
                <SelectItem value="price-low" className="text-xs font-medium rounded-lg cursor-pointer py-1.5 capitalize">
                  Price: Low → High
                </SelectItem>
                <SelectItem value="price-high" className="text-xs font-medium rounded-lg cursor-pointer py-1.5 capitalize">
                  Price: High → Low
                </SelectItem>
                <SelectItem value="newest" className="text-xs font-medium rounded-lg cursor-pointer py-1.5 capitalize">
                  Newest Arrivals
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Products grid ── */}
        <div className="min-h-96">
          {isLoading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading && isError && (
            <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-border/60 rounded-2xl">
              <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground/40">
                <ArrowClockwise className="size-6" />
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                Failed to load products
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
                There was an issue connecting to the server. Please try again.
              </p>
              <Button
                onClick={() => refetch()}
                size="sm"
                className="mt-5 h-8 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <ArrowClockwise className="size-3.5" />
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !isError && filteredAndSortedProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-border/60 rounded-2xl"
            >
              <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground/40">
                <FolderOpen className="size-6" />
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                No products found
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
                Nothing matched your filters. Try a different search or category.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCategory("All") }
                className="mt-5 h-8 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </Button>
            </motion.div>
          )}

          {!isLoading && !isError && filteredAndSortedProducts.length > 0 && (
            <motion.div
              key={category + sort + currentPage}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {paginatedProducts.map((product) => (
                <motion.div key={product.id} variants={fadeInUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Pagination ── */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <CaretLeft className="size-3.5" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1
              const isActive = page === currentPage
              // Show first, last, current ±1, and ellipsis
              const show =
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1

              if (!show) {
                const isEllipsis =
                  (page === 2 && currentPage > 3) ||
                  (page === totalPages - 1 && currentPage < totalPages - 2)
                return isEllipsis ? (
                  <span key={page} className="flex size-8 items-center justify-center text-xs text-muted-foreground">
                    …
                  </span>
                ) : null
              }

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? "bg-foreground text-background border-foreground shadow-sm"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/25 hover:text-foreground"
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

      </div>
    </section>
  )
}