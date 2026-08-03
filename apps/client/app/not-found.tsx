import Link from "next/link"
import { ArrowLeft, House, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4">
      <div className="mx-auto flex max-w-sm flex-col items-center text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-muted ring-1 ring-border/50">
          <span className="font-heading text-4xl font-bold text-muted-foreground/40">
            404
          </span>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved. Try
          searching or go back home.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/store"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <House className="size-4" weight="bold" />
            Go Home
          </Link>
          <Link
            href="/store/products"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/50"
          >
            <MagnifyingGlass className="size-4" />
            Browse Products
          </Link>
        </div>
        <Link
          href="/store"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Go back
        </Link>
      </div>
    </div>
  )
}
