"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useStoreProducts } from "@/hooks/store/use-products"
import { ProductCard } from "@/components/store/product-card"

function parseMasterCategory(category: string): string {
  const parts = category.split(">").map((s) => s.trim())
  return parts[0] ?? category
}

interface RelatedProductsProps {
  category: string
  currentSlug: string
}

export function RelatedProducts({ category, currentSlug }: RelatedProductsProps) {
  const { data } = useStoreProducts({ limit: 10000 })
  const masterCategory = parseMasterCategory(category)

  const related = React.useMemo(() => {
    if (!data?.items) return []
    return data.items
      .filter((p) => {
        const pMaster = parseMasterCategory(p.category)
        return pMaster === masterCategory && p.slug !== currentSlug
      })
      .slice(0, 6)
  }, [data?.items, masterCategory, currentSlug])

  if (related.length === 0) return null

  return (
    <section className="mt-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground mb-6">
          You Might Also Like
        </h2>
      </motion.div>

      <div className="scrollbar-hide flex gap-4 overflow-x-auto overflow-y-hidden pb-2">
        {related.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.35,
              delay: Math.min(i * 0.05, 0.3),
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-44 sm:w-52 lg:w-56 shrink-0"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
