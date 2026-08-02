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
  })
}

export async function fetchStoreProduct(slug: string) {
  return apiClient.get<Product>(`/api/v1/store/products/${slug}`)
}

export async function fetchStoreCategories() {
  const data = await apiClient.get<CategoryListResponse>(
    "/api/v1/store/categories"
  )

  return data.categories
}
