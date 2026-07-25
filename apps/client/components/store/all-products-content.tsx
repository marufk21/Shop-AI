"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@workspace/ui/components/breadcrumb"
import { ProductsSection } from "@/components/store/home/products-section"

export function AllProductsContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/store"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs font-semibold text-foreground">
              All Products
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ProductsSection />
    </div>
  )
}
