"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  House,
  MagnifyingGlass,
  ChatCircle,
  ShoppingCart,
} from "@phosphor-icons/react"
import { useCart } from "@/components/store/cart-provider"
import { cn } from "@workspace/ui/lib/utils"

export function MobileBottomBar() {
  const pathname = usePathname()
  const { itemCount, openCart } = useCart()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const links = [
    {
      href: "/store",
      label: "Home",
      icon: House,
      active: pathname === "/store",
    },
    {
      href: "/store/products",
      label: "Search",
      icon: MagnifyingGlass,
      active: pathname === "/store/products",
    },
    {
      href: "#",
      label: "Cart",
      icon: ShoppingCart,
      active: false,
      badge: itemCount,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        openCart()
      },
    },
    {
      href: "#",
      label: "Chat",
      icon: ChatCircle,
      active: false,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        const trigger = document.querySelector<HTMLButtonElement>(
          '[aria-label="Open chat"]'
        )
        trigger?.click()
      },
    },
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t bg-background/80 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={link.onClick}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full transition-colors",
                link.active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="relative">
                <Icon className="size-5" weight={link.active ? "fill" : "regular"} />
                {mounted && "badge" in link && link.badge != null && link.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {(link.badge ?? 0) > 9 ? "9+" : (link.badge ?? 0)}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
