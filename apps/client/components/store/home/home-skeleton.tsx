import { Skeleton } from "@workspace/ui/components/skeleton"
import { Lightning } from "@phosphor-icons/react"

function SkeletonCard() {
  return (
    <div className="w-44 sm:w-52 lg:w-56 shrink-0 rounded-xl border border-border/50 bg-card p-0">
      <div className="aspect-square w-full rounded-t-xl bg-muted" />
      <div className="space-y-2 p-3 sm:p-3.5">
        <Skeleton className="h-3 w-16 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-3 w-10 rounded-md" />
        </div>
      </div>
    </div>
  )
}

function SectionHeaderSkeleton() {
  return (
    <div className="flex items-end justify-between mb-4">
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-28 rounded-md" />
      </div>
      <Skeleton className="h-4 w-16 rounded-md" />
    </div>
  )
}

export function HomeSkeleton() {
  return (
    <div className="w-full">
      {/* Hero carousel is static — it always renders, so we show a simplified hero skeleton */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="relative h-[260px] w-full overflow-hidden rounded-xl bg-muted/40 sm:h-[340px]">
          <div className="flex h-full flex-col justify-end px-6 pb-14 sm:justify-center sm:px-12 sm:pb-0 md:px-16">
            <div className="max-w-lg space-y-3">
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="h-10 w-72 rounded-lg sm:h-14 sm:w-96" />
              <Skeleton className="h-4 w-64 rounded-md" />
              <Skeleton className="h-11 w-36 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Flash Deals section skeleton */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
              <Lightning className="size-4.5 text-muted-foreground/40" weight="fill" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          </div>
          <div className="scrollbar-hide flex gap-4 overflow-hidden pb-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={`deals-${i}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Offer cards strip is static — brief skeleton */}
      <section className="py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={`offer-${i}`} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Top Picks section skeleton */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeaderSkeleton />
          <div className="scrollbar-hide flex gap-4 overflow-hidden pb-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={`picks-${i}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Just Launched section skeleton */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeaderSkeleton />
          <div className="scrollbar-hide flex gap-4 overflow-hidden pb-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={`launched-${i}`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
