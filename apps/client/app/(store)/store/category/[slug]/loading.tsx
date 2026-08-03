export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 md:pt-8 pb-6 md:pb-10">
      {/* Toolbar skeleton */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-8 w-28 animate-pulse rounded-lg bg-muted" />
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-3/4 animate-pulse rounded-xl border border-border/50 bg-card"
          />
        ))}
      </div>
    </div>
  )
}
