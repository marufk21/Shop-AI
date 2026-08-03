export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 md:pt-8 pb-6 sm:px-6 md:pb-8">
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-12">
        {/* Left: Image skeleton */}
        <div className="self-start lg:sticky lg:top-28">
          <div className="h-80 animate-pulse rounded-xl border border-border/40 bg-white sm:aspect-square sm:h-auto" />
        </div>

        {/* Right: Content skeleton */}
        <div className="space-y-5">
          {/* Category badge */}
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />

          {/* Title */}
          <div className="space-y-2">
            <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-1/2 animate-pulse rounded-md bg-muted" />
          </div>

          {/* Rating */}
          <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />

          {/* Price */}
          <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />

          {/* Separator */}
          <div className="h-px w-full bg-border" />

          {/* Description lines */}
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-4/6 animate-pulse rounded-md bg-muted" />
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-12 w-32 animate-pulse rounded-lg bg-muted" />
            <div className="h-12 flex-1 animate-pulse rounded-lg bg-muted" />
            <div className="h-12 w-12 animate-pulse rounded-lg bg-muted" />
          </div>

          {/* Trust row */}
          <div className="flex gap-6 pt-2">
            <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
          </div>

          {/* Tabs */}
          <div className="flex gap-4 pt-4">
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="h-px w-full bg-border" />

          {/* Tab content */}
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}
