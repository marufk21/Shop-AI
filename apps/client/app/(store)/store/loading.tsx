import { ProductCardSkeleton } from "@/components/store/product-card-skeleton"

export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
