"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Sparkle } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@workspace/ui/components/carousel"

const SLIDES = [
  {
    badge: "Summer Sale 2026",
    title: "Up to 60% Off",
    subtitle: "Premium fashion, electronics & more",
    cta: "Shop the Sale",
    href: "/store/products",
    gradient: "from-rose-500/10 via-amber-500/5 to-background",
  },
  {
    badge: "New Arrivals",
    title: "Just Dropped",
    subtitle: "Fresh styles curated by AI for you",
    cta: "Explore New",
    href: "/store/products",
    gradient: "from-sky-500/10 via-violet-500/5 to-background",
  },
]

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => { api.off("select", onSelect) }
  }, [api])

  React.useEffect(() => {
    if (!api) return
    const timer = setInterval(() => api.scrollNext(), 5000)
    return () => clearInterval(timer)
  }, [api])

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 sm:pt-6">
      <Carousel opts={{ loop: true }} className="w-full rounded-3xl overflow-hidden relative" setApi={setApi}>
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.title}>
              <div className={`relative bg-linear-to-br ${slide.gradient}`}>
                <div className="px-8 sm:px-12 py-12 sm:py-16">
                  <div className="relative z-10 max-w-lg">
                  <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 backdrop-blur-sm px-3 py-0.5 text-xs font-semibold text-muted-foreground mb-5">
                    <Sparkle className="size-3 text-primary" weight="fill" />
                    {slide.badge}
                  </span>

                  <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mt-3 text-base sm:text-lg text-muted-foreground">
                    {slide.subtitle}
                  </p>

                  <Button
                    size="lg"
                    className="mt-8 h-12 px-6 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 cursor-pointer"
                    render={
                      <Link href={slide.href}>
                        {slide.cta}
                        <ArrowRight className="ml-1.5 size-4" />
                      </Link>
                    }
                  />
                </div>
              </div>

              {/* Right side decorative */}
              <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block pointer-events-none">
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 size-72 rounded-full bg-linear-to-br from-primary/20 to-transparent blur-2xl" />
                <div className="absolute right-20 top-1/2 -translate-y-1/2 size-48 rounded-full bg-linear-to-br from-secondary/20 to-transparent blur-xl" />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation */}
      <div className="absolute bottom-6 left-0 right-0">
        <div className="px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === current
                    ? "bg-foreground w-6 h-2"
                    : "bg-foreground/20 hover:bg-foreground/30 w-2 h-2"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => api?.scrollPrev()}
              className="flex size-9 items-center justify-center rounded-full border bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm transition-all cursor-pointer"
              aria-label="Previous"
            >
              <ArrowRight className="size-4 rotate-180" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="flex size-9 items-center justify-center rounded-full border bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm transition-all cursor-pointer"
              aria-label="Next"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
      </Carousel>
    </section>
  )
}
