"use client"

import * as React from "react"
import { X } from "@phosphor-icons/react"

const MESSAGES = [
  "Free shipping on orders over $50",
  "30-day easy returns & exchanges",
  "1-year warranty on all products",
]

const STORAGE_KEY = "shopai-announcement-closed"

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = React.useState(true)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const closed = localStorage.getItem(STORAGE_KEY)
    if (closed === "true") {
      setIsVisible(false)
    }
  }, [])

  React.useEffect(() => {
    if (!isVisible) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isVisible])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem(STORAGE_KEY, "true")
  }

  if (!isVisible) return null

  return (
    <div className="relative flex h-8 items-center justify-center overflow-hidden bg-primary/10 text-primary">
      <div className="flex items-center gap-2 px-4 text-center">
        <span className="text-[11px] font-semibold tracking-wide transition-all duration-500 animate-fade-in">
          {MESSAGES[currentIndex]}
        </span>
      </div>
      <button
        onClick={handleClose}
        className="absolute right-3 flex size-5 items-center justify-center rounded-md text-primary/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
        aria-label="Close announcement"
      >
        <X className="size-3" />
      </button>
    </div>
  )
}
