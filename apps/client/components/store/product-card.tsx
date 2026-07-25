"use client"

import * as React from "react"
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
          className="relative flex flex-col h-full rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 group-hover/card:shadow-xl group-hover/card:shadow-foreground/5 group-hover/card:border-border group-hover/card:-translate-y-1"
        >
          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden bg-white">
            {product.image_url ? (
              <img
                src={getProductImageUrl(product.image_url, "thumbnail")}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-500 group-hover/card:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/10">
                <ShoppingBag className="size-12 text-muted-foreground/15" />
              </div>
            )}

            {/* Badge */}
            {badge === "hot" && (
              <span className="absolute top-3 left-3 inline-flex items-center rounded-lg bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                Hot Deal
              </span>
            )}
            {badge === "ai" && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-lg bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                <Sparkle className="size-2.5" weight="fill" />
                AI Pick
              </span>
            )}

            {/* Wishlist button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer z-10"
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
                className="w-full h-9 rounded-xl bg-white text-black hover:bg-gray-50 font-semibold text-xs border border-gray-200 shadow-lg cursor-pointer"
              >
                <Plus className="size-3.5 mr-1.5" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col flex-1 p-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {product.category.split(">")[0]?.trim() ?? product.category}
            </p>
            <h3 className="font-heading text-[13px] font-semibold text-foreground line-clamp-1 leading-tight mt-0.5">
              {product.name}
            </h3>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500 px-1.5 py-px text-[10px] font-bold text-white leading-none">
                4.2 <Star className="size-2.5" weight="fill" />
              </span>
              <span className="text-[10px] text-muted-foreground">(234)</span>
            </div>

            <div className="mt-auto pt-2">
              <span className="text-base font-bold text-foreground tabular-nums">
                {formattedPrice}
              </span>
              <p className="text-[10px] font-medium text-emerald-600 mt-px">Free delivery</p>
            </div>
          </div>
        </motion.div>
      </Link>
  )
}
