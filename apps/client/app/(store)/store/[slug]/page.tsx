import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { getQueryClient } from "@/lib/query-client"
import { storeProductKeys } from "@/hooks/store/use-products"
import { fetchStoreProduct } from "@/server/store/product-fetchers"
import { ProductDetailContent } from "@/components/store/product-detail-content"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: storeProductKeys.detail(slug),
      queryFn: () => fetchStoreProduct(slug),
    })
  } catch {
    // Prefetch failed — client will fetch on mount
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailContent slug={slug} />
    </HydrationBoundary>
  )
}
