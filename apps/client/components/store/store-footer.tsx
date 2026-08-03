import Image from "next/image"
import Link from "next/link"

export function StoreFooter() {
  const shopLinks = [
    { href: "/store/products", label: "All Products" },
    { href: "/store/products", label: "New Arrivals" },
    { href: "/store/category/electronics", label: "Electronics" },
    { href: "/store/category/home%20%26%20living", label: "Home & Living" },
  ]

  const companyLinks = [
    { href: "/store", label: "About Us" },
    { href: "/store", label: "Careers" },
    { href: "/store", label: "Blog" },
    { href: "/store", label: "Press" },
  ]

  const supportLinks = [
    { href: "/store", label: "Help Center" },
    { href: "/store", label: "Shipping Info" },
    { href: "/store", label: "Returns & Exchanges" },
    { href: "/store", label: "Contact Us" },
  ]

  const currentYear = 2026

  return (
    <footer className="border-t bg-muted/20 w-full mt-auto relative overflow-hidden pb-14 md:pb-0">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 md:pb-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Brand Info (takes 2 columns space on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/store"
              className="flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight select-none group"
            >
              <Image src="/logo.png" alt="ShopAI Logo" width={28} height={28} className="size-7 rounded-md object-cover transition-transform duration-300 group-hover:scale-105" />
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
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="size-8 rounded-lg border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted/30 transition-all duration-200"
                aria-label="Twitter"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="size-8 rounded-lg border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted/30 transition-all duration-200"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-8 lg:col-span-3 lg:grid-cols-3 lg:gap-12">
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
        </div>

        <div className="border-t my-8 md:my-10" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground text-center sm:text-left">
            © {currentYear} ShopAI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/sitemap.xml"
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              Sitemap
            </Link>
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
