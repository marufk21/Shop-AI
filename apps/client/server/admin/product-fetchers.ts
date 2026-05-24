import { axiosClient, axiosMultipart } from "@/server/axios-client"
import type {
  Product,
  ProductCreateInput,
  ProductListParams,
  ProductListResponse,
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
  const client = axiosMultipart()
  const { data } = await client.post<Product>("/api/v1/products", payload)
  return data
}

export async function updateAdminProduct(
  productId: string,
  payload: FormData
) {
  const client = axiosMultipart()
  const { data } = await client.put<Product>(
    `/api/v1/products/${productId}`,
    payload
  )
  return data
}

export async function deleteAdminProduct(productId: string) {
  await axiosClient.delete(`/api/v1/products/${productId}`)
}
