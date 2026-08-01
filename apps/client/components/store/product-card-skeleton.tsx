"use client"

import { Skeleton } from "@workspace/ui/components/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border bg-card p-0 shadow-xs sm:rounded-2xl">
      {/* Product Image Skeleton */}
      <div className="relative aspect-[3/4] w-full bg-muted overflow-hidden">
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
        <Skeleton className="h-4.5 w-3/4 rounded-md" />

        {/* Price & Stock info */}
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-16 rounded-md" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-1.5 rounded-full shrink-0" />
            <Skeleton className="h-3 w-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
