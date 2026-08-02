"use client"

import * as React from "react"

const STORAGE_KEY = "shopai-recently-viewed"
const MAX_ITEMS = 8

interface RecentlyViewedItem {
  slug: string
  name: string
  category: string
  price: number
  imageUrl: string | null
  timestamp: number
}

function loadItems(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as RecentlyViewedItem[]) : []
  } catch {
    return []
  }
}

function saveItems(items: RecentlyViewedItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // silently ignore
  }
}

export function useRecentlyViewed() {
  const [items, setItems] = React.useState<RecentlyViewedItem[]>([])

  React.useEffect(() => {
    setItems(loadItems())
  }, [])

  const addItem = React.useCallback(
    (item: Omit<RecentlyViewedItem, "timestamp">) => {
      setItems((prev) => {
        const filtered = prev.filter((i) => i.slug !== item.slug)
        const next = [
          { ...item, timestamp: Date.now() },
          ...filtered,
        ].slice(0, MAX_ITEMS)
        saveItems(next)
        return next
      })
    },
    []
  )

  return { items, addItem }
}
