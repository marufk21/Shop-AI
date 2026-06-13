import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { getQueryClient } from "@/lib/query-client"
import { storeProductKeys } from "@/hooks/store/use-products"
import { fetchStoreProducts } from "@/server/store/product-fetchers"
import { ProductsSection } from "@/components/store/home/products-section"

export default async function StorePage() {
  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: storeProductKeys.list({ limit: 100 }),
      queryFn: () => fetchStoreProducts({ limit: 100 }),
    })
  } catch {
    // Prefetch failed — client will fetch on mount
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full">
        <ProductsSection />
      </div>
    </HydrationBoundary>
  )
}
