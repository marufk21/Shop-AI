"use client"

import dynamic from "next/dynamic"
import type { ProductFormData } from "./product-form"

const ProductFormDynamic = dynamic(
  () =>
    import("./product-form").then((mod) => ({
      default: mod.ProductForm,
    })),
  { ssr: false }
)

export { ProductFormDynamic as ProductForm }
export type { ProductFormData }
