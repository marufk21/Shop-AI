"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingBag } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  isWishlisted?: boolean
  onWishlistToggle?: (productId: string, event: React.MouseEvent) => void
  onAddToCart?: (product: Product, event: React.MouseEvent) => void
}

export function ProductCard({
  product,
  isWishlisted = false,
  onWishlistToggle,
  onAddToCart,
}: ProductCardProps) {
  const formattedPrice = React.useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(product.price)
  }, [product.price])

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onWishlistToggle?.(product.id, e)
  }

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(product, e)
  }

  const inStock = product.inventory > 0

  return (
    <Link
      href={`/store/${product.slug}`}
      className="block w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -5 }}
        className="group relative rounded-2xl border bg-card flex flex-col overflow-hidden shadow-xs hover:shadow-md hover:border-primary/20 transition-all duration-300 w-full"
      >
      {/* Product Image Wrapper */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted select-none">
        {product.image_url ? (
          <motion.img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <ShoppingBag className="size-10 text-muted-foreground/40" />
          </div>
        )}

        {/* Top Actions: Wishlist & Category Badges */}
        <div className="absolute inset-x-2 top-2 flex items-center justify-between pointer-events-none">
          <Badge className="bg-background/80 hover:bg-background/90 text-foreground font-semibold px-2 py-0.5 text-[10px] backdrop-blur-xs border-border/40 capitalize shadow-xs">
            {product.category}
          </Badge>

          <button
            onClick={handleWishlistClick}
            className="pointer-events-auto size-7.5 rounded-full bg-background/85 backdrop-blur-xs border border-border/40 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:scale-105 transition-all duration-200 shadow-xs cursor-pointer"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`size-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
              weight={isWishlisted ? "fill" : "regular"}
            />
          </button>
        </div>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out flex gap-2">
          <Button
            onClick={handleCartClick}
            className="w-full h-8.5 rounded-lg bg-background/90 hover:bg-background text-foreground font-semibold text-xs border border-border shadow-md backdrop-blur-xs hover:border-primary/20 gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="size-3.5 text-primary" weight="fill" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-xs/tight md:text-sm/tight text-foreground line-clamp-1">
          {product.name}
        </h3>

        <div className="mt-3 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-sm md:text-base text-foreground">
              {formattedPrice}
            </span>
          </div>

          {/* Stock status indicator */}
          <div className="flex items-center gap-1.5 select-none">
            <span className={`size-1.5 rounded-full ${inStock ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
            <span className="text-[10px] font-medium text-muted-foreground">
              {inStock ? `${product.inventory} left` : "Out of stock"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
    </Link>
  )
}
