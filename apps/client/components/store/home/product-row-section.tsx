import * as React from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "@phosphor-icons/react"
import { ProductCard } from "@/components/store/product-card"
import type { Product } from "@/types/product"
import { cn } from "@workspace/ui/lib/utils"

interface ProductRowSectionProps {
  title: string
  badge?: string
  products: Product[]
  className?: string
  href?: string
}

export function ProductRowSection({
  title,
  products,
  className,
  href = "/store/products",
}: ProductRowSectionProps) {
  const prefersReducedMotion = useReducedMotion()

  if (products.length === 0) return null

  return (
    <section className={cn("py-6 sm:py-8", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between mb-4"
        >
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {title}
          </h2>
          <Link
            href={href}
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            View All
            <ArrowRight className="size-3.5" />
          </Link>
        </motion.div>

        <div className="scrollbar-hide flex gap-4 overflow-x-auto overflow-y-hidden pb-1">
          {products.slice(0, 10).map((product, i) => (
            <motion.div
              key={product.id}
              initial={prefersReducedMotion ? {} : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.35,
                delay: i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-44 sm:w-52 lg:w-56 shrink-0"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
