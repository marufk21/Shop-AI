import type { MetadataRoute } from "next"
import { fetchStoreProducts } from "@/server/store/product-fetchers"
import { fetchStoreCategories } from "@/server/store/product-fetchers"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shopai.example.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/store`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/store/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ]

  const [productsData, categories] = await Promise.all([
    fetchStoreProducts({ limit: 10000 }).catch(() => ({ items: [], total: 0 })),
    fetchStoreCategories().catch(() => []),
  ])

  const productRoutes: MetadataRoute.Sitemap = productsData.items.map((product) => ({
    url: `${BASE_URL}/store/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/store/category/${encodeURIComponent(category.name.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}
