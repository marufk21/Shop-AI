"use client"

import dynamic from "next/dynamic"

export const CartDrawer = dynamic(
  () =>
    import("@/components/store/cart-drawer").then((mod) => ({
      default: mod.CartDrawer,
    })),
  { ssr: false }
)
