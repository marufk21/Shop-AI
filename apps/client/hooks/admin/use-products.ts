import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  buildProductFormData,
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminProduct,
  fetchAdminProducts,
  updateAdminProduct,
} from "@/server/admin/product-fetchers"
import type {
  ProductCreateInput,
  ProductListParams,
} from "@/types/product"

export const adminProductKeys = {
  all: ["admin-products"] as const,
  lists: () => [...adminProductKeys.all, "list"] as const,
  list: (params: ProductListParams) =>
    [...adminProductKeys.lists(), params] as const,
  detail: (productId: string) =>
    [...adminProductKeys.all, "detail", productId] as const,
}

export function useAdminProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: adminProductKeys.list(params),
    queryFn: () => fetchAdminProducts(params),
  })
}

export function useAdminProduct(productId: string) {
  return useQuery({
    queryKey: adminProductKeys.detail(productId),
    queryFn: () => fetchAdminProduct(productId),
    enabled: productId.length > 0,
  })
}

export function useCreateAdminProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productData,
      imageFile,
    }: {
      productData: ProductCreateInput
      imageFile?: File | null
    }) => {
      const formData = buildProductFormData(productData, imageFile)
      return createAdminProduct(formData)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminProductKeys.all })
      void queryClient.invalidateQueries({ queryKey: ["store-products"] })
    },
  })
}

export function useUpdateAdminProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      productData,
      imageFile,
      removeImage,
    }: {
      productId: string
      productData: ProductCreateInput
      imageFile?: File | null
      removeImage?: boolean
    }) => {
      const formData = buildProductFormData(productData, imageFile, removeImage)
      return updateAdminProduct(productId, formData)
    },
    onSuccess: (product) => {
      void queryClient.invalidateQueries({ queryKey: adminProductKeys.all })
      void queryClient.invalidateQueries({ queryKey: ["store-products"] })
      queryClient.setQueryData(adminProductKeys.detail(product.id), product)
    },
  })
}

export function useDeleteAdminProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => deleteAdminProduct(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminProductKeys.all })
      void queryClient.invalidateQueries({ queryKey: ["store-products"] })
    },
  })
}
