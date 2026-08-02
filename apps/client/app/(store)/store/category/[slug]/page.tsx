import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { getQueryClient } from "@/lib/query-client"
import { storeProductKeys } from "@/hooks/store/use-products"
import { fetchStoreProducts } from "@/server/store/product-fetchers"
import { CategoryPageContent } from "@/components/store/category-page-content"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const categoryName = decodeURIComponent(slug)

  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: storeProductKeys.list({ category: categoryName, skip: 0, limit: 12 }),
      queryFn: () => fetchStoreProducts({ category: categoryName, skip: 0, limit: 12 }),
    })
  } catch {
    // Prefetch failed — client will fetch on mount
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryPageContent categoryName={categoryName} />
    </HydrationBoundary>
  )
}
