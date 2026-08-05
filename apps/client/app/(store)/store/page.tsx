import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { HomePageContent } from "@/components/store/home/home-page-content"
import { storeProductKeys } from "@/hooks/store/use-products"
import { getQueryClient } from "@/lib/query-client"
import { fetchStoreProducts } from "@/server/store/product-fetchers"

export default async function StorePage() {
  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: storeProductKeys.list({ limit: 50 }),
      queryFn: () => fetchStoreProducts({ limit: 50 }),
    })
  } catch {
    // Prefetch failed — client will fetch on mount.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageContent />
    </HydrationBoundary>
  )
}
