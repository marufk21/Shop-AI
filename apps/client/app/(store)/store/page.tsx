import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { getQueryClient } from "@/lib/query-client"
import { storeProductKeys } from "@/hooks/store/use-products"
import { fetchStoreProducts } from "@/server/store/product-fetchers"
import { HomePageContent } from "@/components/store/home/home-page-content"

export default async function StorePage() {
  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: storeProductKeys.list({ limit: 24 }),
      queryFn: () => fetchStoreProducts({ limit: 24 }),
    })
  } catch {
    // Prefetch failed — client will fetch on mount
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageContent />
    </HydrationBoundary>
  )
}
