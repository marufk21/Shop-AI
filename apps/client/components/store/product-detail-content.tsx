"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  ArrowCounterClockwise,
  Package,
} from "@phosphor-icons/react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"

import { useStoreProduct } from "@/hooks/store/use-products"
import { useCart } from "@/components/store/cart-provider"
import { getProductImageUrl } from "@/lib/image-url"
import { toast } from "sonner"

interface ProductDetailContentProps {
  slug: string
}

export function ProductDetailContent({ slug }: ProductDetailContentProps) {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("features")
  const { data: product, isError, isLoading } = useStoreProduct(slug)
  const { addItem } = useCart()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square rounded-3xl bg-muted animate-pulse" />
          <div className="space-y-4">
            <div className="h-5 w-20 rounded-lg bg-muted animate-pulse" />
            <div className="h-10 w-80 rounded-lg bg-muted animate-pulse" />
            <div className="h-8 w-24 rounded-lg bg-muted animate-pulse" />
            <div className="h-20 rounded-xl bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Button
          variant="ghost"
          size="sm"
          className="mb-8 rounded-xl"
          render={
            <Link href="/store">
              <ArrowLeft className="mr-1.5 size-4" />
              Back to Store
            </Link>
          }
        />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-5 text-muted-foreground/40">
            <Package className="size-7" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Product not found
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button className="mt-6 rounded-xl font-semibold" render={<Link href="/store">Back to Store</Link>} />
        </div>
      </div>
    )
  }

  const inStock = product.inventory > 0

  const handleAddToCart = () => {
    if (!inStock) return
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      slug: product.slug,
      quantity,
    })
    toast.success(`${product.name} added to cart`)
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-8 rounded-xl text-muted-foreground hover:text-foreground"
        render={
          <Link href="/store">
            <ArrowLeft className="mr-1.5 size-4" />
            Back to Store
          </Link>
        }
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="aspect-square overflow-hidden rounded-3xl bg-muted border border-border/60">
            {product.image_url ? (
              <img
                src={getProductImageUrl(product.image_url, "detail")}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="size-20 text-muted-foreground/20" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Category & Status */}
          <div className="flex items-center gap-3 mb-4">
            <Badge
              variant="secondary"
              className="h-7 px-3 rounded-full text-[11px] font-semibold capitalize"
            >
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Badge>
            <div className="flex items-center gap-1.5">
              <span
                className={`size-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`}
              />
              <span className="text-xs font-medium text-muted-foreground">
                {inStock
                  ? `${product.inventory} in stock`
                  : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Name */}
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-4.5 fill-amber-400 text-amber-400"
                  weight="fill"
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              5.0 (24 reviews)
            </span>
          </div>

          {/* Price */}
          <p className="mt-6 text-4xl font-bold text-foreground tabular-nums tracking-tight">
            ${product.price.toFixed(2)}
          </p>

          {/* Description */}
          {product.description && (
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
              {product.description}
            </p>
          )}

          {/* Quantity + Add to Cart */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quantity
              </span>
              <div className="flex items-center gap-0.5 rounded-xl border bg-muted/30 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex size-9 items-center justify-center rounded-lg hover:bg-background transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="flex size-9 items-center justify-center text-sm font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.inventory, q + 1))
                  }
                  disabled={quantity >= product.inventory}
                  className="flex size-9 items-center justify-center rounded-lg hover:bg-background transition-colors cursor-pointer disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 h-12 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 cursor-pointer"
              >
                <ShoppingCart className="mr-2 size-4.5" weight="fill" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button
                variant="outline"
                size="icon-lg"
                className="h-12 w-12 rounded-xl cursor-pointer"
              >
                <Heart className="size-5" />
              </Button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid gap-3 rounded-2xl border border-border/60 bg-card p-5">
            {[
              {
                icon: Truck,
                title: "Free shipping",
                desc: "On orders over $50",
              },
              {
                icon: ShieldCheck,
                title: "1 year warranty",
                desc: "Full coverage included",
              },
              {
                icon: ArrowCounterClockwise,
                title: "30-day returns",
                desc: "Hassle-free exchanges",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3"
              >
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <item.icon className="size-4.5" weight="fill" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="mt-8" />

          {/* Tabs */}
          <div className="mt-8">
            <div className="flex gap-1 rounded-xl border bg-muted/30 p-1">
              {[
                { key: "features", label: "Features" },
                { key: "specs", label: "Specifications" },
                { key: "reviews", label: "Reviews" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-background text-foreground shadow-sm border border-border/60"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {activeTab === "features" && (
                <ul className="space-y-3">
                  {[
                    `${product.inventory} units available in stock`,
                    `${product.status === "active" ? "Active and available" : product.status} product`,
                    `Category: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}`,
                    "Premium quality guaranteed",
                    "24/7 customer support included",
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <div className="size-1.5 rounded-full bg-primary/50 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === "specs" && (
                <div className="space-y-3">
                  {[
                    { label: "SKU", value: product.slug },
                    { label: "Category", value: product.category.charAt(0).toUpperCase() + product.category.slice(1) },
                    { label: "Status", value: product.status },
                    {
                      label: "Inventory",
                      value: String(product.inventory),
                    },
                    {
                      label: "Last Updated",
                      value: new Date(
                        product.updated_at
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }),
                    },
                  ].map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between py-2 px-4 rounded-xl bg-muted/20"
                    >
                      <span className="text-xs text-muted-foreground font-medium">
                        {spec.label}
                      </span>
                      <span className="text-xs font-semibold text-foreground capitalize">
                        {spec.value}
                      </span>
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
                      text: "Exceptional quality. The product exceeded my expectations and delivery was incredibly fast. Highly recommend!",
                      date: "2 weeks ago",
                    },
                    {
                      author: "Jamie L.",
                      rating: 5,
                      text: "Beautiful design and build quality. The attention to detail is remarkable. Will definitely purchase again.",
                      date: "1 month ago",
                    },
                    {
                      author: "Sam K.",
                      rating: 4,
                      text: "Great product overall. Would love to see more color options in the future, but the quality is undeniable.",
                      date: "2 months ago",
                    },
                  ].map((review) => (
                    <div
                      key={review.author}
                      className="rounded-2xl border border-border/60 bg-card p-5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          {review.author}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {review.date}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3.5 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                            weight={i < review.rating ? "fill" : "regular"}
                          />
                        ))}
                      </div>
                      <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
