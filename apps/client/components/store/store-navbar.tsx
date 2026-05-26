"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  Sparkle,
  ShoppingCart,
  UserCircle,
  MagnifyingGlass,
  List,
  Sun,
  Moon,
  Compass,
  ShoppingBag,
  House,
} from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@workspace/ui/components/sheet"
import { StoreSearch } from "./store-search"

export function StoreNavbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const [scrolled, setScrolled] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }



  const inactiveLinkClass = "text-muted-foreground hover:text-foreground transition-all duration-300 font-medium cursor-pointer"

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "border-b bg-background/80 backdrop-blur-xl shadow-xs"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/store"
            className="flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight select-none group"
          >
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
              <Sparkle className="size-4 animate-pulse" weight="fill" />
            </div>
            <span className="bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
              ShopAI
            </span>
          </Link>

          {/* Desktop Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border bg-muted/30 text-muted-foreground hover:text-foreground text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-muted/50 w-56 shadow-xs"
            >
              <MagnifyingGlass className="size-3.5" />
              <span>Search products...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-4.5 select-none items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[9px] font-medium opacity-100 shadow-xs">
                ⌘K
              </kbd>
            </button>

            {/* Theme Switcher */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
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

            {/* Cart Icon (Visual Only) */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
            >
              <ShoppingCart className="size-4.5" />
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground shadow-xs animate-scale-in">
                2
              </span>
              <span className="sr-only">View cart</span>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
                />
              }>
                <UserCircle className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 p-1.5">
                <DropdownMenuLabel className="font-semibold text-xs text-foreground px-2 py-1.5">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem render={<Link href="/store/profile">Profile</Link>} className="cursor-pointer" />
                <DropdownMenuItem render={<Link href="/admin">Admin Dashboard</Link>} className="cursor-pointer" />
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Actions/Drawer */}
          <div className="flex md:hidden items-center gap-2.5">
            {/* Search Trigger */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <MagnifyingGlass className="size-4" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Sheet>
              <SheetTrigger render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-foreground rounded-lg"
                />
              }>
                <List className="size-4.5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 flex flex-col h-full bg-background border-l">
                <SheetHeader className="px-6 py-5 border-b flex flex-row items-center justify-between">
                  <SheetTitle className="flex items-center gap-2.5 font-bold tracking-tight text-lg">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Sparkle className="size-3.5" weight="fill" />
                    </div>
                    <span>ShopAI</span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Navigation Links */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

                  <div className="border-t my-4" />

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">
                      Account & Actions
                    </div>
                    <SheetClose render={
                      <Link
                        href="/store/profile"
                        className="flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      />
                    }>
                      <UserCircle className="size-4" />
                      <span>My Profile</span>
                    </SheetClose>
                    <SheetClose render={
                      <Link
                        href="/admin"
                        className="flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      />
                    }>
                      <Compass className="size-4" />
                      <span>Admin Dashboard</span>
                    </SheetClose>
                  </div>
                </div>

                {/* Mobile Drawer Footer Controls */}
                <div className="p-6 border-t bg-muted/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Appearance</span>
                    {mounted && (
                      <div className="flex rounded-lg border bg-background p-1">
                        <button
                          onClick={() => setTheme("light")}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
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
                          className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Visual Cart</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs">
                      2 items
                    </span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Cmd+K Search Palette */}
      <StoreSearch open={searchOpen} setOpen={setSearchOpen} />
    </>
  )
}
