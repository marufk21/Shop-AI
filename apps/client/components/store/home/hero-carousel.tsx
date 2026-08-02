"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@workspace/ui/components/carousel"

const SLIDES = [
  {
    badge: "Tech Essentials",
    title: "Accessories",
    subtitle: "Minimalist mechanical keyboards, mice & desk accessories",
    cta: "Explore Tech",
    href: "/store/products",
    gradient: "from-purple-500/10 via-pink-500/5 to-background",
    image: "/tech-essentials-hero.jpg",
  },
  {
    badge: "Summer Sale 2026",
    title: "Up to 60% Off",
    subtitle: "Premium fashion, electronics & more",
    cta: "Shop the Sale",
    href: "/store/products",
    gradient: "from-amber-500/10 via-orange-500/5 to-background",
    image: "/summer-sale-hero.jpg",
  },
  {
    badge: "New Arrivals",
    title: "Just Dropped",
    subtitle: "Fresh styles curated by AI for you",
    cta: "Explore New",
    href: "/store/products",
    gradient: "from-blue-500/10 via-indigo-500/5 to-background",
    image: "/new-arrivals-hero.jpg",
  },

  {
    badge: "Luxury Goods",
    title: "Timeless Style",
    subtitle: "Premium leather bags, backpacks & wallets",
    cta: "Shop Accessories",
    href: "/store/products",
    gradient: "from-emerald-500/10 via-teal-500/5 to-background",
    image: "/luxury-goods-hero.jpg",
  },
]

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  React.useEffect(() => {
    if (!api) return
    const timer = setInterval(() => api.scrollNext(), 5000)
    return () => clearInterval(timer)
  }, [api])

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6">
      <Carousel
        opts={{ loop: true }}
        className="relative w-full overflow-hidden rounded-xl"
        setApi={setApi}
      >
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.title}>
              <div
                className={`relative h-[260px] bg-linear-to-br sm:h-[340px] ${slide.gradient}`}
              >
                <div className="flex h-full flex-col justify-end px-6 pb-14 sm:justify-center sm:px-12 sm:pb-0 md:px-16">
                  <div className="relative z-10 max-w-full md:max-w-[48%] lg:max-w-lg">
                    <div className="mb-3 flex items-center gap-2.5 sm:mb-4">
                      <span className="h-px w-6 rounded-full bg-primary/40 sm:w-8" />
                      <span className="text-[10px] font-semibold tracking-[0.15em] text-primary/80 uppercase sm:text-[11px]">
                        {slide.badge}
                      </span>
                    </div>

                    <h1 className="font-heading text-3xl leading-[1.15] font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>

                    <p className="mt-2 max-w-[18rem] text-[11px] leading-relaxed font-medium text-muted-foreground/80 sm:mt-3 sm:max-w-md sm:text-base sm:leading-normal">
                      {slide.subtitle}
                    </p>

                    <Button
                      size="lg"
                      className="mt-4 h-9 rounded-lg px-4 text-xs font-semibold shadow-lg shadow-primary/20 sm:mt-6 sm:h-12 sm:px-6 sm:text-sm"
                      render={
                        <Link href={slide.href}>
                          {slide.cta}
                          <ArrowRight className="ml-1 size-3.5 sm:ml-1.5 sm:size-4" />
                        </Link>
                      }
                    />
                  </div>
                </div>

                {/* Right side image with gradient mask */}
                <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="50vw"
                    className="object-cover object-center"
                    style={{
                      maskImage:
                        "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.15) 30%, rgba(0, 0, 0, 0.8) 70%, black 90%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.15) 30%, rgba(0, 0, 0, 0.8) 70%, black 90%)",
                    }}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation */}
        <div className="absolute inset-x-0 bottom-2 sm:bottom-3">
          <div className="flex items-center justify-between px-6 sm:px-12 md:px-16">
            <div className="flex items-center gap-2 rounded-full bg-background/40 px-3 py-2 shadow-sm ring-1 ring-foreground/5 backdrop-blur-md">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`cursor-pointer rounded-full transition-all duration-300 ${
                    i === current
                      ? "h-2.5 w-5 bg-foreground/90 shadow-sm"
                      : "h-2.5 w-2.5 bg-foreground/35 hover:bg-foreground/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={() => api?.scrollPrev()}
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-foreground/10 bg-background/60 shadow-sm backdrop-blur-md transition-all hover:bg-background/90"
                aria-label="Previous"
              >
                <ArrowRight className="size-4 rotate-180" />
              </button>
              <button
                onClick={() => api?.scrollNext()}
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-foreground/10 bg-background/60 shadow-sm backdrop-blur-md transition-all hover:bg-background/90"
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
