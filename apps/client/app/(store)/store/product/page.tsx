"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  MagnifyingGlass,
  ShoppingCart,
  Heart,
  SquaresFour,
  Rows,
} from "@phosphor-icons/react"

const products = [
  {
    id: 1,
    name: "Minimal Desk Lamp",
    category: "Home",
    price: 89,
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 2,
    name: "Leather Notebook",
    category: "Office",
    price: 34,
    rating: 4.7,
    reviews: 187,
  },
  {
    id: 3,
    name: "Ceramic Mug Set",
    category: "Kitchen",
    price: 52,
    rating: 4.6,
    reviews: 156,
  },
  {
    id: 4,
    name: "Wireless Charger",
    category: "Tech",
    price: 45,
    rating: 4.5,
    reviews: 312,
  },
  {
    id: 5,
    name: "Wool Throw Blanket",
    category: "Home",
    price: 78,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 6,
    name: "Bamboo Desk Organizer",
    category: "Office",
    price: 29,
    rating: 4.3,
    reviews: 145,
  },
  {
    id: 7,
    name: "Scented Candle Trio",
    category: "Home",
    price: 42,
    rating: 4.7,
    reviews: 201,
  },
  {
    id: 8,
    name: "Mechanical Keyboard",
    category: "Tech",
    price: 149,
    rating: 4.9,
    reviews: 423,
  },
  {
    id: 9,
    name: "Linen Apron",
    category: "Kitchen",
    price: 38,
    rating: 4.4,
    reviews: 67,
  },
  {
    id: 10,
    name: "Standing Desk Mat",
    category: "Office",
    price: 65,
    rating: 4.6,
    reviews: 178,
  },
  {
    id: 11,
    name: "Smart Water Bottle",
    category: "Tech",
    price: 35,
    rating: 4.2,
    reviews: 290,
  },
  {
    id: 12,
    name: "Macrame Plant Hanger",
    category: "Home",
    price: 24,
    rating: 4.5,
    reviews: 112,
  },
]

const categories = ["All", "Home", "Office", "Kitchen", "Tech", "Fashion"]

export default function StoreProductsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("popular")
  const [gridView, setGridView] = useState(true)
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())

  const filtered = products
    .filter(
      (p) =>
        (category === "All" || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price
      if (sort === "price-high") return b.price - a.price
      return b.rating - a.rating
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
              <SquaresFour
                className={`size-4 ${gridView ? "" : "opacity-30"}`}
              />
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
          {filtered.map((product) =>
            gridView ? (
              <Link
                key={product.id}
                href={`/store/product/${product.id}`}
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
                      {product.rating} ({product.reviews})
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
                        {product.rating} ({product.reviews})
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
