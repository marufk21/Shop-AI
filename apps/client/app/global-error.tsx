"use client"

import { ArrowCounterClockwise, House } from "@phosphor-icons/react"

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
          <div className="mx-auto flex max-w-sm flex-col items-center text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
              <span className="font-heading text-4xl font-bold text-destructive/60">
                !
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Critical Error
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              A critical error occurred. The application could not be loaded.
              Please try again.
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
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error renders its own <html>, so Next.js Link is unavailable */}
              <a
                href="/store"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/50"
              >
                <House className="size-4" />
                Go Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
