export type ProductStatus = "active" | "draft" | "archived"

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category: string
  inventory: number
  status: ProductStatus
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface ProductListResponse {
  items: Product[]
  total: number
}

export interface ProductCreateInput {
  name: string
  description: string | null
  price: number
  category: string
  inventory: number
  status: ProductStatus
}


export interface ProductListParams {
  status?: ProductStatus
  search?: string
  category?: string
  slugs?: string
  skip?: number
  limit?: number
}
