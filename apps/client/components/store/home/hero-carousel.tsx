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
    gradient: "from-foreground/5 via-foreground/3 to-background",
  },
  {
    badge: "New Arrivals",
    title: "Just Dropped",
    subtitle: "Fresh styles curated by AI for you",
    cta: "Explore New",
    href: "/store/products",
    gradient: "from-foreground/8 via-foreground/2 to-background",
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
    <section className="mx-auto max-w-7xl px-3 pt-3 sm:px-6 sm:pt-6">
      <Carousel opts={{ loop: true }} className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl" setApi={setApi}>
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.title}>
              <div className={`relative min-h-[260px] bg-linear-to-br sm:min-h-[340px] ${slide.gradient}`}>
                <div className="px-6 py-10 sm:px-12 sm:py-16">
                  <div className="relative z-10 max-w-lg">
                  <span className="mb-4 inline-flex max-w-full items-center gap-1.5 rounded-full border bg-background/80 px-3 py-0.5 text-[11px] font-semibold text-muted-foreground backdrop-blur-sm sm:mb-5 sm:text-xs">
                    <Sparkle className="size-3 text-primary" weight="fill" />
                    <span className="truncate">{slide.badge}</span>
                  </span>

                  <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-muted-foreground sm:max-w-none sm:text-lg">
                    {slide.subtitle}
                  </p>

                  <Button
                    size="lg"
                    className="mt-7 h-11 rounded-xl px-5 text-sm font-semibold shadow-lg shadow-primary/20 sm:mt-8 sm:h-12 sm:px-6"
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
      <div className="absolute inset-x-0 bottom-5 sm:bottom-6">
        <div className="flex items-center justify-between px-6 sm:px-8">
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

          <div className="hidden items-center gap-2 sm:flex">
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
