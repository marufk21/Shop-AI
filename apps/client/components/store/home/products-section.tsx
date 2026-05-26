"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  MagnifyingGlass,
  SquaresFour,
  Rows,
  SlidersHorizontal,
  CaretLeft,
  CaretRight,
  FolderOpen,
  ArrowClockwise,
  ShoppingBag,
} from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent } from "@workspace/ui/components/card"
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
import { toast } from "sonner"
import type { Product } from "@/types/product"

const ITEMS_PER_PAGE = 12

export function ProductsSection() {
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState("All")
  const [sort, setSort] = React.useState("popular")
  const [gridView, setGridView] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [wishlist, setWishlist] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, category, sort])

  const { data, isError, isLoading, refetch } = useStoreProducts({
    limit: 100,
  })

  const products = data?.items ?? []

  const categories = React.useMemo(() => {
    const list = new Set(products.map((p) => p.category))
    return ["All", ...Array.from(list).sort()]
  }, [products])

  const filteredAndSortedProducts = React.useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = category === "All" || p.category === category
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
        return matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price
        if (sort === "price-high") return b.price - a.price
        if (sort === "newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        return a.name.localeCompare(b.name)
      })
  }, [products, category, search, sort])

  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredAndSortedProducts, currentPage])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE))

  const handleWishlistToggle = (productId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
        toast.info("Removed from wishlist")
      } else {
        next.add(productId)
        toast.success("Added to wishlist!")
      }
      return next
    })
  }

  const handleAddToCart = (product: Product) => {
    toast.success(`Added ${product.name} to cart! (Demo)`)
  }

  return (
    <section id="products" className="py-20 md:py-24 border-t scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest">
              <ShoppingBag className="size-4" weight="fill" />
              Full Catalog
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl text-foreground">
              All Products
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-normal max-w-lg">
              Browse our complete collection. Filter by category, search by name, and sort to find exactly what you need.
            </p>
          </div>
          <div className="text-xs font-semibold text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border w-fit">
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="mb-8 space-y-4">
          {/* Category Pills */}
          <div className="no-scrollbar flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0">
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
                      className={`h-7 px-3.5 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-all duration-200 border ${
                        active
                          ? "bg-primary border-primary text-primary-foreground shadow-xs shadow-primary/10"
                          : "bg-background border-border/80 text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center justify-between">
            <div className="flex flex-wrap items-center gap-3.5">
              <Select value={sort} onValueChange={(v) => setSort(v ?? "popular")}>
                <SelectTrigger size="sm" className="w-44 h-9 rounded-xl border bg-background/55 text-xs font-semibold cursor-pointer select-none">
                  <SlidersHorizontal className="size-3.5 mr-1 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="p-1 rounded-xl">
                  <SelectItem value="popular" className="cursor-pointer text-xs font-medium py-1.5">Alphabetical</SelectItem>
                  <SelectItem value="price-low" className="cursor-pointer text-xs font-medium py-1.5">Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className="cursor-pointer text-xs font-medium py-1.5">Price: High to Low</SelectItem>
                  <SelectItem value="newest" className="cursor-pointer text-xs font-medium py-1.5">Newest Arrivals</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1.5 border rounded-xl p-1 bg-background">
                <button
                  onClick={() => setGridView(true)}
                  className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                    gridView ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Grid View"
                >
                  <SquaresFour className="size-4" weight={gridView ? "fill" : "regular"} />
                </button>
                <button
                  onClick={() => setGridView(false)}
                  className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                    !gridView ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="List View"
                >
                  <Rows className="size-4" weight={!gridView ? "fill" : "regular"} />
                </button>
              </div>
            </div>

            <div className="relative w-full sm:max-w-64">
              <MagnifyingGlass className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9.5 rounded-xl border bg-background/55 text-xs focus:ring-1 shadow-inner placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        </div>

        {/* Product Display */}
        <div className="min-h-[400px]">
          {isLoading && (
            <div className={gridView ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}>
              {Array.from({ length: 8 }).map((_, index) =>
                gridView ? (
                  <ProductCardSkeleton key={index} />
                ) : (
                  <div key={index} className="h-28 rounded-2xl border bg-muted/40 animate-pulse" />
                )
              )}
            </div>
          )}

          {!isLoading && filteredAndSortedProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-20 border rounded-2xl border-dashed max-w-lg mx-auto mt-6"
            >
              <div className="size-14 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground/60">
                <FolderOpen className="size-6" />
              </div>
              <h3 className="font-semibold text-base text-foreground">No products found</h3>
              <p className="text-xs text-muted-foreground mt-1 px-4 leading-normal max-w-sm">
                We couldn&apos;t find any items matching your selected criteria. Try adjusting the category or search string.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("")
                  setCategory("All")
                }}
                className="mt-5 h-8.5 rounded-xl font-semibold text-xs cursor-pointer border-border hover:bg-muted/40 px-4"
              >
                Reset Filters
              </Button>
            </motion.div>
          )}

          {!isLoading && isError && (
            <div className="flex flex-col items-center justify-center text-center py-20 max-w-lg mx-auto">
              <h3 className="font-semibold text-sm text-foreground">Failed to load</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-normal">
                We couldn&apos;t connect with the products database. Please try refetching the API catalog.
              </p>
              <Button
                onClick={() => refetch()}
                className="mt-4 gap-1 h-8 rounded-xl font-semibold text-xs cursor-pointer"
              >
                <ArrowClockwise className="size-3.5" />
                Retry Fetching
              </Button>
            </div>
          )}

          {/* Grid View */}
          {!isLoading && filteredAndSortedProducts.length > 0 && gridView && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product) => (
                  <motion.div key={product.id} layout variants={fadeInUp} className="flex">
                    <ProductCard
                      product={product}
                      isWishlisted={wishlist.has(product.id)}
                      onWishlistToggle={handleWishlistToggle}
                      onAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* List View */}
          {!isLoading && filteredAndSortedProducts.length > 0 && !gridView && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product) => {
                  const isWishlisted = wishlist.has(product.id)
                  const inStock = product.inventory > 0
                  return (
                    <motion.div key={product.id} layout variants={fadeInUp}>
                      <Link href={`/store/${product.slug}`} className="block">
                        <Card className="flex items-center gap-4 overflow-hidden rounded-2xl border shadow-xs hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
                        <div className="size-24 shrink-0 overflow-hidden bg-muted relative select-none">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                              <FolderOpen className="size-6 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <CardContent className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className="bg-muted hover:bg-muted text-[10px] text-muted-foreground font-semibold px-2 py-0">
                                {product.category}
                              </Badge>
                              <div className="flex items-center gap-1 select-none">
                                <span className={`size-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
                                <span className="text-[9px] text-muted-foreground font-medium">
                                  {inStock ? `${product.inventory} left` : "Out of stock"}
                                </span>
                              </div>
                            </div>
                            <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="text-[11px] text-muted-foreground line-clamp-1 leading-normal max-w-xl">
                                {product.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center sm:justify-end gap-3 shrink-0">
                            <span className="font-bold text-sm md:text-base text-foreground pr-2">
                              ${product.price}
                            </span>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleWishlistToggle(product.id)
                              }}
                              className="text-muted-foreground hover:text-red-500 rounded-lg cursor-pointer"
                            >
                              <Heart
                                className={`size-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                                weight={isWishlisted ? "fill" : "regular"}
                              />
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddToCart(product)
                              }}
                              size="sm"
                              className="h-8.5 px-3.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs gap-1"
                            >
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      </Link>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredAndSortedProducts.length > ITEMS_PER_PAGE && (
          <div className="mt-12 flex items-center justify-between border-t pt-6">
            <div className="text-xs text-muted-foreground font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 rounded-lg text-xs font-semibold cursor-pointer border-border hover:bg-muted/40 gap-1"
              >
                <CaretLeft className="size-3.5" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 rounded-lg text-xs font-semibold cursor-pointer border-border hover:bg-muted/40 gap-1"
              >
                Next
                <CaretRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
