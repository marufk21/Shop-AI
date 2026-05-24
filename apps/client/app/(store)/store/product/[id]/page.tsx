"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  ArrowCounterClockwise,
} from "@phosphor-icons/react"

export default function ProductDetailPage() {
  const [activeTab, setActiveTab] = useState("features")
  const product = {
    name: "Minimal Desk Lamp",
    price: 89,
    rating: 4.8,
    reviews: 234,
    description:
      "Elevate your workspace with the Minimal Desk Lamp, designed for the modern professional. Featuring adjustable brightness levels, a sleek aluminum body, and energy-efficient LED technology, this lamp provides the perfect lighting for any task. Its minimalist design complements any desk setup while reducing eye strain during long work sessions.",
    features: [
      "Adjustable LED brightness with 5 levels",
      "Sleek aluminum body with matte finish",
      "Energy-efficient, 50,000-hour lifespan",
      "USB-C charging port built into base",
      "Touch-sensitive controls",
      "360-degree adjustable arm",
    ],
    category: "Home",
    images: [1, 2, 3],
  }

  return (
    <div className="py-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          render={
            <Link href="/store/product">
              <ArrowLeft className="mr-1.5 size-3.5" />
              Back to Products
            </Link>
          }
        />

        <div className="grid gap-8 xl:grid-cols-2">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-muted" />
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted" />
              ))}
            </div>
          </div>

          <div>
            <Badge variant="secondary" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="font-heading text-2xl font-semibold md:text-3xl">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>

            <p className="mt-6 text-3xl font-bold">${product.price}</p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-6 flex gap-3">
              <Button size="lg" className="flex-1">
                <ShoppingCart className="mr-2 size-4" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon-lg">
                <Heart className="size-4" />
              </Button>
            </div>

            <div className="mt-6 grid gap-3 rounded-xl border p-4">
              {[
                { icon: Truck, label: "Free shipping on orders over $50" },
                { icon: ShieldCheck, label: "1 year warranty included" },
                { icon: ArrowCounterClockwise, label: "30-day easy returns" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-sm"
                >
                  <item.icon className="size-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <Separator className="mt-6" />

            <div className="mt-6">
              <div className="flex gap-1 rounded-lg border p-1">
                {["features", "specs", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                {activeTab === "features" && (
                  <ul className="space-y-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <div className="size-1.5 rounded-full bg-primary/10" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === "specs" && (
                  <div className="space-y-2 text-sm">
                    {[
                      { label: "Material", value: "Aluminum" },
                      { label: "Height", value: '18"' },
                      { label: "Weight", value: "2.4 lbs" },
                      { label: "Power", value: "USB-C, 15W" },
                      { label: "Color", value: "Matte Black / Silver" },
                    ].map((spec) => (
                      <div key={spec.label} className="flex justify-between">
                        <span className="text-muted-foreground">
                          {spec.label}
                        </span>
                        <span className="font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {[
                      {
                        author: "Alex M.",
                        rating: 5,
                        text: "Best desk lamp I've ever owned. The adjustable brightness is perfect for late-night work sessions.",
                        date: "2 weeks ago",
                      },
                      {
                        author: "Jamie L.",
                        rating: 4,
                        text: "Great design and build quality. Would love to see more color options in the future.",
                        date: "1 month ago",
                      },
                    ].map((review) => (
                      <div
                        key={review.author}
                        className="rounded-xl border p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {review.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {review.date}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {review.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
