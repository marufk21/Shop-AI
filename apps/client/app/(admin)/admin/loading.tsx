export default function AdminLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-border/50 bg-card"
          />
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="h-64 animate-pulse rounded-xl border border-border/50 bg-card" />

      {/* Table skeleton */}
      <div className="flex flex-1 flex-col gap-2 rounded-xl border border-border/50 bg-card p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    </div>
  )
}
