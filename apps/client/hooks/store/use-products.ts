import { useQuery } from "@tanstack/react-query"

import {
  fetchStoreProduct,
  fetchStoreProducts,
} from "@/server/store/product-fetchers"
import type { ProductListParams } from "@/types/product"

export const storeProductKeys = {
  all: ["store-products"] as const,
  lists: () => [...storeProductKeys.all, "list"] as const,
  list: (params: ProductListParams) =>
    [...storeProductKeys.lists(), params] as const,
  detail: (slug: string) => [...storeProductKeys.all, "detail", slug] as const,
}

export function useStoreProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: storeProductKeys.list(params),
    queryFn: () => fetchStoreProducts(params),
  })
}

export function useStoreProduct(slug: string) {
  return useQuery({
    queryKey: storeProductKeys.detail(slug),
    queryFn: () => fetchStoreProduct(slug),
    enabled: slug.length > 0,
  })
}
