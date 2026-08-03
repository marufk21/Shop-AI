"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowCounterClockwise, House } from "@phosphor-icons/react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Unhandled error:", error)
  }, [error])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-4">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
          <span className="font-heading text-4xl font-bold text-destructive/60">
            !
          </span>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. Please try again or return to the home
          page.
        </p>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground/60">
          {error.digest ? `Error ID: ${error.digest}` : error.message}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <ArrowCounterClockwise className="size-4" weight="bold" />
            Try Again
          </button>
          <Link
            href="/store"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/50"
          >
            <House className="size-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
