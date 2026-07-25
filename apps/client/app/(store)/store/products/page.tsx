import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { getQueryClient } from "@/lib/query-client"
import { storeProductKeys } from "@/hooks/store/use-products"
import { fetchStoreProducts } from "@/server/store/product-fetchers"
import { AllProductsContent } from "@/components/store/all-products-content"

export default async function ProductsPage() {
  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: storeProductKeys.list({ limit: 10000 }),
      queryFn: () => fetchStoreProducts({ limit: 10000 }),
    })
  } catch {
    // Prefetch failed
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AllProductsContent />
    </HydrationBoundary>
  )
}
