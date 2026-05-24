import { axiosClient } from "@/server/axios-client"
import type {
  Product,
  ProductCreateInput,
  ProductListParams,
  ProductListResponse,
  ProductUpdateInput,
} from "@/types/product"

export async function fetchAdminProducts(params: ProductListParams = {}) {
  const { data } = await axiosClient.get<ProductListResponse>(
    "/api/v1/products",
    { params }
  )

  return data
}

export async function fetchAdminProduct(productId: string) {
  const { data } = await axiosClient.get<Product>(
    `/api/v1/products/${productId}`
  )

  return data
}

export async function createAdminProduct(payload: ProductCreateInput) {
  const { data } = await axiosClient.post<Product>("/api/v1/products", payload)

  return data
}

export async function updateAdminProduct(
  productId: string,
  payload: ProductUpdateInput
) {
  const { data } = await axiosClient.put<Product>(
    `/api/v1/products/${productId}`,
    payload
  )

  return data
}

export async function deleteAdminProduct(productId: string) {
  await axiosClient.delete(`/api/v1/products/${productId}`)
}
