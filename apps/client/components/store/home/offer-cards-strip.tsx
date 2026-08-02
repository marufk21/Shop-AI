"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { CreditCard, Bank, Tag, Truck } from "@phosphor-icons/react"

const OFFERS = [
  {
    icon: CreditCard,
    title: "10% Instant Discount",
    desc: "With HDFC Bank credit & debit cards",
    color: "border-l-foreground",
    bg: "bg-muted/50 dark:bg-muted/20",
  },
  {
    icon: Bank,
    title: "No-Cost EMI",
    desc: "Starting at $16/month on orders above $100",
    color: "border-l-foreground/70",
    bg: "bg-muted/30 dark:bg-muted/10",
  },
  {
    icon: Tag,
    title: "Extra 5% Cashback",
    desc: "On your first order with ShopAI Pay",
    color: "border-l-foreground/50",
    bg: "bg-muted/20 dark:bg-muted/5",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "On all orders above $50",
    color: "border-l-foreground/30",
    bg: "bg-muted/10 dark:bg-transparent",
  },
]

export function OfferCardsStrip() {
  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-2 mb-4"
        >
          <CreditCard className="size-3.5 text-muted-foreground" weight="fill" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Bank Offers
          </p>
          <span className="text-[10px] text-muted-foreground/75 ml-auto">T&C Apply</span>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {OFFERS.map((offer, i) => {
            const Icon = offer.icon
            return (
              <motion.div
                key={offer.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`rounded-xl border border-border/60 border-l-4 ${offer.color} ${offer.bg} p-4`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="size-5 shrink-0 text-foreground/70 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">{offer.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      {offer.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
