"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { CreditCard, Bank, Tag, Truck } from "@phosphor-icons/react"

const OFFERS = [
  {
    icon: CreditCard,
    title: "10% Instant Discount",
    desc: "HDFC Bank credit & debit cards",
    accent: "oklch(0.52 0.19 265)",
  },
  {
    icon: Bank,
    title: "No-Cost EMI",
    desc: "From $16/month on orders above $100",
    accent: "oklch(0.52 0.17 180)",
  },
  {
    icon: Tag,
    title: "Extra 5% Cashback",
    desc: "First order with ShopAI Pay",
    accent: "oklch(0.55 0.2 55)",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "On all orders above $50",
    accent: "oklch(0.53 0.2 22)",
  },
] as const

export function OfferCardsStrip() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Bank Offers
            </p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-foreground">
              Ways to save
            </h2>
          </div>
          <span className="text-xs text-muted-foreground/50">T&C Apply</span>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERS.map(({ icon: Icon, title, desc, accent }, i) => (
            <motion.div
              key={title}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.35,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-2xl border border-border/25 bg-card px-6 py-6"
            >
              <span style={{ color: accent }}>
                <Icon className="size-6" />
              </span>

              <p className="mt-5 text-base font-bold text-foreground">
                {title}
              </p>

              <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
