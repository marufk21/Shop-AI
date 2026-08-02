"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Cube, Star } from "@phosphor-icons/react"

interface PromoCard {
  title: string
  subtitle: string
  cta: string
  href: string
  tag: string
  icon: React.ComponentType<{ className?: string }>
  pattern: "dots" | "lines"
}

const PROMOS: PromoCard[] = [
  {
    title: "Best Sellers",
    subtitle: "The pieces everyone's wearing right now",
    cta: "Shop the list",
    href: "/store/products",
    tag: "Trending",
    icon: Star,
    pattern: "lines",
  },
  {
    title: "Just Dropped",
    subtitle: "The latest styles, added this week",
    cta: "See what's new",
    href: "/store/products",
    tag: "New",
    icon: Cube,
    pattern: "dots",
  },
  
]

function PatternOverlay({ variant }: { variant: "dots" | "lines" }) {
  if (variant === "dots") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1.2px, transparent 1.2px)",
          backgroundSize: "18px 18px",
        }}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 23px, currentColor 23px, currentColor 24px)",
        backgroundSize: "24px 24px",
      }}
    />
  )
}

export function PromoBanners() {
  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {PROMOS.map((promo, i) => {
            const Icon = promo.icon

            return (
              <motion.div
                key={promo.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={promo.href}
                  className="group/banner relative flex h-44 sm:h-60 md:h-72 flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card p-5 sm:p-7 transition-all duration-400 hover:border-border hover:shadow-lg hover:-translate-y-0.5"
                >
                  {/* Texture overlay */}
                  <PatternOverlay variant={promo.pattern} />

                  {/* Soft light accent — top-right corner glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full opacity-[0.04] dark:opacity-[0.06] blur-3xl"
                    style={{
                      background:
                        "radial-gradient(circle, currentColor 0%, transparent 70%)",
                    }}
                  />

                  {/* Top row: tag + decorative element */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-foreground/70">
                      {promo.tag}
                    </span>

                    {/* Small decorative square */}
                    <span
                      aria-hidden="true"
                      className="hidden sm:block size-2.5 rotate-45 rounded-sm border border-border/40 bg-transparent opacity-50"
                    />
                  </div>

                  {/* Middle: heading + subtitle */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 sm:size-11 items-center justify-center rounded-xl bg-foreground/6">
                        <Icon className="size-4.5 sm:size-5 text-foreground/80" />
                      </span>
                      <h3 className="font-heading text-xl sm:text-3xl md:text-4xl font-bold text-foreground leading-none">
                        {promo.title}
                      </h3>
                    </div>

                    <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-snug max-w-md">
                      {promo.subtitle}
                    </p>
                  </div>

                  {/* Bottom: CTA */}
                  <span className="relative z-10 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/60 transition-all duration-300 group-hover/banner:text-foreground group-hover/banner:gap-2.5">
                    {promo.cta}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover/banner:translate-x-0.5" weight="bold" />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
