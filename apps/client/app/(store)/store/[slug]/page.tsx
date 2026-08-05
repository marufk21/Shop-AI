import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { getQueryClient } from "@/lib/query-client"
import { storeProductKeys } from "@/hooks/store/use-products"
import {
  fetchStoreProduct,
  fetchStoreProducts,
} from "@/server/store/product-fetchers"
import { ProductDetailContent } from "@/components/store/product-detail-content"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const queryClient = getQueryClient()

  try {
    const product = await queryClient.fetchQuery({
      queryKey: storeProductKeys.detail(slug),
      queryFn: () => fetchStoreProduct(slug),
    })

    if (product?.category) {
      await queryClient.prefetchQuery({
        queryKey: storeProductKeys.list({
          category: product.category,
          limit: 24,
        }),
        queryFn: () =>
          fetchStoreProducts({ category: product.category, limit: 24 }),
      })
    }
  } catch {
    // Prefetch failed — client hooks will fetch on mount.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailContent slug={slug} />
    </HydrationBoundary>
  )
}
