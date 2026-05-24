import { axiosClient } from "@/server/axios-client"
import type {
  Product,
  ProductListParams,
  ProductListResponse,
} from "@/types/product"

export async function fetchStoreProducts(params: ProductListParams = {}) {
  const { data } = await axiosClient.get<ProductListResponse>(
    "/api/v1/store/products",
    { params }
  )

  return data
}

export async function fetchStoreProduct(slug: string) {
  const { data } = await axiosClient.get<Product>(
    `/api/v1/store/products/${slug}`
  )

  return data
}
