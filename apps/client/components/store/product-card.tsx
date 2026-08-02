"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Plus } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import type { Product } from "@/types/product"
import { useCartDispatch } from "@/components/store/cart-provider"
import { getProductImageUrl } from "@/lib/image-url"
import { formatCurrency } from "@/lib/format-currency"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
}

export const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { addItem } = useCartDispatch()
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const inStock = product.inventory > 0

  const handleCardClick = () => {
    router.push(`/store/${product.slug}`)
  }

  const categoryLabel = React.useMemo(() => {
    return product.category.split(">")[0]?.trim() ?? product.category
  }, [product.category])

  const formattedPrice = React.useMemo(() => {
    return formatCurrency(product.price)
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
    <div
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleCardClick()
        }
      }}
      role="link"
      tabIndex={0}
      className="block w-full h-full group/card cursor-pointer outline-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 group-hover/card:border-border group-hover/card:shadow-md md:group-hover/card:-translate-y-1"
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

          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute right-2.5 top-2.5 z-10 flex size-7 items-center justify-center rounded-full border border-border/50 bg-white text-muted-foreground shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 sm:right-3 sm:top-3 sm:size-8"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`size-3.5 transition-colors ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`}
              weight={isWishlisted ? "fill" : "regular"}
            />
          </button>

          {/* Quick add */}
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100">
            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full h-9 rounded-lg bg-background text-foreground hover:bg-secondary font-medium text-xs border border-border shadow-md cursor-pointer"
            >
              <Plus className="size-3.5 mr-1.5" />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col p-3 sm:p-3.5">
          <p className="truncate text-[10px] font-normal tracking-wide text-muted-foreground/70">
            {categoryLabel}
          </p>
          <h3 className="mt-0.5 line-clamp-2 font-heading text-[13px] font-medium leading-snug text-foreground sm:text-sm sm:line-clamp-1">
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-1 pt-2.5">
            <span className="min-w-0 truncate text-sm font-semibold text-foreground tabular-nums sm:text-base">
              {formattedPrice}
            </span>
            {inStock && (
              <span className="hidden shrink-0 text-[10px] text-muted-foreground/60 sm:inline">
                In stock
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
})
