"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowCounterClockwise,
  ArrowLeft,
  Heart,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "@phosphor-icons/react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"

import { useStoreProduct } from "@/hooks/store/use-products"

export default function ProductDetailPage() {
  const [activeTab, setActiveTab] = useState("features")
  const params = useParams<{ slug: string }>()
  const { data: product, isError, isLoading } = useStoreProduct(params.slug)

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="grid gap-8 xl:grid-cols-2">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-muted animate-pulse" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          </div>
          <div>
            <div className="h-6 w-20 rounded-md bg-muted animate-pulse" />
            <div className="mt-4 h-9 w-72 rounded-md bg-muted animate-pulse" />
            <div className="mt-6 h-10 w-24 rounded-md bg-muted animate-pulse" />
            <div className="mt-4 h-24 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="py-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          render={
            <Link href="/store">
              <ArrowLeft className="mr-1.5 size-3.5" />
              Back to Store
            </Link>
          }
        />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-14 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground/60">
            <ShoppingCart className="size-6" />
          </div>
          <h3 className="font-semibold text-base text-foreground">Product not found</h3>
          <p className="text-xs text-muted-foreground mt-1 px-4 leading-normal max-w-sm">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  const inStock = product.inventory > 0

  return (
    <div className="py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        render={
          <Link href="/store">
            <ArrowLeft className="mr-1.5 size-3.5" />
            Back to Store
          </Link>
        }
      />

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted border">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingCart className="size-16 text-muted-foreground/30" />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="font-semibold capitalize">
              {product.category}
            </Badge>
            <div className="flex items-center gap-1.5 select-none">
              <span className={`size-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {inStock ? `${product.inventory} in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          <h1 className="font-heading text-2xl font-semibold md:text-3xl text-foreground">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">5.0 (2 reviews)</span>
          </div>

          <p className="mt-6 text-3xl font-bold text-foreground">
            ${product.price}
          </p>

          {product.description && (
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <Button size="lg" className="flex-1 rounded-xl font-semibold" disabled={!inStock}>
              <ShoppingCart className="mr-2 size-4" />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button variant="outline" size="icon-lg" className="rounded-xl">
              <Heart className="size-4" />
            </Button>
          </div>

          <div className="mt-6 grid gap-3 rounded-xl border p-4">
            {[
              { icon: Truck, label: "Free shipping on orders over $50" },
              { icon: ShieldCheck, label: "1 year warranty included" },
              { icon: ArrowCounterClockwise, label: "30-day easy returns" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <Separator className="mt-6" />

          <div className="mt-6">
            <div className="flex gap-1 rounded-lg border p-1">
              {["features", "specs", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {activeTab === "features" && (
                <ul className="space-y-2">
                  {[
                    `${product.inventory} units available`,
                    `${product.status} product`,
                    `Category: ${product.category}`,
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="size-1.5 rounded-full bg-primary/40 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === "specs" && (
                <div className="space-y-2 text-sm">
                  {[
                    { label: "SKU", value: product.slug },
                    { label: "Category", value: product.category },
                    { label: "Status", value: product.status },
                    { label: "Inventory", value: String(product.inventory) },
                    {
                      label: "Updated",
                      value: new Date(product.updated_at).toLocaleDateString(),
                    },
                  ].map((spec) => (
                    <div key={spec.label} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {spec.label}
                      </span>
                      <span className="font-medium text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {[
                    {
                      author: "Alex M.",
                      rating: 5,
                      text: "Best purchase I've made this year. The quality exceeded my expectations and the delivery was fast.",
                      date: "2 weeks ago",
                    },
                    {
                      author: "Jamie L.",
                      rating: 4,
                      text: "Great design and build quality. Would love to see more color options in the future.",
                      date: "1 month ago",
                    },
                  ].map((review) => (
                    <div key={review.author} className="rounded-xl border p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {review.author}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {review.date}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
