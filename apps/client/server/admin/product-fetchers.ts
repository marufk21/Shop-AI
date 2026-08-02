import { apiClient } from "@/server/api-client"
import type {
  Product,
  ProductCreateInput,
  ProductListParams,
  ProductListResponse,
} from "@/types/product"

export async function fetchAdminProducts(params: ProductListParams = {}) {
  return apiClient.get<ProductListResponse>("/api/v1/products", {
    params: params as Record<string, string | number | boolean | undefined>,
  })
}

export async function fetchAdminProduct(productId: string) {
  return apiClient.get<Product>(`/api/v1/products/${productId}`)
}

export function buildProductFormData(
  productData: ProductCreateInput,
  imageFile?: File | null,
  removeImage?: boolean
): FormData {
  const formData = new FormData()
  formData.append("data", JSON.stringify(productData))
  if (imageFile) {
    formData.append("image", imageFile)
  }
  if (removeImage) {
    formData.append("remove_image", "true")
  }
  return formData
}

export async function createAdminProduct(payload: FormData) {
  return apiClient.post<Product>("/api/v1/products", payload)
}

export async function updateAdminProduct(
  productId: string,
  payload: FormData
) {
  return apiClient.put<Product>(`/api/v1/products/${productId}`, payload)
}

export async function deleteAdminProduct(productId: string) {
  await apiClient.delete(`/api/v1/products/${productId}`)
}
