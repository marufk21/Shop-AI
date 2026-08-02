"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Storefront, ShieldCheck, Truck, Users } from "@phosphor-icons/react"

interface Brand {
  name: string
  bgClass: string
  textClass: string
}

const BRANDS: Brand[] = [
  { name: "Nike", bgClass: "bg-zinc-900 dark:bg-zinc-100", textClass: "text-zinc-100 dark:text-zinc-900" },
  { name: "Apple", bgClass: "bg-zinc-800 dark:bg-zinc-200", textClass: "text-zinc-100 dark:text-zinc-900" },
  { name: "Samsung", bgClass: "bg-blue-600 dark:bg-blue-500", textClass: "text-white" },
  { name: "Sony", bgClass: "bg-zinc-900 dark:bg-zinc-100", textClass: "text-zinc-100 dark:text-zinc-900" },
  { name: "Adidas", bgClass: "bg-zinc-100 dark:bg-zinc-800", textClass: "text-zinc-900 dark:text-zinc-100" },
  { name: "Puma", bgClass: "bg-zinc-800 dark:bg-zinc-200", textClass: "text-zinc-100 dark:text-zinc-900" },
  { name: "Zara", bgClass: "bg-zinc-900 dark:bg-zinc-100", textClass: "text-zinc-100 dark:text-zinc-900" },
  { name: "H&M", bgClass: "bg-red-600 dark:bg-red-500", textClass: "text-white" },
  { name: "Levi's", bgClass: "bg-blue-700 dark:bg-blue-400", textClass: "text-white dark:text-blue-950" },
  { name: "Ray-Ban", bgClass: "bg-emerald-700 dark:bg-emerald-600", textClass: "text-white" },
]

export function BrandMarquee() {
  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 mb-4"
        >
          <Storefront className="size-4 text-muted-foreground" />
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            Top Brands
          </h2>
        </motion.div>
      </div>

      {/* Marquee container */}
      <div className="relative mx-auto max-w-7xl overflow-hidden group/marquee">
        {/* Left gradient mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-background to-transparent" />

        {/* Right gradient mask */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-background to-transparent" />

        {/* Scrolling track */}
        <div className="flex animate-marquee gap-4 sm:gap-5 px-4 sm:px-6 group-hover/marquee:[animation-play-state:paused]">
          {/* First set */}
          {BRANDS.map((brand) => (
            <BrandChip key={brand.name} brand={brand} />
          ))}
          {/* Duplicate for seamless loop */}
          {BRANDS.map((brand) => (
            <BrandChip key={`dup-${brand.name}`} brand={brand} />
          ))}
        </div>
      </div>

      {/* Trust indicators row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 mt-5 flex items-center justify-center gap-6 sm:gap-10 flex-wrap"
      >
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          <span>Authentic Products</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Truck className="size-3.5" />
          <span>Free Shipping Over $50</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3.5" />
          <span>50K+ Happy Customers</span>
        </div>
      </motion.div>
    </section>
  )
}

function BrandChip({ brand }: { brand: Brand }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl border border-border/40 px-5 py-3 sm:px-6 sm:py-4 min-w-[100px] sm:min-w-[120px] ${brand.bgClass} transition-all duration-300 hover:scale-105 hover:shadow-md`}
    >
      <span
        className={`text-xs sm:text-sm font-bold tracking-wide ${brand.textClass}`}
      >
        {brand.name}
      </span>
    </div>
  )
}
