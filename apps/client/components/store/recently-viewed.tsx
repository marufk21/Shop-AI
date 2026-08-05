"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ClockCounterClockwise } from "@phosphor-icons/react"
import { useRecentlyViewed } from "@/hooks/store/use-recently-viewed"
import { useStoreProducts } from "@/hooks/store/use-products"
import { ProductCard } from "@/components/store/product-card"
import type { Product } from "@/types/product"

export function RecentlyViewed() {
  const prefersReducedMotion = useReducedMotion()

  const { items } = useRecentlyViewed()
  const slugs = React.useMemo(
    () => items.map((item) => item.slug).join(","),
    [items]
  )
  const { data } = useStoreProducts(
    { slugs, limit: 20 },
    slugs.length > 0
  )

  const recentlyViewedProducts = React.useMemo(() => {
    if (!data?.items || items.length === 0) return []
    const productMap = new Map<string, Product>()
    for (const p of data.items) {
      productMap.set(p.slug, p)
    }
    return items
      .map((item) => productMap.get(item.slug))
      .filter((p): p is Product => p != null)
      .slice(0, 6)
  }, [data, items])

  if (recentlyViewedProducts.length === 0) return null

  return (
    <motion.section
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-6 sm:py-8"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 mb-5"
          >
            <ClockCounterClockwise className="size-4 text-muted-foreground" />
            <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
              Recently Viewed
            </h2>
          </motion.div>

          <div className="scrollbar-hide flex gap-4 overflow-x-auto overflow-y-hidden pb-2">
            {recentlyViewedProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-44 sm:w-52 lg:w-56 shrink-0"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
  )
}
