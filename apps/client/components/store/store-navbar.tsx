"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Sparkle,
  ShoppingCart,
  List,
  Sun,
  Moon,
  ShoppingBag,
  MagnifyingGlass,
} from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@workspace/ui/components/sheet"
import { useCart } from "./cart-provider"
import { cn } from "@workspace/ui/lib/utils"

export function StoreNavbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()
  const [scrolled, setScrolled] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const { itemCount, openCart } = useCart()

  React.useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "border-b bg-background/80 backdrop-blur-xl shadow-xs"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6">
          {/* Left: Logo */}
          <div className="flex-1 flex items-center">
            <Link
              href="/store"
              className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight select-none group shrink-0"
            >
              <img
                src="/logo.png"
                alt="ShopAI Logo"
                className="size-8 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="bg-linear-to-r from-foreground to-foreground/80 bg-clip-text hidden lg:inline">
                ShopAI
              </span>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-xl items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 px-4 h-9">
            <MagnifyingGlass className="size-4 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground/70 flex-1 truncate">
              Search for products, brands and more...
            </span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              <span className="text-[9px]">⌘</span>K
            </kbd>
          </div>

          {/* Right: Actions - Desktop */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-1">
            {/* Theme Switcher */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="size-4.5" />
                ) : (
                  <Moon className="size-4.5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={openCart}
              className="relative text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
            >
              <ShoppingCart className="size-4.5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
              <span className="sr-only">View cart</span>
            </Button>

            {/* Admin Dashboard */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin")}
              className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden lg:inline">Admin</span>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-1 ml-auto">
            {/* Cart Button - Mobile */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={openCart}
              className="relative text-muted-foreground hover:text-foreground rounded-lg"
            >
              <ShoppingCart className="size-4.5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-foreground rounded-lg"
                  />
                }
              >
                <List className="size-4.5" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-72 p-0 flex flex-col h-full bg-background border-l"
              >
                <SheetHeader className="px-5 py-4 border-b flex flex-row items-center justify-between">
                  <SheetTitle className="flex items-center gap-2.5 font-bold tracking-tight text-base">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Sparkle className="size-3.5" weight="fill" />
                    </div>
                    <span>ShopAI</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                  {/* Features */}
                  <SheetClose
                    render={
                      <Link
                        href="/store/products"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors cursor-pointer text-left"
                      />
                    }
                  >
                    <ShoppingBag className="size-4" />
                    All Products
                  </SheetClose>

                  <SheetClose
                    render={
                      <Link
                        href="/admin"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors cursor-pointer"
                      />
                    }
                  >
                    <ShoppingBag className="size-4" />
                    Admin Dashboard
                  </SheetClose>
                </div>

                {/* Mobile drawer footer */}
                <div className="p-4 border-t bg-muted/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Appearance
                    </span>
                    {mounted && (
                      <div className="flex rounded-lg border bg-background p-0.5">
                        <button
                          onClick={() => setTheme("light")}
                          className={`px-3 py-1.5 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            resolvedTheme === "light"
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Sun className="size-3.5" />
                          Light
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className={`px-3 py-1.5 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            resolvedTheme === "dark"
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Moon className="size-3.5" />
                          Dark
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
