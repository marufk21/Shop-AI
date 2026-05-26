"use client"

import { Skeleton } from "@workspace/ui/components/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card flex flex-col overflow-hidden shadow-xs w-full p-0">
      {/* Product Image Skeleton */}
      <div className="relative aspect-square w-full bg-muted overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
        
        {/* Badges/Actions Skeletons */}
        <div className="absolute inset-x-2 top-2 flex items-center justify-between">
          <Skeleton className="h-4.5 w-14 rounded-full" />
          <Skeleton className="size-7.5 rounded-full" />
        </div>
      </div>

      {/* Details Skeletons */}
      <div className="p-4 flex flex-col flex-1 space-y-3.5">
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
