"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Plus } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import type { Product } from "@/types/product"
import { useCart } from "@/components/store/cart-provider"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const inStock = product.inventory > 0

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
    toast.info(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist"
    )
  }

  return (
    <Link
      href={`/store/${product.slug}`}
      className="block w-full h-full group"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4 }}
        className="relative flex flex-col h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-foreground/5 group-hover:border-border"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/50">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="size-10 text-muted-foreground/25" />
            </div>
          )}

          {/* Top-right wishlist */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border/40 text-muted-foreground hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/40 transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100 shadow-sm"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`size-4 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
              weight={isWishlisted ? "fill" : "regular"}
            />
          </button>

          {/* Quick add button - bottom overlay on hover */}
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full h-9 rounded-xl bg-background/90 hover:bg-background text-foreground font-semibold text-xs border border-border/60 shadow-lg backdrop-blur-sm cursor-pointer"
            >
              <Plus className="size-3.5 mr-1.5" />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1 p-4">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </p>
          <h3 className="font-heading text-sm font-semibold text-foreground line-clamp-1 leading-snug">
            {product.name}
          </h3>

          <div className="mt-auto pt-3 flex items-end justify-between">
            <span className="text-base font-bold text-foreground tabular-nums">
              {formattedPrice}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`size-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`}
              />
              <span className="text-[11px] font-medium text-muted-foreground">
                {inStock ? "In stock" : "Sold out"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
