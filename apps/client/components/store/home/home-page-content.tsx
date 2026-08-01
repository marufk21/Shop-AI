"use client"

import * as React from "react"
import { useStoreProducts } from "@/hooks/store/use-products"
import { HeroCarousel } from "./hero-carousel"
import { FlashDealsSection } from "./flash-deals-section"
import { OfferCardsStrip } from "./offer-cards-strip"
import { ProductRowSection } from "./product-row-section"
import { RecentlyViewed } from "@/components/store/recently-viewed"

export function HomePageContent() {
  const { data } = useStoreProducts({ limit: 10000 })
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
