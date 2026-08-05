import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { getQueryClient } from "@/lib/query-client"
import { adminProductKeys } from "@/hooks/admin/use-products"
import { fetchAdminProducts } from "@/server/admin/product-fetchers"

import { ProductsContent } from "./products-content"

export default async function ProductsPage() {
  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: adminProductKeys.list({ limit: 100 }),
      queryFn: () => fetchAdminProducts({ limit: 100 }),
    })
  } catch {
    // Prefetch failed — client hook will fetch on mount.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsContent />
    </HydrationBoundary>
  )
}
