"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Lightning } from "@phosphor-icons/react"
import { ProductCard } from "@/components/store/product-card"
import type { Product } from "@/types/product"

function useCountdown() {
  const [timeLeft, setTimeLeft] = React.useState("")
  React.useEffect(() => {
    const calc = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight.getTime() - now.getTime()
      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`)
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [])
  return timeLeft
}

export function FlashDealsSection({ products }: { products: Product[] }) {
  const timeLeft = useCountdown()

  if (products.length === 0) return null

  const dealsProducts = products.slice(0, 8)

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/10">
              <Lightning className="size-4.5 text-rose-500" weight="fill" />
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                Deals of the Day
              </h2>
              <span className="text-sm font-bold text-rose-500 tabular-nums tracking-wider">
                {timeLeft || "00:00:00"}
              </span>
            </div>
          </div>
        </div>

        <div className="scrollbar-hide flex gap-4 overflow-x-auto overflow-y-hidden pb-1">
          {dealsProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
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
