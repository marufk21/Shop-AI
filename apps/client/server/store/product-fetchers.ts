import { apiClient } from "@/server/api-client"
import type {
  Product,
  ProductListParams,
  ProductListResponse,
} from "@/types/product"

export interface CategoryInfo {
  name: string
  count: number
}

interface CategoryListResponse {
  categories: CategoryInfo[]
}

export async function fetchStoreProducts(params: ProductListParams = {}) {
  return apiClient.get<ProductListResponse>("/api/v1/store/products", {
    params: params as Record<string, string | number | boolean | undefined>,
    next: { revalidate: 60 },
  })
}

export async function fetchStoreProduct(slug: string) {
  return apiClient.get<Product>(`/api/v1/store/products/${slug}`, {
    next: { revalidate: 60 },
  })
}

export async function fetchStoreCategories() {
  const data = await apiClient.get<CategoryListResponse>(
    "/api/v1/store/categories",
    { next: { revalidate: 300 } }
  )

  return data.categories
}
