"use client"

import * as React from "react"
import { Sparkle, ShoppingBag } from "@phosphor-icons/react"
import { useStoreProducts } from "@/hooks/store/use-products"
import { getProductImageUrl } from "@/lib/image-url"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"

interface StoreSearchProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function StoreSearch({ open, setOpen }: StoreSearchProps) {
  const { data } = useStoreProducts({ limit: 100 })
  const products = data?.items ?? []

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  const handleSelect = (_slug: string) => {
    setOpen(false)
    const el = document.getElementById("products")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search Products" description="Search products by name or category" className="sm:max-w-xl">
      <Command>
        <CommandInput placeholder="Type a product name or category..." />
        <CommandList className="max-h-87.5 p-2">
          <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
            No products found matching your search.
          </CommandEmpty>

          {products.length > 0 && (
            <CommandGroup heading="Suggestions" className="px-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {products.slice(0, 5).map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(product.slug)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 data-selected:bg-accent/50"
                >
                  {product.image_url ? (
                    <img
                      src={getProductImageUrl(product.image_url, "thumbnail")}
                      alt={product.name}
                      className="size-8 rounded-md object-cover border bg-muted"
                    />
                  ) : (
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center border">
                      <ShoppingBag className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {product.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    ${product.price}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandGroup heading="Categories" className="mt-2 px-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
              <CommandItem
                key={cat}
                value={cat}
                onSelect={() => {
                  setOpen(false)
                  const el = document.getElementById("products")
                  if (el) el.scrollIntoView({ behavior: "smooth" })
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150 data-selected:bg-accent/50 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Sparkle className="size-4 text-primary" weight="fill" />
                <span>Browse {cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
