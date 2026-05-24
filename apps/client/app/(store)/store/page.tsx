"use client"

import Link from "next/link"
import {
  ArrowRight,
  Lightning,
  Shield,
  Sparkle,
  TrendUp,
} from "@phosphor-icons/react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"

import { useStoreProducts } from "@/hooks/store/use-products"

const features = [
  {
    icon: Sparkle,
    title: "AI-Powered Content",
    description:
      "Generate product descriptions, SEO titles, and ad copy with cutting-edge AI.",
  },
  {
    icon: Shield,
    title: "Smart Inventory",
    description:
      "Intelligent stock management with predictive restocking recommendations.",
  },
  {
    icon: Lightning,
    title: "RAG Chatbot",
    description:
      "Instant customer support powered by your documents and policies.",
  },
  {
    icon: TrendUp,
    title: "Real-time Analytics",
    description:
      "Track sales, chatbot usage, and AI generation metrics in one dashboard.",
  },
]

export default function StorePage() {
  const { data, isError, isLoading } = useStoreProducts({ limit: 8 })
  const products = data?.items ?? []

  return (
    <>
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Commerce
          </Badge>
          <h1 className="font-heading text-4xl leading-tight font-semibold md:text-6xl">
            Sell smarter with{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            The modern e-commerce platform with built-in AI product generation,
            intelligent chatbot support, and real-time analytics.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              render={
                <Link href="/store/product">
                  Browse Products <ArrowRight className="ml-1 size-4" />
                </Link>
              }
            />
            <Button
              variant="outline"
              size="lg"
              render={<Link href="/admin">Admin Dashboard</Link>}
            />
          </div>
        </div>
      </section>

      <section className="border-t py-20">
        <h2 className="text-center font-heading text-2xl font-semibold md:text-3xl">
          Everything you need to run your store
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t py-20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold md:text-3xl">
              Trending Products
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Popular items our customers love
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            render={
              <Link href="/store/product">
                View all <ArrowRight className="ml-1 size-3.5" />
              </Link>
            }
          />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl border bg-card p-4">
                <div className="aspect-square rounded-xl bg-muted" />
                <div className="mt-3 h-4 w-16 rounded bg-muted" />
                <div className="mt-2 h-5 w-32 rounded bg-muted" />
                <div className="mt-2 h-5 w-12 rounded bg-muted" />
              </div>
            ))}
          {!isLoading &&
            products.map((product) => (
              <Link
                key={product.id}
                href={`/store/product/${product.slug}`}
                className="rounded-2xl border bg-card p-4 transition-colors hover:border-primary/30"
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground">
                    {product.category}
                  </p>
                  <h3 className="mt-0.5 font-medium">{product.name}</h3>
                  <p className="mt-1 font-semibold text-primary">
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))}
          {!isLoading && products.length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground">
              {isError ? "Products could not be loaded." : "No products found."}
            </p>
          )}
        </div>
      </section>
    </>
  )
}
