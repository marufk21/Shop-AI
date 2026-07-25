"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  TShirt,
  Sneaker,
  DeviceMobile,
  House,
  Football,
  Watch,
  Backpack,
  Sparkle,
  Heart,
} from "@phosphor-icons/react"
import { useStoreProducts } from "@/hooks/store/use-products"
import { cn } from "@workspace/ui/lib/utils"

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Apparel: TShirt,
  Clothing: TShirt,
  Footwear: Sneaker,
  Shoes: Sneaker,
  Electronics: DeviceMobile,
  "Home & Living": House,
  Home: House,
  Sports: Football,
  Accessories: Watch,
  Bags: Backpack,
  default: Sparkle,
}

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  let IconComponent = CATEGORY_ICONS[name]
  if (!IconComponent) {
    for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        IconComponent = icon
        break
      }
    }
  }
  if (!IconComponent) IconComponent = Sparkle
  return <IconComponent className={className} />
}

function parseMaster(category: string): string {
  return category.split(">")[0]?.trim() ?? category
}

export function StickyCategoryBar() {
  const pathname = usePathname()
  const { data } = useStoreProducts({ limit: 10000 })
  const products = data?.items ?? []

  const categories = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const p of products) {
      const master = parseMaster(p.category)
      map.set(master, (map.get(master) ?? 0) + 1)
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
  }, [products])

  if (categories.length === 0) return null

  const isHome = pathname === "/store"

  return (
    <div className="sticky top-16 z-30 w-full border-b bg-background/95 backdrop-blur-xl">
      <div className="scrollbar-hide flex items-center gap-0.5 overflow-x-auto px-4 sm:px-6 mx-auto max-w-7xl h-11">
        {/* For You */}
        <Link
          href="/store"
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-lg px-3 h-8 transition-colors",
            isHome
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
          )}
        >
          <Heart className="size-3.5" weight={isHome ? "fill" : "regular"} />
          <span className="text-xs whitespace-nowrap">For You</span>
        </Link>

        {categories.map(([name]) => {
          const catSlug = encodeURIComponent(name.toLowerCase())
          const isActive = pathname === `/store/category/${catSlug}`
          return (
            <Link
              key={name}
              href={`/store/category/${catSlug}`}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 h-8 transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
              )}
            >
              <CategoryIcon name={name} className="size-3.5" />
              <span className="text-xs whitespace-nowrap">{name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
