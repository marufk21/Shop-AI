"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Plus, Star, Sparkle } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import type { Product } from "@/types/product"
import { useCart } from "@/components/store/cart-provider"
import { getProductImageUrl } from "@/lib/image-url"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const inStock = product.inventory > 0

  const badge = React.useMemo(() => {
    const charSum = product.name.split("").reduce((s, c) => s + c.charCodeAt(0), 0)
    const mod = charSum % 7
    if (mod === 0) return "hot" as const
    if (mod === 1) return "ai" as const
    return null
  }, [product.name])

  const formattedPrice = React.useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(product.price)
  }, [product.price])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      slug: product.slug,
      quantity: 1,
    })
    toast.success(`${product.name} added to cart`)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted((prev) => !prev)
    toast.info(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
  }

  return (
    <Link
        href={`/store/${product.slug}`}
        className="block w-full h-full group/card"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-full flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-all duration-300 group-hover/card:border-border group-hover/card:shadow-xl group-hover/card:shadow-foreground/5 md:group-hover/card:-translate-y-1"
        >
          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden bg-white">
            {product.image_url ? (
              <Image
                src={getProductImageUrl(product.image_url, "thumbnail")!}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain p-3 transition-transform duration-500 sm:p-5 md:group-hover/card:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/10">
                <ShoppingBag className="size-12 text-muted-foreground/15" />
              </div>
            )}

            {/* Badge */}
            {badge === "hot" && (
              <span className="absolute left-2 top-2 inline-flex items-center rounded-md bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm sm:left-3 sm:top-3 sm:rounded-lg sm:px-2 sm:text-[10px]">
                Hot Deal
              </span>
            )}
            {badge === "ai" && (
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground shadow-sm sm:left-3 sm:top-3 sm:rounded-lg sm:px-2 sm:text-[10px]">
                <Sparkle className="size-2.5" weight="fill" />
                AI Pick
              </span>
            )}

            {/* Wishlist button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 sm:right-3 sm:top-3 sm:size-8"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`size-3.5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                weight={isWishlisted ? "fill" : "regular"}
              />
            </button>

            {/* Quick add */}
            <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300 ease-out">
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full h-9 rounded-xl bg-background text-foreground hover:bg-secondary font-semibold text-xs border border-border shadow-lg cursor-pointer"
              >
                <Plus className="size-3.5 mr-1.5" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col p-2.5 sm:p-3">
            <p className="truncate text-[9px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[10px]">
              {product.category.split(">")[0]?.trim() ?? product.category}
            </p>
            <h3 className="mt-0.5 line-clamp-2 min-h-[2.25rem] font-heading text-[12px] font-semibold leading-tight text-foreground sm:min-h-0 sm:text-[13px] sm:line-clamp-1">
              {product.name}
            </h3>

            <div className="mt-1 flex items-center gap-1">
              <span className="inline-flex items-center gap-0.5 rounded bg-primary px-1.5 py-px text-[10px] font-bold text-primary-foreground leading-none">
                4.2 <Star className="size-2.5" weight="fill" />
              </span>
              <span className="truncate text-[9px] text-muted-foreground sm:text-[10px]">(234)</span>
            </div>

            <div className="mt-auto flex items-end justify-between gap-1 pt-2">
              <span className="min-w-0 truncate text-sm font-bold text-foreground tabular-nums sm:text-base">
                {formattedPrice}
              </span>
              <span className="hidden text-[10px] font-medium text-muted-foreground sm:inline">Free delivery</span>
            </div>
          </div>
        </motion.div>
      </Link>
  )
}
