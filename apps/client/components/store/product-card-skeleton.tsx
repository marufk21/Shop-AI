import { Skeleton } from "@workspace/ui/components/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border bg-card p-0 shadow-xs">
      {/* Product Image Skeleton */}
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <Skeleton className="h-full w-full rounded-none" />
        
        {/* Badges/Actions Skeletons */}
        <div className="absolute inset-x-2 top-2 flex items-center justify-between">
          <Skeleton className="h-4.5 w-14 rounded-full" />
          <Skeleton className="size-7.5 rounded-full" />
        </div>
      </div>

      {/* Details Skeletons */}
      <div className="flex flex-1 flex-col space-y-2.5 p-2.5 sm:space-y-3.5 sm:p-4">
        {/* Name Title */}
        <Skeleton className="h-4.5 w-3/4 rounded-lg" />

        {/* Price & Stock info */}
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-16 rounded-lg" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-1.5 rounded-full shrink-0" />
            <Skeleton className="h-3 w-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
