"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useStoreProducts } from "@/hooks/store/use-products"
import { HeroCarousel } from "./hero-carousel"
import { ProductRowSection } from "./product-row-section"
import { HomeSkeleton } from "./home-skeleton"

import { FlashDealsSection } from "./flash-deals-section"
import { OfferCardsStrip } from "./offer-cards-strip"

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
  const { data, isLoading } = useStoreProducts({ limit: 24 })
  const products = React.useMemo(() => data?.items ?? [], [data?.items])

  const newArrivals = React.useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10)
  }, [products])

  const featured = React.useMemo(() => {
    return products.filter((p) => p.status === "active").slice(0, 10)
  }, [products])

  const deals = React.useMemo(() => {
    return [...products]
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .slice(0, 8)
  }, [products])

  if (isLoading) {
    return <HomeSkeleton />
  }

  return (
    <div className="w-full">
      <HeroCarousel />
      <FlashDealsSection products={deals} />
      <OfferCardsStrip />
      <ProductRowSection title="Top Picks for You" products={featured} />
      <ProductRowSection title="Just Launched" products={newArrivals} />
      <RecentlyViewed />
    </div>
  )
}
