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
  Dress,
  Hoodie,
  Handbag,
  Sunglasses,
  BaseballCap,
  Gift,
  Drop,
} from "@phosphor-icons/react"
import { useStoreCategories } from "@/hooks/store/use-products"
import { cn } from "@workspace/ui/lib/utils"

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Apparel: TShirt,
  Clothing: TShirt,
  Dress: Dress,
  Dresses: Dress,
  Topwear: Hoodie,
  Innerwear: TShirt,
  Bottomwear: TShirt,
  Footwear: Sneaker,
  Shoes: Sneaker,
  Electronics: DeviceMobile,
  "Home & Living": House,
  Home: House,
  Sports: Football,
  Accessories: Watch,
  Jewellery: Sparkle,
  Jewelry: Sparkle,
  Eyewear: Sunglasses,
  Sunglasses: Sunglasses,
  Watches: Watch,
  Caps: BaseballCap,
  Bags: Backpack,
  Bag: Handbag,
  Handbags: Handbag,
  "Free Items": Gift,
  Free: Gift,
  "Personal Care": Drop,
  Personal: Drop,
  Beauty: Drop,
  Grooming: Drop,
  default: Sparkle,
}

const FALLBACK_ICONS = [
  TShirt,
  Watch,
  Sneaker,
  Backpack,
  DeviceMobile,
  House,
  Football,
  Sunglasses,
  BaseballCap,
]

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
  if (!IconComponent) {
    const charSum = name
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0)
    IconComponent = FALLBACK_ICONS[charSum % FALLBACK_ICONS.length] ?? Sparkle
  }
  return <IconComponent className={className} />
}

function parseMaster(category: string): string {
  return category.split(">")[0]?.trim() ?? category
}

export function StickyCategoryBar() {
  const pathname = usePathname()
  const { data: categories = [] } = useStoreCategories()

  const topCategories = categories.slice(0, 8)

  const isHome = pathname === "/store"

  return (
    <div className="sticky top-16 z-30 w-full bg-background/95 backdrop-blur-xl">
      <div className="scrollbar-hide mx-auto flex h-11 max-w-7xl items-center justify-between gap-[7px] overflow-x-auto px-4 sm:justify-start sm:gap-1 sm:px-6">
        {/* For You */}
        <Link
          href="/store"
          className={cn(
            "flex h-8 shrink-0 items-center gap-1.5 rounded-lg transition-colors",
            isHome
              ? "bg-primary px-3 font-semibold text-primary-foreground"
              : "px-[11px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground sm:px-3"
          )}
        >
          <Heart className="size-3.5" weight={isHome ? "fill" : "regular"} />
          <span className={cn(
            "whitespace-nowrap text-[11px] sm:text-xs",
            !isHome && "hidden sm:inline"
          )}>
            For You
          </span>
        </Link>

        {topCategories.map(({ name }) => {
          const catSlug = encodeURIComponent(name.toLowerCase())
          const isActive = pathname === `/store/category/${catSlug}`
          return (
            <Link
              key={name}
              href={`/store/category/${catSlug}`}
              className={cn(
                "flex h-8 shrink-0 items-center gap-1.5 rounded-lg transition-colors",
                isActive
                  ? "bg-primary px-3 font-semibold text-primary-foreground"
                  : "px-[11px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground sm:px-3"
              )}
            >
              <CategoryIcon name={name} className="size-3.5" />
              <span className={cn(
                "whitespace-nowrap text-[11px] sm:text-xs",
                !isActive && "hidden sm:inline"
              )}>
                {name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
