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
  const params = useParams<{ id: string }>()
  const { data: product, isError, isLoading } = useStoreProduct(params.id)

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="grid gap-8 xl:grid-cols-2">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-muted" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl bg-muted"
                />
              ))}
            </div>
          </div>
          <div>
            <div className="h-6 w-20 rounded bg-muted" />
            <div className="mt-4 h-9 w-72 rounded bg-muted" />
            <div className="mt-6 h-10 w-24 rounded bg-muted" />
            <div className="mt-4 h-24 rounded bg-muted" />
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
            <Link href="/store/product">
              <ArrowLeft className="mr-1.5 size-3.5" />
              Back to Products
            </Link>
          }
        />
        <p className="text-sm text-muted-foreground">
          Product could not be loaded.
        </p>
      </div>
    )
  }

  return (
    <div className="py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        render={
          <Link href="/store/product">
            <ArrowLeft className="mr-1.5 size-3.5" />
            Back to Products
          </Link>
        }
      />

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-muted" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="aspect-square rounded-xl bg-muted" />
            ))}
          </div>
        </div>

        <div>
          <Badge variant="secondary" className="mb-3">
            {product.category}
          </Badge>
          <h1 className="font-heading text-2xl font-semibold md:text-3xl">
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
            <span className="text-sm text-muted-foreground">
              {product.inventory} in stock
            </span>
          </div>

          <p className="mt-6 text-3xl font-bold">${product.price}</p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {product.description ?? "No description available."}
          </p>

          <div className="mt-6 flex gap-3">
            <Button size="lg" className="flex-1">
              <ShoppingCart className="mr-2 size-4" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon-lg">
              <Heart className="size-4" />
            </Button>
          </div>

          <div className="mt-6 grid gap-3 rounded-xl border p-4">
            {[
              { icon: Truck, label: "Free shipping on orders over $50" },
              { icon: ShieldCheck, label: "1 year warranty included" },
              { icon: ArrowCounterClockwise, label: "30-day easy returns" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <item.icon className="size-4 text-muted-foreground" />
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
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
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
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="size-1.5 rounded-full bg-primary/10" />
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
                      <span className="font-medium">{spec.value}</span>
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
                      text: "Best desk lamp I've ever owned. The adjustable brightness is perfect for late-night work sessions.",
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
                        <span className="text-sm font-medium">
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
