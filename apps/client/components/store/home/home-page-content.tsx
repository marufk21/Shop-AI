"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useStoreProducts } from "@/hooks/store/use-products"
import { HeroCarousel } from "./hero-carousel"
import { FlashDealsSection } from "./flash-deals-section"
import { OfferCardsStrip } from "./offer-cards-strip"
import { BrandMarquee } from "./brand-marquee"
import { ProductRowSection } from "./product-row-section"
import { PromoBanners } from "./promo-banners"
import { HomeSkeleton } from "./home-skeleton"
import type { Product } from "@/types/product"

function shuffleSlice(
  products: Product[],
  start: number,
  count: number
): Product[] {
  const shuffled = [...products]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    if (!temp) continue
    const other = shuffled[j]
    if (!other) continue
    shuffled[i] = other
    shuffled[j] = temp
  }
  return shuffled.slice(start, start + count)
}

const RecentlyViewed = dynamic(
  () =>
    import("@/components/store/recently-viewed").then((mod) => ({
      default: mod.RecentlyViewed,
    })),
  {
    ssr: false,
    loading: () => <RecentlyViewedSkeleton />,
  }
)

function RecentlyViewedSkeleton() {
  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="size-4 rounded bg-muted" />
          <div className="h-6 w-36 rounded-lg bg-muted" />
        </div>
        <div className="scrollbar-hide flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-44 sm:w-52 lg:w-56 shrink-0 rounded-xl border border-border/50 bg-card"
            >
              <div className="aspect-square w-full rounded-t-xl bg-muted" />
              <div className="space-y-2 p-2.5 sm:p-3">
                <div className="h-3 w-16 rounded-md bg-muted" />
                <div className="h-4 w-full rounded-md bg-muted" />
                <div className="flex items-center justify-between pt-1">
                  <div className="h-5 w-14 rounded-md bg-muted" />
                  <div className="h-3 w-10 rounded-md bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomePageContent() {
  const { data, isLoading } = useStoreProducts({ limit: 50 })
  const products = React.useMemo(
    () => (data?.items ?? []).filter((p) => p.status === "active"),
    [data?.items]
  )

  const newArrivals = React.useMemo(() => {
    return shuffleSlice(products, 0, 10)
  }, [products])

  const featured = React.useMemo(() => {
    return shuffleSlice(products, 10, 10)
  }, [products])

  const deals = React.useMemo(() => {
    return shuffleSlice(products, 20, 8)
  }, [products])

  if (isLoading) {
    return <HomeSkeleton />
  }

  return (
    <div className="w-full">
      <HeroCarousel />
      <FlashDealsSection products={deals} />
      <BrandMarquee />
      <ProductRowSection title="Top Picks for You" products={featured} />
      <PromoBanners />
      <ProductRowSection title="Just Launched" products={newArrivals} />
      <OfferCardsStrip />
      <RecentlyViewed />
    </div>
  )
}
