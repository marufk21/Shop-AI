"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Heart,
  MagnifyingGlass,
  Rows,
  ShoppingCart,
  SquaresFour,
} from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"

import { useStoreProducts } from "@/hooks/store/use-products"

export default function StoreProductsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("popular")
  const [gridView, setGridView] = useState(true)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const { data, isError, isLoading } = useStoreProducts({
    limit: 100,
    search: search || undefined,
  })
  const products = data?.items ?? []
  const categories = [
    "All",
    ...Array.from(new Set(products.map((product) => product.category))).sort(),
  ]

  const filtered = products
    .filter(
      (p) =>
        (category === "All" || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price
      if (sort === "price-high") return b.price - a.price
      if (sort === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }
      return a.name.localeCompare(b.name)
    })

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold md:text-3xl">
          All Products
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse our curated collection of premium products.
        </p>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="xs"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-8 rounded-lg border border-input bg-transparent px-3 text-xs outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low</option>
            <option value="price-high">Price: High</option>
            <option value="newest">Newest</option>
          </select>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setGridView(true)}
          >
            <SquaresFour className={`size-4 ${gridView ? "" : "opacity-30"}`} />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setGridView(false)}
          >
            <Rows className={`size-4 ${!gridView ? "" : "opacity-30"}`} />
          </Button>
          <div className="relative min-w-0 flex-1 sm:max-w-56">
            <MagnifyingGlass className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9"
            />
          </div>
        </div>
      </div>

      <div
        className={
          gridView
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-3"
        }
      >
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border bg-card transition-colors"
            >
              <div className="aspect-square rounded-t-2xl bg-muted" />
              <div className="p-3.5">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="mt-2 h-4 w-32 rounded bg-muted" />
                <div className="mt-3 h-5 w-20 rounded bg-muted" />
              </div>
            </div>
          ))}
        {!isLoading && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {isError ? "Products could not be loaded." : "No products found."}
          </p>
        )}
        {!isLoading &&
          filtered.map((product) =>
            gridView ? (
              <Link
                key={product.id}
                href={`/store/product/${product.slug}`}
                className="group rounded-2xl border bg-card transition-colors hover:border-primary/30"
              >
                <div className="relative aspect-square rounded-t-2xl bg-muted">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault()
                      setWishlist((prev) => {
                        const next = new Set(prev)
                        if (next.has(product.id)) next.delete(product.id)
                        else next.add(product.id)
                        return next
                      })
                    }}
                  >
                    <Heart
                      className={`size-4 ${
                        wishlist.has(product.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                  </Button>
                </div>
                <div className="p-3.5">
                  <p className="text-xs text-muted-foreground">
                    {product.category}
                  </p>
                  <h3 className="mt-0.5 text-sm font-medium">{product.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold text-primary">
                      ${product.price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {product.inventory} in stock
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <Card
                key={product.id}
                className="flex items-center gap-4 overflow-hidden"
              >
                <div className="size-24 shrink-0 bg-muted" />
                <CardContent className="flex flex-1 items-center justify-between p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {product.category}
                    </p>
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-semibold text-primary">
                        ${product.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {product.inventory} in stock
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon-sm">
                      <Heart className="size-4" />
                    </Button>
                    <Button size="sm">
                      <ShoppingCart className="mr-1.5 size-3.5" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}
      </div>
    </div>
  )
}
