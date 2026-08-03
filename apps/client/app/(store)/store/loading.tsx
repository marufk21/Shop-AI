export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 md:pt-8">
      {/* Hero skeleton */}
      <div className="mb-8 h-50 animate-pulse rounded-2xl bg-muted/60 sm:h-70" />

      {/* Flash row */}
      <div className="mb-8">
        <div className="mb-4 h-5 w-36 animate-pulse rounded-md bg-muted/60" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-52 w-40 shrink-0 animate-pulse rounded-xl bg-muted/60 sm:w-48"
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div>
        <div className="mb-4 h-5 w-32 animate-pulse rounded-md bg-muted/60" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-3/4 animate-pulse rounded-xl bg-muted/60"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
