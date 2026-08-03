"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  ShoppingBagOpen,
  TShirt,
  DeviceMobile,
  House,
  Heartbeat,
  GameController,
  BookOpen,
  Sparkle,
  ShieldCheck,
  Truck,
  Users,
} from "@phosphor-icons/react"
import { useStoreCategories } from "@/hooks/store/use-products"

// ---------------------------------------------------------------------------
// Icon resolver — matches category names to relevant Phosphor icons
// ---------------------------------------------------------------------------
const CATEGORY_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  electronic: DeviceMobile,
  gadget: DeviceMobile,
  phone: DeviceMobile,
  cloth: TShirt,
  fashion: TShirt,
  apparel: TShirt,
  home: House,
  furniture: House,
  decor: House,
  health: Heartbeat,
  beauty: Heartbeat,
  wellness: Heartbeat,
  gaming: GameController,
  game: GameController,
  book: BookOpen,
  accessor: Sparkle,
  jewel: Sparkle,
}

function resolveIcon(
  name: string,
): React.ComponentType<{ className?: string }> {
  const lower = name.toLowerCase()
  for (const [key, icon] of Object.entries(CATEGORY_ICON_MAP)) {
    if (lower.includes(key)) return icon
  }
  return ShoppingBagOpen
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Authentic Products" },
  { icon: Truck, label: "Free Shipping" },
  { icon: Users, label: "50K+ Customers" },
] as const

const MARQUEE_SPEED_S = 30

// ---------------------------------------------------------------------------
// Brand card
// ---------------------------------------------------------------------------
function BrandCard({ name }: { name: string }) {
  const Icon = resolveIcon(name)

  return (
    <Link
      href={`/store/category/${encodeURIComponent(name.toLowerCase())}`}
      className="group/card relative flex shrink-0 select-none items-center gap-3 rounded-2xl border border-border/20 bg-card/60 px-5 py-3.5 backdrop-blur-sm transition-all duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:border-border/50 hover:bg-card hover:shadow-lg min-w-37.5 sm:min-w-42.5"
    >
      {/* Icon */}
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 transition-colors duration-300 group-hover/card:bg-primary/10">
        <Icon className="size-4.5 text-foreground/55 transition-colors duration-300 group-hover/card:text-primary" />
      </span>

      {/* Label */}
      <span className="text-sm font-semibold text-foreground/65 transition-colors duration-300 group-hover/card:text-foreground">
        {name}
      </span>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function BrandMarquee() {
  const { data: categories = [] } = useStoreCategories()
  const prefersReducedMotion = useReducedMotion()

  const displayCategories = React.useMemo(
    () => categories.slice(0, 10),
    [categories],
  )

  const doubled = React.useMemo(
    () => [...displayCategories, ...displayCategories],
    [displayCategories],
  )

  if (displayCategories.length === 0) return null

  return (
    <section
      className="relative overflow-hidden py-14 sm:py-20"
      aria-labelledby="brand-marquee-heading"
    >
      {/* Subtle radial glow behind the section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, oklch(0.48 0.2 265 / 0.035), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ---- Header ---- */}
        <motion.header
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2
            id="brand-marquee-heading"
            className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Trusted by Top Brands
          </h2>
          <p className="mx-auto mt-2.5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Premium quality products from the brands you know and love
          </p>
        </motion.header>

        {/* ---- Marquee track ---- */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="group/marquee relative mt-10 sm:mt-12"
          role="marquee"
          aria-label="Featured brands"
        >
          {/* Edge fades — mask the cards as they scroll out of view */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-linear-to-r from-background to-transparent sm:w-24"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-linear-to-r from-transparent to-background sm:w-24"
          />

          {/* Overflow container — scrollable fallback when motion is reduced */}
          <div
            className={
              prefersReducedMotion
                ? "overflow-x-auto scrollbar-hide"
                : "overflow-hidden"
            }
          >
            <div
              className="flex gap-4"
              style={{
                width: prefersReducedMotion ? "auto" : "max-content",
                animation: prefersReducedMotion
                  ? "none"
                  : `marquee ${MARQUEE_SPEED_S}s linear infinite`,
              }}
              onMouseEnter={(e) => {
                if (prefersReducedMotion) return
                ;(e.currentTarget as HTMLElement).style.animationPlayState =
                  "paused"
              }}
              onMouseLeave={(e) => {
                if (prefersReducedMotion) return
                ;(e.currentTarget as HTMLElement).style.animationPlayState =
                  "running"
              }}
            >
              {doubled.map(({ name }, i) => (
                <BrandCard key={`${name}-${i}`} name={name} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ---- Trust indicators ---- */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
        >
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-border/25 bg-card/50 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm sm:text-sm"
            >
              <Icon className="size-3.5 shrink-0 text-foreground/40 sm:size-4" />
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
