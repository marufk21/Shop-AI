"use client"

import Link from "next/link"
import { Sparkle, GithubLogo, TwitterLogo, InstagramLogo } from "@phosphor-icons/react"

export function StoreFooter() {
  const shopLinks = [
    { href: "#products", label: "All Products" },
    { href: "#products", label: "New Arrivals" },
    { href: "#products", label: "Electronics" },
    { href: "#products", label: "Home & Office" },
  ]

  const companyLinks = [
    { href: "/store", label: "About Us" },
    { href: "/store", label: "Careers" },
    { href: "/store", label: "Store Blog" },
    { href: "/store", label: "Press Kit" },
  ]

  const supportLinks = [
    { href: "/store", label: "Help Center" },
    { href: "/store", label: "Shipping Policy" },
    { href: "/store", label: "Returns & Exchanges" },
    { href: "/store", label: "Contact Support" },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/20 w-full mt-auto relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info (takes 2 columns space on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/store"
              className="flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkle className="size-3.5" weight="fill" />
              </div>
              <span className="bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                ShopAI
              </span>
            </Link>
            <p className="text-xs/relaxed text-muted-foreground max-w-sm">
              The premium AI-powered e-commerce storefront. Experience intelligence integrated into shopping with instant responses, curated descriptions, and modern design.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="size-8 rounded-lg border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted/30 transition-all duration-200"
                aria-label="GitHub"
              >
                <GithubLogo className="size-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="size-8 rounded-lg border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted/30 transition-all duration-200"
                aria-label="Twitter"
              >
                <TwitterLogo className="size-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="size-8 rounded-lg border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted/30 transition-all duration-200"
                aria-label="Instagram"
              >
                <InstagramLogo className="size-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Shop
            </h4>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Company
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Support
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t my-8 md:my-10" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground text-center sm:text-left">
            © {currentYear} ShopAI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/store"
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              Privacy Policy
            </Link>
            <Link
              href="/store"
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
